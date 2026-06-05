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

## PROBLEM

UNIDA Gontor's library catalog was a shared Google Sheet. Thesis submission required students to email PDFs to a librarian who manually renamed and sorted them. Staff scheduling ran on WhatsApp. Book borrowing was a paper logbook that lived behind the front desk and didn't answer the one question students actually had: *is this book available right now?*

Existing solutions existed — SLiMS (open source library system), commercial ILS platforms — but none fit:
- Too complex to configure for Indonesian campus workflows
- No built-in Indonesian-language thesis management
- UI/UX was dated, librarians avoided using them
- API support was limited or nonexistent

**What if the entire library — catalog, circulation, thesis, staff ops — ran through a single system built for how this campus actually works?**

---

## ARCHITECTURE

```
Browser / Mobile App
  → Laravel 12 + Filament v3 (admin panel)
  → Meilisearch (full-text search, auto-synced)
  → MySQL 8 (transactions, relationships)
  → REST API (mobile-ready)
```

### Modules

| Module | Function |
|--------|----------|
| **Catalog** | Book metadata, barcode generation, cover upload, stock management |
| **Circulation** | Borrow/return, due date tracking, late fee calculation |
| **E-Library** | Searchable digital book repository with embedded viewer |
| **E-Thesis** | PDF submission workflow, plagiarism check integration |
| **Membership** | Member registration, card generation, borrowing history |
| **Internal Ops** | Staff task management, shift scheduling, stock opname |

### Key Decisions

**Filament v3 over custom admin panel.** Building a custom CRUD admin panel from scratch would have taken months. Filament v3 generated production-grade tables, forms, and access control in days. For an internal tool with real users, developer time is the bottleneck — not framework overhead.

**Meilisearch over Elasticsearch.** Elasticsearch would have been overkill for campus scale — 50,000 documents, 7 concurrent staff users, `< 2,000` search queries/day. Meilisearch runs as a single binary, auto-syncs from MySQL via built-in indexer, and returns results in `< 50ms`. Zero maintenance overhead.

**API-first even though v1 was desktop-only.** The mobile app was planned from day one. Exposing a REST API from the start meant the mobile team could build independently without blocking on backend changes. This saved weeks of refactoring later.

---

## RESULTS

### Search Performance

```
Query: "pemrograman web"
MySQL LIKE %pemrograman%web%:  ~2.1s
Meilisearch (typo-tolerant):   ~12ms

Improvement: 175× faster
```

### MySQL Crash Story

Three weeks in, the production MySQL instance crashed during a stock opname operation. The stock opname query was scanning and locking the entire `books` table — 15,000+ rows — while staff were actively borrowing and returning books. The transaction log filled the disk, MySQL aborted, and the library was down for 2 hours.

**Root cause:** Stock opname was implemented as a naive `SELECT ... FOR UPDATE` on the entire catalog. On a campus library database, this looked harmless in staging. In production with concurrent circulation transactions, it was a deadlock bomb.

**Fix:**
- Replaced full-table locking with paginated chunked processing (100 books at a time)
- Added `read_committed` isolation level for stock opname transactions
- Set up automated MySQL backups every 6 hours (previously: none)
- Added monitoring: disk usage alert at 80%

This was the moment the system went from "side project" to "production system" — we had the scars to prove it.

### Membership

165+ active members registered in the system, including students and staff. Circulation transactions are tracked per-member with borrowing history, late fee calculation, and automated reminders.

---

## BUSINESS IMPACT

| Before | After |
|--------|-------|
| Catalog search: shared spreadsheet, no search. ~10 min/book lookup. | Full-text search: 12ms. Instant availability check. |
| Borrowing: paper logbook, limited to front-desk hours. | Digital circulation: borrow/return tracked, due date auto-calculated. |
| Thesis submission: email PDF → manual sort → manual entry. ~30 min/thesis. | E-Thesis module: upload → auto-categorize → plag-check → published. 5 min. |
| Staff schedule: WhatsApp group. No audit trail. | Internal ops: task assignments, shift calendar, complete history. |
| Backups: none. | Automated 6-hourly backups + disk monitoring. |
| Disaster recovery: hope. | Documented crash recovery procedure (learned the hard way). |

---

## LESSONS

1. **The MySQL crash was inevitable because we didn't think about concurrent access.** Staging environments lie — they have one user. Production has 7 staff running queries simultaneously. Always test with concurrent load before shipping.

2. **Internal tools ship faster but have higher reliability expectations.** When the library system goes down, there's no "we'll fix it in the next sprint" — a librarian is standing at the front desk with a student waiting to borrow a book. You fix it *now*.

3. **Filament v3 was the right call.** Saved months of CRUD boilerplate. When the crash happened, we could drop into raw SQL for the fix without touching the admin panel layer — clean separation of concerns.

4. **API-first is worth the upfront cost.** The mobile app integration was planned for the next phase but never required a backend rewrite because the API contracts were already there.

5. **A production system with 165 users taught me more than any competition project.** Competitions optimize for novelty and presentation. Internal tools optimize for reliability and real user satisfaction. Both matter, but only production experience teaches you to handle the 2 AM crash call.

---

## WHAT'S NEXT

Face recognition attendance is in development — integrating face-lib with PerpusGate for automated check-in when students visit the library. This will replace the current manual sign-in sheet and tie attendance data directly to membership records.

---

## LINKS

- **Stack:** Laravel 12 · Filament v3 · Meilisearch · MySQL 8 · Tailwind v4
- **Internal system** — no public repo (campus data privacy)

*June 2026. Built for UNIDA Gontor's library staff and 165+ campus members.*
