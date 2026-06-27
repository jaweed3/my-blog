---
slug: perpusgate
title: "PerpusGate: Running a Campus Library on Laravel + Filament"
date: 2026-06-05T10:00:00.000Z
excerpt: "165+ users, full-text search with Meilisearch, MySQL crash recovery — shipping a production library system for UNIDA Gontor when spreadsheets and WhatsApp stopped scaling."
coverImage: /images/posts/perpusgate.svg
tags:
  - Backend
  - Production
  - Laravel
  - Case Study
---

UNIDA Gontor's library was running on a Google Sheet. Thesis submission worked like this: students emailed PDFs to a librarian who manually renamed them and sorted into folders. Staff scheduling lived in WhatsApp. Borrowing was a paper logbook behind the front desk that couldn't answer the one question students actually had: is this book available right now?

Existing solutions — SLiMS, commercial ILS platforms — existed but none fit. Too complex to configure for Indonesian campus workflows. No built-in thesis management for Indonesian-language submissions. UI was dated enough that librarians avoided them. API support was limited or nonexistent.

So I built one.

## What it does

Six modules covering the entire library workflow:

- **Catalog** — book metadata, barcode generation, cover upload, stock management
- **Circulation** — borrow/return, due date tracking, late fee calculation
- **E-Library** — searchable digital book repository with embedded viewer
- **E-Thesis** — PDF submission with auto-categorization
- **Membership** — registration, card generation, borrowing history
- **Internal Ops** — staff task management, shift scheduling, stock opname

## Tech choices

**Filament v3 over custom admin panel.** Building a CRUD admin panel from scratch would have taken months. Filament v3 generated production-grade tables, forms, and access control in days. For an internal tool with real users, developer time is the bottleneck — not framework overhead.

**Meilisearch over Elasticsearch.** Elasticsearch would have been overkill for campus scale — 50,000 documents, 7 concurrent staff users, under 2,000 searches per day. Meilisearch runs as a single binary, auto-syncs from MySQL via built-in indexer, and returns results in under 50ms. Zero maintenance overhead. Search went from 2.1 seconds (MySQL LIKE queries) to ~12ms. 175x faster.

**API-first even though v1 was desktop-only.** The mobile app was planned from day one. Exposing a REST API from the start meant the mobile team could build independently without blocking on backend changes. Saved weeks of refactoring later.

## The MySQL crash that made it real

Three weeks in, the production MySQL instance crashed during a stock opname operation. The query was scanning and locking the entire `books` table — 15,000+ rows — while staff were actively borrowing and returning books. The transaction log filled the disk. MySQL aborted. The library was down for two hours.

Root cause: stock opname was implemented as a naive `SELECT ... FOR UPDATE` on the entire catalog. Looked harmless in staging. In production with concurrent circulation transactions, it was a deadlock bomb.

The fix: paginated chunked processing (100 books at a time), `read_committed` isolation level for stock opname transactions, automated MySQL backups every 6 hours (previously: none), and disk usage alerting at 80%.

This was the moment the system stopped being a side project and became a production system. We had the scars to prove it.

## Before and after

| Before | After |
|--------|-------|
| Catalog search: shared spreadsheet, ~10 min/book lookup | Full-text search: 12ms, instant availability check |
| Borrowing: paper logbook, limited to front-desk hours | Digital circulation with auto-calculated due dates |
| Thesis submission: email → manual sort → manual entry, ~30 min/thesis | Upload → auto-categorize → published, ~5 min |
| Staff schedule: WhatsApp group, no audit trail | Task assignments, shift calendar, complete history |
| Backups: none | Automated 6-hourly backups + disk monitoring |
| Disaster recovery: hope | Documented crash recovery procedure (learned the hard way) |

## What I'd tell myself starting over

**The MySQL crash was inevitable because we didn't think about concurrent access.** Staging environments have one user. Production has seven staff running queries simultaneously. Test with concurrent load before shipping.

**Internal tools ship faster but have higher reliability expectations.** When the library system goes down, there's no "we'll fix it in the next sprint." A librarian is standing at the front desk with a student waiting to borrow a book. You fix it now.

**Filament v3 was the right call.** Saved months of CRUD boilerplate. When the crash happened, we could drop into raw SQL for the fix without touching the admin panel layer — clean separation of concerns.

**API-first is worth the upfront cost.** The mobile app integration never required a backend rewrite because the API contracts were already there.

**A production system with 165 users teaches you more than any competition project.** Competitions optimize for novelty and presentation. Internal tools optimize for reliability and real user satisfaction. Both matter, but only production experience teaches you to handle the 2 AM crash call.

## What's next

Face recognition attendance is in development — integrating face-lib with PerpusGate for automated check-in when students visit the library. This replaces the current manual sign-in sheet and ties attendance data directly to membership records.

## Stack

Laravel 12 · Filament v3 · Meilisearch · MySQL 8 · Tailwind v4

*Internal system — no public repo (campus data privacy). June 2026. Built for UNIDA Gontor's library staff and 165+ campus members.*
