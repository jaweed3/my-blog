<section id="hero">
  <div class="hero-top">
    <span class="section-label">[01 — About]</span>
    <span class="availability-badge">Available</span>
  </div>

  <h1 class="hero-name">Fatih<br />Jawwad</h1>

  <div class="hero-rule"></div>

  <p class="hero-title">Machine Learning Engineer</p>

  <p class="hero-desc">
    I design and deploy AI systems that work in production — from edge devices to cloud infrastructure.
    Specializing in edge ML, model optimization, and MLOps.
  </p>

  <div class="stats-grid">
    <div class="stat">
      <span class="stat-number">3</span>
      <span class="stat-label">OSS PRs Merged</span>
    </div>
    <div class="stat">
      <span class="stat-number">8</span>
      <span class="stat-label">Projects Shipped</span>
    </div>
    <div class="stat">
      <span class="stat-number">165+</span>
      <span class="stat-label">Daily Active Users</span>
    </div>
  </div>

  <nav class="hero-links">
    <a href="/projects">Work ↓</a>
    <a href="/blog">Blog ↓</a>
    <a href="/Fatih%20Jawwad%20Resume.pdf" target="_blank" rel="noopener noreferrer">Resume →</a>
    <a href="https://github.com/jaweed3" target="_blank" rel="noopener noreferrer">GitHub</a>
    <a href="https://linkedin.com/in/jaweed3" target="_blank" rel="noopener noreferrer">LinkedIn</a>
  </nav>
</section>

<style lang="scss">
  @import '$lib/scss/breakpoints.scss';

  #hero {
    padding: min(80px, 8vw) 0 min(60px, 6vw);

    .hero-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .availability-badge {
      font-family: var(--font-mono);
      font-size: 11px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      background: var(--accent-2);
      color: white;
      padding: 4px 12px;
    }

    .hero-name {
      font-family: var(--font-display);
      font-size: clamp(72px, 12vw, 140px);
      font-weight: 400;
      letter-spacing: -0.02em;
      text-transform: uppercase;
      line-height: 0.92;
      margin: 0 0 16px;
    }

    .hero-rule {
      width: 80px;
      height: 2px;
      background: var(--border);
      margin-bottom: 20px;
    }

    .hero-title {
      font-family: var(--font-body);
      font-size: clamp(20px, 2.5vw, 28px);
      font-weight: 600;
      color: var(--text);
      margin: 0 0 16px;
    }

    .hero-desc {
      font-family: var(--font-body);
      font-size: 18px;
      line-height: 1.7;
      color: var(--muted);
      max-width: 640px;
      margin: 0 0 32px;
    }

    .stats-grid {
      display: flex;
      gap: clamp(24px, 4vw, 48px);
      margin-bottom: 32px;
      flex-wrap: wrap;

      .stat {
        display: flex;
        flex-direction: column;
        gap: 2px;

        .stat-number {
          font-family: var(--font-display);
          font-size: clamp(36px, 5vw, 48px);
          color: var(--code);
          line-height: 1;
        }

        .stat-label {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--muted);
        }
      }
    }

    .hero-links {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      align-items: center;

      a {
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
    }
  }
</style>
