<script lang="ts">
  import Header from '$lib/components/organisms/Header.svelte';
  import Footer from '$lib/components/organisms/Footer.svelte';
</script>

<svelte:head>
  <title>Hire Me — Fatih Jawwad</title>
  <meta name="description" content="Edge ML & Rust Systems Engineer available for hire. Specialized in ESP32-S3, ONNX, Burn, and production-grade AI under extreme constraints." />
  <meta property="og:title" content="Hire Fatih Jawwad — Edge ML Engineer" />
  <meta property="og:description" content="Edge ML & Rust Systems Engineer available for hire. Specialized in ESP32-S3, ONNX, Burn, and production-grade AI under extreme constraints." />
</svelte:head>

<Header showBackground />

<main class="hire-page">
  <div class="container">
    <!-- Hero -->
    <section class="hero">
      <h1 class="title">Fatih Jawwad Al-Mumtaz</h1>
      <p class="subtitle">Edge ML & Rust Systems Engineer</p>
      <p class="tagline">
        Deploying production-grade AI under extreme constraints:
        <br />
        <span class="highlight">sub-MB SRAM</span>, <span class="highlight">&lt;1ms latency</span>, <span class="highlight">zero cloud dependency</span>
      </p>
      <div class="cta-buttons">
        <a href="mailto:wedjaw22@gmail.com" class="btn btn-primary">Contact Me</a>
        <a href="https://github.com/jaweed3" target="_blank" rel="noopener" class="btn btn-secondary">GitHub</a>
        <a href="https://linkedin.com/in/fatih-al-mumtaz" target="_blank" rel="noopener" class="btn btn-secondary">LinkedIn</a>
      </div>
    </section>

    <!-- Skills -->
    <section class="section">
      <h2 class="section-title">Technical Skills</h2>
      <div class="skills-grid">
        <div class="skill-category">
          <h3>Languages</h3>
          <div class="skill-tags">
            <span class="skill-tag">Rust</span>
            <span class="skill-tag">Python</span>
            <span class="skill-tag">C/C++</span>
            <span class="skill-tag">TypeScript</span>
            <span class="skill-tag">Kotlin</span>
            <span class="skill-tag">Bash</span>
          </div>
        </div>
        <div class="skill-category">
          <h3>Edge ML</h3>
          <div class="skill-tags">
            <span class="skill-tag">ONNX Runtime</span>
            <span class="skill-tag">TFLite INT8</span>
            <span class="skill-tag">Burn</span>
            <span class="skill-tag">Candle</span>
            <span class="skill-tag">ESP32-S3</span>
            <span class="skill-tag">ARM Cortex-M</span>
            <span class="skill-tag">Model Quantization</span>
          </div>
        </div>
        <div class="skill-category">
          <h3>Systems</h3>
          <div class="skill-tags">
            <span class="skill-tag">Axum</span>
            <span class="skill-tag">FastAPI</span>
            <span class="skill-tag">Docker</span>
            <span class="skill-tag">Kubernetes</span>
            <span class="skill-tag">MLflow</span>
            <span class="skill-tag">DVC</span>
            <span class="skill-tag">Prometheus</span>
            <span class="skill-tag">Grafana</span>
            <span class="skill-tag">OpenTelemetry</span>
          </div>
        </div>
        <div class="skill-category">
          <h3>ML/DL</h3>
          <div class="skill-tags">
            <span class="skill-tag">PyTorch</span>
            <span class="skill-tag">TensorFlow</span>
            <span class="skill-tag">YOLOv8</span>
            <span class="skill-tag">Autoencoders</span>
            <span class="skill-tag">Recommendation Systems</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Open Source -->
    <section class="section">
      <h2 class="section-title">Open Source Contributions</h2>
      <div class="oss-grid">
        <div class="oss-card">
          <h3>sonos/tract</h3>
          <p class="oss-meta">2 PRs merged · Tiny ONNX inference engine</p>
          <p>Exposed ONNX model metadata for edge-optimized loading; fixed RMSNorm mapping bug affecting speech recognition workloads.</p>
          <a href="https://github.com/sonos/tract/pulls?q=author:jaweed3" target="_blank" rel="noopener" class="link">View PRs →</a>
        </div>
        <div class="oss-card">
          <h3>tracel-ai/burn</h3>
          <p class="oss-meta">4 PRs merged · Rust deep learning framework</p>
          <p>Implemented ROUGE-L metric (283 lines), fixed SgdConfig initialization bug, improved error messages and TUI shutdown.</p>
          <a href="https://github.com/tracel-ai/burn/pulls?q=author:jaweed3" target="_blank" rel="noopener" class="link">View PRs →</a>
        </div>
        <div class="oss-card">
          <h3>huggingface/candle</h3>
          <p class="oss-meta">4 PRs open · Minimalist ML framework for Rust</p>
          <p>GGUF metadata loading, Metal device panic prevention, Apple Silicon test precision fix, ONNX device propagation.</p>
          <a href="https://github.com/huggingface/candle/pulls?q=author:jaweed3" target="_blank" rel="noopener" class="link">View PRs →</a>
        </div>
      </div>
    </section>

    <!-- Projects -->
    <section class="section">
      <h2 class="section-title">Featured Projects</h2>
      <div class="projects-grid">
        <div class="project-card">
          <h3>burn-recsys</h3>
          <p>Production recommendation API in Rust with Burn framework, HNSW retrieval, and OpenTelemetry observability.</p>
          <div class="tech-tags">
            <span>Rust</span>
            <span>Burn</span>
            <span>Axum</span>
            <span>HNSW</span>
          </div>
          <p class="result"><strong>Result:</strong> &lt;1ms p50 latency at 1,000+ req/s on Apple M4</p>
          <a href="https://github.com/jaweed3/burn-recsys" target="_blank" rel="noopener" class="link">View on GitHub →</a>
        </div>

        <div class="project-card">
          <h3>vibeSentinel</h3>
          <p>Embedded anomaly detection on ESP32-S3 under 256KB SRAM. Autoencoder for vibration monitoring, zero cloud.</p>
          <div class="tech-tags">
            <span>Rust</span>
            <span>ESP32-S3</span>
            <span>Autoencoder</span>
            <span>Edge ML</span>
          </div>
          <p class="result"><strong>Result:</strong> 2MB models compressed to sub-MB SRAM</p>
          <a href="https://github.com/jaweed3/vibeSentinel" target="_blank" rel="noopener" class="link">View on GitHub →</a>
        </div>

        <div class="project-card">
          <h3>retakId</h3>
          <p>Offline landslide detection for rural villages. TensorFlow.js edge model with Delta-OTA.</p>
          <div class="tech-tags">
            <span>TensorFlow.js</span>
            <span>Edge ML</span>
            <span>Delta OTA</span>
            <span>Telegram Bot</span>
          </div>
          <p class="result"><strong>Result:</strong> Best Thematic Award IYREF ITB 2026 (40+ teams)</p>
          <a href="https://github.com/jaweed3/retakId" target="_blank" rel="noopener" class="link">View on GitHub →</a>
        </div>

        <div class="project-card">
          <h3>RescueVision Edge</h3>
          <p>Offline SAR drone MLOps pipeline. YOLOv8n → ONNX INT8, FastAPI serving, field deployment.</p>
          <div class="tech-tags">
            <span>Python</span>
            <span>YOLOv8</span>
            <span>ONNX</span>
            <span>Docker</span>
          </div>
          <p class="result"><strong>Result:</strong> 15-minute deployment for disaster response</p>
          <a href="https://github.com/jaweed3/RescueVision" target="_blank" rel="noopener" class="link">View on GitHub →</a>
        </div>

        <div class="project-card">
          <h3>PerpusGate</h3>
          <p>Production biometric access system at UNIDA Gontor. Face recognition with InsightFace.</p>
          <div class="tech-tags">
            <span>Python</span>
            <span>FastAPI</span>
            <span>InsightFace</span>
            <span>MySQL</span>
          </div>
          <p class="result"><strong>Result:</strong> 500+ entries daily in production</p>
          <a href="https://github.com/jaweed3/face-lib" target="_blank" rel="noopener" class="link">View on GitHub →</a>
        </div>

        <div class="project-card">
          <h3>esp32-jarvis</h3>
          <p>Offline wake-word detection and face recognition on ESP32-S3. Zero cloud dependency.</p>
          <div class="tech-tags">
            <span>C++</span>
            <span>ESP-IDF</span>
            <span>ESP32-S3</span>
            <span>TinyML</span>
          </div>
          <p class="result"><strong>Result:</strong> Fully offline biometric system</p>
          <a href="https://github.com/jaweed3/esp32-jarvis" target="_blank" rel="noopener" class="link">View on GitHub →</a>
        </div>
      </div>
    </section>

    <!-- Experience -->
    <section class="section">
      <h2 class="section-title">Experience</h2>
      <div class="timeline">
        <div class="timeline-item">
          <h3>Google Student Ambassador</h3>
          <p class="timeline-meta">2024 – Present · UNIDA Gontor, Indonesia</p>
          <p>Led 15+ ML/data-science workshops; connected 6 campus groups with Google tools and industry mentors.</p>
        </div>
        <div class="timeline-item">
          <h3>Co-Founder & Lead, Forum DA'I</h3>
          <p class="timeline-meta">2024 – Present · Darussalam Artificial Intelligence</p>
          <p>Founded university's first AI club; designed curriculum and mentored peers in production-grade projects.</p>
        </div>
        <div class="timeline-item">
          <h3>IT Support Staff</h3>
          <p class="timeline-meta">2024 – Present · UNIDA Gontor Library</p>
          <p>Maintain 50+ Linux/Windows workstations and library management system serving 5,000+ students daily.</p>
        </div>
      </div>
    </section>

    <!-- Education -->
    <section class="section">
      <h2 class="section-title">Education</h2>
      <div class="timeline">
        <div class="timeline-item">
          <h3>B.Eng. Computer Engineering</h3>
          <p class="timeline-meta">Aug 2024 – Present · Universitas Darussalam Gontor · GPA: 3.7/4.0</p>
        </div>
        <div class="timeline-item">
          <h3>Erasmus+ Exchange (KA171)</h3>
          <p class="timeline-meta">Sep 2025 – Feb 2026 · Universidad de Sevilla · Scholarship</p>
        </div>
      </div>
    </section>

    <!-- Achievements -->
    <section class="section">
      <h2 class="section-title">Achievements</h2>
      <ul class="achievements-list">
        <li><strong>Best Thematic Award, IYREF ITB 2026</strong> — retakId landslide-detection edge AI (40+ teams)</li>
        <li><strong>Erasmus+ KA171 Scholarship</strong> — European Union, 2025–2026</li>
        <li><strong>3rd Place, FTI Hackathon (Mobile Apps)</strong> — Universitas Kristen Satya Wacana, 2025</li>
        <li><strong>Publication:</strong> "Identification of Prayer Movements Using CNN and Prewitt & Morphology" — 94% accuracy, 2024</li>
        <li><strong>Certifications:</strong> Google Advanced Data Analytics (2025), Azure AI Fundamentals (2025)</li>
      </ul>
    </section>

    <!-- CTA -->
    <section class="section cta-section">
      <h2 class="section-title">Let's Work Together</h2>
      <p class="cta-text">
        I'm open to opportunities in Edge AI, Rust Systems, and ML Infrastructure engineering.
        <br />
        Remote or on-site. Let's build something that matters.
      </p>
      <div class="cta-buttons">
        <a href="mailto:wedjaw22@gmail.com" class="btn btn-primary">Get In Touch</a>
        <a href="/resume" class="btn btn-secondary">Download Resume</a>
      </div>
    </section>
  </div>
