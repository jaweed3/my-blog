---
slug: delta-ota
title: "Delta OTA: Shrinking Model Updates from 2.6MB to 47KB"
date: 2026-06-05T18:00:00.000Z
excerpt: "Custom binary format, byte-level region patching, 98.2% bandwidth savings — shipping TensorFlow Lite model updates over WhatsApp-data connections in rural Indonesia."
coverImage: /images/posts/delta-ota.svg
tags:
  - Edge AI
  - Model Quantization
  - Embedded Systems
  - Android
  - Case Study
---

Retak.id runs a MobileNetV2 INT8 model — 2.6MB — on Android phones in rural Ponorogo. When the model improves, users need the update. A 2.6MB download over WhatsApp-data (the de facto internet in rural Indonesia) takes 30-60 seconds. Users on 3G or metered connections won't wait. They skip the update and keep using the old model.

But model updates are typically small. Fine-tuning changes only the final layers while the rest of the weights are identical. Downloading the entire 2.6MB file for a 16KB change is wasteful.

So I built a delta update system that only transmits the bytes that actually changed.

## The .rkd format

A custom binary format with zero external dependencies:

```
Magic: "RKD1" (4 bytes)
Region Count: uint32 LE
For each changed region:
  Offset: uint32 LE — byte position in old model
  Length: uint32 LE — number of changed bytes
  Data:  <length> bytes — new byte values
Entire payload: gzip level 9
```

The core algorithm is embarrassingly simple:

```python
def find_changed_regions(old: bytes, new: bytes):
    if len(old) != len(new):
        return [(0, len(new), new)]
    regions = []
    i = 0
    while i < n:
        if old[i] != new[i]:
            start = i
            while i < n and old[i] != new[i]:
                i += 1
            regions.append((start, i - start, new[start:i]))
        else:
            i += 1
    return regions
```

If model sizes differ (architecture change), the full model is sent as a single region. Same format handles both cases.

## Real-world numbers

| Metric | Value |
|--------|-------|
| Full model (MobileNetV2 INT8) | 2,710,280 bytes (2.6 MB) |
| Changed regions (v3a → v3b) | 15,706 contiguous byte regions |
| Changed bytes total | 16,195 bytes (0.6% of model) |
| Raw delta size (before gzip) | 141,851 bytes |
| Compressed delta (.rkd) | 48,451 bytes (47 KB) |
| Bandwidth savings | 98.2% |

Only the fine-tuned classification head changed. Feature extractor layers were identical — and the delta format captured exactly that.

## How the update flows

App launches → hits `check-model-update` edge function → server returns `delta_url` (47KB) + `full_url` (2.6MB fallback) → download .rkd → gzip decompress → patch against bundled assets (not cached — deterministic) → validate via TFLite Interpreter inference → if valid, save to internal storage; if invalid, fall back to full download.

Patching against the model shipped in the APK, not a downloaded copy, ensures deterministic results regardless of update history.

## Safety gates

- Size mismatch detection: if old and new sizes differ, send full model
- 50% savings threshold: if compressed delta exceeds 50% of full model size, skip delta and download full
- Zero-change abort: if no bytes differ, no file is written
- TFLite validation: patched model runs inference before being committed
- Fallback URL: the edge function always provides a full download as backup

## What I learned

**Fine-tuning naturally produces tiny deltas.** Only the classification head changes while the feature extractor stays frozen. Delta compression is almost free when the architecture is designed for it.

**stdlib is enough.** The delta system uses Python `gzip` and `struct` — nothing else. The `.rkd` format is 80 lines of Python. Simple solutions for simple problems.

**Patch against bundled assets, not cached.** The target is the model shipped in the APK, not a downloaded copy. This ensures deterministic patching — the base is always the same regardless of update history.

**The 50% savings gate prevents perverse incentives.** Without it, a badly-optimized delta would ship a file the same size as the full model but with extra patching overhead.

**Edge functions are perfect for this.** A Deno edge function on Supabase does the version check in under 10ms, returns pre-signed URLs, and costs nothing for the traffic.

## Links

- Code: [github.com/jaweed3/retakId](https://github.com/jaweed3/retakId)
- `compute_delta.py`: `backend/scripts/training/compute_delta.py`
- `deploy_delta.py`: `backend/scripts/deploy_delta.py`
- Edge function: `backend/edge-functions/check-model-update/index.ts`

*June 2026. Part of the Retak.id project — landslide early detection for rural Indonesia.*
