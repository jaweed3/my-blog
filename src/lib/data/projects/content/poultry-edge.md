---
title: Poultry Edge Disease Detection
slug: poultry-edge
description: Two-paper edge ML research line on INT8 quantization for poultry disease detection — characterization, then pruning as mitigation.
excerpt: Characterizing INT8 quantization across MobileNetV2, ShuffleNetV2 and EfficientNet-B0 — and finding that on CPU, quantization made inference 6–30× slower.
coverImage: images/features/poultry-edge.png
date: 2026-09-30
tags:
  - Edge AI
  - Model Quantization
  - Computer Vision
techStack:
  - PyTorch
  - ONNX Runtime
  - INT8 PTQ
  - Grad-CAM
  - Gradual Unlearning
github: https://github.com/jaweed3/paper_poultry_edge
status: active
featured: true
hidden: false
impact: Establishes that INT8 PTQ on CPU can cost 6.4–30.1× in latency rather than saving it — turning a default assumption into a measured one
stats:
  - value: '8,770'
    label: 'Training Images'
  - value: '98.35%'
    label: 'Best Test Accuracy'
  - value: '3'
    label: 'CNN Architectures'
  - value: '6.4–30.1×'
    label: 'INT8 Latency Overhead'
problem: INT8 quantization is treated as a default win for edge deployment. Nobody publishes the cases where it backfires, so teams ship PTQ pipelines assuming a speedup they never get.
results:
  - 'EfficientNet-B0 98.35%, MobileNetV2 97.83%, ShuffleNetV2 97.38% test accuracy (Machuve et al. 2022, 4 classes)'
  - 'INT8 PTQ on CPU introduced 6.4–30.1× latency overhead from dequantization cost'
  - 'Conclusion: quantization does not speed up CPU inference without VNNI / Tensor Core acceleration'
  - 'Paper 2 (MLCIPR 2026) applies pruning to mitigate that INT8 overhead'
outcome: Turns "quantize and ship" into a measured decision — the overhead is now a known, reproducible number rather than a surprise discovered in production
---

## Problem

Post-training quantization to INT8 is the default first move for edge deployment: shrink the model, keep the accuracy, ship it. The pitch is that smaller weights mean less memory traffic and faster inference.

That pitch is only true when the target CPU has hardware support for INT8 math. On a generic x86 core without VNNI, or on most ARM cores in their default configuration, the quantized graph pays a **dequantization tax** on every operation — expanding weights back to FP32 to feed a float pipeline. The model gets smaller. Inference gets slower.

Almost nobody writes this down, because a negative result does not make a good demo. So teams run a PTQ pipeline, measure a regression, and either blame their harness or quietly drop the project.

## Approach

Two papers, deliberately sequenced.

**Paper 1 — characterization.** Establish the baseline honestly. Three lightweight CNNs trained on the Machuve et al. (2022) poultry fecal dataset — 8,770 images across four classes (Coccidiosis, Healthy, NCD, Salmonellosis) — exported to ONNX, quantized with INT8 PTQ, then evaluated both for accuracy and for latency on an Intel i5-12400F under ONNX Runtime.

| Model           | Test Acc | FP32 Size | INT8 Size | FP32 Latency |
| --------------- | -------- | --------- | --------- | ------------ |
| MobileNetV2     | 97.83%   | 8.48 MB   | 2.30 MB   | 1.85 ms      |
| ShuffleNetV2    | 97.38%   | 4.89 MB   | 1.47 MB   | 3.17 ms      |
| EfficientNet-B0 | 98.35%   | 15.30 MB  | 4.16 MB   | 3.50 ms      |

The accuracy story is excellent — all three hold their FP32 accuracy through INT8. The latency story is where it breaks.

## Key Finding

**INT8 PTQ on CPU introduced 6.4–30.1× latency overhead**, driven by dequantization cost. Compression ratios in the table above are real; the speedup that motivated them is not there without hardware acceleration.

```
Quantize ≠ faster
  INT8 weights → dequantize → float compute → pay tax on every op
  No VNNI / Tensor Cores  ⇒  net LOSS
```

Grad-CAM is included in the pipeline so the accuracy claim is inspectable rather than a single number — you can see whether the quantized model is looking at the lesion or at the background.

**Paper 2 — mitigation (MLCIPR 2026).** Once the overhead is characterized, the next question is what actually reduces it. Pruning before quantization attacks the dequantization cost at its source: fewer weights to expand, fewer operations to pay the tax on.

## Why it matters

This is the kind of result that only exists because someone was willing to publish the boring half. The practical output is a rule:

> Measure after quantizing. On a CPU without INT8 acceleration, quantization buys you memory, not speed — and pruning is what recovers the latency.

That rule changes deployment decisions, and it is reproducible from the committed artifacts.

## Repositories

- **Paper 1 — characterization:** [`paper_poultry_edge`](https://github.com/jaweed3/paper_poultry_edge)
- **Paper 2 — pruning mitigation (MLCIPR 2026):** [`paper_poultry_p2`](https://github.com/jaweed3/paper_poultry_p2)
