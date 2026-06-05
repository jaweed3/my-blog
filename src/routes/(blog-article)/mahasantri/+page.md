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

## PROBLEM

Pesantren (Islamic boarding schools) operate with dense hierarchies and closed communities. Students who witness abuse, bullying, or corruption have no safe channel to report it. Anonymous Google Forms leak IP addresses and browser fingerprints. Oral reporting to trusted ustaz requires identifying yourself. In small communities, even anonymous reports can be traced through timing, writing style, or metadata.

Existing anonymous reporting tools assume the server is trustworthy. If the pesantren's own IT staff run the server, this assumption fails — the system administrator can cross-reference submission timestamps with access logs, correlate IPs, or simply read unencrypted reports.

**What if a whistleblower system existed where the server could not identify the reporter even if it wanted to?**

This project is research-phase — the core cryptographic scheme is implemented, but it has not undergone third-party security audit.

---

## ARCHITECTURE

```
Student (Android app)
  → Kotlin/Compose UI
  → Tink ECIES Encrypt (report + metadata)
  → HTTPS POST → FastAPI Backend
  → PostgreSQL (encrypted blobs only)
  ↓
  Admin exports encrypted blobs to USB
  → Air-gapped laptop (never online)
  → Tink ECIES Decrypt → plaintext report
```

### Flow

1. Student opens app, writes report, submits
2. App encrypts the report with the admin's ECIES public key *before* sending
3. Server receives an opaque encrypted blob — no plaintext, no metadata, no IP stored
4. Server returns a cryptographic token to the student
5. Admin periodically downloads encrypted blobs to USB drive
6. Admin walks to an air-gapped laptop, inserts USB, decrypts offline
7. Student can later check their token to see if the admin marked the report as "read"

**The server never sees plaintext. The admin cannot find the submitter. The token proves existence without revealing identity.**

---

## KEY DECISIONS

### Tink ECIES over DIY Crypto

Google's Tink library handles ECIES (Elliptic Curve Integrated Encryption Scheme) with authenticated encryption. Key management follows Tink's built-in key rotation and versioning — no custom crypto primitives. The public key is bundled in the app, the private key lives exclusively on the air-gapped laptop.

**Why ECIES and not RSA?** ECIES offers smaller ciphertexts (relevant for mobile bandwidth), forward secrecy is easier to reason about, and Tink's implementation is well-audited.

### ZK Token Scheme

After submission, the server returns a deterministic token derived from:
- A server-side secret (known only to the backend)
- The SHA-256 hash of the encrypted blob

The student stores this token locally. Later, they can present the token to check report status (submitted / read by admin / action taken). The server can confirm the token is valid without knowing which student presented it. The token reveals zero information about:
- Who submitted the report
- What the report contains
- When the report was submitted

A malicious server could log token-presentation timestamps to deanonymize *active* users checking their reports. Mitigation: implement a full zero-knowledge proof instead of the hash-based scheme (see LESSONS).

### Air-Gapped Admin Workflow

The admin laptop:
- Has no network interfaces enabled (WiFi, Bluetooth, Ethernet physically disabled)
- Receives encrypted blobs via USB drive
- Decrypts using Tink's `Aead` primitive with the private key
- Displays plaintext reports in a local web UI that binds to `127.0.0.1` only

This is deliberately inconvenient. The friction is the security guarantee. A compromised admin laptop cannot exfiltrate data because it has no network path out.

### FastAPI Backend

```
POST /api/v1/report     — receive encrypted blob → store → return token
GET  /api/v1/status     — check report status by token (no auth required)
GET  /api/v1/export     — admin-only, dumps unopened encrypted blobs
```

No plaintext touches the server process. The `POST` handler saves the raw bytes to PostgreSQL as a `BYTEA` column. An IP header-stripping reverse proxy (nginx) strips `X-Forwarded-For` before proxying. The server literally cannot identify the submitter.

---

## STATUS

| Component | Status |
|-----------|--------|
| Android app (Kotlin/Compose) | Functional — encryption, submission, token storage |
| FastAPI backend | Functional — receive, store, export |
| Air-gapped admin UI | Prototype — local web UI on air-gapped laptop |
| ZK token scheme | Implemented (hash-based, see LESSONS) |
| Security audit | **Not done** — core crypto needs external review |
| Production deployment | **Not yet** — research phase |

---

## WHAT'S INTERESTING

The architecture itself is the artifact. Every design decision prioritizes anonymity over convenience:

- **No user accounts.** Registration leaks identity. Instead, each install generates a local device key for token management.
- **No push notifications.** Google Firebase would reveal device identity to Google, and the server would know which device received which notification.
- **No analytics.** No Firebase, no Sentry, no crash reporting.
- **No plaintext storage on the server, not even ephemerally.** Encryption happens in the app process before the HTTPS request is constructed.

This level of paranoia is necessary because the adversary model includes the system administrator. Most "anonymous" reporting tools don't consider this threat.

---

## LESSONS

1. **The hash-based token is not a real ZK proof.** The current scheme uses `HMAC(server_secret, sha256(encrypted_blob))`. This proves token validity but doesn't prevent the server from linking token-check requests via timing correlation. A proper zero-knowledge proof (zk-SNARK or Bulletproof) would eliminate this leak. I chose the simpler scheme for prototyping speed — the ZK proof is the next research milestone.

2. **Air-gapped workflows are impractical for daily use.** The admin must physically walk to the laptop, insert USB, decrypt, re-encrypt responses, walk back. This works for a pesantren with 1-2 weekly reports. It would not scale to 50 reports/day. The tradeoff: strong security vs usability. For this use case, the security wins.

3. **Tink was the right choice, but dependency size is a concern.** Tink for Android adds ~3MB to the APK. In a 20MB app, that's significant. Potential alternative: use the JCA (Java Cryptography Architecture) directly with NIST P-256 and AES-GCM. Tradeoff: less battle-tested key management.

4. **The threat model drives every decision.** Most apps add crypto as an afterthought. Here, crypto was the starting point and everything else was built around it. This inverted design process was surprisingly effective — the hardest constraint shaped the cleanest architecture.

5. **Research projects teach different lessons than production.** Without users, you optimize for correctness over reliability. The air-gapped workflow would fail in production (USB drives get lost, admin gets lazy). Documenting this gap is honest engineering.

---

## LINKS

- **Stack:** Kotlin/Compose (Android) · FastAPI (Python) · Tink (ECIES) · PostgreSQL
- **Internal research project** — not deployed to production, no public repo (pesantren data privacy)

*June 2026. Zero-knowledge architecture for anonymous whistleblowing in closed communities.*
