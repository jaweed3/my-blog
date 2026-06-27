<script lang="ts">
  import ShaderBackground from '$lib/components/effects/ShaderBackground.svelte';
</script>

<section id="hero">
  <ShaderBackground />
  <div class="hero-bg-layer"></div>
  <div class="hero-glows">
    <div class="glow glow-main"></div>
    <div class="glow glow-1"></div>
    <div class="glow glow-2"></div>
  </div>
  <div class="hero-content">
    <div class="badge">
      <span class="ping-dot"></span>
      <span class="badge-text">Available for collaboration</span>
    </div>
    <h1 class="hero-heading">
      Fatih<br />
      <span class="text-primary">Jawwad</span>
    </h1>
    <p class="hero-subhead">Professional ML Engineer</p>
    <p class="hero-desc">
      Professional ML Engineer specializing in Edge AI and production ML systems. I design and deploy AI at the edge — from ESP32 firmware running Rust ML models to cloud-native inference pipelines. Open source contributor to tracel-ai/burn, sonos/tract, and huggingface/candle. I don't just build models — I ship them.
    </p>
    <div class="hero-tech-badges">
      <span class="tech-badge">TensorFlow</span>
      <span class="tech-badge">PyTorch</span>
      <span class="tech-badge">ONNX</span>
      <span class="tech-badge">Rust</span>
      <span class="tech-badge">FastAPI</span>
      <span class="tech-badge">Docker</span>
      <span class="tech-badge">MLOps</span>
      <span class="tech-badge">LLM</span>
    </div>
    <div class="stats-grid">
      <div class="stat-item">
        <span class="stat-number">3</span>
        <span class="stat-label">OSS PRs Merged</span>
      </div>
      <div class="stat-item">
        <span class="stat-number">8</span>
        <span class="stat-label">Projects Shipped</span>
      </div>
      <div class="stat-item">
        <span class="stat-number">165+</span>
        <span class="stat-label">Daily Active Users</span>
      </div>
    </div>
    <div class="hero-cta">
      <a href="/projects" class="glass-btn">Work ↓</a>
      <a href="/writing" class="glass-btn">Blog ↓</a>
      <a href="/resume" class="glass-btn">Resume ↓</a>
    </div>
  </div>
</section>

<style lang="scss">
  #hero {
    position: relative;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    padding: 96px 0 64px;

    .hero-bg-layer {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: -1;
      opacity: 0.4;
      background: radial-gradient(circle at 50% 50%, rgba(94,106,210,0.05) 0%, transparent 50%);
    }

    .hero-glows {
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 0;
      overflow: hidden;

      .glow {
        position: absolute;
        border-radius: 50%;
        filter: blur(80px);
        opacity: 0.15;
      }

      .glow-main {
        width: 500px;
        height: 500px;
        top: 20%;
        left: 50%;
        transform: translateX(-50%);
        background: radial-gradient(circle, rgba(94,106,210,0.4) 0%, transparent 60%);
      }

      .glow-1 {
        width: 300px;
        height: 300px;
        top: 60%;
        left: 15%;
        background: radial-gradient(circle, rgba(0,238,252,0.3) 0%, transparent 50%);
      }

      .glow-2 {
        width: 250px;
        height: 250px;
        top: 10%;
        right: 15%;
        background: radial-gradient(circle, rgba(189,194,255,0.25) 0%, transparent 50%);
      }
    }

    .hero-content {
      position: relative;
      z-index: 2;
      width: 100%;
      max-width: var(--container-max);
      margin: 0 auto;
      padding: 0 var(--margin-mobile);
      text-align: center;

      @media (min-width: 768px) {
        padding: 0 var(--margin-desktop);
      }
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      border-radius: 999px;
      background: rgba(28, 27, 27, 0.4);
      backdrop-filter: blur(16px);
      border: 1px solid var(--border);
      margin-bottom: 40px;

      .ping-dot {
        position: relative;
        display: flex;
        width: 8px;
        height: 8px;

        &::before {
          content: '';
          position: absolute;
          display: inline-flex;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: var(--secondary-fixed-dim);
          opacity: 0.75;
          animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        &::after {
          content: '';
          position: relative;
          display: inline-flex;
          border-radius: 50%;
          width: 8px;
          height: 8px;
          background: var(--secondary-fixed-dim);
        }
      }

      .badge-text {
        font-family: var(--font-mono);
        font-size: var(--caption);
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: var(--muted);
      }
    }

    .hero-heading {
      font-family: var(--font-display);
      font-size: var(--headline-lg-mobile);
      font-weight: 600;
      letter-spacing: -0.01em;
      line-height: 1.2;
      margin: 0 0 24px;
      text-shadow: 0 0 30px rgba(189, 194, 255, 0.3);

      .text-primary {
        color: var(--accent);
      }

      @media (min-width: 768px) {
        font-size: var(--headline-lg);
        letter-spacing: -0.02em;
        line-height: 1.1;
      }
    }

    .hero-subhead {
      font-family: var(--font-display);
      font-size: var(--headline-md);
      font-weight: 500;
      line-height: 1.3;
      color: var(--text-variant);
      margin: 0 auto 48px;
      max-width: 672px;

      @media (min-width: 768px) {
        font-size: var(--headline-md);
      }
    }

    .hero-desc {
      font-family: var(--font-body);
      font-size: var(--body-lg);
      line-height: 1.6;
      color: var(--muted);
      max-width: 768px;
      margin: 0 auto 40px;
    }

    .hero-tech-badges {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 10px;
      margin-bottom: 64px;

      .tech-badge {
        padding: 6px 14px;
        background: rgba(0, 238, 252, 0.04);
        border: 1px solid rgba(0, 238, 252, 0.12);
        border-radius: 6px;
        font-family: var(--font-mono);
        font-size: 11px;
        line-height: 1;
        color: var(--accent-2);
        text-transform: uppercase;
        letter-spacing: 0.08em;
        transition: all 0.2s;

        &:hover {
          background: rgba(0, 238, 252, 0.1);
          border-color: var(--accent-2);
        }
      }
    }

    .stats-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--gutter);
      width: 100%;
      max-width: 896px;
      margin: 0 auto 64px;

      @media (min-width: 768px) {
        grid-template-columns: repeat(3, 1fr);
      }

      .stat-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        border-left: 1px solid rgba(255, 255, 255, 0.08);
        border-right: 1px solid rgba(255, 255, 255, 0.08);
        padding: 0 32px;

        .stat-number {
          font-family: var(--font-display);
          font-size: var(--headline-md);
          font-weight: 500;
          line-height: 1.3;
          color: var(--accent-2);
        }

        .stat-label {
          font-family: var(--font-mono);
          font-size: var(--caption);
          line-height: 1.4;
          color: var(--muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
      }
    }

    .hero-cta {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 20px;

      .glass-btn {
        padding: 16px 40px;
        border-radius: 8px;
        font-family: var(--font-display);
        font-size: var(--headline-md);
        font-weight: 500;
        line-height: 1.3;
        display: flex;
        align-items: center;
        gap: 8px;
        text-decoration: none;
        color: var(--text);
        background: rgba(255, 255, 255, 0.03);
        backdrop-filter: blur(12px);
        border: 1px solid var(--border);
        transition: all 0.2s;

        &:hover {
          background: rgba(189, 194, 255, 0.1);
          border-color: var(--accent);
        }
      }
    }
  }

  @keyframes ping {
    75%, 100% {
      transform: scale(2);
      opacity: 0;
    }
  }
</style>
