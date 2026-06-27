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

I was building a recommendation system with Burn — the Rust DL framework with 15K+ GitHub stars — and kept hitting the same wall. Shape mismatches with no dimension info. TensorNotFound errors with zero guidance on how to fix them. SGD config docs that were just wrong. The framework was powerful but the developer experience had rough edges I couldn't ignore.

I'd never contributed to Burn before. Didn't know the codebase, the conventions, or how harsh the review process would be. So I did the dumb thing: started fixing whatever annoyed me and hoped for the best.

## The PRs, in order

### 1. ROUGE-L Score Metric (#4967 — merged May 20)

Burn had BLEU, CER, and WER for NLP evaluation. No ROUGE-L, despite an issue (#544) that had been open for months. I needed it for my own project, so I wrote it.

The implementation computes F1 from the longest common subsequence between predicted and reference token sequences. Eight unit tests covering edge cases — perfect match, no match, padding, empty sequences, batch averaging. Reviewer asked me to remove a redundant `total_f1` update. I fixed it. Merged same day. Three files added (`rouge.rs` + module registration).

### 2. SGD Config Fix (#4986 — merged May 21)

`SgdConfig::init` had two problems: wrong documentation (said "creates a new config" instead of "creates a new optimizer") and a concrete `OptimizerAdaptor` return type instead of `impl Optimizer`.

I fixed both. Then the reviewer (laggui) asked me to revert the return type change. It would break uniformity across all other optimizer configs. My change was technically "better" but violated the project's established pattern. He was right.

Final diff: +2/-2 lines. Doc fix only. This was the most valuable rejection I've gotten in open source.

### 3. Better Shape Errors (#4996 — merged May 25)

This one came from pure frustration. Burn's tensor and NN module errors would say "incompatible shapes" without telling you which shapes. Debugging a 10-layer neural network means adding print statements everywhere.

I added shape, rank, and dimension context to four error sites:
- Matmul: panic now includes tensor rank and incompatible dimensions
- Broadcast: includes arg count and expected minimum dims
- Squeeze: shows requested vs actual dim count
- Group norm: uses `num_dims()` instead of `num_elements()` — was showing "12800 total elements" instead of "expected 4 dims"

Clean merge. One force-push for formatting.

### 4. Derive Conflicting Generic (#5028 — merged Jun 1)

This was the deep one. When a generic type parameter is used in both a `Module` field and a `#[module(skip)]` field, Burn's derive macro emitted a confusing error about a missing `Module` trait bound. Users had no clue the real issue was the generic being shared across skip/non-skip fields.

I wrote a custom derive macro diagnostic. Instead of the cryptic compiler error:

```
error: Generic type `T` is used in both a module field and a skipped field.
       Consider removing `#[module(skip)]` or using a different type for one of the fields.
```

This required understanding proc macros, `syn` AST manipulation, and Burn's module codegen. Two review cycles. First caught a style issue. Second approved. The most technically complex PR of the five by far.

### 5. TensorNotFound `.allow_partial(true)` Hint (#5032 — merged Jun 2)

When `load_from` fails because a checkpoint is missing tensors — common when loading a pretrained model into a modified architecture — Burn just says "TensorNotFound." Users don't know about `.allow_partial(true)`.

Added a diagnostic hint to both the PyTorch store and Safetensors store, plus documentation with error-handling examples:

```
Error: Tensor "weight" not found in checkpoint.
  Hint: Use `.allow_partial(true)` to load only available tensors.
```

Merged on June 2.

### Bonus: TUI Cleanup (#5039 — draft)

After the five merged PRs, I started working on replacing panics with clean shutdown in Burn's TUI mode. Still in draft.

## How it played out

The progression was organic — every PR taught me something that enabled the next one. The derive macro PR would have been impossible without understanding Burn's module system from the earlier fixes.

ROUGE-L (feature) → May 20 — new metric, learned the review process
SGD config (fix) → May 21 — learned to respect project conventions
Shape errors (fix) → May 25 — cross-crate changes (tensor, ndarray, nn)
Derive macro (fix) → Jun 1 — deepest change (proc macro, syn, codegen)
TensorNotFound hint (feat) → Jun 2 — UX + docs, two stores + book

## What I learned

**Fix what you use.** Every PR came from a real problem I hit while building something. I wasn't hunting for "good first issues" — I was scratching my own itch. The motivation is genuine and the fix is better because you understand the context.

**The reviewer knows the codebase better than you.** On PR #4986, I tried to change the return type to what I thought was "correct." The reviewer pointed out it would break uniformity. He was right. Accepting that gracefully meant the PR merged in hours instead of weeks.

**Progressive codebase exploration.** I couldn't have jumped to the derive macro without doing the earlier PRs first. Each one unlocked understanding of a new part of the codebase.

**Documentation changes are valid contributions.** PR #2 was two lines. PR #5 was mostly docs. Both fixed real user pain. Not every contribution needs to be a new feature.

**Convincing a busy maintainer that your PR is worth reviewing is half the work.** Clear descriptions, linked issues, passing CI, small diffs — these signal that you respect the maintainer's time. Every PR I opened was reviewed and merged within 48 hours.

## Links

- PR #4967: [github.com/tracel-ai/burn/pull/4967](https://github.com/tracel-ai/burn/pull/4967) — ROUGE-L metric
- PR #4986: [github.com/tracel-ai/burn/pull/4986](https://github.com/tracel-ai/burn/pull/4986) — SGD config fix
- PR #4996: [github.com/tracel-ai/burn/pull/4996](https://github.com/tracel-ai/burn/pull/4996) — Shape error context
- PR #5028: [github.com/tracel-ai/burn/pull/5028](https://github.com/tracel-ai/burn/pull/5028) — Derive macro diagnostic
- PR #5032: [github.com/tracel-ai/burn/pull/5032](https://github.com/tracel-ai/burn/pull/5032) — TensorNotFound hint
- PR #5039: [github.com/tracel-ai/burn/pull/5039](https://github.com/tracel-ai/burn/pull/5039) — TUI cleanup (draft)
