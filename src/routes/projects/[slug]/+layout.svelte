<script lang="ts">
  import type { Project } from '$lib/utils/types';
  import Header from '$lib/components/organisms/Header.svelte';
  import Footer from '$lib/components/organisms/Footer.svelte';
  import ExternalLinkIcon from '$lib/icons/external-link.svelte';
  import { siteBaseUrl } from '$lib/data/meta';

  export let data: { project: Project; prevProject: Project | null; nextProject: Project | null };
  const { project, prevProject, nextProject } = data;
</script>

<svelte:head>
  <title>{project.title} — Jawwad</title>
  <meta name="description" content={project.impact} />
  <meta property="og:title" content={project.title} />
  <meta property="og:description" content={project.impact} />
  <meta property="og:image" content={project.coverImage ? siteBaseUrl + project.coverImage : ''} />
  <meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<Header showBackground={true} />

<main>
  <div class="container">
    <nav class="breadcrumb">
      <a href="/projects">← Projects</a>
    </nav>

    <article>
      <header class="project-hero">
        <div class="hero-tags">
          {#each project.tags as tag, i}
            <span>{tag}{#if i < project.tags.length - 1}<span class="tag-sep"> · </span>{/if}</span>
          {/each}
        </div>

        <div class="hero-title-row">
          <h1>{project.title}</h1>
          {#if project.github}
            <a href={project.github} target="_blank" rel="noopener noreferrer" class="github-link">
              <ExternalLinkIcon /> GitHub →
            </a>
          {/if}
        </div>

        <div class="hero-rule"></div>

        <p class="hero-subtitle">{project.impact}</p>

        {#if project.stats && project.stats.length > 0}
          <div class="stat-grid">
            {#each project.stats as stat}
              <div class="stat-item">
                <span class="stat-number">{stat.value}</span>
                <span class="stat-label">{stat.label}</span>
              </div>
            {/each}
          </div>
        {/if}
      </header>

      <div class="project-body">
        <div class="content">
          <slot />
        </div>
      </div>

      {#if prevProject || nextProject}
        <nav class="project-nav">
          {#if prevProject}
            <a href="/projects/{prevProject.slug}" class="nav-link prev">
              <span class="nav-direction">← Previous</span>
              <span class="nav-title">{prevProject.title}</span>
              <span class="nav-desc">{prevProject.impact}</span>
            </a>
          {:else}
            <div></div>
          {/if}
          {#if nextProject}
            <a href="/projects/{nextProject.slug}" class="nav-link next">
              <span class="nav-direction">Next →</span>
              <span class="nav-title">{nextProject.title}</span>
              <span class="nav-desc">{nextProject.impact}</span>
            </a>
          {:else}
            <div></div>
          {/if}
        </nav>
      {/if}
    </article>
  </div>
</main>

<Footer />

<style lang="scss">
  @import '$lib/scss/breakpoints.scss';

  /* ── Breadcrumb ── */
  .breadcrumb {
    padding: 32px 0 0;

    a {
      font-family: var(--font-mono);
      font-size: 12px;
      color: var(--muted);
      text-decoration: none;
      transition: color 0.2s ease;

      &:hover {
        color: var(--text);
      }
    }
  }

  /* ── Hero ── */
  .project-hero {
    padding: 32px 0 48px;

    .hero-tags {
      font-family: var(--font-mono);
      font-size: 11px;
      letter-spacing: 0.12em;
      color: var(--muted);
      margin-bottom: 16px;
      text-transform: uppercase;
    }

    .hero-title-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 24px;

      h1 {
        margin: 0;
        font-size: clamp(48px, 7vw, 96px);
        flex: 1;
      }
    }

    .github-link {
      display: flex;
      align-items: center;
      gap: 6px;
      font-family: var(--font-mono);
      font-size: 12px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      text-decoration: none;
      padding: 8px 16px;
      border: 1px solid var(--border);
      color: var(--text);
      flex-shrink: 0;
      transition: all 0.2s ease;

      &:hover {
        border-color: var(--accent);
        color: var(--accent);

        :global(svg) {
          color: var(--accent);
        }
      }

      :global(svg) {
        width: 14px;
        transition: color 0.2s ease;
      }

      @include for-phone-only {
        font-size: 11px;
        padding: 6px 12px;
      }
    }

    .hero-rule {
      height: 1px;
      background: var(--border);
      margin: 24px 0;
    }

    .hero-subtitle {
      font-family: var(--font-body);
      font-size: 20px;
      color: var(--muted);
      line-height: 1.5;
      margin: 0;
      max-width: 680px;
    }
  }

  /* ── Stat Grid ── */
  .stat-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    border: 1px solid var(--border);
    margin-top: 40px;

    .stat-item {
      padding: 24px;
      border-right: 1px solid var(--border);

      &:last-child {
        border-right: none;
      }

      @include for-phone-only {
        padding: 16px;

        &:nth-child(even) {
          border-right: none;
        }
        &:nth-child(2) {
          border-right: 1px solid var(--border);
        }
      }
    }

    .stat-number {
      display: block;
      font-family: var(--font-display);
      font-size: 42px;
      color: var(--code);
      line-height: 1;
    }

    .stat-label {
      display: block;
      font-family: var(--font-mono);
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--muted);
      margin-top: 6px;
    }
  }

  /* ── Content Body ── */
  .project-body {
    padding-bottom: 80px;
  }

  :global(.content) {
    max-width: 680px;

    a {
      color: var(--accent);
      text-decoration: underline;
      text-underline-offset: 0.15em;

      &:hover {
        text-underline-offset: 0.3em;
      }
    }

    p {
      font-family: var(--font-body);
      font-size: 18px;
      line-height: 1.75;
      color: var(--text);
      margin: 1em 0;
    }

    h2 {
      font-family: var(--font-display);
      font-size: clamp(28px, 3vw, 42px);
      color: var(--text);
      margin-top: 72px;
      margin-bottom: 16px;
    }

    h3 {
      font-family: var(--font-body);
      font-size: 22px;
      font-weight: 600;
      color: var(--text);
      margin: 40px 0 8px;
    }

    ul {
      list-style: none;
      padding: 0;

      li {
        font-family: var(--font-body);
        font-size: 18px;
        padding: 10px 0 10px 20px;
        border-bottom: 1px solid var(--border);
        position: relative;
        line-height: 1.6;

        &::before {
          content: '◆';
          position: absolute;
          left: 0;
          color: var(--accent);
          font-size: 10px;
          top: 14px;
        }
      }
    }

    ol {
      li {
        font-family: var(--font-body);
        font-size: 18px;
        line-height: 1.6;
        color: var(--text);
        margin: 8px 0;
      }
    }

    pre {
      background: var(--surface);
      border: 1px solid var(--border);
      border-left: 3px solid var(--accent);
      padding: 24px;
      overflow-x: auto;
      font-family: var(--font-mono);
      font-size: 13px;
      line-height: 1.6;
      color: var(--code);
      margin: 32px 0;

      code {
        background: none;
        border: none;
        padding: 0;
        font-size: inherit;
        color: inherit;
      }
    }

    code {
      font-family: var(--font-mono);
      font-size: 0.85em;
    }

    code:not(pre code) {
      color: var(--code);
      background: var(--surface);
      padding: 2px 6px;
      border: 1px solid var(--border);
    }

    pre[class*="language-undefined"],
    code[class*="language-undefined"] {
      &::before {
        display: none;
      }
    }

    blockquote {
      border-left: 3px solid var(--accent);
      background: var(--surface);
      padding: 16px 20px;
      margin: 32px 0;

      p {
        margin: 0;
      }
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-family: var(--font-mono);
      font-size: 13px;
      margin: 40px 0;

      th {
        text-align: left;
        padding: 12px 16px;
        background: var(--surface);
        border: 1px solid var(--border);
        color: var(--accent);
        font-size: 11px;
        letter-spacing: 0.1em;
        text-transform: uppercase;
      }

      td {
        padding: 14px 16px;
        border: 1px solid var(--border);
        color: var(--text);
        font-family: var(--font-body);
        font-size: 16px;
        vertical-align: top;
      }

      tr:hover td {
        background: var(--surface);
      }
    }

    strong {
      color: var(--text);
      font-weight: 600;
    }

    hr {
      border: none;
      border-top: 1px solid var(--border);
      margin: 48px 0;
    }

    img {
      display: block;
      margin: 2rem auto;
      max-width: 100%;
      border: 2px solid var(--border);
    }
  }

  /* ── Prev/Next Navigation ── */
  .project-nav {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0;
    border: 1px solid var(--border);
    margin-bottom: 80px;
    transition: border-color 0.2s ease;

    @include for-phone-only {
      grid-template-columns: 1fr;
    }

    .nav-link {
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 32px;
      text-decoration: none;
      transition: all 0.2s ease;

      &.prev {
        border-right: 1px solid var(--border);
        @include for-phone-only {
          border-right: none;
          border-bottom: 1px solid var(--border);
        }
      }

      &:hover {
        border-color: var(--accent);

        .nav-title {
          color: var(--accent);
        }
      }

      .nav-direction {
        font-family: var(--font-mono);
        font-size: 11px;
        color: var(--muted);
        text-transform: uppercase;
        letter-spacing: 0.1em;
      }

      .nav-title {
        font-family: var(--font-display);
        font-size: 28px;
        color: var(--text);
        text-transform: uppercase;
        letter-spacing: -0.01em;
        line-height: 1.2;
        transition: color 0.2s ease;
      }

      .nav-desc {
        font-family: var(--font-body);
        font-size: 14px;
        color: var(--muted);
        line-height: 1.4;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .github-link,
    .project-nav .nav-link,
    .breadcrumb a,
    :global(.content a),
    :global(.content tr td) {
      transition: none;
    }
  }
</style>
