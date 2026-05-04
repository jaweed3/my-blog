---
slug: bitts
title: "BitJETS: 1.58-bit Text-to-Speech — From 12 MB to 2.5 MB"
date: 2026-04-05T10:00:00.000Z
excerpt: "Training a TTS model where every convolutional weight is limited to just three values: {-1, 0, 1}. The result? A model 5x smaller (12 MB → 2.5 MB) that still produces intelligible speech."
coverImage: /images/posts/bitts.png
tags:
  - Machine Learning
  - TTS
  - Quantization
  - Research
---

> **TL;DR:** I trained a TTS model where all convolutional weights are just three values: `{-1, 0, 1}`. The result? A model 5x smaller (12 MB → 2.5 MB) that still sounds intelligible. Built from [BitNet b1.58](https://arxiv.org/abs/2402.17764) + [JETS](https://arxiv.org/abs/2203.16852), trained on an RTX 4060.

---

## Why This Is Interesting

Imagine TTS models like Tortoise, VITS, or NaturalSpeech. They're good, but huge — hundreds of megabytes, even gigabytes. What if we build a TTS model that's **just a few megabytes** but can still speak clearly?

This isn't just about "making it small for the sake of it." A small model means:

- **Edge deployment** — runs on phones, smart speakers, embedded devices
- **Real-time inference** — low latency because there are no floating-point multiply operations
- **Cheap storage** — fits in embedded flash memory
- **Energy efficient** — perfect for always-on devices

The [BitTTS paper (Kawamura et al., 2024)](https://arxiv.org/abs/2409.10577) answers this with a radical approach: **quantize all convolutional layers to 1.58-bit ternary weights** `{-1, 0, 1}`.

---

## What Does 1.58-bit Mean?

Imagine a normal neural network: every weight is a 32-bit float. In BitNet, weights are quantized to just **three values**:

```
{-1, 0, 1}
```

Why call it 1.58-bit? Because `log₂(3) ≈ 1.585`. In information theory terms, each ternary "trit" stores ~1.58 bits of information.

During inference, weight × activation multiplication becomes an **add/subtract/ignore** operation — no floating-point multiplies at all. Hardware can run this blazingly fast.

### How Quantization Works (STE)

```
Forward pass:
  W_real (float32) → W_ternary = round(clip(W_real / β, -1, 1))
  Conv uses W_ternary

Backward pass (Straight-Through Estimator):
  Gradients flow to W_real, NOT to W_ternary
  ∇W_real = ∇W_ternary  (treat round() as identity during backward)
```

Real weights (`W_real`) are still stored as float32 and updated by the optimizer. Quantization only happens in the forward pass. This is called **Quantization-Aware Training (QAT)** — the model learns to produce representations that are robust to quantization noise.

---

## Architecture

```
Text → Embedding → BitEncoder (4× BitConvBlock) → VarianceAdaptor → BitDecoder (4× BitConvBlock) → Mel → HiFi-GAN → Audio
       1.58-bit                                         dur predictor         1.58-bit              FP32
```

### BitConvBlock — The Quantized Unit

Each convolution layer is wrapped with:

1. **LayerNorm (Sub-LN)** — normalization before quantization, stabilizes input distribution
2. **BitConv1d** — weight quantization `{-1, 0, 1}` + 8-bit activation quantization
3. **Residual connection** — skip connection helps gradient flow

```python
class BitConvBlock(nn.Module):
    def forward(self, x):
        x_norm = self.layer_norm(x)        # Sub-LN normalization
        x_t = x_norm.transpose(1, 2)       # B,T,C → B,C,T
        out = self.bit_conv(x_t)           # Quantized conv
        return out.transpose(1, 2)         # Back to B,T,C
```

### Weight Packing — Algorithm 1

During deployment, ternary weights are compressed using base-3 block encoding:

```
5 ternary values → 1 byte (uint8)
  3^5 = 243 ≤ 256 ✓

Conv1d(256, 256, k=5):
  FP32:   256×256×5×4 bytes = 1,280 KB
  uint8:  256×256×5×1 bytes =   320 KB
  Packed: 256×256×5÷5 bytes =    64 KB  ← 20x smaller!
```

---

## Results

### Model Size

| Format | Size |
|--------|------|
| FP32 (baseline) | 12.10 MB |
| Packed (actual) | **2.52 MB** |
| Compression | **79.2% reduction** |

### Inference Speed (RTX 4060)

| Input Length | Latency | RTF |
|-------------|---------|-----|
| 10 chars | 3.2 ms | 0.0047× |
| 30 chars | 5.8 ms | 0.0046× |
| 60 chars | 10.2 ms | 0.0046× |

<p>RTF &lt; 1.0 means <strong>faster than real-time</strong>. On an RTX 4060, inference is 200× faster than audio duration. Even on CPU it’s still real-time because there are no multiply operations.</p>

### Parameter Distribution

- **92.9%** parameters in BitConv1d (1.58-bit)
- **7.1%** parameters in Embedding, LayerNorm, Linear (FP32)

This is maximum efficiency — nearly all parameters can be quantized, leaving only the components that truly need full precision.

---

## Training

### Setup

```bash
git clone <repo> && cd bitts
chmod +x scripts/*.sh
./scripts/bootstrap.sh    # one-command: uv + CUDA + LJSpeech + HiFi-GAN
./scripts/train.sh --resume   # start training
```

### Configuration

| Hyperparameter | Value |
|----------------|-------|
| Dataset | LJSpeech (~24 hours, single speaker) |
| Batch size | 32 |
| Learning rate | 2e-4 |
| LR schedule | Exponential decay (γ=0.9973/step) |
| Optimizer | AdamW (β₁=0.8, β₂=0.99) |
| Total steps | 500,000 |
| Hardware | RTX 4060 8GB |

### Training Loop Highlights

```python
# Loss filter: skip batch if loss explodes
if loss.item() > 15.0 or torch.isnan(loss):
    continue

# Robust gradient accumulation — track accum_count yourself
(loss / ACCUM_STEPS).backward()
accum_count += 1

# Gradient clipping
clip_grad_norm_(model.parameters(), 1.0)
```

### Checkpoint System

- `latest.pth` — full state, overwritten every step (for resume)
- `bitjets_ckpt_N.pth` — snapshot every 10K steps
- `bitjets_packed_N.pth` — compressed version (Algorithm 1)

---

## Why HiFi-GAN (FP32) for the Vocoder?

The BitTTS paper explicitly mentions: **quantizing vocoder waveform generation layers causes severe audio degradation** (Section 3.2). Vocoders need full precision to reconstruct waveforms from mel spectrograms. But since the vocoder is only ~53 MB and a preprocessing step, this doesn't significantly impact the total pipeline.

---

## WandB Integration

Training integrates with [Weights & Biases](https://wandb.ai) for monitoring:

- Loss curves (mel, duration, total)
- Gradient norm
- Learning rate
- Parameter histograms

Optional — can be disabled with `--no-wandb` or by leaving `WANDB_API_KEY` empty in `.env`.

---

## How to Use

| Command | Purpose |
|---------|---------|
| `./scripts/bootstrap.sh` | Setup environment (one-time) |
| `./scripts/train.sh --resume` | Resume training |
| `./scripts/train.sh --resume --no-wandb` | Offline training |
| `./scripts/train.sh --preset high` | Training bs=64 (faster) |
| `./scripts/infer.sh --text "hello world"` | Generate audio |
| `./scripts/demo.sh` | Generate showcase artifacts |

---

## Demo

```bash
# Generate 6 audio samples + benchmark + spectrogram
./scripts/demo.sh
```

Output in `demo_output/`:
- 6 sample WAV files (varied text: short, long, technical)
- `benchmark.txt` — latency, RTF, model size
- `mel_spectrogram.png` — mel spectrogram visualization
- `summary.txt` — summary of all artifacts

---

## Project Structure

```
bitts/
├── main.py            # CLI: train / infer / benchmark / sample
├── scripts/
│   ├── bootstrap.sh   # One-command setup
│   ├── train.sh       # Training launcher
│   ├── infer.sh       # Inference launcher
│   └── demo.sh        # Showcase generator
├── src/
│   ├── layers.py      # BitConv1d, BitConvBlock, quant functions
│   ├── models.py      # BitJETS, BitEncoder, BitDecoder, VarianceAdaptor
│   ├── train.py       # Training loop (step-based, infinite dataloader)
│   ├── packing.py     # Algorithm 1 weight indexing
│   ├── checkpoint.py  # Save/load/resume utilities
│   └── ...
├── tests/             # 19 tests: quantization math, model, packing, smoke
└── checkpoints/       # Model weights + HiFi-GAN vocoder
```

---

## Next Steps / TODO

- [ ] Multi-speaker training (VCTK, LibriTTS)
- [ ] ONNX/TFLite export for mobile deployment
- [ ] Quantize variance adaptor (currently still FP32)
- [ ] Streaming inference (frame-by-frame)
- [ ] Bahasa Indonesia support

---

## References

- [BitTTS: Quantized Text-to-Speech (Kawamura et al., 2024)](https://arxiv.org/abs/2409.10577)
- [BitNet b1.58: 1.58-bit Large Language Models (Ma et al., 2024)](https://arxiv.org/abs/2402.17764)
- [JETS: Jointly Training FastSpeech2 and HiFi-GAN (Lim et al., 2022)](https://arxiv.org/abs/2203.16852)
- [HiFi-GAN: Generative Adversarial Networks for Speech Synthesis (Kong et al., 2020)](https://arxiv.org/abs/2010.05646)

---

*Trained on an RTX 4060 while drinking coffee. A TTS model 5x smaller that can still speak clearly. Quantization is the future.*
