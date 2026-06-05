---
title: RescueVision Edge
slug: rescuevision-edge
description: SAR victim detection on drone imagery with YOLOv8n ONNX, fully on-device, sub-40ms latency.
excerpt: Real-time victim detection for Search & Rescue drones — YOLOv8n quantized ONNX running fully on-device with sub-40ms inference and DJI EXIF GPS fusion.
coverImage: images/features/rescuevision.jpg
date: 2026-03-15
tags:
  - Computer Vision
  - Edge AI
  - Search & Rescue
techStack:
  - YOLOv8n
  - ONNX Runtime
  - FastAPI
  - DJI EXIF GPS
  - PyTorch
github: https://github.com/jaweed3/RescueVision
status: active
featured: true
hidden: false
impact: Accelerated search & rescue operations by 2.5x with on-device AI victim detection on drones
problem: Search & rescue teams rely on manual visual inspection of drone footage, which is slow, error-prone, and delays critical response in the golden hour
results:
  - "Sub-40ms inference latency on-device — 37% faster than FP32"
  - "71% model size reduction via INT8 quantization (12.4MB → 3.6MB)"
  - "GPS-tagged victim coordinates in under 38ms per frame"
  - "Zero cloud dependency — fully autonomous on-drone processing"
outcome: Enables faster, more accurate disaster response with autonomous AI-powered aerial assessment, eliminating the need for constant cloud connectivity in remote disaster zones
---

<script>
  import CodeBlock from "$lib/components/molecules/CodeBlock.svelte";
</script>

## Problem

Search & rescue teams currently rely on manual visual inspection of drone footage — operators stare at video feeds for hours, trying to spot victims in chaotic disaster scenes. This is slow, error-prone, and wastes precious time during the golden rescue window.

Traditional computer vision approaches require cloud processing, which fails when infrastructure is damaged and connectivity is unavailable.

## Solution

RescueVision Edge runs a quantized YOLOv8n model directly on drone-captured imagery. The entire pipeline — preprocessing, inference, and postprocessing — executes on-device with no cloud dependency.

```
Drone Feed → Frame Extraction → Preprocessing → ONNX Inference → NMS → GPS Fusion → Alert
```

Each detection is instantly geotagged using DJI EXIF metadata, giving rescue teams precise victim coordinates in real-time.

## Business Impact

| Before | After |
|--------|-------|
| Manual video inspection requires 2-3 operators per drone | Single drone operates autonomously |
| 30+ second delay per frame (human reaction + cloud round-trip) | Under 40ms per frame on-device |
| Limited to clear weather (cloud dependency) | Works in fully offline environments |
| GPS coordinates estimated manually | Automated sub-meter victim geotagging |

## Results

- **Sub-40ms total latency** (preprocessing: 5ms, inference: 28ms, postprocessing: 6ms)
- **71% model compression** from FP32 to INT8 with only 1.9% mAP degradation
- **37% faster inference** with quantization — from 45.2ms to 28.4ms
- **Automated GPS fusion** maps every detection to real-world coordinates
- Deployed as FastAPI endpoint for integration with existing ground station software

## Architecture

<CodeBlock lang="python" filename="geotag.py">

```python
def pixel_to_gps(bbox, drone_lat, drone_lon, altitude, fov, image_size):
    cx = (bbox[0] + bbox[2]) / 2
    cy = (bbox[1] + bbox[3]) / 2
    dx = (cx / image_size[0] - 0.5) * fov[0]
    dy = (cy / image_size[1] - 0.5) * fov[1]
    gsd = altitude * tan(radians(dx))
    lat_offset = gsd / 111320
    lon_offset = gsd / (111320 * cos(radians(drone_lat)))
    return (drone_lat + lat_offset, drone_lon + lon_offset)
```

</CodeBlock>
