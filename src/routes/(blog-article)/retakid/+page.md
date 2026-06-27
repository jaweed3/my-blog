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

Jenangan, Ponorogo. 41 landslides in 4 months. Illegal mining strips vegetation, destabilizes slopes. Roads cut off. Communities isolated.

The local disaster agency (BPBD) has no real-time field data. Existing solutions — IoT sensors at $500+/node, satellite imagery at $1,000+/km², drone surveys — are too expensive and can't reach rural villages. The only alternative is manual reporting, which is hours late.

This is a real deployment, not a research prototype. The app is running on users' phones in Ponorogo.

## How it works

Point your phone at a slope. The app captures a photo, resizes to 224x224, runs a TFLite INT8 model (2.6MB), and returns one of three classifications: AMAN (safe), WASPADA (caution), or BAHAYA (danger) — all on-device, no internet required.

Key decisions:
- **On-device inference.** Landslide-prone areas have poor connectivity. A cloud API is useless if users can't reach it. TFLite runs on any Android 7.0+ device.
- **INT8 quantization.** Drops the model from 14MB FP32 to 2.6MB — fits in a single APK. Inference latency under 50ms on a Pixel 4a.
- **Config-driven pipeline.** Single `training.yaml` controls everything. Exact reproducibility for competition judges.

## Building the dataset

Soil crack datasets don't exist. There's no ImageNet for Indonesian landslides. We built our own.

70+ search queries across DuckDuckGo. Custom scraper with perceptual hash deduplication (Hamming distance under 6), Laplacian blur detection to reject low-quality images, rotating user agents, exponential backoff, and 12-thread parallel download.

Manual triage into three classes by our team geologist. Critical discovery: retakan kemarau (dry season cracks) are not landslide warning signs. We initially mislabeled these as WASPADA. Fixing that single labeling error jumped accuracy by 3%.

V1 dataset: 4,522 images (noisy BAHAYA labels). V2: 3,545 images (cleaned, balanced). Result: 73% → 85% accuracy from data cleaning alone. Label quality beats dataset size. Always audit your annotations before tuning hyperparameters.

## Training iterations

**Iteration 1 — Baseline transfer learning.** MobileNetV2 (frozen) + classification head. LR 1e-4, dropout 0.3. 73.0% test accuracy. Decent, but WASPADA F1 was 0.56. The model couldn't distinguish subtle warning signs from severe cracks.

**Iteration 2 — Fine-tuning.** Unfroze layers 100+ (54 layers, 1.87M params). LR 1e-5, dropout 0.5. 76.7% test accuracy. But 1.87M trainable params on 2,500 training images = overfitting. AMAN F1 dropped.

**Iteration 3 — Conservative fine-tuning.** Unfroze layers 130+ (24 layers, 800K params). LR 5e-6, dropout 0.5, aggressive augmentation. 81.8% test accuracy. The sweet spot. Fewer trainable params + slower learning = better generalization.

**Iteration 4 — Data quality fix.** Same config. Cleaned dataset. 84.9% test accuracy. WASPADA F1 0.68+. INT8 agreement 93.75%. The biggest single improvement came from fixing bad labels, not changing the model architecture.

## Reproducibility

Every decision was made with reproducibility as a constraint:

```bash
git clone https://github.com/jaweed3/retakId.git
bash scripts/bootstrap.sh
make split && make train
```

Fixed seeds everywhere (Python, NumPy, TensorFlow, data split). uv.lock pins all 200+ dependencies. DVC + DagsHub for dataset versioning. Docker for hermetic training. MLflow (DagsHub hosted) logs every experiment — params, metrics, artifacts.

Built a grid search system that defines parameter grids in YAML, auto-generates experiment configs, runs with resume support, and logs everything to DagsHub MLflow. No more CSV files. No more "which config produced 81%?"

## What I'd do differently

**Active learning for annotation.** Instead of random sampling, use model uncertainty to prioritize which images to label next. Would have caught the AMAN/WASPADA confusion earlier.

**Test-time augmentation.** Average predictions across 5-10 augmented versions for +1-2% free accuracy. Didn't implement due to mobile latency constraints.

**Model distillation.** Train a larger teacher model (EfficientNetB3), distill to MobileNetV3. Could push 90%+ while keeping under 5MB.

**Start with data audit, not hyperparameter tuning.** 80% of the accuracy gains came from fixing labels, not tweaking learning rates. I learned this the hard way.

## Impact

Before: zero early warning system in rural areas. BPBD relies on manual reports that arrive hours late.

After: a free app that turns phones into landslide sensors. Zero infrastructure cost — uses existing smartphones. Instant AI analysis, ~300ms per photo.

This project was a semi-finalist at IYREF 2026 (Climate Resilience & Local Wisdom category) and won the Best Thematic Award. The model is deployed as a TFLite package integrated into an Android app currently in use in the Ponorogo region.

## Links

- Code: [github.com/jaweed3/retakId](https://github.com/jaweed3/retakId)
- Experiments: [dagshub.com/jaweed3/retakId.mlflow](https://dagshub.com/jaweed3/retakId.mlflow)
- Dataset: [dagshub.com/jaweed3/retakId](https://dagshub.com/jaweed3/retakId)

*Built with Farrel (Data Acquisition) and Adam (Android Dev). May 2026.*
