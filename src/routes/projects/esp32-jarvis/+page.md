---
title: ESP32-Jarvis
slug: esp32-jarvis
description: Fully offline wake-word detection and face recognition on ESP32-S3 microcontroller with quantized models in C++.
excerpt: Edge AI access control — wake-word + face recognition running fully offline on a $10 ESP32-S3 microcontroller.
coverImage: images/features/esp32-jarvis.jpg
date: 2026-01-03
tags:
  - Edge AI
  - IoT
  - Embedded Systems
techStack:
  - ESP32-S3
  - C++
  - TensorFlow Lite Micro
  - ESP-IDF
  - CMake
github: https://github.com/jaweed3/esp32-jarvis
status: active
featured: true
hidden: false
impact: Brings AI-powered face recognition to $10 IoT hardware with zero cloud dependency
stats:
  - value: "$10"
    label: "Hardware Cost"
  - value: "500ms"
    label: "Inference Time"
  - value: "100%"
    label: "Offline Operation"
  - value: "100x"
    label: "Cheaper than RPi"
problem: Smart access control systems require expensive cloud servers or powerful edge devices, making them inaccessible for small-scale deployments and privacy-sensitive environments
results:
  - "Runs on $10 ESP32-S3 microcontroller — 100x cheaper than Raspberry Pi alternatives"
  - "Fully offline — zero cloud dependency, zero latency, zero privacy risk"
  - "Dual-mode: wake-word detection + face recognition in under 500ms"
  - "Quantized INT8 models running in C++ on constrained hardware"
outcome: Enables cost-effective, privacy-preserving smart access for homes, offices, and restricted areas without monthly cloud fees or internet connectivity
---

## Problem

Smart access control typically relies on:
- **Cloud-based solutions**: Monthly fees, privacy concerns, latency, internet dependency
- **Powerful edge hardware**: Raspberry Pi + camera ($100+) — overkill for simple door access
- **RFID/cards**: Easy to lose, share, or duplicate

This excludes small businesses, co-working spaces, and privacy-conscious users from adopting biometric access control.

## Solution

ESP32-Jarvis implements a complete voice + face biometric pipeline on a $10 ESP32-S3 microcontroller:
1. **Wake-word detection** — activates the system only when triggered
2. **Face recognition** — matches against enrolled users
3. **Fully offline** — all processing on-device, no cloud calls

Everything is implemented in C++ with quantized INT8 models running on ESP-NN optimized kernels.

## Business Impact

| Before | After |
|--------|-------|
| Cloud face recognition: $20-50/month + internet required | One-time $10 hardware cost, zero monthly fees |
| Raspberry Pi solution: $100+ per door | ESP32-S3: $10 per door |
| Privacy concerns with cloud biometric data | All data stays on-device |
| Latency from cloud round-trips: 1-5s | Local inference: under 500ms |

## Results

- **10x cost reduction** compared to Raspberry Pi-based solutions
- **Zero operating cost** — no cloud API fees, no subscription
- **100% privacy** — biometric data never leaves the device
- **Sub-second inference** with quantized INT8 models on ESP32-S3
- **Dual-mode authentication** (voice + face) for higher security
