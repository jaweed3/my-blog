---
title: OliTrack — Lingkar Oli Semarang
slug: olitrack
description: Circular B3 traceability for used motor oil from informal workshops — closing the first mile of the used-oil loop with offline-first mobile capture.
excerpt: DSDC 2026 — closing the used-motor-oil loop at the first mile, with offline drum capture, B3 risk scoring and a digital manifest for licensed collectors.
coverImage: images/features/olitrack.png
date: 2026-08-23
tags:
  - Circular Economy
  - Offline-First
  - Waste Traceability
techStack:
  - React
  - Supabase
  - PWA
  - GeoJSON
github: https://github.com/jaweed3/olitrack
status: wip
featured: true
hidden: false
impact: Targets the actual failure point in Indonesia's used-oil chain — the informal first mile, where 1,500–2,000 workshops per city lose the material before any formal system sees it
stats:
  - value: '1,500–2,000'
    label: 'Informal Workshops in Semarang'
  - value: 'Rp 3–5K'
    label: 'Recoverable Value / Liter'
  - value: '850–900t'
    label: 'Daily Waste to Jatibarang'
  - value: '30s'
    label: 'Drum Capture'
problem: Used motor oil from informal workshops is discarded without a B3 manifest, so it reaches drains, wells and an already-overloaded landfill — while the biodiesel value in that same liter is lost at the first mile.
results:
  - 'Guest-first capture: a 30-second drum photo is enough to start, GPS optional'
  - 'Automated liter calculation plus a B3 risk score per collection'
  - 'Licensed collectors routed in; digital B3 manifest issued as PDF + QR'
  - 'DLH dashboard tracks diverted liters per district'
  - 'Offline-first via IndexedDB — captures survive dead spots and poor signal'
outcome: Proves the circular loop is a first-mile logistics problem, not a refinery problem, and makes the informal contribution legible to the formal collectors and regulator that currently cannot see it
---

## Problem

Semarang has an estimated **1,500–2,000 informal motorcycle workshops** that dispose of used oil with no B3 manifest. The oil goes into drains and wells, and into the Jatibarang landfill — already receiving 850–900 tons a day against 1,200 tons of generation.

The environmental damage is the headline, but the more interesting number is this: one liter of used oil is worth roughly **Rp 3,000–5,000** as biodiesel feedstock. So the loop is not broken because the material has no value. It is broken at the first mile, before anyone collects it.

## Solution

```
Workshop photographs drum (30s)
   → system estimates liters + B3 risk score
   → licensed collector is dispatched
   → digital manifest issued (PDF + QR)
   → oil becomes biodiesel
   → DLH dashboard tracks diverted liters per district
```

Guest-first and GPS-optional are deliberate. Asking a small workshop owner to register an account and grant location access before their first collection is how you lose them. One photo is the whole onboarding.

The risk score is what makes it more than a receipt app — it flags contaminated loads before they reach a processor, which is the thing that actually determines whether oil gets accepted or dumped.

## Design decisions

**Offline-first, via IndexedDB.** Workshop coverage in Semarang is not uniform, and a capture tool that fails without signal fails exactly where the material is. Captures queue locally and sync when a connection returns.

**Configuration over code.** Theme and parameters live in `circular.yaml`, so the same codebase serves the next city's program without a rewrite.

**Reuses the Retak.id pattern.** Photo capture, location, validation, risk score, map, verification, manifest — the interaction model was already proven on a landslide-reporting problem, so OliTrack is a domain swap rather than a new invention. That is the cheapest possible path to a working prototype for a hackathon.

Design system lives in `base ui reference/olitrack_semarang/DESIGN.md` — Slate `#0F172A`, Amber `#FEA619`, Teal `#0E6A3A`, Plus Jakarta Sans, industrial-modern.

## Status

WIP. Proposal-stage for DSDC 2026 (_Circular Economy for Eco-Health Cities_ — Smart Waste & Resource Circularity + Eco-Health Monitoring). The full loop is designed and the capture flow is the piece that matters most to de-risk first, since every downstream step depends on getting the first mile recorded accurately.
