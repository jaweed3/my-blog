---
slug: esp
title: "ESP32-S3 Neural Camera: MJPEG Streaming at 5MB on a $15 MCU"
date: 2026-05-05T10:00:00.000Z
excerpt: "Pushing a 1600×1200 camera pipeline through 8MB PSRAM with zero heap fragmentation — captive portal WiFi, dual-core FreeRTOS pinning, and why DRAM is the real bottleneck on ESP32-S3."
coverImage: /images/posts/esp32.png
tags:
  - Embedded Systems
  - Edge AI
  - ESP32-S3
  - Computer Vision
  - FreeRTOS
---

## PROBLEM

Most "smart camera" IoT products fall into two camps: Raspberry Pi devices running Python with 4GB of RAM and a full Linux kernel, or cloud-dependent cameras that stream everything to a remote GPU. Neither works for cost-sensitive, offline-first deployments.

A Raspberry Pi 4 costs $55. A cloud subscription adds $10-50/month per device. For rural monitoring, security cameras in bandwidth-constrained areas, or battery-operated sensors, this is prohibitively expensive.

The engineering question: **can you build a usable camera pipeline — WiFi, MJPEG streaming, state management — on a $15 microcontroller with 8MB of PSRAM and 512KB of DRAM?**

The answer is yes, but not the way you'd design it on a Linux system.

---

## STATUS

This project is **Phase 2** of a 7-phase roadmap. What's shipped:

> **Shipped:** WiFi manager with captive portal · OV2640 camera · MJPEG HTTP streaming · 6-state FreeRTOS machine · EventBus pub/sub · LED indicator · 4 build environments

> **Not yet shipped (roadmap):** TFLite Micro wake word detection (Phase 3) · MTCNN face detection (Phase 4) · SPA dashboard (Phase 5) · MobileFaceNet face recognition (Phase 6) · OTA updates (Phase 7)

This post covers the embedded systems engineering that makes the ML pipeline possible — because without this foundation, the ML never makes it onto the device.

---

## HARDWARE

The Seeed Studio XIAO ESP32S3 Sense, $15 retail:

| Component | Spec |
|-----------|------|
| MCU | ESP32-S3, Xtensa LX7 dual-core @ 240MHz |
| PSRAM | 8MB OPI @ 80MHz |
| Flash | 8MB QSPI NOR |
| Camera | OV2640, 1600×1200 max, hardware JPEG encoder, DVP parallel |
| Mic | MSM261D3526H1CPM digital MEMS, PDM, I2S |
| Wireless | WiFi 2.4GHz b/g/n + BLE 5.0 |
| Indicator | Orange LED GPIO21 (PWM) |

For context: 8MB PSRAM is roughly what a single Chrome tab uses to render a Google homepage. I needed to fit camera frame buffers, audio ring buffers, ML model weights, HTTP server state, and FreeRTOS overhead in that same footprint.

The real constraint, however, isn't PSRAM — it's the **512KB of internal DRAM**.

---

## ARCHITECTURE

### Dual-Core FreeRTOS Pinning

```
USB-C ──→ ESP32-S3 ──→ OV2640 Camera (DVP)
                │
                ├──→ PDM Mic (I2S GPIO 41-42)
                ├──→ Orange LED (GPIO21 PWM)
                ├──→ MicroSD (SPI GPIO 3,7-9)
                └──→ WiFi AP/STA ──→ HTTP Server (port 80)
```

Core 0 (PRO — Network I/O): WiFi stack, HTTP server
Core 1 (APP — ML Processing): Audio capture, camera pipeline, state machine

The key insight: **WiFi and ML inference cannot share a core.** The WiFi stack is soft real-time — starving it for even a few milliseconds causes packet loss, disconnections, and MJPEG stream corruption. ML inference, by contrast, blocks for 100-150ms. These workloads don't need different priorities — they need different cores.

I initially tried balancing them on one core with different task priorities. It didn't work. Core pinning was the fix.

### State Machine

