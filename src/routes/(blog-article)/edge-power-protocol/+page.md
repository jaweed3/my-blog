---
slug: edge-power-protocol
title: 'Measuring Millijoules on a $5 USB Meter: Power Protocol for Edge Inference'
date: 2026-09-16T09:00:00.000Z
excerpt: "mJ/inf = W × mean_ms. How to get honest energy numbers for edge ML papers with an inline USB meter, and when to admit you don't have the data."
tags:
  - Edge ML
  - Benchmark
  - Power Measurement
  - Case Study
keywords:
  - edge inference energy
  - USB power meter
  - mJ per inference
  - Raspberry Pi 5 power
hidden: false
---

Reviewers asked for power/energy "even approximate." Here's the protocol that turns a cheap inline USB meter into publishable numbers — and the line where approximation becomes fabrication.

## Topology

```
wall → official 5V PSU → USB meter → USB-C cable → Pi 5
```

The meter is inline, not the supply. And the PSU must be the official one: a weak supply sags under load, the SoC throttles, and both your latency and wattage numbers are garbage. Stable power is a measurement prerequisite, not an accessory.

## Procedure

1. Pin the governor to `performance`. Frequency scaling during measurement invalidates everything.
2. Idle baseline: boot, wait ~30s for steady state, record `W_idle`, SoC temp.
3. Per config: run the standard 1000-warmup + 1000-measured pass, record stable `W_load` during the measured phase. Ignore warmup spikes.
4. If the meter fluctuates, record the range (e.g. 5.1–5.3W) and use the midpoint. Report the range, not just the midpoint.

## The math

`mJ/inference = W_load × mean_ms`

Units work out cleanly: watts × milliseconds = millijoules (since J = W·s, ×1000 for mJ, ÷1000 for ms — they cancel). Example: 5.2W × 0.2107ms = 1.096 mJ/inf.

You need both halves: watts from the meter, mean latency from the benchmark JSON. The template I bring to the session pre-fills all baseline means so the field work is watts-only.

## What makes it honest

- Same PSU, same cable, same ambient setup across all configs. Changing hardware mid-session voids comparability.
- Report idle alongside load. A reader can sanity-check your delta.
- Temperature logged before/after each config. Throttling shows up here first.
- Photo of the wiring. Costs nothing, kills "was this even measured" questions.

## When to not report

If a config's watts weren't measured: write `n/a` + one future-work sentence. Do not estimate from "similar" configs, do not scale from literature TDP. An approximate measurement is a number you actually read off a meter with stated error bars. Anything else is fiction with units.

That distinction is exactly what the reviewer asked for: "even approximate" means honest coarse data, not invented precise data.
