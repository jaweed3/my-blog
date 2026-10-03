---
title: Mahasantri — anonymous reporting
slug: mahasantri
description: End-to-end encrypted anonymous reporting app for pesantren students — identity is never stored, and admins decrypt offline on an air-gapped machine.
excerpt: 'Zero-knowledge reporting for pesantren students — E2E-encrypted submissions, a dual-PIN decoy, no IP storage, and admin decryption on an air-gapped machine.'
coverImage: images/features/mahasantri.png
date: 2026-08-07
tags:
  - Security
  - Privacy
  - Mobile
techStack:
  - Kotlin
  - Jetpack Compose
  - FastAPI
  - Google Tink
  - Nginx
github: https://github.com/jaweed3/whistleblower
status: active
featured: true
hidden: false
impact: Makes anonymous reporting survivable for students who live in the institution they are reporting about — coercion is designed around, not promised away
stats:
  - value: 'ECIES'
    label: 'P-256 + AES-128-GCM'
  - value: '0'
    label: 'Identities Stored'
  - value: '5'
    label: 'Failed PINs Before Wipe'
problem: Abuse reporting in a boarding school fails on coercion, not on technology. A student who must identify themselves to file a report — or whose identity the server can later reveal — will simply not file one.
results:
  - 'Server stores only a SHA-256 hash of the submission token — the hash cannot be reversed to reach the reporter'
  - 'End-to-end encryption with Google Tink ECIES P-256 + AES-128-GCM'
  - 'Dual-PIN gate: real PIN opens the app, decoy PIN opens a calculator and wipes after 5 failed attempts'
  - 'Nginx strips all IP headers — no connection metadata retained'
  - 'Public feed of sanitized reports with admin-verified k-anonymity, plus solidarity voting'
outcome: Demonstrates that anonymous reporting is achievable end to end when threat modeling assumes the institution itself is the adversary
---

## Problem

Reporting abuse in a pesantren has one hard constraint that a normal reporting app cannot satisfy: **the reporter lives in the institution they are reporting about.**

That changes the threat model completely. A student filing a report through a conventional system has to trust that the school's administration — who operate and can subpoena that same system — will never learn who filed it. If the server can decrypt a report, or retain an IP address, or tie a token to an account, the anonymity is cosmetic.

## Approach

Assume the operator is the adversary. Every design decision follows from that.

**End-to-end encryption (Google Tink).** ECIES with P-256, AES-128-GCM for the payload. The server handles ciphertext only. The private key lives on an air-gapped machine, so there is no online component capable of decrypting a report at all — not a policy against it, not a permission flag, an absence.

**Zero-knowledge tokens.** The server stores only a SHA-256 hash of a deterministic token derived from a server-side secret and the hash of the encrypted blob. A student holds the token locally and can later present it to check status. The server confirms validity without ever learning who presented it, when, or what the report says.

**Dual-PIN gate.** The real PIN opens the app. The decoy PIN opens what looks like a working calculator. Five failed attempts trigger an auto-wipe. A forced hand-over of an unlocked phone yields a calculator.

**No IP storage.** Nginx is configured to strip every IP header before the request reaches the application, so connection metadata never exists to be leaked.

**Public feed with k-anonymity.** Reports are sanitized and published so the community can see that reporting is happening and solidarity is possible, but only once enough reports aggregate that publishing any single one cannot identify its author.

**No push notifications.** Firebase would hand Google a delivery token tied to a device — a de-anonymization channel dressed up as a convenience.

## Status

Working end to end: FastAPI backend with key generation and a pytest suite, Android client in Kotlin with Jetpack Compose, public key provisioned into app assets at build time. Documentation covers getting started and the security features.

The deeper point is that every one of these features exists to defeat a specific coercion scenario. Anonymous reporting fails when it only protects against a passive database breach; it works when it is engineered against someone actively looking.
