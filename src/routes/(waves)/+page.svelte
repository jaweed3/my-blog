<script lang="ts">
  import Hero from '$lib/components/organisms/Hero.svelte';
  import About from '$lib/components/organisms/About.svelte';
  import ProjectsSection from '$lib/components/organisms/ProjectsSection.svelte';
  import type { BlogPost, Project } from '$lib/utils/types';

  export let data: { posts: BlogPost[]; projects: Project[] };
  const { posts, projects } = data;
</script>

<div class="container">
  <Hero />
  <About />

  {#if projects && projects.length > 0}
    <section id="featured-work" class="section-block">
      <span class="section-label">[02 — Work]</span>
      <ProjectsSection {projects} />
    </section>
  {/if}

  <section id="skills" class="section-block">
    <span class="section-label">[03 — Skills]</span>
    <h2>Capabilities</h2>
    <div class="skills-grid">
      <div class="skill-category">
        <span class="skill-category-label">Edge Deployment</span>
        <span class="skill-items">ONNX · TFLite · ESP32 · ARM · Apple Silicon</span>
      </div>
      <div class="skill-category">
        <span class="skill-category-label">Model Optimization</span>
        <span class="skill-items">INT8 Quantization · 1.58-bit Ternary · Pruning · ONNX Runtime</span>
      </div>
      <div class="skill-category">
        <span class="skill-category-label">ML Frameworks</span>
        <span class="skill-items">PyTorch · Burn (Rust) · InsightFace · YOLOv8</span>
      </div>
      <div class="skill-category">
        <span class="skill-category-label">Backend &amp; Infra</span>
        <span class="skill-items">FastAPI · Rust/Axum · Docker · MLflow · Prometheus</span>
      </div>
      <div class="skill-category">
        <span class="skill-category-label">Languages</span>
        <span class="skill-items">Python · Rust · C++ · SQL</span>
      </div>
    </div>
  </section>

  <section id="experience" class="section-block">
    <span class="section-label">[04 — Experience]</span>
    <h2>Timeline</h2>
    <div class="timeline">
      <div class="timeline-item">
        <span class="timeline-year">Sep 2025 – Feb 2026</span>
        <div class="timeline-content">
          <span class="timeline-role">Erasmus+ KA171 Exchange</span>
          <span class="timeline-org">Universidad de Sevilla, Spain</span>
          <p class="timeline-desc">Studied computer engineering abroad, focused on ML systems and embedded AI.</p>
        </div>
      </div>
      <div class="timeline-item">
        <span class="timeline-year">2024 – Present</span>
        <div class="timeline-content">
          <span class="timeline-role">Sole Technical Developer</span>
          <span class="timeline-org">UPT Perpustakaan UNIDA Gontor</span>
          <p class="timeline-desc">Designed and deployed PerpusGate — a face recognition library access system serving 165+ daily users in production.</p>
        </div>
      </div>
    </div>
  </section>

  <section id="opensource" class="section-block">
    <span class="section-label">[05 — Open Source]</span>
    <h2>Contributions</h2>
    <div class="oss-list">
      <div class="oss-item">
        <span class="oss-marker">✦</span>
        <div class="oss-content">
          <span class="oss-repo">burn-ml/burn</span>
          <span class="oss-desc">3 PRs merged — recommendation systems, tensor ops</span>
        </div>
      </div>
      <div class="oss-item">
        <span class="oss-marker">✦</span>
        <div class="oss-content">
          <span class="oss-repo">openvinotoolkit/openvino</span>
          <span class="oss-desc">PR #33935 — lax.gather JAX frontend (8/8 CPU tests)</span>
        </div>
      </div>
    </div>
    <a href="https://github.com/jaweed3" target="_blank" rel="noopener noreferrer" class="oss-link">View on GitHub →</a>
  </section>

  {#if posts && posts.length > 0}
    <section id="blog-posts" class="section-block">
      <span class="section-label">[06 — Writing]</span>
      <h2>Posts</h2>
      <div class="blog-list">
        {#each posts as post}
          <a href="/{post.slug}" class="blog-item">
            <span class="blog-date">{post.date.slice(0, 10)}</span>
            <span class="blog-title">{post.title}</span>
          </a>
        {/each}
      </div>
      <a href="/blog" class="blog-all-link">All posts →</a>
    </section>
  {/if}
</div>

<style lang="scss">
  @import '$lib/scss/breakpoints.scss';

  .section-block {
    padding: min(80px, 8vw) 0;
    border-top: 1px solid var(--border);

    h2 {
      margin: 0 0 24px;
    }
  }

  .skills-grid {
    display: flex;
    flex-direction: column;
    gap: 16px;

    .skill-category {
      display: flex;
      gap: 24px;
      align-items: baseline;
      padding: 12px 0;
      border-bottom: 1px solid var(--border);

      @include for-phone-only {
        flex-direction: column;
        gap: 4px;
      }

      .skill-category-label {
        font-family: var(--font-mono);
        font-size: 11px;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: var(--muted);
        min-width: 200px;
      }

      .skill-items {
        font-family: var(--font-body);
        font-size: 16px;
        color: var(--text);
        line-height: 1.5;
      }
    }
  }

  .timeline {
    display: flex;
    flex-direction: column;
    gap: 24px;

    .timeline-item {
      display: flex;
      gap: 24px;
      padding: 16px 0;
      border-bottom: 1px solid var(--border);

      @include for-phone-only {
        flex-direction: column;
        gap: 8px;
      }

      .timeline-year {
        font-family: var(--font-mono);
        font-size: 12px;
        color: var(--muted);
        min-width: 180px;
        flex-shrink: 0;
      }

      .timeline-content {
        display: flex;
        flex-direction: column;
        gap: 2px;

        .timeline-role {
          font-family: var(--font-body);
          font-size: 18px;
          font-weight: 600;
          color: var(--text);
        }

        .timeline-org {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--muted);
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .timeline-desc {
          font-family: var(--font-body);
          font-size: 15px;
          color: var(--muted);
          margin: 4px 0 0;
          line-height: 1.5;
        }
      }
    }
  }

  .oss-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 20px;

    .oss-item {
      display: flex;
      gap: 12px;
      align-items: baseline;

      .oss-marker {
        color: var(--accent);
        font-size: 16px;
      }

      .oss-content {
        display: flex;
        flex-direction: column;
        gap: 2px;

        .oss-repo {
          font-family: var(--font-mono);
          font-size: 14px;
          color: var(--text);
        }

        .oss-desc {
          font-family: var(--font-body);
          font-size: 14px;
          color: var(--muted);
        }
      }
    }
  }

  .oss-link {
    font-family: var(--font-mono);
    font-size: 13px;
    letter-spacing: 0.1em;
    text-decoration: none;
    color: var(--muted);
    transition: color 0.2s ease;

    &:hover {
      color: var(--accent);
    }
  }

  .blog-list {
    display: flex;
    flex-direction: column;

    .blog-item {
      display: flex;
      gap: 24px;
      align-items: baseline;
      padding: 10px 0;
      border-bottom: 1px solid var(--border);
      text-decoration: none;
      transition: all 0.2s ease;

      &:hover {
        .blog-title {
          color: var(--accent);
        }
      }

      .blog-date {
        font-family: var(--font-mono);
        font-size: 12px;
        color: var(--muted);
        min-width: 100px;
        flex-shrink: 0;
      }

      .blog-title {
        font-family: var(--font-body);
        font-size: 16px;
        color: var(--text);
        transition: color 0.2s ease;
      }
    }
  }

  .blog-all-link {
    display: inline-block;
    margin-top: 16px;
    font-family: var(--font-mono);
    font-size: 13px;
    letter-spacing: 0.1em;
    text-decoration: none;
    color: var(--muted);
    transition: color 0.2s ease;

    &:hover {
      color: var(--accent);
    }
  }
</style>
