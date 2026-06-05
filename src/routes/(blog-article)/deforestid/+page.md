---
slug: deforestid
title: "Deforest.id: Legal-Aware Forest Monitoring with Satellite ML"
date: 2026-06-05T14:00:00.000Z
excerpt: "YOLOv8 + GEE + government One Map Policy — detecting deforestation per grid cell, cross-referencing with official forest zone data from KLHK/BIG, and sending WhatsApp alerts with criminal law citations."
coverImage: /images/posts/deforestid.svg
tags:
  - Edge AI
  - Computer Vision
  - Backend
  - Case Study
---

## PROBLEM

Indonesia loses over 1 million hectares of forest per year. The monitoring tools that exist — Global Forest Watch, DETER, RADD — are reactive and passive. They detect deforestation but don't alert local field officers in real time. More importantly, they have no awareness of *Indonesian law*.

A forest fire detected in a Protected Forest (Hutan Lindung) carries different legal weight than the same fire detected in Production Forest (Hutan Produksi). The first is a criminal violation of UU 41/1999 with up to 10 years imprisonment. The second is a permit violation. Existing global tools don't distinguish between the two.

Field officers don't check satellite dashboards. They use WhatsApp.

**What if deforestation alerts included geotagged photos, ML confidence scores, *and* the exact legal basis for prosecution — all sent to a field officer's phone automatically?**

This project was developed as collaborative research with Farrel Ghozy (data acquisition, labeling). The architecture and ML pipeline are my work; the data partner handled ground-truth validation.

---

## ARCHITECTURE

```
GEE (Landsat/Sentinel)
  → Python Fetcher → Grid Generator (256m cells)
  → PostGIS (grid_cells + forest_zones overlay)
  → ML Worker (YOLOv8 → TFLite)
  → Legal Validator (combine ML confidence + zone category)
  → PostgreSQL (detection_logs + alerts)
  → Backend API (Bun + Elysia)
     ├── React + Leaflet dashboard
     └── WhatsApp Bot (Baileys) → field officer phone
```

### The Legal Layer

This is what makes Deforest.id different from any global forest monitoring tool. Before generating an alert, the system cross-references the detected grid cell against official government forest zone data:

| Zone Code | Category | Alert Level |
|-----------|----------|-------------|
| 100100 — Hutan Lindung (HL) | PROTECTED | 🔴 CRITICAL |
| 100210 — Cagar Alam (CA) | CONSERVATION | 🔴 CRITICAL |
| 200000 — Hutan Produksi (HP) | PRODUCTION | 🟡 HIGH |
| 200300 — Hutan Produksi Konversi (HPK) | PRODUCTION | 🟢 LOW |
| Lainnya — APL/Non-Kawasan | NON-FOREST | ⚪ INFO |

A `severe` damage classification in a PROTECTED zone gets automatically escalated to `critical` severity and the alert includes the relevant law citation (UU 41/1999, Permen LHK 7/2021).

### Data Sources

- **Satellite imagery:** Google Earth Engine (Landsat 8/9, Sentinel-2), cloud cover `< 20%`
- **Forest zones:** KLHK Geoportal (SIGAP) — Penetapan Kawasan Hutan layer + BIG Satupeta (One Map Policy)
- **Grid system:** 256m × 256m cells, stored as PostGIS geometry for spatial join with forest zone polygons

---

## ML PIPELINE

### Model

YOLOv8 (Ultralytics) for land damage detection per grid tile, quantized to TensorFlow Lite for CPU inference.

```
Input: 640×640 grid tile (from GEE crop pipeline)
  → YOLOv8 inference → bounding boxes + confidence
  → Post-processing (NMS, threshold at 0.7)
  → Classification: severe / moderate / mild / none
  → Annotated image with zone overlay label
```

### Training Data

Custom dataset built from:
- Labeled grid tiles from GEE imagery (Farrel: labeling, Jaweed: pipeline + training)
- 3-class damage severity with geological validation
- Cloud pixel masking (255 = ignore in loss)
- Streamlit-based mask reviewer for annotation quality control

### Training Pipeline

```
GEE fetcher → grid crop → ML inference → results writer
  → Legal validator → alert trigger (if confidence > 0.7)
  → WA bot notification
```

