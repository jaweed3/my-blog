---
slug: kws-pi5-revision
title: "KWS on Pi 5: Answering a Major Revision in One Borrowed Afternoon"
date: 2026-09-16T07:00:00.000Z
excerpt: "Major revision, due 30 Sep. Five reviewer points, one 2-3 hour Pi 5 session. How I ordered eval 12-class, thread scaling, full-int8 DS-CNN, and power measurement by payoff."
tags:
  - Edge ML
  - Keyword Spotting
  - Raspberry Pi
  - Benchmark
  - Case Study
keywords:
  - KWS
  - Raspberry Pi 5
  - TFLite
  - ONNX Runtime
  - ICAITech
hidden: false
---

Paper A — *Benchmarking Keyword Spotting Architectures Across TensorFlow Lite and ONNX Runtime on a Raspberry Pi 5* — came back Major Revision from ICAITech (#1571339978, due 30 Sep 2026). Five reviewer points. One borrowed Pi 5, one afternoon, 2-3 hours total.

This is the plan I actually run, in payoff order. If time gets cut, the highest-value data is already in the bag.

## What the reviewers asked

1. Add power/energy measurement, even approximate.
2. Add two- and four-thread sensitivity on at least CNN and DS-CNN.
3. Clarify Table II: which DS-CNN artifact was used.
4. Report 12-class results, or justify the 10-command subset harder.
5. If any second board is available, replicate one configuration on it.

Point 5 is explicitly optional ("if any"). Points 1, 2, 4 need the board. Point 3 is a 10-minute text fix.

## The ordering logic

Highest payoff first:

**0. Build testlists (5 min, once).** `make_testlists.py` from SCv2 full on the Pi. Expect ~4,074 rows (10-class) and ~11,005 rows (12-class: commands + unknown + 1,000 silence slices, seed 42). Validate: the 10-list must reproduce the paper numbers (90.55 / 79.63 / 90.48 / 92.56).

**1. Eval 12-class (~1 hr, answers R1 point 4).** All 4 models x 3 columns (fp32 tflite, fp32 onnx, int8 tflite) x 2 lists. Highest payoff because it closes the biggest methodological hole. Save stdout — the script doesn't write JSON: `... | tee results/eval12_<model>_<backend>.txt`.

**2. Thread scaling (~30 min, answers R1 point 3).** `bench_threads.py --models dscnn,crnn --threads 1,2,4`. Validate: T=1 must match `benchmark_kws_pi.json` (0.2107 ms) and `bench_crnn_fp32.json` (0.2586 ms) within noise. If LiteRT ignores num_threads, the JSON records it honestly instead of fabricating scaling.

**3. Full-int8 DS-CNN (~30 min, answers R1+R3 labeling).** The submitted "int8" DS-CNN cell is the original mixed-precision MLPerf artifact (int8 conv kernels, float32 remainder) — not full-int8 like the other three rows. `quantize_dscnn.py` closes that gap with no retraining: rebuild verified fp32 Keras, calibrate on `dscnn_rep.npz` (seed 42), write `kws_ref_model_fullint8.tflite`. Then benchmark + accuracy on both lists.

**4. Power (near-zero extra effort, alongside step 2).** USB meter inline to the Pi 5. Record idle watts, then watts per config during the run. `mJ/inference = W × mean_ms`. If the meter isn't there: skip, write future work, don't invent numbers.

## Baselines already in hand

| Config | TFLite fp32 | ONNX fp32 | Ratio |
|---|---|---|---|
| DS-CNN | 0.2107 ms | 0.1702 ms | 0.81 (ONNX wins) |
| DNN | 0.0158 ms | 0.0286 ms | 1.81 |
| LSTM | 0.3722 ms | 0.7782 ms | 2.09 |
| CRNN | 0.2586 ms | 0.3609 ms | 1.40 |

The single-model finding (ONNX 19.2% faster on DS-CNN) reverses everywhere else. DS-CNN is operator-dispatch-bound — many small ops, graph fusion pays off. The rest are matmul-bound or sequential-bound, where ONNX session overhead dominates. That mechanism paragraph is the paper's actual contribution, not the table.

## What goes home

`results/bench_threads.json`, `results/bench_dscnn_fullint8.json`, `results/eval12_*.txt`, the 26KB full-int8 model, `power_notes.txt`. Git add + push from the Pi before leaving. No data leaves on an SD card in my pocket.

## The one hole I found this morning

`data/dscnn_rep.npz` exists nowhere — not on the Mac, not in git. The runbook said "built on Mac" but SCv2 (5.6GB) only lives on the Pi. Fix: build it on the Pi directly (`make_rep_dscnn.py`, needs only numpy+scipy). Deps are trivial; the dataset is already there.

Lesson I keep relearning: verify the payload before the session, not during it. Borrowed hardware has no slack for setup debugging.
