<script lang="ts">
  import { title } from '$lib/data/meta';
</script>

<svelte:head>
  <title>Resume — {title}</title>
</svelte:head>

<div class="resume-page">
  <section class="resume-hero">
    <span class="section-moniker">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
      04 — Experience
    </span>
    <h1 class="resume-name">Fatih Jawwad</h1>
    <p class="resume-title">Professional ML Engineer</p>
    <a href="/Fatih%20Jawwad%20Resume.pdf" target="_blank" rel="noopener noreferrer" class="download-btn">Download PDF →</a>
  </section>

  <div class="resume-grid">
    <!-- Left: Timeline -->
    <section class="timeline-col">
      <div class="timeline-section">
        <div class="tl-item">
          <div class="tl-dot tl-dot-active"></div>
          <div class="tl-body">
            <span class="tl-date">Sep 2025 – Feb 2026</span>
            <h3 class="tl-role">Erasmus+ KA171 Exchange</h3>
            <p class="tl-org">Universidad de Sevilla, Spain</p>
            <div class="tl-card">
              <p class="tl-desc">Studied computer engineering abroad, focused on ML systems and embedded AI. Collaborated on research-oriented ML projects within an international academic environment.</p>
            </div>
          </div>
        </div>

        <div class="tl-item">
          <div class="tl-dot"></div>
          <div class="tl-body">
            <span class="tl-date">2024 – Present</span>
            <h3 class="tl-role">Sole Technical Developer</h3>
            <p class="tl-org">UPT Perpustakaan UNIDA Gontor</p>
            <div class="tl-card">
              <p class="tl-desc">Designed and deployed PerpusGate — a face recognition library access system serving 165+ daily users. Built the entire stack from embedded camera firmware to the web management dashboard.</p>
              <div class="tl-tech">
                <span>InsightFace</span>
                <span>FastAPI</span>
                <span>MySQL</span>
                <span>Python</span>
              </div>
            </div>
          </div>
        </div>

        <div class="tl-item">
          <div class="tl-dot"></div>
          <div class="tl-body">
            <span class="tl-date">2022 – Present</span>
            <h3 class="tl-role">Computer Engineering B.S.</h3>
            <p class="tl-org">Universitas Darussalam Gontor (UNIDA Gontor)</p>
            <div class="tl-card">
              <p class="tl-desc">B.S. Computer Engineering. Focus on embedded systems, machine learning, and software engineering.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Right: Capability Matrix -->
    <aside class="cap-col">
      <div class="cap-card">
        <h2 class="cap-title">Capability Matrix</h2>

        <div class="cap-group">
          <div class="cap-label">Edge Deployment</div>
          <div class="cap-progress"><div class="cap-bar" style="width:95%"></div></div>
          <div class="cap-skills">
            {#each ['ONNX', 'TFLite', 'ESP32', 'ARM', 'Apple Silicon'] as s}
              <span class="cap-skill">{s}</span>
            {/each}
          </div>
        </div>

        <div class="cap-group">
          <div class="cap-label">Model Optimization</div>
          <div class="cap-progress"><div class="cap-bar" style="width:90%"></div></div>
          <div class="cap-skills">
            {#each ['INT8 Quantization', '1.58-bit Ternary', 'Pruning', 'ONNX Runtime'] as s}
              <span class="cap-skill">{s}</span>
            {/each}
          </div>
        </div>

        <div class="cap-group">
          <div class="cap-label">ML Frameworks</div>
          <div class="cap-progress"><div class="cap-bar" style="width:85%"></div></div>
          <div class="cap-skills">
            {#each ['PyTorch', 'Burn (Rust)', 'InsightFace', 'YOLOv8'] as s}
              <span class="cap-skill">{s}</span>
            {/each}
          </div>
        </div>

        <div class="cap-group">
          <div class="cap-label">Backend &amp; Infra</div>
          <div class="cap-progress"><div class="cap-bar" style="width:80%"></div></div>
          <div class="cap-skills">
            {#each ['FastAPI', 'Rust/Axum', 'Docker', 'MLflow', 'Prometheus'] as s}
              <span class="cap-skill">{s}</span>
            {/each}
          </div>
        </div>

        <div class="cap-group">
          <div class="cap-label">Languages</div>
          <div class="cap-progress"><div class="cap-bar" style="width:90%"></div></div>
          <div class="cap-skills">
            {#each ['Python', 'Rust', 'C++', 'SQL'] as s}
              <span class="cap-skill">{s}</span>
            {/each}
          </div>
        </div>
      </div>

      <!-- Core Languages -->
      <div class="cap-card">
        <h2 class="cap-title">Core Languages</h2>
        <div class="core-langs">
          <div class="core-item">
            <span class="core-dot" style="background: var(--accent-2)"></span>
            <span>Python</span>
          </div>
          <div class="core-item">
            <span class="core-dot" style="background: var(--accent)"></span>
            <span>Rust</span>
          </div>
          <div class="core-item">
            <span class="core-dot" style="background: var(--accent-3)"></span>
            <span>C++</span>
          </div>
          <div class="core-item">
            <span class="core-dot" style="background: var(--muted)"></span>
            <span>SQL</span>
          </div>
        </div>
      </div>

      <!-- OSS -->
      <div class="cap-card">
        <h2 class="cap-title">OSS Contributions</h2>
        <a href="https://github.com/tracel-ai/burn" target="_blank" rel="noopener noreferrer" class="oss-item">
          <div class="oss-item-head">
            <h4>tracel-ai/burn</h4>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>
            </svg>
          </div>
          <p>5 PRs merged — ROUGE-L metric, SGD config fix, derive hints</p>
          <span class="oss-meta">Merged #4967, #4986, #4996, #5028, #5032</span>
        </a>
        <a href="https://github.com/sonos/tract" target="_blank" rel="noopener noreferrer" class="oss-item">
          <div class="oss-item-head">
            <h4>sonos/tract</h4>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>
            </svg>
          </div>
          <p>2 PRs merged — ONNX metadata, SimplifiedLayerNorm fix</p>
          <span class="oss-meta">Merged #2408, #2409</span>
        </a>
        <a href="https://github.com/huggingface/candle" target="_blank" rel="noopener noreferrer" class="oss-item">
          <div class="oss-item-head">
            <h4>huggingface/candle</h4>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>
            </svg>
          </div>
          <p>PR open — GGUF added tokens (fixes Qwen think/think)</p>
          <span class="oss-meta">Open #3641</span>
        </a>
        <a href="https://github.com/jaweed3" target="_blank" rel="noopener noreferrer" class="oss-link">VIEW ALL ON GITHUB →</a>
      </div>
    </aside>
  </div>
</div>

<style lang="scss">
  .resume-page {
    max-width: var(--container-max);
    margin: 0 auto;
    padding: 0 var(--margin-mobile) 96px;

    @media (min-width: 768px) {
      padding: 0 var(--margin-desktop) 96px;
    }
  }

  .resume-hero {
    padding: 128px 0 64px;

    .section-moniker {
      display: inline-block;
      padding: 4px 12px;
      background: var(--surface-container-high);
      border-radius: 999px;
      font-family: var(--font-mono);
      font-size: var(--label-mono);
      line-height: 1;
      letter-spacing: 0.05em;
      color: var(--accent);
      margin-bottom: 16px;
      display: inline-flex;
      align-items: center;
      gap: 6px;

      svg {
        width: 18px;
        height: 18px;
      }
    }

    .resume-name {
      font-family: var(--font-display);
      font-size: var(--headline-lg-mobile);
      font-weight: 600;
      letter-spacing: -0.01em;
      line-height: 1.2;
      color: var(--text);
      margin: 0 0 8px;

      @media (min-width: 768px) {
        font-size: var(--headline-lg);
        letter-spacing: -0.02em;
        line-height: 1.1;
      }
    }

    .resume-title {
      font-family: var(--font-display);
      font-size: var(--headline-md);
      font-weight: 500;
      line-height: 1.3;
      color: var(--text-variant);
      margin: 0 0 24px;
    }

    .download-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      border: 1px solid var(--accent);
      border-radius: 8px;
      font-family: var(--font-mono);
      font-size: var(--label-mono);
      line-height: 1;
      letter-spacing: 0.05em;
      color: var(--accent);
      text-decoration: none;
      text-transform: uppercase;
      transition: all 0.2s;

      &:hover {
        background: var(--accent);
        color: var(--bg);
      }
    }
  }

  .resume-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 48px;

    @media (min-width: 1024px) {
      grid-template-columns: 7fr 5fr;
    }
  }

  /* Timeline */
  .timeline-section {
    position: relative;

    &::before {
      content: '';
      position: absolute;
      left: 16px;
      top: 8px;
      bottom: 8px;
      width: 1px;
      background: linear-gradient(to bottom, transparent, var(--accent) 15%, var(--accent) 85%, transparent);
      opacity: 0.2;
    }
  }

  .tl-item {
    position: relative;
    padding-left: 48px;
    padding-bottom: 48px;

    &:last-child {
      padding-bottom: 0;
    }

    .tl-dot {
      position: absolute;
      left: 13px;
      top: 6px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--muted);
      border: 2px solid var(--bg);
      transition: all 0.2s;

      &.tl-dot-active {
        background: var(--accent);
        box-shadow: 0 0 10px rgba(189, 194, 255, 0.5);
      }
    }

    &:hover .tl-dot {
      transform: scale(1.25);
    }

    .tl-date {
      font-family: var(--font-mono);
      font-size: var(--caption);
      line-height: 1.4;
      color: var(--outline-variant);
      display: block;
      margin-bottom: 8px;
    }

    .tl-role {
      font-family: var(--font-display);
      font-size: var(--headline-md);
      font-weight: 500;
      line-height: 1.3;
      color: var(--text);
      margin: 0;
    }

    .tl-org {
      font-family: var(--font-body);
      font-size: var(--body-md);
      font-weight: 500;
      line-height: 1.5;
      color: var(--accent);
      margin: 4px 0 16px;
    }

    .tl-card {
      background: var(--surface-charcoal);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 24px;
      box-shadow: inset 0 1px 1px 0 rgba(255, 255, 255, 0.05);
      transition: border-color 0.2s;

      &:hover {
        border-color: rgba(189, 194, 255, 0.4);
      }

      .tl-desc {
        font-family: var(--font-body);
        font-size: var(--body-md);
        line-height: 1.5;
        color: var(--text-variant);
        margin: 0 0 16px;
      }

      .tl-tech {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;

        span {
          padding: 4px 8px;
          background: var(--surface-container-low);
          border: 1px solid var(--border);
          border-radius: 4px;
          font-family: var(--font-mono);
          font-size: 10px;
          line-height: 1;
          color: var(--accent);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
      }
    }
  }

  /* Capability Matrix */
  .cap-col {
    display: flex;
    flex-direction: column;
    gap: var(--gutter);
  }

  .cap-card {
    background: var(--surface-charcoal);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 32px;
    box-shadow: inset 0 1px 1px 0 rgba(255, 255, 255, 0.05);

    .cap-title {
      font-family: var(--font-mono);
      font-size: var(--label-mono);
      line-height: 1;
      letter-spacing: 0.05em;
      color: var(--muted);
      text-transform: uppercase;
      margin: 0 0 32px;
    }
  }

  .cap-group {
    margin-bottom: 24px;

    &:last-child {
      margin-bottom: 0;
    }

    .cap-label {
      font-family: var(--font-body);
      font-size: var(--body-md);
      font-weight: 500;
      line-height: 1.5;
      color: var(--text);
      margin-bottom: 8px;
    }

    .cap-progress {
      height: 4px;
      width: 100%;
      background: var(--surface-container-high);
      border-radius: 999px;
      overflow: hidden;
      margin-bottom: 12px;

      .cap-bar {
        height: 100%;
        background: var(--primary-container);
        border-radius: 999px;
      }
    }

    .cap-skills {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;

      .cap-skill {
        padding: 2px 8px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 4px;
        font-family: var(--font-mono);
        font-size: 10px;
        line-height: 1.4;
        color: var(--text-variant);
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
    }
  }

  .core-langs {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }

  .core-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 12px;
    background: var(--surface-container-low);
    border: 1px solid var(--border);
    border-radius: 8px;
    font-family: var(--font-mono);
    font-size: 12px;
    line-height: 1;
    color: var(--text);

    .core-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
    }
  }

  .oss-item {
    display: block;
    padding: 16px;
    border: 1px solid var(--border);
    border-radius: 8px;
    text-decoration: none;
    margin-bottom: 8px;
    transition: border-color 0.2s;

    &:hover {
      border-color: rgba(189, 194, 255, 0.6);

      h4 {
        color: var(--accent);
      }
    }

    .oss-item-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;

      h4 {
        font-family: var(--font-body);
        font-size: var(--body-md);
        font-weight: 500;
        line-height: 1.5;
        color: var(--text);
        margin: 0;
        transition: color 0.2s;
      }

      svg {
        color: var(--muted);
      }
    }

    p {
      font-family: var(--font-body);
      font-size: 13px;
      line-height: 1.5;
      color: var(--text-variant);
      margin: 0 0 4px;
    }

    .oss-meta {
      font-family: var(--font-mono);
      font-size: 11px;
      line-height: 1;
      color: var(--muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
  }

  .oss-link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-top: 16px;
    font-family: var(--font-mono);
    font-size: var(--caption);
    line-height: 1.4;
    color: var(--accent);
    text-decoration: none;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
</style>
