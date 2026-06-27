---
slug: mahasantri
title: "Mahasantri: Zero-Knowledge Whistleblower for Pesantren"
date: 2026-06-05T12:00:00.000Z
excerpt: "ZK token scheme, Tink ECIES encryption, air-gapped admin — building a whistleblower app where the server itself cannot link a report to its submitter."
coverImage: /images/posts/mahasantri.svg
tags:
  - Cryptography
  - Android
  - Backend
  - Kotlin
  - Case Study
---

Pesantren (Islamic boarding schools) operate with dense hierarchies and closed communities. Students who witness abuse, bullying, or corruption have no safe channel to report it. Anonymous Google Forms leak IP addresses and browser fingerprints. Oral reporting to trusted ustaz requires identifying yourself. In small communities, even anonymous reports can be traced through timing, writing style, or metadata.

Existing anonymous reporting tools assume the server is trustworthy. If the pesantren's own IT staff run the server, this assumption fails — the system administrator can cross-reference submission timestamps with access logs, correlate IPs, or simply read unencrypted reports.

So the question became: can you build a whistleblower system where the server cannot identify the reporter even if it wants to?

This is research-phase. The core cryptographic scheme works, but it hasn't undergone a third-party security audit.

## How it works

The flow is simple in theory, paranoid in practice:

1. Student opens the app, writes a report, submits
2. App encrypts the report with the admin's ECIES public key *before* sending
3. Server receives an opaque encrypted blob — no plaintext, no metadata, no IP stored
4. Server returns a cryptographic token to the student
5. Admin periodically downloads encrypted blobs to USB drive
6. Admin walks to an air-gapped laptop, inserts USB, decrypts offline
7. Student can later check their token to see if the admin marked the report as "read"

The server never sees plaintext. The admin cannot identify the submitter. The token proves existence without revealing identity.

## Crypto decisions

**Tink ECIES over DIY crypto.** Google's Tink library handles ECIES with authenticated encryption. Key management follows built-in key rotation and versioning — no custom crypto primitives. The public key lives in the app, the private key lives exclusively on the air-gapped laptop. ECIES over RSA because it gives smaller ciphertexts (relevant for mobile bandwidth) and Tink's implementation is well-audited.

**The ZK token scheme.** After submission, the server returns a deterministic token derived from a server-side secret and the SHA-256 hash of the encrypted blob. The student stores this token locally. Later, they can present it to check report status. The server can confirm the token is valid without knowing which student presented it. The token reveals zero information about who submitted the report, what it contains, or when it was submitted.

Caveat: a malicious server could log token-presentation timestamps to deanonymize active users checking their reports. A proper zero-knowledge proof (zk-SNARK or Bulletproof) would fix this. That's the next research milestone.

**Air-gapped admin workflow.** The admin laptop has no network interfaces enabled — WiFi, Bluetooth, Ethernet physically disabled. Encrypted blobs arrive via USB drive. Decryption happens offline. Reports display in a local web UI that binds to `127.0.0.1` only. This is deliberately inconvenient. The friction is the security guarantee. A compromised admin laptop cannot exfiltrate data because it has no network path out.

## Backend

Three endpoints:

```
POST /api/v1/report     — receive encrypted blob → store → return token
GET  /api/v1/status     — check report status by token (no auth required)
GET  /api/v1/export     — admin-only, dumps unopened encrypted blobs
```

No plaintext touches the server process. The POST handler saves raw bytes to PostgreSQL as a `BYTEA` column. An IP header-stripping reverse proxy strips `X-Forwarded-For` before proxying. The server literally cannot identify the submitter.

## Status

Android app (Kotlin/Compose) is functional — encryption, submission, token storage. FastAPI backend works — receive, store, export. Admin UI is a prototype. Security audit is not done. Production deployment has not happened.

## Design philosophy

Every decision prioritizes anonymity over convenience:

- No user accounts. Registration leaks identity. Each install generates a local device key.
- No push notifications. Firebase would reveal device identity to Google.
- No analytics. No Firebase, no Sentry, no crash reporting.
- No plaintext storage on the server, not even ephemerally.

This level of paranoia is necessary because the adversary model includes the system administrator. Most "anonymous" reporting tools don't consider this threat.

## What I'd do differently

**The hash-based token is not a real ZK proof.** The current scheme uses `HMAC(server_secret, sha256(encrypted_blob))`. This proves token validity but doesn't prevent the server from linking token-check requests via timing correlation. A proper zero-knowledge proof would eliminate this leak. I chose the simpler scheme for prototyping speed.

**Air-gapped workflows are impractical for daily use.** The admin must physically walk to the laptop, insert USB, decrypt, re-encrypt responses, walk back. This works for 1-2 weekly reports. It would not scale to 50 reports per day. The tradeoff is intentional, but it limits deployment.

**The threat model drove every decision.** Most apps add crypto as an afterthought. Here, crypto was the starting point and everything else was built around it. This inverted design process was surprisingly effective — the hardest constraint shaped the cleanest architecture.

## Stack

Kotlin/Compose (Android) · FastAPI (Python) · Tink (ECIES) · PostgreSQL

*Internal research project — not deployed to production, no public repo (pesantren data privacy). June 2026.*