</main>

<Footer />

<style lang="scss">
  @import '$lib/scss/variables';
  @import '$lib/scss/mixins';

  .hire-page {
    padding-top: 72px;
    min-height: 100vh;
    background: var(--bg);
  }

  .container {
    max-width: 900px;
    margin: 0 auto;
    padding: 0 var(--margin-mobile);

    @media (min-width: 768px) {
      padding: 0 var(--margin-desktop);
    }
  }

  .section {
    margin: 64px 0;

    @media (min-width: 768px) {
      margin: 96px 0;
    }
  }

  .title {
    font-family: var(--font-display);
    font-size: clamp(2rem, 5vw, 3rem);
    font-weight: 700;
    color: var(--text);
    margin: 0 0 8px 0;
  }

  .subtitle {
    font-family: var(--font-mono);
    font-size: var(--label-mono);
    color: var(--accent);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin: 0 0 16px 0;
  }

  .tagline {
    font-family: var(--font-body);
    font-size: var(--body-lg);
    color: var(--text-variant);
    line-height: 1.6;
    margin: 0 0 32px 0;

    .highlight {
      color: var(--accent-2);
      font-weight: 600;
    }
  }

  .cta-buttons {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  .btn {
    padding: 12px 24px;
    border-radius: 8px;
    font-family: var(--font-mono);
    font-size: var(--label-mono);
    text-decoration: none;
    transition: all 0.2s;
    display: inline-flex;
    align-items: center;
    gap: 8px;

    &.btn-primary {
      background: var(--accent);
      color: var(--bg);
      font-weight: 600;

      &:hover {
        background: var(--accent-2);
      }
    }

    &.btn-secondary {
      background: transparent;
      color: var(--accent);
      border: 1px solid var(--accent);

      &:hover {
        background: rgba(0, 238, 252, 0.08);
      }
    }
  }

  .section-title {
    font-family: var(--font-display);
    font-size: var(--headline-lg);
    font-weight: 600;
    color: var(--text);
    margin: 0 0 32px 0;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--border);
  }

  .skills-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 24px;

    @media (min-width: 600px) {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .skill-category {
    h3 {
      font-family: var(--font-mono);
      font-size: var(--label-mono);
      color: var(--accent);
      margin: 0 0 12px 0;
      text-transform: uppercase;
    }
  }

  .skill-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .skill-tag {
    padding: 6px 12px;
    background: var(--surface-container);
    border: 1px solid var(--border);
    border-radius: 6px;
    font-family: var(--font-mono);
    font-size: var(--caption);
    color: var(--text-variant);
  }

  .oss-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 24px;

    @media (min-width: 600px) {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .oss-card {
    background: var(--surface-container);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 24px;
    transition: border-color 0.2s;

    &:hover {
      border-color: var(--accent);
    }

    h3 {
      font-family: var(--font-display);
      font-size: var(--headline-sm);
      color: var(--text);
      margin: 0 0 4px 0;
    }

    .oss-meta {
      font-family: var(--font-mono);
      font-size: var(--caption);
      color: var(--text-variant);
      margin: 0 0 12px 0;
    }

    p {
      font-family: var(--font-body);
      font-size: var(--body-md);
      color: var(--text-variant);
      line-height: 1.6;
      margin: 0 0 16px 0;
    }

    .link {
      color: var(--accent);
      text-decoration: none;
      font-family: var(--font-mono);
      font-size: var(--caption);
      font-weight: 500;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  .projects-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 24px;

    @media (min-width: 600px) {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .project-card {
    background: var(--surface-container);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 24px;
    transition: border-color 0.2s;

    &:hover {
      border-color: var(--accent);
    }

    h3 {
      font-family: var(--font-display);
      font-size: var(--headline-sm);
      color: var(--text);
      margin: 0 0 8px 0;
    }

    p {
      font-family: var(--font-body);
      font-size: var(--body-md);
      color: var(--text-variant);
      line-height: 1.6;
      margin: 0 0 12px 0;
    }

    .tech-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 12px;

      span {
        padding: 4px 8px;
        background: var(--surface-container-high);
        border-radius: 4px;
        font-family: var(--font-mono);
        font-size: var(--caption);
        color: var(--text-variant);
      }
    }

    .result {
      font-size: var(--body-sm);
      color: var(--accent-2);
      margin-bottom: 16px !important;
    }

    .link {
      color: var(--accent);
      text-decoration: none;
      font-family: var(--font-mono);
      font-size: var(--caption);
      font-weight: 500;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  .timeline {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .timeline-item {
    padding-left: 20px;
    border-left: 2px solid var(--border);

    h3 {
      font-family: var(--font-display);
      font-size: var(--headline-sm);
      color: var(--text);
      margin: 0 0 4px 0;
    }

    .timeline-meta {
      font-family: var(--font-mono);
      font-size: var(--caption);
      color: var(--text-variant);
      margin: 0 0 8px 0;
    }

    p {
      font-family: var(--font-body);
      font-size: var(--body-md);
      color: var(--text-variant);
      line-height: 1.6;
      margin: 0;
    }
  }

  .achievements-list {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      font-family: var(--font-body);
      font-size: var(--body-md);
      color: var(--text-variant);
      line-height: 1.8;
      margin-bottom: 12px;
      padding-left: 20px;
      position: relative;

      &::before {
        content: '→';
        position: absolute;
        left: 0;
        color: var(--accent);
      }
    }
  }

  .cta-section {
    text-align: center;
    padding: 48px 24px;
    background: var(--surface-container);
    border: 1px solid var(--border);
    border-radius: 16px;

    .cta-text {
      font-family: var(--font-body);
      font-size: var(--body-lg);
      color: var(--text-variant);
      margin: 0 0 32px 0;
    }
  }
</style>