Hermetic training with DVC for dataset versioning, Docker for environment reproducibility, and a mask reviewer app built in Streamlit to audit and correct annotations before training.

---

## KEY DECISIONS

**Bun + Elysia over Express/Fastify.** Bun's 3× faster startup and native TypeScript support make it ideal for containerized deployments. Elysia provides end-to-end type safety without a separate validation layer.

**PostGIS spatial joins over API calls.** Government API calls for KLHK/BIG data are slow and rate-limited. Pulling forest zone polygons once (weekly sync) and doing spatial joins locally with PostGIS R-tree indexes makes grid-zone lookups `< 5ms` per cell.

**Baileys (WhatsApp Web API) for notifications.** No paid API, no Twilio costs. Runs as a containerized Node.js service that polls for unsent alerts every 30 seconds. Authentication via QR code scan, session persisted to disk.

**Docker Compose with CPU pinning.** ML inference is the bottleneck (4 vCPU, 8GB RAM dedicated). Pinning it to specific physical cores prevents contention with the backend API and database containers on the same host.

---

## RESULTS

| Component | Status |
|-----------|--------|
| GEE fetcher + grid generator | Production-ready |
| YOLOv8 training pipeline | Complete (v1 trained) |
| ML inference (TFLite quantized) | Functional, CPU inference |
| KLHK/BIG GIS overlay | Integrated via PostGIS spatial join |
| Legal-aware alert severity | Implemented in DB trigger |
| React + Leaflet dashboard | Built |
| WhatsApp Bot (Baileys) | Prototype, alert formatting done |
| Docker Compose deployment | Configured for Proxmox VPS |
| Published paper | LaTeX methodology + ICP concept paper |

### Grid Detection Stats

```
Total grid cells:     scalable to AOI
Detection batch:      100 grids / inference pass
Confidence threshold: 0.7 (configurable)
Alert escalation:     ML severity + zone category → final severity
```

---

## BUSINESS IMPACT

| Before | After |
|--------|-------|
| Reactive monitoring: wait for manual reports (24-72 hr) | Proactive EWS: satellite pull → ML → alert in `< 10 min` |
| No legal context in alerts | Alert includes zone status, SK decree, and criminal law citation |
| Global tools ignore Indonesian forest law | Integrated with KLHK/BIG One Map Policy — aligns with government data |
| Field officers don't check dashboards | WhatsApp notification reaches them where they already communicate |
| Alert has no evidentiary value | Alert includes geotagged coordinates, annotated image, and legal reference |

---

## LESSONS

1. **The legal layer was the hardest part — and the most important.** Government GIS APIs (KLHK SIGAP, BIG Satupeta) are poorly documented, rate-limited, and occasionally return malformed GeoJSON. We built a weekly sync with validation + fallback. The effort was worth it: the legal context transforms a generic deforestation alert into actionable evidence.

2. **U-Net vs YOLOv8 was a real tradeoff.** U-Net gives per-pixel segmentation (more precise damage area), but YOLOv8 is faster and simpler for grid-based classification. We prototyped both and chose YOLOv8 for the pipeline. The U-Net experiments are in the research paper.

3. **CPU inference on a VPS is the bottleneck.** At 4 vCPU / 8 GB RAM, processing a full AOI takes ~10 min per batch of 100 grids. GPU inference would drop this to seconds. For a research prototype the tradeoff is acceptable; production deployment would need a GPU node or edge TPU.

4. **Baileys is fragile but free.** WhatsApp Web API sessions disconnect unpredictably and require QR re-auth. For a hackathon/research project it works. For production, a paid WhatsApp Business API or Telegram bot would be more reliable.

5. **The paper was as important as the code.** Publishing the methodology as a LaTeX paper forced us to formalize the architecture, reference related work, and justify design decisions. The ICP concept paper gave the project academic credibility beyond the codebase.

---

## LINKS

- **Code:** [github.com/FarrelGhozy/Deforest.id](https://github.com/FarrelGhozy/Deforest.id)
- **Stack:** Python (GEE, YOLOv8) · Bun + Elysia · PostgreSQL + PostGIS · React + Leaflet · Docker

*June 2026. Collaborative research with Farrel Ghozy (data acquisition, labeling). ML pipeline, architecture, and paper by Jaweed.*
