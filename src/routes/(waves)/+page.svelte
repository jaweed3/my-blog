<script lang="ts">
  import Hero from '$lib/components/organisms/Hero.svelte';
  import Footer from '$lib/components/organisms/Footer.svelte';
  import type { BlogPost, Project } from '$lib/utils/types';

  export let data: { posts: BlogPost[]; projects: Project[] };
  const { posts, projects } = data;

  function getTagColor(tag: string) {
    const lower = tag.toLowerCase();
    if (lower.includes('rust') || lower.includes('edge') || lower.includes('ai')) return 'primary';
    if (lower.includes('cv') || lower.includes('vision') || lower.includes('mobile')) return 'cyan';
    if (lower.includes('prod') || lower.includes('access')) return 'amber';
    return 'muted';
  }
</script>

<Hero />

<!-- Featured Work -->
<section id="work" class="section-container">
  <div class="section-header">
    <div>
      <span class="section-moniker">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><path d="M8 21h8"/><path d="M12 17v4"/></svg>
        [02 — Work]</span>
      <h2 class="section-title">Featured Work</h2>
    </div>
    <a href="/projects" class="section-all-link">View All Projects →</a>
  </div>

  <div class="bento-grid">
    <!-- VibeSentinel: hero card -->
    {#each projects as project}
      {#if project.slug === 'vibesentinel'}
        <a href="/projects/{project.slug}" class="bento-card bento-hero">
          <div class="bento-bg" style="background: linear-gradient(135deg, rgba(94,106,210,0.08) 0%, transparent 50%);"></div>
          <div class="bento-content">
            <div class="bento-tags">
              {#each project.tags.slice(0, 2) as tag}
                <span class="bento-tag {getTagColor(tag)}">{tag}</span>
              {/each}
            </div>
            <div class="bento-bottom">
              <h3 class="bento-title">{project.title}</h3>
              <p class="bento-desc">{project.excerpt}</p>
            </div>
          </div>
        </a>
      {/if}
    {/each}

    <!-- Retak.id -->
    {#each projects as project}
      {#if project.slug === 'retakid'}
        <a href="/projects/{project.slug}" class="bento-card bento-small">
          <div class="bento-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <h3 class="bento-title">{project.title}</h3>
          <p class="bento-desc">{project.excerpt}</p>
        </a>
      {/if}
    {/each}

    <!-- PerpusGate -->
    {#each projects as project}
      {#if project.slug === 'perpusgate'}
        <a href="/projects/{project.slug}" class="bento-card bento-small">
          <div class="bento-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M9 3v2m6-2v2M9 19v2m6-2v2M5 7h14M5 17h14M5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z"/>
            </svg>
          </div>
          <h3 class="bento-title">{project.title}</h3>
          <p class="bento-desc">{project.excerpt}</p>
        </a>
      {/if}
    {/each}

    <!-- burn-recsys -->
    {#each projects as project}
      {#if project.slug === 'burn-recsys'}
        <a href="/projects/{project.slug}" class="bento-card bento-accent">
          <div class="bento-content">
            <h3 class="bento-title">{project.title}</h3>
            <p class="bento-desc">{project.excerpt}</p>
            <div class="bento-status">
              <span class="status-dot"></span>
              <span class="status-label">Active Development</span>
            </div>
          </div>
        </a>
      {/if}
    {/each}

    <!-- RescueVision -->
    {#each projects as project}
      {#if project.slug === 'rescuevision-edge'}
        <a href="/projects/{project.slug}" class="bento-card bento-wide">
          <div class="bento-row-content">
            <div class="bento-row-text">
              <h3 class="bento-title">{project.title}</h3>
              <p class="bento-desc">{project.excerpt}</p>
            </div>
            <div class="bento-thumb">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/>
              </svg>
            </div>
          </div>
        </a>
      {/if}
    {/each}
  </div>
</section>

<!-- Skills -->
<section id="skills" class="section-container section-skills">
  <div class="section-header">
    <span class="section-moniker">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
      [03 — Skills]</span>
    <h2 class="section-title">Capabilities</h2>
  </div>

  <div class="skills-grid">
    <div class="skill-group">
      <h4 class="skill-group-label">Edge Deployment</h4>
      <div class="skill-chips">
        {#each ['ONNX', 'TFLite', 'ESP32', 'ARM', 'Apple Silicon'] as skill}
          <span class="skill-chip">{skill}</span>
        {/each}
      </div>
    </div>
    <div class="skill-group">
      <h4 class="skill-group-label">Model Optimization</h4>
      <div class="skill-chips">
        {#each ['INT8 Quantization', '1.58-bit Ternary', 'Pruning', 'ONNX Runtime'] as skill}
          <span class="skill-chip">{skill}</span>
        {/each}
      </div>
    </div>
    <div class="skill-group">
      <h4 class="skill-group-label">ML Frameworks</h4>
      <div class="skill-chips">
        {#each ['PyTorch', 'Burn (Rust)', 'InsightFace', 'YOLOv8'] as skill}
          <span class="skill-chip">{skill}</span>
        {/each}
      </div>
    </div>
    <div class="skill-group">
      <h4 class="skill-group-label">Backend &amp; Infra</h4>
      <div class="skill-chips">
        {#each ['FastAPI', 'Rust/Axum', 'Docker', 'MLflow', 'Prometheus'] as skill}
          <span class="skill-chip">{skill}</span>
        {/each}
      </div>
    </div>
    <div class="skill-group">
      <h4 class="skill-group-label">Languages</h4>
      <div class="skill-chips">
        {#each ['Python', 'Rust', 'C++', 'SQL'] as skill}
          <span class="skill-chip">{skill}</span>
        {/each}
      </div>
    </div>
  </div>
</section>

<!-- Timeline -->
<section id="experience" class="section-container">
  <div class="section-header">
    <span class="section-moniker">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
      [04 — Experience]</span>
    <h2 class="section-title">Timeline</h2>
  </div>

  <div class="timeline-list">
    <div class="timeline-item">
      <div class="timeline-dot timeline-dot-active">
        <svg width="6" height="6" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="6"/></svg>
      </div>
      <div class="timeline-body">
        <div class="timeline-head">
          <h3 class="timeline-role">Erasmus+ KA171 Exchange</h3>
          <span class="timeline-date">Sep 2025 – Feb 2026</span>
        </div>
        <p class="timeline-desc">Studied computer engineering abroad, focused on ML systems and embedded AI at Universidad de Sevilla, Spain.</p>
      </div>
    </div>
    <div class="timeline-item">
      <div class="timeline-dot">
        <svg width="6" height="6" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="6"/></svg>
      </div>
      <div class="timeline-body">
        <div class="timeline-head">
          <h3 class="timeline-role">Sole Technical Developer</h3>
          <span class="timeline-date">2024 – Present</span>
        </div>
        <p class="timeline-desc">Designed and deployed PerpusGate — a face recognition library access system serving 165+ daily users in production at UPT Perpustakaan UNIDA Gontor.</p>
      </div>
    </div>
  </div>
</section>

<!-- Open Source -->
<section id="opensource" class="section-container">
  <div class="section-header">
    <span class="section-moniker">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
      [05 — OSS]</span>
    <h2 class="section-title">Open Source</h2>
  </div>

  <div class="oss-cards">
    <a href="https://github.com/tracel-ai/burn" target="_blank" rel="noopener noreferrer" class="oss-card">
      <div class="oss-card-head">
        <h4 class="oss-repo">tracel-ai/burn</h4>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>
        </svg>
      </div>
      <p class="oss-desc">5 PRs merged — ROUGE-L metric, SGD config fix, error messages, derive hints, TensorNotFound hints</p>
      <span class="oss-badge">Merged #4967, #4986, #4996, #5028, #5032</span>
    </a>
    <a href="https://github.com/sonos/tract" target="_blank" rel="noopener noreferrer" class="oss-card">
      <div class="oss-card-head">
        <h4 class="oss-repo">sonos/tract</h4>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>
        </svg>
      </div>
      <p class="oss-desc">2 PRs merged — ONNX metadata in Graph.properties, SimplifiedLayerNorm → RMSNorm fix</p>
      <span class="oss-badge">Merged #2408, #2409</span>
    </a>
    <a href="https://github.com/huggingface/candle" target="_blank" rel="noopener noreferrer" class="oss-card">
      <div class="oss-card-head">
        <h4 class="oss-repo">huggingface/candle</h4>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>
        </svg>
      </div>
      <p class="oss-desc">PR open — load added tokens from GGUF metadata (fixes Qwen think/think tags)</p>
      <span class="oss-badge">Open #3641</span>
    </a>
  </div>
  <a href="https://github.com/jaweed3" target="_blank" rel="noopener noreferrer" class="oss-all-link">VIEW ALL ON GITHUB →</a>
</section>

<!-- Writing -->
{#if posts && posts.length > 0}
  <section id="writing" class="section-container">
    <div class="section-header">
      <div>
        <span class="section-moniker">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          [06 — Writing]</span>
        <h2 class="section-title">Latest Posts</h2>
      </div>
      <a href="/writing" class="section-all-link">All posts →</a>
    </div>

    <div class="post-list">
      {#each posts as post}
        <a href="/{post.slug}" class="post-item">
          <span class="post-date">{post.date.slice(0, 10)}</span>
          <div class="post-content">
            <h3 class="post-title">{post.title}</h3>
            <p class="post-excerpt">{post.excerpt}</p>
            <div class="post-tags">
              {#each post.tags?.slice(0, 3) as tag}
                <span class="post-tag">{tag}</span>
              {/each}
            </div>
          </div>
        </a>
      {/each}
    </div>
  </section>
{/if}

<style lang="scss">
  .section-container {
    padding: 96px var(--margin-mobile);
    max-width: var(--container-max);
    margin: 0 auto;

    @media (min-width: 768px) {
      padding: 96px var(--margin-desktop);
    }
  }

  .section-skills {
    background: var(--surface-charcoal);
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    max-width: none;
    padding-left: 0;
    padding-right: 0;

    > .section-header {
      max-width: var(--container-max);
      margin: 0 auto;
      padding: 0 var(--margin-mobile);

      @media (min-width: 768px) {
        padding: 0 var(--margin-desktop);
      }
    }

    > .skills-grid {
      max-width: var(--container-max);
      margin: 0 auto;
      padding: 0 var(--margin-mobile);

      @media (min-width: 768px) {
        padding: 0 var(--margin-desktop);
      }
    }
  }

  .section-header {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 64px;

    @media (min-width: 768px) {
      flex-direction: row;
      justify-content: space-between;
      align-items: flex-end;
    }

    .section-moniker {
      font-family: var(--font-mono);
      font-size: var(--caption);
      line-height: 1.4;
      color: var(--accent);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      display: inline-flex;
      align-items: center;
      gap: 6px;

      svg {
        width: 18px;
        height: 18px;
      }
    }

    .section-title {
      font-family: var(--font-display);
      font-size: var(--headline-lg-mobile);
      font-weight: 600;
      letter-spacing: -0.01em;
      line-height: 1.2;
      margin: 4px 0 0;

      @media (min-width: 768px) {
        font-size: var(--headline-lg);
        letter-spacing: -0.02em;
        line-height: 1.1;
      }
    }

    .section-all-link {
      font-family: var(--font-mono);
      font-size: var(--label-mono);
      line-height: 1;
      letter-spacing: 0.05em;
      color: var(--accent);
      text-decoration: none;
      text-transform: uppercase;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  /* Bento Grid */
  .bento-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--gutter);
    grid-auto-rows: 280px;

    @media (min-width: 768px) {
      grid-template-columns: repeat(12, 1fr);
    }
  }

  .bento-card {
    background: var(--surface-charcoal);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 32px;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
    text-decoration: none;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      border-color: var(--accent);
      box-shadow: 0 0 20px rgba(189, 194, 255, 0.05);
    }

    &.bento-hero {
      @media (min-width: 768px) {
        grid-column: span 8;
        grid-row: span 2;
      }
    }

    &.bento-small {
      @media (min-width: 768px) {
        grid-column: span 4;
        grid-row: span 1;
      }
    }

    &.bento-accent {
      @media (min-width: 768px) {
        grid-column: span 4;
        grid-row: span 1;
      }
      border-left: 4px solid var(--accent);
    }

    &.bento-wide {
      @media (min-width: 768px) {
        grid-column: span 8;
        grid-row: span 1;
      }
    }

    .bento-bg {
      position: absolute;
      inset: 0;
      z-index: 0;
      opacity: 0.4;
      transition: opacity 0.3s;
    }

    &:hover .bento-bg {
      opacity: 0.6;
    }

    .bento-content {
      position: relative;
      z-index: 1;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .bento-tags {
      display: flex;
      gap: 8px;
      margin-bottom: auto;
    }

    .bento-tag {
      padding: 4px 8px;
      border-radius: 4px;
      font-family: var(--font-mono);
      font-size: 10px;
      line-height: 1;
      text-transform: uppercase;
      letter-spacing: 0.05em;

      &.primary {
        background: rgba(189, 194, 255, 0.1);
        border: 1px solid rgba(189, 194, 255, 0.2);
        color: var(--accent);
      }
      &.cyan {
        background: rgba(0, 238, 252, 0.1);
        border: 1px solid rgba(0, 238, 252, 0.2);
        color: var(--accent-2);
      }
      &.amber {
        background: rgba(255, 184, 103, 0.1);
        border: 1px solid rgba(255, 184, 103, 0.2);
        color: var(--accent-3);
      }
      &.muted {
        background: var(--surface-container-high);
        border: 1px solid var(--border);
        color: var(--muted);
      }
    }

    .bento-bottom {
      margin-top: auto;
    }

    .bento-title {
      font-family: var(--font-display);
      font-size: var(--headline-md);
      font-weight: 500;
      line-height: 1.3;
      color: var(--text);
      margin: 0 0 8px;
    }

    .bento-desc {
      font-family: var(--font-body);
      font-size: var(--body-md);
      line-height: 1.5;
      color: var(--text-variant);
      margin: 0;
      max-width: 448px;
    }

    .bento-icon {
      color: var(--accent-2);
      margin-bottom: 16px;
    }

    .bento-status {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: auto;
      padding-top: 16px;

      .status-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--accent);
      }

      .status-label {
        font-family: var(--font-mono);
        font-size: 10px;
        line-height: 1;
        color: var(--muted);
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
    }

    .bento-row-content {
      display: flex;
      flex-direction: column;
      gap: 32px;
      align-items: center;
      height: 100%;

      @media (min-width: 768px) {
        flex-direction: row;
      }

      .bento-row-text {
        flex: 1;
      }

      .bento-thumb {
        width: 128px;
        height: 128px;
        background: var(--surface-container-high);
        border-radius: 8px;
        overflow: hidden;
        border: 1px solid var(--border);
        display: none;
        align-items: center;
        justify-content: center;
        color: var(--muted);
        flex-shrink: 0;

        @media (min-width: 768px) {
          display: flex;
        }
      }
    }
  }

  /* Skills */
  .skills-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--gutter);
    margin-top: 64px;

    @media (min-width: 768px) {
      grid-template-columns: repeat(2, 1fr);
    }
    @media (min-width: 1024px) {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  .skill-group {
    display: flex;
    flex-direction: column;
    gap: 16px;

    .skill-group-label {
      font-family: var(--font-mono);
      font-size: var(--label-mono);
      line-height: 1;
      color: var(--muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: 0;
    }

    .skill-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .skill-chip {
      padding: 4px 12px;
      background: var(--surface-container);
      border: 1px solid var(--border);
      border-radius: 999px;
      font-family: var(--font-mono);
      font-size: var(--caption);
      line-height: 1.4;
      color: var(--text);
    }
  }

  /* Timeline */
  .timeline-list {
    max-width: 896px;
  }

  .timeline-item {
    position: relative;
    padding-left: 32px;
    padding-bottom: 48px;
    border-left: 1px solid var(--border);

    &:last-child {
      padding-bottom: 0;
    }

    .timeline-dot {
      position: absolute;
      left: -5px;
      top: 0;
      width: 9px;
      height: 9px;
      border-radius: 50%;
      background: var(--muted);
      box-shadow: 0 0 0 4px var(--bg);
      transition: all 0.2s;

      &.timeline-dot-active {
        background: var(--accent);
        box-shadow: 0 0 0 4px var(--bg);
      }
    }

    &:hover .timeline-dot {
      transform: scale(1.25);
    }

    .timeline-body {
      .timeline-head {
        display: flex;
        flex-direction: column;
        gap: 4px;
        margin-bottom: 8px;

        @media (min-width: 768px) {
          flex-direction: row;
          justify-content: space-between;
        }
      }

      .timeline-role {
        font-family: var(--font-display);
        font-size: var(--body-lg);
        font-weight: 700;
        line-height: 1.6;
        color: var(--text);
        margin: 0;
      }

      .timeline-date {
        font-family: var(--font-mono);
        font-size: var(--caption);
        line-height: 1.4;
        color: var(--muted);
      }

      .timeline-desc {
        font-family: var(--font-body);
        font-size: var(--body-md);
        line-height: 1.5;
        color: var(--text-variant);
        margin: 0;
      }
    }
  }

  /* OSS */
  .oss-cards {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 32px;
  }

  .oss-card {
    display: block;
    padding: 16px;
    background: var(--surface-charcoal);
    border: 1px solid var(--border);
    border-radius: 8px;
    text-decoration: none;
    transition: border-color 0.2s;
    box-shadow: inset 0 1px 1px 0 rgba(255, 255, 255, 0.05);

    &:hover {
      border-color: rgba(189, 194, 255, 0.6);
    }

    .oss-card-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;

      .oss-repo {
        font-family: var(--font-body);
        font-size: var(--body-md);
        font-weight: 500;
        line-height: 1.5;
        color: var(--text);
        margin: 0;
      }

      svg {
        color: var(--muted);
      }
    }

    &:hover .oss-repo {
      color: var(--accent);
    }

    .oss-desc {
      font-family: var(--font-body);
      font-size: 13px;
      line-height: 1.5;
      color: var(--text-variant);
      margin: 0 0 4px;
    }

    .oss-badge {
      font-family: var(--font-mono);
      font-size: 11px;
      line-height: 1;
      color: var(--muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
  }

  .oss-all-link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-family: var(--font-mono);
    font-size: var(--caption);
    line-height: 1.4;
    color: var(--accent);
    text-decoration: none;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  /* Writing */
  .post-list {
    display: flex;
    flex-direction: column;
  }

  .post-item {
    display: block;
    padding: 32px 0;
    text-decoration: none;
    transition: padding-left 0.2s;

    &:not(:last-child) {
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }

    &:hover {
      padding-left: 16px;

      .post-title {
        color: var(--accent);
      }
    }

    @media (min-width: 768px) {
      display: flex;
      gap: 16px;
      align-items: baseline;
    }
  }

  .post-date {
    font-family: var(--font-mono);
    font-size: var(--label-mono);
    line-height: 1;
    color: var(--muted);
    flex-shrink: 0;
    min-width: 120px;
    display: block;
    margin-bottom: 8px;

    @media (min-width: 768px) {
      margin-bottom: 0;
    }
  }

  .post-content {
    flex-grow: 1;
  }

  .post-title {
    font-family: var(--font-display);
    font-size: var(--headline-md);
    font-weight: 500;
    line-height: 1.3;
    color: var(--text);
    margin: 0 0 12px;
    transition: color 0.2s;
  }

  .post-excerpt {
    font-family: var(--font-body);
    font-size: var(--body-md);
    line-height: 1.5;
    color: var(--text-variant);
    margin: 0 0 16px;
  }

  .post-tags {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .post-tag {
    padding: 2px 8px;
    background: var(--surface-container-low);
    border: 1px solid var(--border);
    border-radius: 4px;
    font-family: var(--font-mono);
    font-size: 11px;
    line-height: 1.4;
    color: var(--accent-2);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
</style>
