---
slug: retakid
title: "Retak.id: On-Device ML for Landslide Early Detection"
date: 2026-05-01T10:00:00.000Z
excerpt: "84.9% accuracy, 2.6MB INT8 model, fully offline — production ML deployment for a real humanitarian problem in Ponorogo, Indonesia."
coverImage: /images/posts/retakId.png
tags:
  - Machine Learning
  - Computer Vision
  - TFLite
  - Android
  - Case Study
---

## PROBLEM

Jenangan, Ponorogo. 41 landslides in 4 months. Illegal mining strips vegetation, destabilizes slopes. Roads cut off. Communities isolated.

Local disaster agency (BPBD) has no real-time field data. Existing solutions — IoT sensors ($500+/node), satellite imagery ($1,000+/km²), drone surveys — are too expensive and can't reach rural villages. The only alternative is manual reporting, which is hours late.

**What if every citizen with a smartphone could detect landslide risks before they happen?**

This is a real deployment, not a research prototype. The app is running on users' phones in Ponorogo.

---

## ARCHITECTURE

```
Camera → Bitmap (any resolution)
  → Resize 224×224 → uint8 [0,255]
  → TFLite INT8 Model (2.6MB)
  → AMAN / WASPADA / BAHAYA + confidence
  → No internet required. 0ms server latency. Works in rural Ponorogo.
```

Key decisions:
- **On-device inference, not cloud.** Landslide-prone areas have poor connectivity. A cloud API is useless if users can't reach it. TFLite runs on any Android 7.0+ device.
- **INT8 quantization.** Drops model from 14MB FP32 to 2.6MB — fits in a single APK. Inference latency `<50ms` on a Pixel 4a.
- **Config-driven pipeline.** Single `training.yaml` controls everything. Exact reproducibility for competition judges.

---

## DATA

Soil crack datasets don't exist. There's no ImageNet for Indonesian landslides. We had to build our own.

### Scraping
70+ search queries across DuckDuckGo. Built a custom scraper with:
- Perceptual hash deduplication (pHash, Hamming distance  `<` 6)
- Laplacian blur detection (reject images  `<` threshold)
- Rotating user agents + exponential backoff
- 12-thread parallel download with random delays

### Annotation Strategy
Manual triage into 3 classes by domain knowledge (not me — the team geologist). Critical insight: **retakan kemarau (dry season cracks) ≠ landslide warning signs.** We initially mislabeled these as WASPADA. Fixing this single labeling error jumped accuracy 3%.

```
v1 dataset: 4,522 images (noisy BAHAYA labels)
v2 dataset: 3,545 images (cleaned, balanced)
Result:     73% → 85% accuracy from data cleaning alone
```

Lesson: **Label quality beats dataset size. Always audit your annotations before tuning hyperparameters.**

---

## RESULTS

### Iteration 1: Baseline Transfer Learning
```
MobileNetV2 (frozen) + classification head
LR 1e-4, dropout 0.3, basic augmentation
→ 73.0% test accuracy
```
Standard transfer learning. Decent, but WASPADA F1 was 0.56. The model couldn't distinguish subtle warning signs from severe cracks.

### Iteration 2: Fine-Tuning
```
MobileNetV2 (layers 100+ unfrozen, 54 layers, 1.87M params)
LR 1e-5, dropout 0.5
→ 76.7% test accuracy
```
Unfreezing half the model helped, but 1.87M trainable params on 2,500 training images = overfitting. AMAN F1 dropped. Too aggressive.

### Iteration 3: Conservative Fine-Tuning
```
MobileNetV2 (layers 130+ unfrozen, 24 layers, 800K params)
LR 5e-6, dropout 0.5, aggressive augmentation
→ 81.8% test accuracy
```
The sweet spot. Fewer trainable params + slower learning = better generalization. WASPADA F1 recovered to 0.64.

### Iteration 4: Data Quality Fix
```
Same config. Cleaned dataset (BAHAYA noise removed).
→ 84.9% test accuracy. WASPADA F1 0.68+. INT8 agreement 93.75%.
```
**The biggest single improvement didn't come from model architecture — it came from fixing bad labels.**

---

Every decision was made with reproducibility as a constraint:

```bash
# Anyone can reproduce the exact model:
git clone https://github.com/jaweed3/retakId.git
bash scripts/bootstrap.sh    # auto-installs Python, deps, pulls data
make split && make train      # produces identical model.tflite
```

- **Fixed seeds everywhere** (Python, NumPy, TensorFlow, data split)
- **uv.lock** pins all 200+ dependencies
- **DVC + DagsHub** for dataset versioning (S3-compatible, free tier)
- **Docker** for hermetic training environment
- **MLflow** (DagsHub hosted) — every experiment logged: params, metrics, artifacts

---

## REPRODUCIBILITY

Built a grid search system that:
- Defines parameter grids in YAML (`grid_search.yaml`)
- Auto-generates experiment configs (cartesian product + exclude rules)
- Runs with resume support (SSH disconnect → re-run, skips completed)
- Logs everything to DagsHub MLflow (view from phone)

```
24 experiments × 15 min = ~6 hours on CPU, ~1 hour on GPU
Compare in MLflow UI: accuracy vs dropout vs fine_tune_at vs learning_rate
```

No more CSV files. No more "which config produced 81%?". Every run traceable.

---

## What I'd Do Differently

1. **Active learning for annotation.** Instead of random sampling, use model uncertainty to prioritize which images to label next. Would have caught the AMAN/WASPADA confusion earlier.

2. **Test-time augmentation.** Average predictions across 5-10 augmented versions for +1-2% free accuracy. Didn't implement due to mobile latency constraints.

3. **Model distillation.** Train a larger teacher model (EfficientNetB3), distill to MobileNetV3. Could push 90%+ while keeping  `<` 5MB.

4. **Start with data audit, not hyperparameter tuning.** 80% of the accuracy gains came from fixing labels, not tweaking learning rates. I learned this the hard way.

---

## BUSINESS IMPACT

| Before | After |
|--------|-------|
| Zero early warning system in rural areas | Free app turns phones into landslide sensors |
| BPBD relies on manual reports (hours late) | Real-time dashboard with geotagged reports |
| IoT sensor deployment: $500+/location | Zero infrastructure cost — uses existing smartphones |
| Satellite imagery: $1000+/km², days to process | Instant AI analysis, 300ms per photo |

This project was a semi-finalist at **IYREF 2026** (Climate Resilience & Local Wisdom category) and won the **Best Thematic Award**. The model is deployed as a TFLite package integrated into an Android app currently in use in the Ponorogo region.

---

## LINKS

- **Code:** [github.com/jaweed3/retakId](https://github.com/jaweed3/retakId)
- **Experiments:** [dagshub.com/jaweed3/retakId.mlflow](https://dagshub.com/jaweed3/retakId.mlflow)
- **Dataset:** [dagshub.com/jaweed3/retakId](https://dagshub.com/jaweed3/retakId)

*Built with Farrel (Data Acquisition) and Adam (Android Dev). May 2026.*
