---
slug: bitts
title: "BitJETS: What Happens When You Train a 1.58-bit TTS on Commodity Hardware"
date: 2026-04-05T10:00:00.000Z
excerpt: "Implementing BitNet b1.58 quantization for TTS — 5× compression (12 MB → 2.5 MB), 200× faster-than-real-time inference, but the audio is robotic and timing is broken. Here's exactly why, and what it would take to fix it."
coverImage: /images/posts/bitts.png
tags:
  - Model Quantization
  - Speech Synthesis
  - Research
  - PyTorch
  - Edge AI
---

## PROBLEM

Text-to-speech models keep getting better at sounding human. The trade-off: they keep getting larger. Tortoise, VITS, NaturalSpeech — hundreds of megabytes to gigabytes. Deploying these on-device (phone, smart speaker, embedded) requires aggressive compression without destroying intelligibility.

The BitTTS paper (Kawamura et al., 2024) proposes 1.58-bit ternary quantization for all convolutional layers — weights limited to `{-1, 0, 1}`, eliminating floating-point multiplies during inference. Promising numbers on paper: 5× compression, near-lossless quality.

I implemented it on a single RTX 4060 with LJSpeech. This post documents what actually happened — both the compression wins and the quality ceiling.

---

## STATUS

**This is a research experiment, not a production system.** The architecture and quantization math are correctly implemented per the paper. The audio output is intelligible but robotic. Key limitations (documented in detail below) prevent reaching production quality regardless of hardware budget.

---

## WHAT 1.58-BIT MEANS

A standard neural network stores every weight as a 32-bit float. In BitNet b1.58, weights are quantized to three values:

```
{-1, 0, 1}
```

`log₂(3) ≈ 1.585` bits per weight — hence "1.58-bit." During inference, weight × activation becomes an add/subtract/ignore operation. No floating-point multiplies. Hardware can run this 2-5× faster than equivalent FP32.

### Straight-Through Estimator

Quantization is non-differentiable. The trick: during forward pass, real-valued weights are rounded to `{-1, 0, 1}`. During backward pass, gradients flow through the rounding operation as if it were identity:

```
Forward:  W_real → W_ternary = round(clip(W_real / β, -1, 1))
Backward: ∇W_real = ∇W_ternary   (STE approximation)
```

Real-valued weights are maintained and updated by the optimizer at full precision. Only the forward pass uses ternary weights. This is Quantization-Aware Training (QAT) — the model learns to produce representations robust to quantization noise.

---

## ARCHITECTURE

```
Text → Embedding → BitEncoder × 4 → VarianceAdaptor → BitDecoder × 4 → Mel → HiFi-GAN → Audio
                    1.58-bit QAT     dur predictor      1.58-bit QAT                FP32
```

### BitConvBlock

Each convolution layer is wrapped with:

1. **LayerNorm** — normalizes input distribution before quantization
2. **BitConv1d** — weight quantization to `{-1, 0, 1}` + 8-bit activation quantization
3. **Residual connection** — gradient flow through deep stacks

```python
class BitConvBlock(nn.Module):
    def forward(self, x):
        x_norm = self.layer_norm(x)
        x_t = x_norm.transpose(1, 2)
        out = self.bit_conv(x_t)
        return out.transpose(1, 2)
```

### Weight Packing (Algorithm 1)

5 ternary values → 1 byte via base-3 block encoding:

```
3^5 = 243 ≤ 256 ✓  (fits in uint8)

Conv1d(256, 256, k=5):
  FP32:   256 × 256 × 5 × 4 bytes = 1,280 KB
  Packed: 256 × 256 × 5 ÷ 5 bytes  =   64 KB  ← 20× smaller than FP32 weights
```

---

## RESULTS

### Model Size

| Format | Size |
|--------|------|
| FP32 baseline | 12.10 MB |
| Packed (Algorithm 1) | **2.52 MB** |
| Compression | **79.2% reduction** |

### Inference Latency (RTX 4060)

| Input | Latency | RTF |
|-------|---------|-----|
| 10 chars | 3.2 ms | 0.0047× |
| 30 chars | 5.8 ms | 0.0046× |
| 60 chars | 10.2 ms | 0.0046× |

`RTF < 1.0` means faster than real-time. Inference is ~200× faster than audio duration.

### Parameter Distribution

- **92.9%** in BitConv1d (1.58-bit quantized)
- **7.1%** in Embedding, LayerNorm, Linear (FP32)

Maximum quantization efficiency — all the weights that can be compressed, are.

---

## WHERE IT FAILS

The compression numbers are genuine. The quality is not. Here's why.

### 1. Dummy Duration Labels

Every character gets `mel_len // text_len` frames — uniform duration regardless of phoneme. `a` and `the` get the same duration. Stressed vs unstressed syllables sound identical.

**Impact:** This is the single biggest quality ceiling. The decoder learns to produce different mel features for the same duration label, which is a contradictory training signal. Results in robotic timing regardless of training duration.

**Fix:** Montreal Forced Aligner (MFA) to extract per-phoneme durations from audio + transcript. Expected gain: +0.5-1.0 MOS.

### 2. Estimated MOS: ~2.5–3.2

TTS quality measured by Mean Opinion Score (1–5, human raters):

