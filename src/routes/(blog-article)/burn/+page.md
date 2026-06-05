---
slug: burn
title: "5 PRs to tracel-ai/burn: From ROUGE-L to Compiler Ergonomics"
date: 2026-06-05T16:00:00.000Z
excerpt: "One month, five merged pull requests to a Rust deep learning framework. ROUGE-L metric, SGD config fix, better shape errors, derive macro diagnostics, and a TensorNotFound hint. Here's the progression from first-time contributor to core crate patches."
coverImage: /images/posts/burn.svg
tags:
  - Rust
  - Backend
  - Open Source
  - Case Study
---

## PROBLEM

Burn is a Rust deep learning framework with 15K+ GitHub stars. I was building a recommendation system with it and kept hitting cryptic errors — shape mismatches with no dimension info, TensorNotFound with no hint about how to fix it, SGD config docs that were straight-up wrong. The framework was powerful, but the developer experience had rough edges.

I had never contributed to Burn before. I didn't know the codebase, the conventions, or the review process.

**What if I just started fixing the things that annoyed me?**

---

## THE PRs

### 1. ROUGE-L Score Metric (#4967 — merged May 20)

**The ask:** Burn had BLEU, CER, and WER metrics for NLP evaluation, but no ROUGE-L. Issue #544 had been open requesting it.

**The implementation:** Computes the F1 score based on the longest common subsequence (LCS) between predicted and reference token sequences. 8 unit tests covering edge cases (perfect match, no match, padding, empty sequences, batch averaging).

**Review experience:** Single review cycle. Reviewer asked to remove a redundant `total_f1` update. Merged same day.

**Diff:** +3 files (new `rouge.rs`, registered in `mod.rs`)

### 2. SGD Config Fix (#4986 — merged May 21)

**The ask:** `SgdConfig::init` had wrong documentation (said "creates a new config" instead of "creates a new optimizer") and used a concrete `OptimizerAdaptor` return type instead of `impl Optimizer`. Issue #868.

**The fix:** Corrected the doc. Tried to change the return type to `impl Optimizer` — reviewer requested reverting it because it would break uniformity across other optimizers.

**Key lesson:** I pushed a change that was technically "better" but violated the project's consistency pattern. The reviewer was right. Good OSS contributions respect established patterns, not just technical correctness.

**Diff:** +2/-2 lines (doc fix only, return type reverted)

### 3. Better Shape Errors (#4996 — merged May 25)

**The ask:** Burn's tensor and NN module errors often said "incompatible shapes" without telling you *which* shapes. When you're debugging a 10-layer neural network, this means adding print statements everywhere.

**The fix:** Added shape, rank, and dimension context to 4 error sites:

- **matmul:** panic now includes tensor rank and incompatible dimensions
- **broadcast:** includes arg count and expected minimum dims
- **squeeze:** shows requested vs actual dim count
- **group norm:** uses `num_dims()` instead of `num_elements()` (was showing 12800 total elements instead of "expected 4 dims")

**Review experience:** Clean merge. One force-push for formatting.

### 4. Derive Conflicting Generic (#5028 — merged Jun 1)

**The ask:** When a generic type parameter is used in both a `Module` field and a `#[module(skip)]` field, Burn's derive macro emitted a confusing error about a missing `Module` trait bound. Users had no idea the real issue was the generic being shared across skip/non-skip fields. Issue #5007.

**The fix:** Custom derive macro diagnostic. Instead of the cryptic compiler error, users now see:

```
error: Generic type `T` is used in both a module field and a skipped field.
       Consider removing `#[module(skip)]` or using a different type for one of the fields.
```

**Why this matters:** This is a custom derive macro in `burn-derive`. It required understanding proc macros, `syn` AST manipulation, and Burn's module codegen — the most technically complex PR of the five.

**Review experience:** Two review cycles. First round caught a code style issue. Second round was approved.

### 5. TensorNotFound `.allow_partial(true)` Hint (#5032 — merged Jun 2)

**The ask:** When `load_from` fails because a checkpoint is missing tensors (common when loading a pretrained model into a modified architecture), Burn just says "TensorNotFound" with no hint. Users don't know about `.allow_partial(true)`. Issue #4718.

**The fix:** Added a diagnostic hint to the `TensorNotFound` error in both the PyTorch store and Safetensors store, plus documentation clarification with error-handling examples.

```
Error: Tensor "weight" not found in checkpoint.
  Hint: Use `.allow_partial(true)` to load only available tensors.
