---
title: PerpusGate
slug: perpusgate
description: Production face recognition library access system — deployed and serving daily users.
excerpt: AI-powered library gate system with face recognition — running in production at a university, serving thousands of daily entries.
coverImage: images/features/perpusgate.jpg
date: 2025-09-15
tags:
  - Computer Vision
  - Production
  - Access Control
techStack:
  - InsightFace
  - FastAPI
  - MySQL
  - Vanilla JS
  - Python
github: https://github.com/jaweed3/perpusgate
status: active
featured: true
hidden: false
impact: Eliminated manual ID checks for a university library — replacing card-based entry with face recognition
stats:
  - value: "10x"
    label: "Throughput"
  - value: "<1s"
    label: "Recognition"
  - value: "0"
    label: "Staff Needed"
  - value: "Live"
    label: "Production"
problem: University libraries waste 10-15 seconds per student on manual ID card checks during peak hours, creating long queues and requiring multiple security staff at entrances
results:
  - "Production deployment — serving real users daily"
  - "Sub-second face recognition with InsightFace"
  - "Replaced physical ID cards with face-based entry"
  - "10x faster throughput during peak hours"
outcome: Eliminated entry bottlenecks at peak hours, reduced staffing requirements, and modernized library access with zero-touch face recognition
---

## Problem

University library entry during peak hours:
- **Long queues**: 10-15 seconds per student for manual ID card check
- **Staff cost**: Multiple security/attendant staff needed at entrances
- **ID card issues**: Forgotten cards, damaged cards, temporary replacements
- **No analytics**: No data on entry patterns, peak usage, or unauthorized access

## Solution

PerpusGate is a production face recognition system that:
1. **Detects and recognizes** faces at the library entrance
2. **Grants access** automatically — no cards, no tokens
3. **Logs entries** with timestamps and face embeddings
4. **Alerts staff** on unrecognized individuals

Built with InsightFace for high-accuracy face recognition, FastAPI for the backend, and MySQL for persistent storage.

## Business Impact

| Before (Manual ID Check) | After (Face Recognition) |
|--------|-------|
| 10-15 seconds per entry | Under 1 second per entry |
| 2-3 staff needed at peak hours | 0 staff at gate — automated entry |
| Queue buildup during class changes | Smooth flow with no bottlenecks |
| Card replacement costs | Zero consumable costs |
| No visitor analytics | Full entry analytics and usage patterns |

## Results

- **Production deployment** — actively serving daily users
- **Sub-second recognition** with InsightFace deep learning model
- **10x throughput improvement** during peak class-change hours
- **Zero-touch entry** — students walk in, recognized automatically
- **MySQL-backed** persistent storage for access logs and analytics
- **MVPs first** — vanilla JS frontend + FastAPI backend for rapid deployment
