---
title: Retak.id
slug: retakid
description: Crowdsourcing early detection of landslide soil cracks via Android + Web platform with on-device ML.
excerpt: Community-powered landslide early warning system — 84.9% accurate soil crack classification, fully offline, running on smartphones.
coverImage:
date: 2026-04-29
tags:
  - Computer Vision
  - Social Impact
  - Mobile AI
techStack:
  - Kotlin
  - TensorFlow Lite
  - React
  - Supabase
  - MobileNetV2
  - Leaflet
github: https://github.com/jaweed3/retakId
status: active
featured: true
hidden: false
impact: Democratizes landslide early warning — turning everyday smartphones into life-saving geohazard sensors for rural communities
stats:
  - value: "84.9%"
    label: "Accuracy"
  - value: "2.6MB"
    label: "Model Size"
  - value: "50ms"
    label: "Inference"
  - value: "3,547"
    label: "Samples"
problem: "41 landslides in 4 months in Jenangan, Ponorogo. Existing solutions (IoT sensors, satellite imagery, drone surveys) are too expensive and can't reach rural villages"
results:
  - "84.9% test accuracy on soil crack classification (MobileNetV2 INT8)"
  - "Runs fully offline on $200 Android phones — zero infrastructure"
  - "Multi-factor risk engine: slope, rainfall, elevation, soil type (5 factors, 300ms)"
  - "Delta OTA updates — 70-90% bandwidth savings for model updates"
outcome: Enables rural communities to detect landslide risks early without any infrastructure investment — just a smartphone and the app
---

## Problem

Jenangan, Ponorogo. 41 landslides in 4 months. Illegal mining strips vegetation, destabilizes slopes. Roads cut off. Communities isolated.

Local disaster agency (BPBD) lacks real-time field data. Existing solutions — IoT sensors, satellite imagery, drone surveys — are too expensive and can't reach rural villages.

**What if every citizen with a smartphone could detect landslides before they happen?**

## Solution

**Retak.id** — an Android + Web platform that classifies soil crack severity from a single photo, computes multi-factor risk in real-time, aggregates citizen reports, and feeds verified data back into model retraining.

```
Point camera → Take photo → Instant risk level → Live dashboard → Verify → Retrain
```

All ML inference runs **fully offline on-device** — no internet required in deep rural slopes.

## Business Impact

| Before | After |
|--------|-------|
| Zero early warning system in rural areas | Free app turns phones into landslide sensors |
| BPBD relies on manual reports (hours late) | Real-time dashboard with geotagged reports |
| IoT sensor deployment: $500+/location | Zero infrastructure cost — uses existing smartphones |
| Satellite imagery: $1000+/km², days to process | Instant AI analysis, 300ms per photo |

## Results

- **84.9% test accuracy** on 3-class soil crack classification (AMAN / WASPADA / BAHAYA)
- **2.6MB INT8 model** — fits on any Android 8+ device
- **Sub-50ms inference** on mid-range phones (Pixel 4a)
- **5-factor risk engine** combines ML vision (50%) + slope (20%) + rainfall (15%) + elevation (10%) + soil type (5%)
- **3,547 training samples** across 3 classes, manually annotated
- **Human-in-the-loop verification** — every admin correction becomes training data
- **Delta OTA updates** — 70-90% bandwidth savings for model updates in rural areas with limited connectivity
- IYREF 2026 Semi-Finalist
