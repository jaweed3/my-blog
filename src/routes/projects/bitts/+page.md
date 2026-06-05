---
title: BitJETS-M4
slug: bitts
description: Extreme Edge TTS with 1.58-bit quantization — ~79% model size reduction vs FP32 on Apple Silicon.
excerpt: Extreme compression for text-to-speech — 1.58-bit ternary weights achieve 79% size reduction while maintaining voice quality.
coverImage: images/features/bitjets.jpg
date: 2026-02-01
tags:
  - Edge AI
  - Speech Synthesis
  - Model Quantization
techStack:
  - PyTorch
  - BitNet b1.58
  - MPS
  - HiFi-GAN
  - LJSpeech
github: https://github.com/jaweed3/bitts
status: active
featured: true
hidden: false
impact: Reduces TTS model size by 79% while maintaining voice quality — making AI speech viable on edge devices
stats:
  - value: "79%"
    label: "Compression Ratio"
  - value: "5x"
    label: "Smaller than FP32"
  - value: "3.2ms"
    label: "Inference Time"
  - value: "1.58-bit"
    label: "Ternary Weights"
problem: Text-to-speech models are too large for edge deployment, requiring cloud connectivity for voice synthesis and preventing offline accessibility applications
results:
  - "79% compression vs FP32 (12.4MB → 2.5MB)"
  - "Real-time inference — faster than real-time (sub-millisecond per sample)"
  - "1.58-bit ternary weights {-1, 0, 1} via quantization-aware training"
  - "5x model size reduction with minimal quality loss"
outcome: Enables on-device voice synthesis for IoT, automotive infotainment, assistive technology, and accessibility applications without cloud connectivity
---

## Problem

Text-to-speech models are notoriously large. A standard FP32 TTS model consumes 10-50MB, making them impossible to deploy on:

- IoT devices with limited flash storage
- Automotive head units without cloud connectivity
- Assistive devices for visually impaired users
- Offline navigation systems

Existing quantization techniques reduce size but degrade voice quality significantly.

## Solution

BitJETS-M4 implements **1.58-bit ternary quantization** (BitNet b1.58) on the JETS TTS architecture. All convolutional layers use ternary weights `{-1, 0, 1}` with quantization-aware training (QAT) via Straight-Through Estimator.

```
Text → [Embedding] → [BitEncoder × 4] → [VarianceAdaptor] → [BitDecoder × 4] → [Mel] → [HiFi-GAN] → Audio
                       1.58-bit QAT                             1.58-bit QAT              FP32
```

## Business Impact

| Before | After |
|--------|-------|
| 12.4MB FP32 model — too large for most edge devices | 2.5MB packed model — fits on any modern microcontroller |
| Cloud dependency for voice synthesis | Fully on-device, zero latency, zero bandwidth |
| 45ms+ inference on edge CPU | Real-time — faster than real-time (RTF less than 0.005) |
| Limited to connected devices | Works anywhere — car, airplane, remote areas |

## Results

- **79% compression** — 12.4MB FP32 → 2.5MB packed (Algorithm 1)
- **5x smaller** than equivalent FP32 model
- **Real-time performance** — 3.2ms for short utterances, 10ms for long
- **Cross-platform**: RTX 4060, Apple M-series, CPU
- Full JETS architecture with HiFi-GAN vocoder
