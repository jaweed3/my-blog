---
title: KWS Pi5 Benchmark
slug: kws-pi5-benchmark
description: Four keyword-spotting architectures benchmarked across TensorFlow Lite and ONNX Runtime on a Raspberry Pi 5 under one controlled protocol.
excerpt: DS-CNN, dense, LSTM and CNN-GRU benchmarked against TFLite and ONNX Runtime on Raspberry Pi 5 — with on-board PMIC energy measurement and a 1,000-pass protocol.
coverImage: images/features/kws-pi5-benchmark.png
date: 2026-09-22
tags:
  - Edge AI
  - Keyword Spotting
  - Benchmarking
techStack:
  - TensorFlow 2.16
  - TensorFlow Lite
  - ONNX Runtime
  - Raspberry Pi 5
  - Google Speech Commands v2
github: https://github.com/jaweed3/kws-pi5-artifact
status: active
featured: true
hidden: false
impact: A reproducible artifact where every table number traces back to a committed JSON — including the cases where TFLite and ONNX Runtime disagree
stats:
  - value: '4'
    label: 'KWS Architectures'
  - value: '3'
    label: 'Runtime Configs'
  - value: '47 KB'
    label: 'Full-INT8 DS-CNN'
  - value: '1,000'
    label: 'Measured Passes / Run'
problem: Keyword-spotting papers routinely mix architectures, runtimes and hardware in one comparison table. When latency and accuracy come from different machines and different harness settings, the numbers are not comparable and the conclusion is not trustworthy.
results:
  - 'DS-CNN (MLPerf Tiny reference), dense DNN, LSTM and CNN-GRU hybrid × float32 TFLite, int8 TFLite, float32 ONNX Runtime'
  - 'Full-INT8 DS-CNN quantizes to 47 KB — the entire model fits comfortably on-device'
  - 'On-board energy measured via PMIC across 8 configurations, not inferred from wall-clock time'
  - 'Thread scaling swept at 1/2/4 threads; int8-I/O mixed-precision artifact evaluated separately'
outcome: Every latency, accuracy and energy figure in the paper is traceable to a committed JSON, and the exact model artifacts are included so third parties can re-verify accuracy on any machine
---

## Problem

Keyword spotting is the canonical edge workload: tiny models, tight power budgets, always-on audio. It is also where benchmark hygiene is worst.

The typical paper picks four architectures, exports each to two runtimes, and reports one latency number per cell. But those numbers often come from different machines, different thread counts, different warmup policies, and outlier handling done by hand. The conclusion — "TFLite is faster than ONNX Runtime" — then rests on a comparison that was never actually controlled.

## The protocol

Every run, without exception:

```
1,000 warmup passes  →  1,000 measured passes  →  sequential
single thread (unless a thread sweep is the point)
features precomputed, so preprocessing is not in the timing
IQR outlier removal
10,000-resample bootstrap for 95% confidence intervals
seed 42
```

Precomputing features matters more than it sounds: if the MFCC front end is inside the timed loop, you are benchmarking your DSP implementation as much as your runtime. And bootstrap CIs matter because Pi 5 latency distributions have tails — a mean without an interval is not a result.

## What is measured

| Axis          | Values                                                           |
| ------------- | ---------------------------------------------------------------- |
| Architectures | DS-CNN (MLPerf Tiny ref), dense DNN, LSTM, CNN-GRU               |
| Runtimes      | float32 TFLite, int8 TFLite, float32 ONNX Runtime                |
| Dataset       | Google Speech Commands v2 (CC BY 4.0), 10-cmd and 12-class lists |
| Energy        | On-board PMIC, 8 configurations                                  |
| Threads       | 1 / 2 / 4 sweep                                                  |

The full-INT8 DS-CNN comes in at **47 KB**. That is the entire acoustic model — a useful reminder of how small an always-on wake-word model can be when it is actually quantized end to end rather than in name only.

## The artifact

This is a benchmark **artifact** first and a paper second. That ordering is the point:

```
bench/code/     train → export → quantize → benchmark → evaluate
                pmic_power.py        on-board energy measurement
                bench_threads.py     1/2/4-thread sweep
                evaluate_int8io.py   int8-I/O mixed-precision evaluation
bench/models/   every artifact measured, including the 47 KB full-int8 DS-CNN
bench/results/  raw JSON behind every table + protocol metadata
paper/          LaTeX source, figures, refs.bib
```

You do not need a Pi 5 to check the accuracy claims. The models and datasets are committed, so `evaluate.py` runs on any x86 machine with both runtimes installed. Latency reproduces on a Pi 5 under the `performance` governor, with 1-thread rows landing within roughly 2% noise.

## Note on the dataset

Google Speech Commands v2 is CC BY 4.0 and about 5.6 GB, so it is **not** vendored into the repo. `make_testlists.py` builds the 10-command and 12-class evaluation lists from a local copy.
