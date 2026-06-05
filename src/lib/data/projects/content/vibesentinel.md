---
title: VibeSentinel
slug: vibesentinel
description: Edge AI predictive maintenance — autoencoder anomaly detection running 100% in Rust on ESP32-S3.
excerpt: Predicts industrial equipment failure before it happens using a $20 microcontroller — 524-parameter autoencoder, 100% Rust, no cloud.
coverImage:
date: 2026-05-09
tags:
  - Edge AI
  - Predictive Maintenance
  - Rust
  - IIoT
techStack:
  - Rust
  - Burn Framework
  - ESP32-S3
  - ESP-IDF
  - LSM6DS3
  - no_std
github: https://github.com/jaweed3/vibeSentinel
status: active
featured: true
hidden: false
impact: Predicts industrial equipment failure before it happens — using a $20 microcontroller with zero cloud dependency
stats:
  - value: "$20"
    label: "Hardware Cost"
  - value: "524"
    label: "Parameters"
  - value: "200Hz"
    label: "Sample Rate"
  - value: "~2KB"
    label: "Model Size"
problem: Industrial predictive maintenance requires expensive sensor infrastructure ($500+/node), cloud subscriptions, and specialized expertise — inaccessible for small factories, remote equipment, and budget-constrained operations
results:
  - "524-parameter autoencoder — smallest model in its class (~2 KB)"
  - "100% Rust — from training in Burn to no_std inference on ESP32-S3"
  - "Bit-exact golden vectors guarantee identical output across x86 and Xtensa"
  - "10 structured error codes (E001-E010) for every possible failure mode"
  - "200 Hz 3-axis sampling with FFT, RMS, kurtosis, and spectral analysis"
outcome: Brings enterprise-grade predictive maintenance to budget-constrained operations — preventing costly downtime without cloud infrastructure or expensive hardware
---

## Problem

Industrial predictive maintenance today:
- **Expensive sensors**: $500-2000 per monitoring node
- **Cloud dependency**: Most solutions require constant internet for ML inference
- **Complex setup**: Specialized expertise needed for installation and configuration
- **Inaccessible**: Small factories, remote pumps, and budget-constrained operations are locked out

Unplanned downtime costs industrial facilities $50,000-500,000 per hour — yet most can't afford predictive maintenance.

## Solution

VibeSentinel monitors industrial machinery vibration using an autoencoder neural network running directly on an ESP32-S3 microcontroller:

```
Sensor → 128-sample window → 26 features → Z-score norm → AE → MSE > threshold? → Alert
(3-axis @ 200 Hz)    (FFT + Stats)             (524 params)           (LED or MQTT)
```

100% Rust end-to-end — training (Burn), inference (no_std), and firmware (ESP-IDF).

## Business Impact

| Before | After |
|--------|-------|
| Predictive maintenance node: $500-2000 | $20 microcontroller — 25x cheaper |
| Cloud-dependent — internet required | Fully offline, works in remote areas |
| Weeks to deploy per machine | Flash firmware in minutes |
| Enterprise only — small factories excluded | Accessible to any operation with rotating machinery |

## Results

- **524-parameter autoencoder** (~2 KB) — near-zero memory footprint
- **End-to-end Rust**: Burn training → golden vector validation → no_std deployment
- **Bit-exact cross-architecture**: golden vectors verify identical output on x86 and Xtensa
- **26-dimensional feature vector**: FFT, RMS, kurtosis, crest factor, spectral centroid
- **10 structured error codes** (E001-E010) for every failure mode — zero ambiguity in diagnosis
- **200 Hz real-time sampling** on 3 axes via LSM6DS3 IMU
- **Roadmap**: WiFi MQTT, multi-model, adaptive threshold, INT8 quantization, sensor fusion
