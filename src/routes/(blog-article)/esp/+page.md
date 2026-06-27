---
slug: esp
title: "ESP32-S3 Neural Camera: MJPEG Streaming at 5MB on a $15 MCU"
date: 2026-05-05T10:00:00.000Z
excerpt: "Pushing a 1600x1200 camera pipeline through 8MB PSRAM with zero heap fragmentation — captive portal WiFi, dual-core FreeRTOS pinning, and why DRAM is the real bottleneck on ESP32-S3."
coverImage: /images/posts/esp32.png
tags:
  - Embedded Systems
  - Edge AI
  - ESP32-S3
  - Computer Vision
  - FreeRTOS
---

Most "smart camera" IoT products fall into two camps: Raspberry Pi devices running Python with 4GB of RAM and a full Linux kernel, or cloud-dependent cameras that stream everything to a remote GPU. A Raspberry Pi 4 costs $55. Cloud subscriptions add $10-50/month per device.

The engineering question was: can you build a usable camera pipeline — WiFi, MJPEG streaming, state management — on a $15 microcontroller with 8MB of PSRAM and 512KB of DRAM?

The answer is yes, but not the way you'd design it on a Linux system.

## Status

This is Phase 2 of a 7-phase roadmap. What's shipped: WiFi manager with captive portal, OV2640 camera, MJPEG HTTP streaming, 6-state FreeRTOS state machine, EventBus pub/sub, LED indicator, 4 build environments.

Not yet shipped: TFLite Micro wake word detection (Phase 3), MTCNN face detection (Phase 4), SPA dashboard (Phase 5), MobileFaceNet face recognition (Phase 6), OTA updates (Phase 7).

This post covers the embedded engineering that makes the ML pipeline possible — because without this foundation, the ML never makes it onto the device.

## The hardware

Seeed Studio XIAO ESP32S3 Sense, $15 retail. Dual-core Xtensa LX7 at 240MHz. 8MB OPI PSRAM. 8MB QSPI NOR flash. OV2640 camera, 1600x1200 max with hardware JPEG encoder. MSM261D3526H1CPM digital MEMS mic. WiFi 2.4GHz b/g/n + BLE 5.0.

For context: 8MB PSRAM is roughly what a single Chrome tab uses to render a Google homepage. I needed to fit camera frame buffers, audio ring buffers, ML model weights, HTTP server state, and FreeRTOS overhead in that same footprint.

The real constraint, however, isn't PSRAM — it's the 512KB of internal DRAM.

## Dual-core FreeRTOS pinning

Core 0 (PRO) handles WiFi stack and HTTP server. Core 1 (APP) handles audio capture, camera pipeline, and state machine.

The key insight I learned the hard way: WiFi and ML inference cannot share a core. The WiFi stack is soft real-time — starving it for even a few milliseconds causes packet loss and stream corruption. ML inference blocks for 100-150ms. I initially tried balancing them on one core with different task priorities. It didn't work. Core pinning fixed in minutes what priority tuning couldn't fix in days.

## State machine

Six states with entry/exit hooks and typed event transitions:

```
INIT → has saved WiFi?
  YES → CONNECTING → IDLE
  NO  → AP_MODE → IDLE
IDLE → wake word (future) → ACTIVE (30s timeout → IDLE)
Any failure → ERROR (5s → retry)
```

The ACTIVE → IDLE timeout exists for power management. At 240MHz with continuous camera streaming, the board draws ~300mA. On a 2000mAh battery, that's ~6 hours. The 30-second inactivity timeout cuts average draw by ~70% in typical use.

## EventBus communication

Standard FreeRTOS queues handle bytes, not messages. I built a typed pub/sub layer:

```cpp
struct EventMessage {
    SystemEvent event;
    int32_t data[4];
};
```

No heap allocation during dispatch. Each message is 20 bytes. The queue is allocated once at boot with 32 fixed slots. Memory fragmentation was my primary failure concern — everything that can be statically allocated, is.

## PSRAM budgeting

8MB sounds generous until you lay out the allocations. Camera frame buffers need to be in DRAM (DMA requirement). Audio ring buffers go in PSRAM. TFLite tensor arena in PSRAM. RGB565 conversion buffer at 307KB — the single largest allocation, and it has to stay because MTCNN requires the full image for pyramid scaling.

After accounting for everything, DRAM usage sits at ~264KB out of 512KB. PSRAM uses ~1.3MB out of 8MB. Heap fragmentation: 0% — all static allocation. Boot-to-stream time: ~2.5s.

The surprising takeaway: PSRAM was never the bottleneck. The real constraint was DRAM — camera DMA buffers, task stacks, WiFi and lwIP internals all compete for that 512KB. After accounting for those, ~150KB remains.

## Camera pipeline

MJPEG stream operates at full camera framerate — the JPEG buffer is served zero-copy to the HTTP client. Face detection (when implemented) will decode JPEG → RGB565 → MTCNN, which is why it's throttled to every 3rd frame.

PSRAM latency is real: ~40ns access vs ~10ns for internal SRAM. For sequential access (audio ring buffer), negligible. For random access during ML inference on scattered tensors, the 4x latency penalty compounds.

## What I learned

**Static allocation is freedom.** Dynamic allocation on a microcontroller with 8MB PSRAM is tempting. Don't. Every buffer is allocated once at boot; free() is never called. Zero fragmentation, predictable memory, no malloc-related crashes after extended uptime.

**Core pinning beats priority tuning.** The fundamental issue isn't priority — it's that both workloads need uninterrupted time slices of incompatible lengths. Core pinning fixed in minutes what priority tuning couldn't fix in days.

**Hardware JPEG changes everything.** Before understanding the OV2640's hardware JPEG encoder, I planned to stream raw RGB565 frames. That would have required 5x the bandwidth, 3x the PSRAM, and produced lower framerates. Hardware accelerators are the difference between a working product and a toy.

**PSRAM ≠ DRAM.** PSRAM is plentiful (6.7MB free) but has 4x the access latency. DRAM is the true constraint. The scarce resource isn't the one you think — profile early.

## Code structure

```
esp32-jarvis/
├── platformio.ini            # 4 build environments
├── src/
│   ├── main.cpp              # Entry → SystemManager
│   ├── pins_config.h
│   ├── core/                 # StateMachine, EventBus, LedIndicator
│   ├── memory/
│   ├── wifi/                 # WifiManager, CaptivePortal
│   ├── audio/
│   ├── vision/
│   ├── server/
│   └── storage/
└── docs/                     # architecture, api, pinout, build, troubleshooting
```

Four build environments for isolated testing:
```bash
pio run -e full          # Integrated firmware
pio run -e test_cam      # Camera + WiFi + Stream only
pio run -e test_mic      # Microphone recording only
pio run -e test_wifi     # WiFi manager + Captive portal only
```

Repo: [github.com/jaweed3/esp32-jarvis](https://github.com/jaweed3/esp32-jarvis)

## Roadmap

Phase 3: TFLite Micro wake word detection (micro_speech, 22KB)
Phase 4: ESP-DL MTCNN face detection with WebSocket events
Phase 5: SPA dashboard with real-time bounding box overlay
Phase 6: MobileFaceNet S8 face recognition (enroll, match, database)
Phase 7: OTA firmware updates, production hardening

## Tech stack

`C++17` `FreeRTOS` `PlatformIO` `ESP-IDF` `esp32-camera` `ESP-DL` `TFLite Micro` `MTCNN` `MobileFaceNet` `I2S PDM` `MJPEG` `DNS Captive Portal` `NVS Preferences`