```
                        ┌──────────────┐
                        │    INIT      │
                        └──────┬───────┘
                               │
                   Has saved WiFi?
                       /          \
                     YES           NO
                      ↓             ↓
               ┌──────────┐  ┌──────────┐
               │CONNECTING│  │ AP_MODE  │
               └────┬─────┘  └────┬─────┘
                    │             │
               ┌────▼─────┐       │
               │   IDLE   │◄──────┘
               └────┬─────┘
                    │ wake word (future)
               ┌────▼─────┐
               │  ACTIVE  │  30s timeout → IDLE
               └────┬─────┘
                    │
               ┌────▼─────┐
               │  ERROR   │  5s → retry
               └──────────┘
```

Six states, each with entry/exit hooks and typed event transitions:

| State | Trigger | Timeout |
|-------|---------|---------|
| `INIT` | Boot | None |
| `AP_MODE` | No saved WiFi | None (manual) |
| `CONNECTING` | WiFi selected via portal | 15s → ERROR |
| `IDLE` | Connected, camera optional | None |
| `ACTIVE` | Wake word (future) | 30s → IDLE |
| `ERROR` | Any failure | 5s → retry INIT or AP_MODE |

The `ACTIVE → IDLE` timeout exists for power management — at 240MHz with continuous camera streaming, the board draws ~300mA. On a 2000mAh battery, that's ~6 hours. The 30-second inactivity timeout cuts average draw by ~70% in typical use.

### EventBus — Inter-Task Communication

Standard FreeRTOS queues are fragile — they handle bytes, not messages. I built a typed pub/sub layer:

```cpp
struct EventMessage {
    SystemEvent event;
    int32_t data[4];
};

class EventBus {
    bool post(const EventMessage& msg);
    bool postFromISR(const EventMessage& msg);
    bool receive(EventMessage& msg, TickType_t timeout);
};
```

No heap allocation during dispatch. Each message is 20 bytes. The queue is allocated once at boot with 32 fixed slots. Memory fragmentation was my primary failure concern on this platform — everything that can be statically allocated, is.

---

## PSRAM BUDGETING

8MB sounds generous until you lay out the allocations:

| Component | Size | Location | Notes |
|-----------|------|----------|-------|
| Camera frame buffers (2×) | ~100KB | **DRAM** | HVGA JPEG, DMA requires DRAM |
| Audio ring buffer (3s) | 96KB | PSRAM | 16kHz × 16-bit × 3s |
| MFCC feature buffer | 8KB | PSRAM | 49 frames × 40 coeffs |
| TFLite tensor arena | 32KB | PSRAM | Micro speech model activations |
| RGB565 conversion buffer | 307KB | PSRAM | 480×320 × 2 bytes — face detection input |
| MTCNN model weights | ~250KB | PSRAM | Stage 1 (MSR01) + Stage 2-3 (MNP01) |
| MobileFaceNet S8 | ~400KB | PSRAM | 112×112 face rec, int8 |
| HTTP/WS scratch buffers | ~32KB | PSRAM | Chunked response buffers |
| FreeRTOS task stacks | ~32KB | DRAM | 6 tasks × ~5KB |
| **Total used** | **~1.3MB** | — | |
| **Free** | **~6.7MB** | — | |

The surprising takeaway: **PSRAM was never the bottleneck.** The real constraint was DRAM — only 512KB internal SRAM. Camera DMA buffers MUST be in DRAM. Task stacks live in DRAM. WiFi and lwIP internals live in DRAM. After accounting for those, ~150KB remains.

The RGB565 conversion buffer is the single largest allocation at 307KB (PSRAM). I investigated tiling the conversion frame-by-frame to reduce peak usage, but MTCNN requires the full image for pyramid scaling — tiling breaks multi-scale detection entirely. Some allocations are non-negotiable.

---

## RESULTS

### Camera Pipeline Throughput

MJPEG stream operates at **full camera framerate** (limited only by OV2640 sensor readout and JPEG encoding) because the JPEG buffer is served zero-copy to the HTTP client. The face detection pipeline (when implemented) will decode JPEG → RGB565 → run MTCNN, which is why it's throttled to every 3rd frame (~5 FPS).

PSRAM latency is real: ~40ns access vs ~10ns for internal SRAM. For sequential access (audio ring buffer), this is negligible. For random access during ML inference on scattered tensors, the 4× latency penalty compounds. Profile before you allocate.

### Memory Utilization

