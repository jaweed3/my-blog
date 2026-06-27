---
slug: bitts
title: "BitJETS: What Happens When You Train a 1.58-bit TTS on Commodity Hardware"
date: 2026-04-05T10:00:00.000Z
excerpt: "Implementing BitNet b1.58 quantization for TTS — 5x compression (12 MB → 2.5 MB), 200x faster-than-real-time inference, but the audio is robotic and timing is broken. Here's exactly why, and what it would take to fix it."
coverImage: /images/posts/bitts.png
tags:
  - Model Quantization
  - Speech Synthesis
  - Research
  - PyTorch
  - Edge AI
---

I trained a 1.58-bit text-to-speech model on a single RTX 4060. The compression numbers are genuinely impressive — 5x smaller, 200x faster than real-time. The audio quality, however, is where things get honest.

This is a research experiment, not a production system. The architecture and quantization math are correctly implemented per the BitTTS paper. The audio is intelligible but robotic. And the limitations aren't about hardware — they're architectural choices I'd make differently next time.

## What 1.58-bit actually means

Normal neural networks store every weight as a 32-bit float. In BitNet b1.58, weights are quantized to three values: `{-1, 0, 1}`. That's log₂(3) ≈ 1.585 bits per weight — hence "1.58-bit."

During inference, weight × activation becomes an add/subtract/ignore operation. No floating-point multiplies. Hardware can run this 2-5x faster than equivalent FP32.

The training trick is the Straight-Through Estimator. During forward pass, real-valued weights are rounded to {-1, 0, 1}. During backward pass, gradients flow through the rounding as if it were identity. Real-valued weights are maintained at full precision by the optimizer. Only the forward pass uses ternary weights. The model learns to produce representations that survive the quantization noise.

## Model architecture

```
Text → Embedding → BitEncoder × 4 → VarianceAdaptor → BitDecoder × 4 → Mel → HiFi-GAN → Audio
                    1.58-bit QAT     dur predictor      1.58-bit QAT                FP32
```

Each convolution layer is wrapped with LayerNorm (normalizes input before quantization), BitConv1d (weights to {-1, 0, 1} + 8-bit activation quantization), and a residual connection for gradient flow through deep stacks.

The weight packing uses base-3 block encoding — 5 ternary values per byte since 3⁵ = 243 fits in a uint8. A Conv1d(256, 256, k=5) goes from 1,280 KB in FP32 to 64 KB packed. 20x smaller.

## Compression results that actually work

FP32 baseline: 12.10 MB. Packed: 2.52 MB. That's a 79.2% reduction. These numbers are real and reproducible.

Inference latency on an RTX 4060: 3.2ms for 10 characters, 5.8ms for 30, 10.2ms for 60. RTF (real-time factor) ~0.0046 — about 200x faster than audio duration.

92.9% of parameters are in 1.58-bit quantized BitConv1d layers. Only 7.1% remain in FP32 (Embedding, LayerNorm, Linear). Maximum quantization efficiency.

## Where it falls apart

The compression numbers are genuine. The quality is not. Here's why.

**Dummy duration labels.** Every character gets `mel_len // text_len` frames — uniform duration regardless of phoneme. 'a' and 'the' get the same duration. Stressed vs unstressed syllables sound identical. This is the single biggest quality ceiling. The decoder learns to produce different mel features for the same duration label, which is a contradictory training signal. The fix is Montreal Forced Aligner for per-phoneme duration extraction. Expected gain: +0.5-1.0 MOS.

**Estimated MOS: ~2.5-3.2.** For reference, human speech is ~4.5, Tacotron 2 + WaveNet is ~4.5, the BitTTS paper (A100, 2000K steps) claims ~3.8. This project produces clearly synthetic, robotic speech. Every word is understandable with short, simple text, but timing is off and prosody is flat. You would not mistake this for a human.

**Character-level input, no phonemes.** Input is raw characters (a-z, space, punctuation). No grapheme-to-phoneme conversion. Homographs like "read" (present vs past) sound identical. English irregular words ("colonel", "worcestershire") are ambiguous at character level. A phonemizer library for G2P conversion would fix this.

**HiFi-GAN vocoder is FP32.** The waveform generator runs at full precision. Full system (acoustic + vocoder): ~55 MB. The acoustic model alone compresses to ~2 MB. The compression claim is valid only for the acoustic model. Quantizing the vocoder causes "severe audio degradation" according to the paper — an open research problem.

## Honest summary

| Can claim | Cannot claim |
|-----------|--------------|
| Correct BitNet b1.58 quantization implementation | Production-quality naturalness |
| 5x acoustic model compression vs FP32 | Paper-equivalent MOS |
| Working end-to-end: text → intelligible speech | End-to-end 1.58-bit system |
| Faster-than-real-time inference (CPU and GPU) | Multi-speaker or cross-lingual |
| Reproducible on commodity GPU | Mobile/edge deployment |

The real story: I implemented 1.58-bit TTS quantization from scratch, correctly matching the paper's quantization math, and trained it on a single RTX 4060. The audio quality doesn't need to match Google's TTS for the implementation to demonstrate real capability.

## What I'd do differently

**Duration modeling is everything in TTS.** I spent weeks tuning hyperparameters, adjusting learning rates, trying different architectures. The single biggest quality improvement would come from MFA alignment — something I hadn't even considered until after training was complete. Time on data preprocessing yields higher returns than time on model architecture.

**Compression > quality is a valid research tradeoff.** A 5x smaller model that produces robotic but intelligible speech is not useless — it's a starting point. There's a deployment niche for models small enough to fit anywhere and fast enough to run in real-time, even if they don't sound natural.

**Don't write the blog post before the model is done.** The repo and early writeup were created while the model was still training. The limitations document exists in the repo but was never reflected in the post. That's backwards — the post should reference, not hide, the limitations.

## Training setup

LJSpeech (~24 hours, single speaker). Batch size 32. Learning rate 2e-4 with exponential decay. AdamW optimizer. 500,000 training steps. RTX 4060 8GB. ~3-4 hours training time.

## Roadmap

- MFA duration alignment (highest ROI quality improvement)
- ONNX / CoreML export for edge deployment
- G2P phoneme input
- Multi-speaker training (VCTK)
- Actual MCD + WER benchmarks via Whisper

## Code

Repo: [github.com/jaweed3/bitts](https://github.com/jaweed3/bitts)
Limitations: [LIMITATIONS.md](https://github.com/jaweed3/bitts/blob/main/LIMITATIONS.md) — full honest assessment

```bash
git clone https://github.com/jaweed3/bitts
cd bitts
./scripts/bootstrap.sh
./scripts/train.sh --resume
```

19 tests covering quantization math, model forward/backward, weight packing roundtrip, and training loop smoke test:
```bash
python -m pytest tests/ -v
```

## References

- [BitTTS: Quantized Text-to-Speech](https://arxiv.org/abs/2409.10577) — Kawamura et al., 2024
- [BitNet b1.58: 1.58-bit LLMs](https://arxiv.org/abs/2402.17764) — Ma et al., 2024
- [JETS: Jointly Training FastSpeech2 and HiFi-GAN](https://arxiv.org/abs/2203.16852) — Lim et al., 2022
- [HiFi-GAN](https://arxiv.org/abs/2010.05646) — Kong et al., 2020
