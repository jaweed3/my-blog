---
title: Burn vs TFLite vs ONNX Runtime
slug: edge-burn-benchmark
description: The official benchmark harness benchmarking Burn, TensorFlow Lite and ONNX Runtime for inference on ARM64 edge hardware.
excerpt: A controlled harness comparing Burn, TensorFlow Lite and ONNX Runtime on ARM64 edge hardware — testing whether a Rust-native tensor library can hold its own on-device.
date: 2026-07-31
tags:
  - Edge AI
  - Rust
  - Benchmarking
techStack:
  - Rust
  - Burn
  - TensorFlow Lite
  - ONNX Runtime
  - ARM64
github: https://github.com/jaweed3/edge-burn-benchmark
status: active
featured: true
hidden: false
impact: Puts a third runtime under the same harness as the two incumbents, so the Rust-native option is judged on measurements rather than enthusiasm
stats:
  - value: '3'
    label: 'Runtimes Compared'
  - value: 'ARM64'
    label: 'Target Platform'
  - value: 'Rust'
    label: 'Burn Implementation'
problem: Edge inference has two default runtimes — TensorFlow Lite and ONNX Runtime — chosen by habit and tooling fit rather than by measurement. A Rust-native tensor library is a credible third option, but claiming it is faster means nothing without a harness that treats all three identically.
results:
  - 'Burn, TensorFlow Lite and ONNX Runtime driven through one harness on ARM64'
  - 'Measures the case a Rust-native runtime is actually proposed for: on-device, memory-constrained deployment'
  - 'Harness is the published artifact, so third parties can extend it to their own models'
outcome: Settles the runtime question with reproducible numbers on the hardware that matters, instead of benchmark tables copied between blog posts
---

## Problem

Pick an edge inference runtime and you are probably picking TensorFlow Lite or ONNX Runtime. That choice usually has nothing to do with performance — it is made by whichever SDK already wraps your model.

Burn is a Rust-native deep learning framework with its own tensor, autodiff and training stack. That makes it genuinely interesting for edge work: no Python runtime, no FFI boundary, one binary to deploy. But "interesting" is not "faster", and the honest way to find out is to measure it.

## Approach

The published harness drives **Burn**, **TensorFlow Lite** and **ONNX Runtime** through a single benchmark path on ARM64 edge hardware. Same models, same inputs, same measurement procedure, same machine — so the only variable left is the runtime.

The important detail is that the harness _is_ the deliverable. A benchmark that only exists as a results table is a claim; a benchmark that ships as runnable code is an invitation to check it.

## Why ARM64 specifically

x86 numbers do not transfer. Different vector widths, different NEON paths, different memory behaviour, and a very different power envelope. Every conclusion about edge deployment has to be re-earned on the actual target architecture, which is why this is an ARM64 harness rather than a laptop benchmark with a target-shaped title.

## What it settles

Whether a Rust-native runtime is a legitimate third option for on-device inference, measured on-device rather than argued about. If the answer turns out to be "TFLite still wins on throughput", that is a useful result — it tells Rust teams where the boundary is instead of leaving them to find out in production.
