---
slug: deforestid
title: "Deforest.id: Legal-Aware Forest Monitoring with Satellite ML"
date: 2026-06-05T14:00:00.000Z
excerpt: "YOLOv8 + GEE + government One Map Policy — detecting deforestation per grid cell, cross-referencing with official forest zone data, and sending WhatsApp alerts with criminal law citations."
coverImage: /images/posts/deforestid.svg
tags:
  - Edge AI
  - Computer Vision
  - Backend
  - Case Study
---

Indonesia loses over a million hectares of forest per year. The monitoring tools that exist — Global Forest Watch, DETER, RADD — detect deforestation but don't alert local field officers in real time. More importantly, they have no awareness of Indonesian law.

A forest fire detected in Protected Forest (Hutan Lindung) carries different legal weight than the same fire in Production Forest (Hutan Produksi). One is a criminal violation of UU 41/1999 with up to 10 years imprisonment. The other is a permit violation. Global tools don't distinguish between the two.

Field officers also don't check satellite dashboards. They use WhatsApp.

This project was collaborative research with Farrel Ghozy (data acquisition, labeling). The architecture and ML pipeline are my work; the data partner handled ground-truth validation.

## The legal layer

This is what makes Deforest.id different. Before generating an alert, the system cross-references the detected grid cell against official government forest zone data from KLHK and BIG (One Map Policy):

- Hutan Lindung / Cagar Alam → CRITICAL alert, includes UU 41/1999 citation
- Hutan Produksi → HIGH alert
- Hutan Produksi Konversi → LOW alert
- APL/Non-Kawasan → INFO only

A "severe" damage classification in a protected zone gets automatically escalated to critical severity with the relevant law citation.

## How it works

Satellite imagery comes from Google Earth Engine (Landsat 8/9, Sentinel-2) with cloud cover under 20%. A grid generator splits the area of interest into 256m × 256m cells, stored as PostGIS geometry. Forest zone polygons from KLHK's SIGAP portal and BIG's Satupeta are synced weekly and spatially joined locally — government API calls are slow and rate-limited, but PostGIS R-tree indexes make grid-zone lookups under 5ms per cell.

Each grid tile goes through YOLOv8 (quantized to TFLite for CPU inference) which classifies damage as severe, moderate, mild, or none. The ML result then passes through a legal validator: severity + zone category = final alert level.

If confidence is above 0.7 and the zone is protected, a WhatsApp notification goes out automatically via Baileys (WhatsApp Web API) — no paid API, no Twilio costs. The alert includes the coordinates, annotated satellite image, and the legal basis for prosecution.

## ML pipeline

Custom dataset built from labeled GEE imagery, three-class damage severity with geological validation, and cloud pixel masking. Hermetic training with DVC for dataset versioning, Docker for environment reproducibility, and a Streamlit mask reviewer to audit annotations before training.

**YOLOv8 vs U-Net was a real tradeoff.** U-Net gives per-pixel segmentation (more precise damage area), but YOLOv8 is faster and simpler for grid-based classification. We prototyped both and chose YOLOv8 for the pipeline. The U-Net experiments are in the research paper.

## Infrastructure

Bun + Elysia for the backend — 3x faster startup and native TypeScript support make it ideal for containerized deployments. PostGIS for spatial joins. Baileys for WhatsApp notifications. Docker Compose with CPU pinning — ML inference gets dedicated physical cores to prevent contention with the API and database.

Running on a Proxmox VPS. CPU inference on 4 vCPU / 8GB RAM processes ~100 grids per batch in about 10 minutes. GPU inference would drop this to seconds. For a research prototype the tradeoff is acceptable; production would need a GPU node or edge TPU.

## What we built

GEE fetcher + grid generator is production-ready. YOLOv8 training pipeline is complete. ML inference (TFLite quantized) is functional. KLHK/BIG GIS overlay is integrated via PostGIS spatial join. Legal-aware alert severity is implemented as a database trigger. React + Leaflet dashboard is built. WhatsApp bot is prototyped with alert formatting done. The methodology is written up as a LaTeX paper for ICP concept submission.

## Lessons

**The legal layer was the hardest part and the most important.** Government GIS APIs (KLHK SIGAP, BIG Satupeta) are poorly documented, rate-limited, and occasionally return malformed GeoJSON. We built a weekly sync with validation and fallback. The effort was worth it — legal context transforms a generic deforestation alert into actionable evidence.

**CPU inference on a VPS is the bottleneck.** At 4 vCPU / 8GB RAM, processing a full area of interest takes too long for real-time monitoring. Production deployment would need a GPU node or edge TPU.

**Baileys is fragile but free.** WhatsApp Web API sessions disconnect unpredictably and require QR re-auth. For research it works. For production, a paid WhatsApp Business API or Telegram bot would be more reliable.

**The paper was as important as the code.** Publishing forced us to formalize the architecture, reference related work, and justify design decisions. The concept paper gave the project academic credibility beyond the codebase.

## Links

- Code: [github.com/FarrelGhozy/Deforest.id](https://github.com/FarrelGhozy/Deforest.id)
- Stack: Python (GEE, YOLOv8) · Bun + Elysia · PostgreSQL + PostGIS · React + Leaflet · Docker

*June 2026. Collaborative research with Farrel Ghozy. ML pipeline, architecture, and paper by Jaweed.*
