---
title: AntiTimpa (FactLens)
slug: anti-timpa
description: An Android scam detector that reads the screen on demand — hold the floating button, the text is OCR'd and checked, and a verdict comes back.
excerpt: Scam detection that works on the message you are already reading — hold a floating button to blur the screen, OCR the text, and get a verdict.
date: 2026-07-25
tags:
  - Mobile
  - Security
  - OCR
techStack:
  - Kotlin
  - Jetpack Compose
  - FastAPI
  - OCR
github: https://github.com/jaweed3/anti-timpa
status: wip
featured: false
hidden: false
impact: Detects scams at the point of reading rather than at the point of receiving, which is where a copy-paste-to-check flow actually breaks down
stats:
  - value: '2s'
    label: 'Hold to Scan'
  - value: '3'
    label: 'Verdict Levels'
  - value: 'Build 1.1'
    label: 'Current POC'
problem: Scam warnings live in the channel the scam arrived through. The person who most needs to check a message is the person least likely to think of checking it — so link warnings and "report scam" buttons arrive too late to matter.
results:
  - 'Floating overlay button works on top of any app — Instagram, WhatsApp, TikTok'
  - 'Long-press 2 seconds blurs the screen, runs OCR, and sends the text for checking'
  - 'Verdict returned as a result card: Aman / Mencurigakan / Terindikasi Penipuan'
  - 'Result card lists the specific flagged items rather than a bare score'
  - 'Backend in FastAPI, modular by team with clear per-module ownership'
outcome: Fits scam checking into the two-second attention window of actually reading a message, instead of a separate app the user has to remember to open
---

## Problem

The anti-scam advice that actually exists assumes a workflow nobody follows. _Check the link. Don't transfer to new accounts. Report it._ By the time a recipient thinks to verify, they are three replies deep and the money is gone.

The structural problem is that awareness lives in a different channel than the threat. Warnings arrive as broadcast announcements on one platform while the scam arrives as a direct message on another, from someone who appears to be a friend.

## Approach

Detect at the moment of reading, using the screen the user is already looking at.

```
Floating FAB appears over any app
   → hold 2 seconds
   → screen blurs (also a privacy signal to the reader)
   → OCR extracts the text
   → backend checks for scam patterns
   → verdict card: Aman / Mencurigakan / Terindikasi Penipuan
```

The overlay button works on top of **any** app — Instagram, WhatsApp, TikTok. That is the whole trick: the user never leaves the conversation, and never has to decide to open a different app.

The verdict names the **specific flagged items** rather than returning a bare score. "Mencurigakan" on its own is not actionable; the user needs to see _which_ phrase triggered it.

Blurring the screen is doing double duty — it signals to the person being photographed that their screen is being read, which is a privacy affordance the design gets for free from the OCR step.

## Status

**WIP.** Two Android APKs are committed (v1.0 hackathon build and a v1.1 proof of concept), alongside the backend, specs and design references. Running it locally means building the debug APK and starting the FastAPI backend.

The shipped APKs are the honest artifact here — a hackathon v1.0 and a v1.1 POC is the expected shape of this kind of project, and having both committed makes the iteration visible.