| Metric | Value |
|--------|-------|
| DRAM used (critical) | ~264KB / 512KB |
| PSRAM used | ~1.3MB / 8MB |
| Heap fragmentation | 0% (all static) |
| Boot-to-stream time | ~2.5s |

### Captive Portal

The entire WiFi setup UI — HTML, CSS, JavaScript — is compiled into firmware as a `constexpr` string. **4KB gzipped.** No SPIFFS partition, no external dependencies, no filesystem overhead.

---

## BUSINESS IMPACT

| Before | After |
|--------|-------|
| Smart camera node: $55 (RPi) + cloud sub | $15 MCU, zero recurring cost |
| Cloud dependency for any ML | Fully offline pipeline |
| Week-long development setup | One-command `pio run -e full` |
| Python stack: 200MB+ OS image | C++ firmware: ~500KB binary |

This architecture is directly applicable to: rural security cameras, agricultural monitoring, wildlife observation, and any deployment where per-unit cost and bandwidth constraints rule out SBCs.

---

## LESSONS

### 1. Static Allocation Is Freedom

Dynamic allocation on a microcontroller with 8MB PSRAM is tempting. Don't. Every buffer is allocated once at boot; `free()` is never called. Zero heap fragmentation after extended uptime, predictable memory, no malloc-related crashes.

### 2. Core Pinning Beats Priority Tuning

I spent days trying to balance WiFi and ML on a single core with different priority levels. The fundamental issue isn't priority — it's that both workloads need uninterrupted time slices of incompatible lengths. Core pinning fixed in minutes what priority tuning couldn't fix in days.

### 3. Hardware JPEG Changes Everything

Before understanding the OV2640's hardware JPEG encoder, I planned to stream raw RGB565 frames. That would have required 5× the bandwidth, 3× the PSRAM, and produced lower framerates. Hardware accelerators are the difference between a working product and a toy.

### 4. PSRAM ≠ DRAM

PSRAM is plentiful (6.7MB free) but has 4× the access latency. DRAM is the true constraint (512KB total, ~150KB free after overhead). The scarce resource isn't the one you think — profile early.

---

## CODE STRUCTURE

```
esp32-jarvis/
├── platformio.ini            # 4 build environments
├── src/
│   ├── main.cpp              # Entry → SystemManager
│   ├── pins_config.h         # GPIO definitions
│   ├── core/
│   │   ├── SystemManager.h   # Init + main loop
│   │   ├── StateMachine.h    # 6-state FSM
│   │   ├── EventBus.h        # FreeRTOS queue pub/sub
│   │   └── LedIndicator.h    # PWM patterns
│   ├── memory/MemoryManager.h
│   ├── wifi/WifiManager.h
│   ├── wifi/CaptivePortal.h
│   ├── audio/AudioManager.h
│   ├── vision/CameraManager.h
│   ├── server/HttpServer.h
│   ├── storage/ConfigManager.h
│   └── tests/
├── docs/
│   ├── architecture.md
│   ├── api.md
│   ├── pinout.md
│   ├── build.md
│   └── troubleshooting.md
└── wiring_diagram.png
```

Four build environments for isolated module testing:

```bash
pio run -e full          # Integrated firmware
pio run -e test_cam      # Camera + WiFi + Stream only
pio run -e test_mic      # Microphone recording only
pio run -e test_wifi     # WiFi manager + Captive portal only
```

Each compiles a single module in isolation — critical for debugging hardware without rebuilding the entire firmware.

**Repo:** [github.com/jaweed3/esp32-jarvis](https://github.com/jaweed3/esp32-jarvis)

---

## ROADMAP

The remaining phases, each independently shippable and testable:

- **Phase 3:** TFLite Micro wake word detection (micro_speech, 22KB)
- **Phase 4:** ESP-DL MTCNN face detection with WebSocket events
- **Phase 5:** SPA dashboard with real-time bounding box overlay
- **Phase 6:** MobileFaceNet S8 face recognition (enroll, match, database)
- **Phase 7:** OTA firmware updates, production hardening

---

## TECH STACK

`C++17` `FreeRTOS` `PlatformIO` `ESP-IDF` `esp32-camera` `ESP-DL` `TFLite Micro` `MTCNN` `MobileFaceNet` `I2S PDM` `MJPEG` `DNS Captive Portal` `NVS Preferences`
