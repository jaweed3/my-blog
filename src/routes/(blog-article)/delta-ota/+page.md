---
slug: delta-ota
title: "Delta OTA: Shrinking Model Updates from 2.6MB to 47KB"
date: 2026-06-05T18:00:00.000Z
excerpt: "Custom .rkd binary format, byte-level region patching, 98.2% bandwidth savings — shipping TensorFlow Lite model updates over WhatsApp-data connections in rural Indonesia."
coverImage: /images/posts/delta-ota.svg
tags:
  - Edge AI
  - Model Quantization
  - Embedded Systems
  - Android
  - Case Study
---

## PROBLEM

Retak.id runs a MobileNetV2 INT8 model (2.6MB) on Android phones in rural Ponorogo. When the model improves — better WASPADA recall, fixed labeling errors — users need the update.

A 2.6MB download over WhatsApp-data (the de facto internet in rural Indonesia) takes 30-60 seconds. Users on 3G or metered connections won't wait. They skip the update and keep using the old model, which means they never benefit from improvements.

But model updates are small — fine-tuning changes only the final layers. The rest of the weights are identical. Downloading the entire 2.6MB file for a 16KB change is wasteful.

**What if updates only transmitted the bytes that actually changed?**

---

## ARCHITECTURE

```
Server (Python):
  old.tflite + new.tflite
  → byte-level diff → gzip level 9
  → .rkd file (Retak Delta)
  → Supabase Storage

Edge Function (Deno):
  check-model-update ← Android device polls on launch
  → returns delta_url + full_url (fallback)

Android (Kotlin):
  download .rkd → gzip decompress
  → patch against bundled assets
  → validate via TFLite Interpreter
  → save to internal storage
```

---

## THE .rkd FORMAT

A custom binary format with no external dependencies:

```
┌──────────────────────────────────────────────────────┐
│ Magic: "RKD1" (4 bytes)                              │
│ Region Count: uint32 LE (4 bytes)                    │
│                                                      │
│ For each changed region:                              │
│ ┌──────────────────────────────────────────────────┐ │
│ │ Offset: uint32 LE — byte position in old model   │ │
│ │ Length: uint32 LE — number of changed bytes       │ │
│ │ Data:  <length> bytes — new byte values           │ │
│ └──────────────────────────────────────────────────┘ │
│                                                      │
│ Entire payload: gzip level 9                         │
└──────────────────────────────────────────────────────┘
```

### Core Algorithm

```
def find_changed_regions(old: bytes, new: bytes):
    if len(old) != len(new):
        # Architecture changed — send full model as delta
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

If model sizes differ (architecture change, e.g., MobileNetV2 → EfficientNet), the full model is sent as a single region. The same format handles both cases.

---

## RESULTS

### Real-World Delta Performance

| Metric | Value |
|--------|-------|
| Full model (MobileNetV2 INT8) | 2,710,280 bytes (2.6 MB) |
| Changed regions (v3a → v3b) | **15,706** contiguous byte regions |
| Changed bytes total | 16,195 bytes (0.6% of model) |
| Raw delta size (before gzip) | 141,851 bytes |
| Compressed delta (.rkd) | **48,451 bytes (47 KB)** |
| Gzip compression ratio | 65.8% |
| Bandwidth savings vs full | **98.2%** |
| Quality gate | ✅ Passed (savings > 50%) |
| Delta application | ✅ Bit-exact validated |

Only the fine-tuned classification head changed. Feature extractor layers were identical — and the delta format captured exactly that.

### Android Update Flow

```
App launch
  → ModelUpdateChecker hits check-model-update edge function
  → Server returns: delta_url (47KB) + full_url (2.6MB)
  → Download .rkd → gzip decompress
  → Patch against bundled assets (not cached — deterministic)
  → Validate patched model via TFLite Interpreter inference
  → If valid: save to internal storage, use for future inferences
  → If invalid: fall back to full model download
```

### End-to-End Pipeline

```
compute_delta.py (byte diff → .rkd)
  → deploy_delta.py (upload to Supabase + register version)
  → check-model-update edge function (version check API)
  → DeltaModelLoader.kt (Android: download → patch → validate)
```

---

## SAFETY GATES

1. **Size mismatch detection** — If old and new model sizes differ, full model is used (handles architecture changes gracefully)
2. **50% savings threshold** — If compressed delta exceeds 50% of full model size, skip delta and download full
3. **Zero-change abort** — If no bytes differ, no delta file is written
4. **TFLite Interpreter validation** — Patched model runs inference before being committed
5. **Fallback URL** — Edge function always provides `full_url` alongside `delta_url`

---

## BUSINESS IMPACT

| Before | After |
|--------|-------|
| Model update: 2.6 MB download | Model update: 47 KB download |
| ~45s on 3G, likely abandoned | ~1-2s, completes before user notices |
| Users skip updates → stale models deployed | High update adoption → everyone gets improvements |
| Frequent retraining = bandwidth problem | Frequent retraining = trivial deltas |
| No version tracking | Full version registry with automated rollback |

---

## LESSONS

1. **Fine-tuning naturally produces tiny deltas.** Only the classification head changes. The feature extractor is frozen. This means delta compression is almost free — the architecture is designed for it.

2. **stdlib is enough.** The delta system uses Python `gzip` and `struct` — no dependencies. The `.rkd` format is 80 lines of Python. Simple solutions for simple problems.

3. **Patch against bundled assets, not cached.** The patching target is the model shipped in the APK, not a downloaded copy. This ensures deterministic patching — the base is always the same, regardless of update history.

4. **The 50% savings gate prevents perverse incentives.** Without it, a badly-optimized delta (e.g., random weights = 100% changed) would ship a file the same size as the full model, but with extra patching overhead. The gate ensures deltas are always worthwhile.

5. **Edge functions are perfect for this.** A Deno edge function on Supabase does the version check in `< 10ms`, returns pre-signed URLs, and costs nothing for the traffic volume.

---

## LINKS

- **Code:** [github.com/jaweed3/retakId](https://github.com/jaweed3/retakId)
- **compute_delta.py:** `backend/scripts/training/compute_delta.py`
- **deploy_delta.py:** `backend/scripts/deploy_delta.py`
- **Edge function:** `backend/edge-functions/check-model-update/index.ts`

*June 2026. Part of the Retak.id project — landslide early detection for rural Indonesia.*
