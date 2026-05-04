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
---

<script>
  import CodeBlock from "$lib/components/molecules/CodeBlock.svelte";
</script>

## Architecture Overview

RescueVision Edge runs a quantized YOLOv8n model directly on drone-captured imagery. The entire pipeline — preprocessing, inference, and postprocessing — executes on-device with no cloud dependency.

### Pipeline

```
Drone Feed → Frame Extraction → Preprocessing → ONNX Inference → NMS → GPS Fusion → Alert
```

## Quantization Strategy

We apply INT8 quantization via ONNX Runtime to compress the FP32 YOLOv8n model while preserving detection accuracy.

The quantization formula for weights:

```
W_int8 = round(W_fp32 / scale) + zero_point
```

Where the scale and zero-point are calibrated per-channel using symmetric quantization:

```
scale = max(|W_fp32|) / 127
```

### Latency Breakdown

`t_total = t_pre + t_infer + t_post = 5ms + 28ms + 6ms < 40ms`

- **Preprocessing** (`5ms`): Resize to `640x640`, normalize to `[0, 1]`
- **Inference** (`28ms`): ONNX Runtime with INT8 execution provider
- **Postprocessing** (`6ms`): NMS with IoU threshold `0.45`, confidence threshold `0.50`

## Detection Performance

| Metric | FP32 | INT8 | Delta |
|--------|------|------|-------|
| mAP@0.5 | 0.892 | 0.884 | -0.9% |
| mAP@0.5:0.95 | 0.671 | 0.658 | -1.9% |
| Latency (ms) | 45.2 | 28.4 | -37% |
| Model Size (MB) | 12.4 | 3.6 | -71% |

## GPS Fusion

Each detection is geotagged using DJI EXIF metadata embedded in the drone imagery:

<CodeBlock lang="python" filename="geotag.py">

```python
def pixel_to_gps(bbox, drone_lat, drone_lon, altitude, fov, image_size):
    """
    Convert bounding box center to GPS coordinates
    using drone telemetry from DJI EXIF.
    """
    cx = (bbox[0] + bbox[2]) / 2
    cy = (bbox[1] + bbox[3]) / 2

    # Angular offset from drone nadir
    dx = (cx / image_size[0] - 0.5) * fov[0]
    dy = (cy / image_size[1] - 0.5) * fov[1]

    # Ground distance
    gsd = altitude * tan(radians(dx))
    lat_offset = gsd / 111320  # meters per degree lat
    lon_offset = gsd / (111320 * cos(radians(drone_lat)))

    return (drone_lat + lat_offset, drone_lon + lon_offset)
```

</CodeBlock>

## API Endpoint

The FastAPI server exposes a single inference endpoint:

<CodeBlock lang="yaml" filename="openapi.yaml">

```yaml
POST /detect
  Content-Type: multipart/form-data
  Parameters:
    - image: file (JPEG/PNG, drone capture)
    - confidence: float = 0.5
    - iou: float = 0.45
  Response:
    detections:
      - bbox: [x1, y1, x2, y2]
        class: "person"
        confidence: 0.94
        gps: [lat, lon]
    latency_ms: 38.2
```

</CodeBlock>
