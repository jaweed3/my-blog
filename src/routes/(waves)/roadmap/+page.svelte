<script lang="ts">
  import { title } from '$lib/data/meta';
</script>

<svelte:head>
  <title>Roadmap — {title}</title>
</svelte:head>

<section class="roadmap-hero">
  <span class="hero-badge">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
    // OPEN_SOURCE_INITIATIVE
  </span>
  <h1 class="hero-title">OSS Roadmap</h1>
  <p class="hero-desc">~45 merged PRs, ~60+ issues across 13 repos — with highlights in 3 major Rust ML orgs (tracel-ai/burn, sonos/tract, huggingface/candle).</p>
  <div class="hero-stats">
    <div class="hero-stat">
      <span class="hero-stat-value">45+</span>
      <span class="hero-stat-label">PRs Merged</span>
    </div>
    <div class="hero-stat">
      <span class="hero-stat-value">13</span>
      <span class="hero-stat-label">Repos</span>
    </div>
  </div>
</section>

<div class="roadmap-grid">
  <div class="roadmap-col">
    <h2 class="col-title">External Repos</h2>

    <div class="roadmap-item completed">
      <div class="rm-indicator"></div>
      <div class="rm-content">
        <span class="rm-status">MERGED</span>
        <span class="rm-title">tracel-ai/burn — 5 PRs</span>
        <span class="rm-desc">ROUGE-L metric, SgdConfig::init fix, error messages with shape context, derive hints, TensorNotFound.store_hint</span>
        <span class="rm-meta">#4967, #4986, #4996, #5028, #5032</span>
      </div>
    </div>

    <div class="roadmap-item">
      <div class="rm-indicator"></div>
      <div class="rm-content">
        <span class="rm-status open">OPEN</span>
        <span class="rm-title">tracel-ai/burn</span>
        <span class="rm-desc">Replace panic with clean shutdown on user exit in TUI</span>
        <span class="rm-meta">#5039</span>
      </div>
    </div>

    <div class="roadmap-item completed">
      <div class="rm-indicator"></div>
      <div class="rm-content">
        <span class="rm-status">MERGED</span>
        <span class="rm-title">sonos/tract — 2 PRs</span>
        <span class="rm-desc">ONNX model metadata in Graph.properties, SimplifiedLayerNormalization → RMSNorm fix</span>
        <span class="rm-meta">#2408, #2409</span>
      </div>
    </div>

    <div class="roadmap-item">
      <div class="rm-indicator"></div>
      <div class="rm-content">
        <span class="rm-status open">OPEN</span>
        <span class="rm-title">sonos/tract</span>
        <span class="rm-desc">Prevent panics in shape inference when operands missing</span>
        <span class="rm-meta">#2411</span>
      </div>
    </div>

    <div class="roadmap-item">
      <div class="rm-indicator"></div>
      <div class="rm-content">
        <span class="rm-status open">OPEN</span>
        <span class="rm-title">huggingface/candle</span>
        <span class="rm-desc">Load added tokens from GGUF metadata (fixes missing think/think tags on Qwen)</span>
        <span class="rm-meta">#3641</span>
      </div>
    </div>

    <div class="roadmap-item completed">
      <div class="rm-indicator"></div>
      <div class="rm-content">
        <span class="rm-status">MERGED</span>
        <span class="rm-title">taufiqriza/Unida-Library — 7 PRs</span>
        <span class="rm-desc">Rust→Wasm book recommender, TF-IDF pipeline, PDF viewer fixes, remember-me auth, ethesis seeder</span>
        <span class="rm-meta">#20, #21, #24-27, #29</span>
      </div>
    </div>

    <div class="roadmap-item completed">
      <div class="rm-indicator"></div>
      <div class="rm-content">
        <span class="rm-status">MERGED</span>
        <span class="rm-title">FarrelGhozy/WANI</span>
        <span class="rm-desc">4 themes + dashboard selector + color presets</span>
        <span class="rm-meta">#40</span>
      </div>
    </div>

    <div class="roadmap-item completed">
      <div class="rm-indicator"></div>
      <div class="rm-content">
        <span class="rm-status">MERGED</span>
        <span class="rm-title">gii-is-DP1/dp1-2025-2026-li-5</span>
        <span class="rm-desc">Requirements document fix, layers UML, game board with rules</span>
        <span class="rm-meta">#98, #127</span>
      </div>
    </div>
  </div>

  <div class="roadmap-col">
    <h2 class="col-title">Self Projects Pipeline</h2>

    <div class="pipeline-item completed">
      <span class="pipeline-icon">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
      </span>
      <div class="pipeline-text">
        <span class="pipeline-name">jaweed3/retakId — ~20 PRs merged</span>
        <span class="pipeline-status">Active</span>
      </div>
    </div>

    <div class="pipeline-item completed">
      <span class="pipeline-icon">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
      </span>
      <div class="pipeline-text">
        <span class="pipeline-name">jaweed3/vibeSentinel — ESP32+Rust</span>
        <span class="pipeline-status">Active</span>
      </div>
    </div>

    <div class="pipeline-item completed">
      <span class="pipeline-icon">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
      </span>
      <div class="pipeline-text">
        <span class="pipeline-name">jaweed3/esp32-jarvis — 7-phase roadmap</span>
        <span class="pipeline-status">Active</span>
      </div>
    </div>

    <div class="pipeline-item in-progress">
      <span class="pipeline-icon">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>
      </span>
      <div class="pipeline-text">
        <span class="pipeline-name">jaweed3/face-lib — breaking changes</span>
        <span class="pipeline-status">Refactoring</span>
      </div>
    </div>

    <div class="pipeline-item future">
      <span class="pipeline-icon">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
      </span>
      <div class="pipeline-text">
        <span class="pipeline-name">jaweed3/web-ml-ops — pipeline ops</span>
        <span class="pipeline-status">Early Stage</span>
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  .roadmap-hero {
    padding: 128px var(--margin-mobile) 48px;
    max-width: var(--container-max);
    margin: 0 auto;

    @media (min-width: 768px) {
      padding: 128px var(--margin-desktop) 48px;
    }

    .hero-badge {
      font-family: var(--font-mono);
      font-size: var(--caption);
      line-height: 1;
      letter-spacing: 0.1em;
      color: var(--accent-2);
      text-transform: uppercase;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 16px;

      svg {
        width: 18px;
        height: 18px;
      }
    }

    .hero-title {
      font-family: var(--font-display);
      font-size: var(--headline-lg-mobile);
      font-weight: 600;
      letter-spacing: -0.01em;
      line-height: 1.2;
      color: var(--text);
      margin: 0 0 12px;

      @media (min-width: 768px) {
        font-size: var(--headline-lg);
        letter-spacing: -0.02em;
        line-height: 1.1;
      }
    }

    .hero-desc {
      font-family: var(--font-body);
      font-size: var(--body-lg);
      line-height: 1.6;
      color: var(--text-variant);
      margin: 0 0 32px;
    }

    .hero-stats {
      display: flex;
      gap: 48px;
    }

    .hero-stat {
      .hero-stat-value {
        font-family: var(--font-display);
        font-size: var(--headline-md);
        font-weight: 500;
        line-height: 1.3;
        color: var(--accent);
        display: block;
      }

      .hero-stat-label {
        font-family: var(--font-mono);
        font-size: var(--caption);
        line-height: 1.4;
        color: var(--muted);
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
    }
  }

  .roadmap-grid {
    max-width: var(--container-max);
    margin: 0 auto;
    padding: 0 var(--margin-mobile) 96px;
    display: grid;
    grid-template-columns: 1fr;
    gap: 48px;

    @media (min-width: 768px) {
      padding: 0 var(--margin-desktop) 96px;
      grid-template-columns: 1fr 1fr;
    }
  }

  .col-title {
    font-family: var(--font-mono);
    font-size: var(--label-mono);
    line-height: 1;
    letter-spacing: 0.05em;
    color: var(--accent-2);
    text-transform: uppercase;
    margin: 0 0 32px;
  }

  /* Roadmap items (left column) */
  .roadmap-item {
    display: flex;
    gap: 20px;
    padding: 0 0 32px;
    position: relative;

    &:not(:last-child)::before {
      content: '';
      position: absolute;
      left: 7px;
      top: 24px;
      bottom: 0;
      width: 2px;
      background: var(--border);
    }

    .rm-indicator {
      width: 16px;
      height: 16px;
      border: 2px solid var(--border);
      flex-shrink: 0;
      margin-top: 4px;
      background: transparent;
    }

    &.completed .rm-indicator {
      background: var(--accent);
      border-color: var(--accent);
    }

    .rm-content {
      display: flex;
      flex-direction: column;
      gap: 4px;

      .rm-status {
        font-family: var(--font-mono);
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        background: var(--accent);
        color: var(--on-primary);
        padding: 2px 8px;
        align-self: flex-start;
        line-height: 1.4;
      }

      .rm-title {
        font-family: var(--font-display);
        font-size: var(--body-md);
        font-weight: 500;
        line-height: 1.5;
        color: var(--text);
      }

      .rm-desc {
        font-family: var(--font-body);
        font-size: 14px;
        line-height: 1.5;
        color: var(--muted);
        margin: 0 0 4px;
      }

      .rm-meta {
        font-family: var(--font-mono);
        font-size: 11px;
        line-height: 1;
        color: var(--muted);
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
    }

    .rm-status {
      &.open {
        background: var(--accent-2);
        color: var(--bg);
      }
    }
  }

  /* Pipeline items (right column) */
  .pipeline-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.03);
    border-left: 2px solid var(--border);
    margin-bottom: 8px;

    &.completed {
      border-left-color: var(--accent);
    }

    &.in-progress {
      border-left-color: var(--accent-2);
    }

    &.future {
      border-left-color: var(--outline-variant);
      opacity: 0.5;
    }

    .pipeline-icon {
      flex-shrink: 0;
      width: 16px;
      height: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .pipeline-text {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex: 1;
      gap: 16px;

      .pipeline-name {
        font-family: var(--font-body);
        font-size: 14px;
        font-weight: 500;
        line-height: 1.5;
        color: var(--text);
      }

      .pipeline-status {
        font-family: var(--font-mono);
        font-size: 10px;
        line-height: 1;
        color: var(--muted);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        flex-shrink: 0;
      }
    }
  }
</style>