```

**This was merged today (June 2).**

### Bonus: TUI Cleanup (#5039 — draft, open)

After the 5 merged PRs, I started working on replacing panics with clean shutdown in Burn's TUI mode. Still in draft.

---

## TRAJECTORY

```
ROUGE-L (feature)          → May 20 — new metric, learned the review process
SGD config (fix)           → May 21 — learned to respect project conventions
Shape errors (fix)         → May 25 — cross-crate changes (tensor/ndarray/nn)
Derive macro (fix)         → Jun 1  — deepest change (proc macro, syn, codegen)
TensorNotFound hint (feat) → Jun 2  — UX + docs, 2 stores + book
```

The progression was organic: every PR taught me something about the codebase that enabled the next one. The derive macro PR would have been impossible without understanding Burn's module system from the earlier fixes.

---

## IMPACT

| # | PR | Type | Files Changed | Status |
|---|----|------|---------------|--------|
| 1 | ROUGE-L metric | Feature | 3 | Merged |
| 2 | SGD config doc | Fix | 1 | Merged |
| 3 | Shape error context | Fix | 4 (tensor, ndarray, nn) | Merged |
| 4 | Derive macro diagnostic | Fix | 1 (burn-derive) | Merged |
| 5 | TensorNotFound hint | Feature | 3 (pytorch, safetensors, docs) | Merged |
| - | TUI clean shutdown | Fix | Draft | Open |

---

## LESSONS

1. **Fix what you use.** Every PR came from a real problem I hit while building something with Burn. I wasn't hunting for "good first issues" — I was scratching my own itch. This makes the motivation genuine and the fix better because you understand the context.

2. **The reviewer knows the codebase better than you.** On PR #4986, I tried to change the return type to what I thought was "correct." The reviewer (laggui) pointed out it would break uniformity. He was right. Accepting that feedback gracefully and reverting the change meant the PR merged in hours instead of weeks.

3. **Progressive codebase exploration.** The 5 PRs followed a natural depth gradient: surface-level metric → doc fix → cross-crate error messages → derive macro internals. I couldn't have jumped to #4 without doing #1-3 first. Each PR unlocked understanding of a new part of the codebase.

4. **Documentation changes are valid contributions.** PR #2 was 2 lines. PR #5 was mostly docs. Both fixed real user pain. Not every contribution needs to be a new feature.

5. **Convincing a busy maintainer that your PR is worth reviewing is half the work.** Clear descriptions, linked issues, passing CI, small diffs — these signal that you respect the maintainer's time. Every PR I opened was reviewed and merged within 48 hours.

---

## LINKS

- **PR #4967:** [github.com/tracel-ai/burn/pull/4967](https://github.com/tracel-ai/burn/pull/4967) — ROUGE-L metric
- **PR #4986:** [github.com/tracel-ai/burn/pull/4986](https://github.com/tracel-ai/burn/pull/4986) — SGD config fix
- **PR #4996:** [github.com/tracel-ai/burn/pull/4996](https://github.com/tracel-ai/burn/pull/4996) — Shape error context
- **PR #5028:** [github.com/tracel-ai/burn/pull/5028](https://github.com/tracel-ai/burn/pull/5028) — Derive macro diagnostic
- **PR #5032:** [github.com/tracel-ai/burn/pull/5032](https://github.com/tracel-ai/burn/pull/5032) — TensorNotFound hint
- **PR #5039:** [github.com/tracel-ai/burn/pull/5039](https://github.com/tracel-ai/burn/pull/5039) — TUI cleanup (draft)

*June 2026. 5 PRs to tracel-ai/burn in one month. Contributor badge: acquired.*