| System | MOS |
|--------|-----|
| Human speech (LJSpeech) | ~4.5–4.7 |
| Tacotron 2 + WaveNet | ~4.5 |
| FastSpeech 2 + HiFi-GAN | ~4.3 |
| BitTTS paper (1.58-bit, A100, 2000K steps) | ~3.8 |
| **BitJETS (this project)** | **~2.5–3.2 (est.)** |
| Barely intelligible | ~2.0 |
| Unintelligible | `<1.5` |

This project produces clearly synthetic, robotic speech. Every word is understandable (assuming short, simple text), but timing is off and prosody is flat. You would not mistake this for a human.

### 3. Character-Level Input, No Phonemes

Input is raw characters (`a`, `b`, ..., `z`, space, punctuation). There's no grapheme-to-phoneme conversion. Homographs like `read` (present vs past) sound identical. English irregular words (`colonel`, `worcestershire`) are ambiguous at character level.

**Fix:** `phonemizer` library for G2P conversion before encoding.

### 4. HiFi-GAN Vocoder Is FP32

The waveform generator runs at full FP32 precision. The system is not end-to-end quantized:

- Full system (acoustic + vocoder): ~55 MB
- BitJETS acoustic (packed): ~2 MB
- Compression claim is valid only for the acoustic model

The paper explicitly notes that quantizing the vocoder causes "severe audio degradation" — an open research problem.

---

## HONEST SUMMARY

| Can claim | Cannot claim |
|-----------|--------------|
| Correct BitNet b1.58 quantization implementation | Production-quality naturalness |
| 5× acoustic model compression vs FP32 | Paper-equivalent MOS |
| Working end-to-end: text → intelligible speech | End-to-end 1.58-bit system |
| Faster-than-real-time inference (CPU and GPU) | Multi-speaker or cross-lingual |
| Reproducible training on commodity GPU | Mobile/edge deployment |

The story is: **I implemented 1.58-bit TTS quantization from scratch, correctly matching the paper's quantization math, and trained it on a single RTX 4060.** That story is true and genuinely interesting from an ML engineering standpoint. The audio quality doesn't need to match Google's TTS for the implementation to demonstrate real capability.

---

## LESSONS

### 1. Duration Modeling Is Everything in TTS

I spent weeks tuning hyperparameters, adjusting learning rates, trying different architectures. The single biggest quality improvement would come from MFA alignment — something I hadn't even considered until after training was complete. Time spent on data preprocessing yields higher returns than time spent on model architecture.

### 2. Compression > Quality Is a Valid Research Trade-off

A 5× smaller model that produces robotic but intelligible speech is not useless — it's a starting point. There's a deployment niche for models that are small enough to fit anywhere and fast enough to run in real-time, even if they don't sound natural. The question is whether the quality floor is acceptable for the target use case.

### 3. Benchmark Carefully, Especially Inference Numbers

3.2ms on an RTX 4060 means nothing for edge deployment. The interesting benchmark for this work is: can this run in real-time on an M4 MacBook Air or a Raspberry Pi? I haven't measured that yet, and those numbers would be more relevant than GPU latency.

### 4. Don't Write the Blog Post Before the Model Is Done

The repo and blog post were written while the model was still training. The limitations document exists in the repo but was never reflected in the blog post. That's backwards — the blog post should reference, not hide, the limitations.

---

## CODE

**Repo:** [github.com/jaweed3/bitts](https://github.com/jaweed3/bitts)
**Limitations:** [LIMITATIONS.md](https://github.com/jaweed3/bitts/blob/main/LIMITATIONS.md) — full honest assessment

### Quick Start

```bash
git clone https://github.com/jaweed3/bitts
cd bitts
chmod +x scripts/*.sh
./scripts/bootstrap.sh    # uv + CUDA + LJSpeech + HiFi-GAN
./scripts/train.sh --resume
```

### Test Coverage

19 tests covering quantization math, model forward/backward, weight packing roundtrip, and training loop smoke test:

```bash
python -m pytest tests/ -v
```

---

## TRAINING SETUP

| Hyperparameter | Value |
|----------------|-------|
| Dataset | LJSpeech (~24 hours, single speaker) |
| Batch size | 32 |
| Learning rate | 2e-4 |
| LR schedule | Exponential decay (γ=0.9973/step) |
| Optimizer | AdamW (β₁=0.8, β₂=0.99) |
| Training steps | 500,000 |
| Hardware | RTX 4060 8GB |
| Training time | ~3-4 hours |

---

## ROADMAP

- MFA duration alignment (highest ROI quality improvement)
- ONNX / CoreML export for edge deployment
- G2P phoneme input
- Multi-speaker training (VCTK)
- Actual MCD + WER benchmarks via Whisper

---

## REFERENCES

- [BitTTS: Quantized Text-to-Speech](https://arxiv.org/abs/2409.10577) — Kawamura et al., 2024
- [BitNet b1.58: 1.58-bit LLMs](https://arxiv.org/abs/2402.17764) — Ma et al., 2024
- [JETS: Jointly Training FastSpeech2 and HiFi-GAN](https://arxiv.org/abs/2203.16852) — Lim et al., 2022
- [HiFi-GAN](https://arxiv.org/abs/2010.05646) — Kong et al., 2020
