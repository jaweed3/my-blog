<script lang="ts">
  import type { Project } from '$lib/utils/types';
  import Tag from '$lib/components/atoms/Tag.svelte';
  import Image from '$lib/components/atoms/Image.svelte';
  import Header from '$lib/components/organisms/Header.svelte';
  import Footer from '$lib/components/organisms/Footer.svelte';
  import ExternalLinkIcon from '$lib/icons/external-link.svelte';
  import { siteBaseUrl } from '$lib/data/meta';

  export let data: { project: Project };
  const { project } = data;
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
  <article class="container">
    <header class="project-header">
      <div class="meta">
        <div class="badges">
          {#each project.tags as tag}
            <Tag>{tag}</Tag>
          {/each}
        </div>
        <h1>{project.title}</h1>
        <p class="impact">{project.impact}</p>
        <div class="links">
          {#if project.github}
            <a href={project.github} target="_blank" rel="noopener noreferrer" class="link-btn">
              <ExternalLinkIcon /> Source
            </a>
          {/if}
          {#if project.demo}
            <a href={project.demo} target="_blank" rel="noopener noreferrer" class="link-btn">
              <ExternalLinkIcon /> Demo
            </a>
          {/if}
        </div>
      </div>
      {#if project.coverImage}
        <div class="cover">
          <Image src="/{project.coverImage}" alt={project.title} />
        </div>
      {/if}
    </header>

    <div class="problem-section">
      <div class="label accent">Problem</div>
      <p>{project.problem}</p>
    </div>

    {#if project.results && project.results.length > 0}
      <div class="results-section">
        <div class="label green">Key Results</div>
        <div class="results-grid">
          {#each project.results as result}
            <div class="result-item">{result}</div>
          {/each}
        </div>
      </div>
    {/if}

    {#if project.outcome}
      <div class="outcome-section">
        <div class="label green">Outcome</div>
        <p>{project.outcome}</p>
      </div>
    {/if}

    <div class="tech-stack">
      <span class="label">Tech</span>
      {#each project.techStack as tech}
        <Tag color="secondary">{tech}</Tag>
      {/each}
    </div>

    <div class="content-divider"></div>

    <div id="article-content">
      <div class="content">
        <slot />
      </div>
    </div>

    <div class="back-nav">
      <a href="/projects">← All Projects</a>
    </div>
  </article>
</main>

<Footer />

<style lang="scss">
  @import '$lib/scss/breakpoints.scss';

  .project-header {
    display: grid;
    grid-template-columns: 1fr 380px;
    gap: 40px;
    align-items: start;
    padding: 40px 0;

    @include for-tablet-portrait-down {
      grid-template-columns: 1fr;
    }

    .meta {
      display: flex;
      flex-direction: column;
      gap: 12px;

      .badges {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }

      h1 {
        margin: 0;
      }

      .impact {
        font-family: var(--font-body);
        font-size: 18px;
        font-weight: 600;
        color: var(--text);
        line-height: 1.5;
        margin: 0;
      }

      .links {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;

        .link-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-mono);
          font-size: 12px;
          letter-spacing: 0.1em;
          text-decoration: none;
          padding: 8px 16px;
          border: 1px solid var(--border);
          color: var(--text);
          text-transform: uppercase;
          transition: all 0.2s;

          &:hover {
            border-color: var(--accent);
            color: var(--accent);
          }
        }
      }
    }

    .cover {
      border: 2px solid var(--border);
    }
  }

  .label {
    font-family: var(--font-mono);
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    margin-bottom: 8px;
    display: block;
    color: var(--muted);

    &.accent {
      color: var(--accent);
    }
    &.green {
      color: var(--code);
    }
  }

  .problem-section {
    border-left: 3px solid var(--accent);
    padding: 16px 20px;
    margin: 8px 0 24px;
    background: var(--surface);

    p {
      margin: 0;
      font-family: var(--font-body);
      font-size: 16px;
      line-height: 1.6;
      color: var(--text);
    }
  }

  .results-section {
    margin-bottom: 24px;

    .results-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;

      @include for-phone-only {
        grid-template-columns: 1fr;
      }

      .result-item {
        font-family: var(--font-body);
        font-size: 15px;
        line-height: 1.5;
        padding: 12px 16px;
        border: 1px solid var(--border);
        color: var(--text);
      }
    }
  }

  .outcome-section {
    border-left: 3px solid var(--code);
    padding: 16px 20px;
    margin-bottom: 24px;
    background: var(--surface);

    p {
      margin: 0;
      font-family: var(--font-body);
      font-size: 16px;
      line-height: 1.6;
      color: var(--text);
    }
  }

  .tech-stack {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    padding: 16px 0;
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    margin-bottom: 24px;

    .label {
      margin-bottom: 0;
      margin-right: 4px;
    }
  }

  .content-divider {
    height: 1px;
    background: var(--border);
    margin-bottom: 30px;
  }

  #article-content {
    .content {
      a {
        color: var(--accent);
        text-decoration: underline;
        text-underline-offset: 0.15em;

        &:hover {
          text-underline-offset: 0.3em;
        }
      }

      p {
        margin: 0.75rem 0;
        line-height: 1.65;
        font-size: 16px;
        color: var(--text);
      }

      h2 {
        margin: 2.5rem 0 0.5rem;
      }

      h3 {
        margin: 2rem 0 0.3rem;
      }

      img {
        display: block;
        margin: 2rem auto;
        max-width: 100%;
        border: 2px solid var(--border);
      }

      code {
        font-family: var(--font-mono);
        font-size: 0.9em;
      }

      code:not([class^='language-']) {
        background: var(--surface);
        padding: 3px 6px;
        border: 1px solid var(--border);
        color: var(--code);
      }

      blockquote {
        padding: 16px 20px;
        border-left: 3px solid var(--accent);
        background: var(--surface);
        margin: 1.5rem 0;

        p {
          margin: 0;
        }
      }

      pre {
        margin: 1.5rem 0;
        overflow-x: auto;
        border: 1px solid var(--border);
        background: var(--surface);
        padding: 16px;

        code {
          background: none;
          border: none;
          padding: 0;
        }
      }

      table {
        width: 100%;
        border-collapse: collapse;
        margin: 1.5rem 0;
        font-size: 0.9rem;
        border: 1px solid var(--border);

        th, td {
          padding: 10px 14px;
          border: 1px solid var(--border);
          text-align: left;
        }

        th {
          background: var(--surface);
          font-weight: 600;
          font-family: var(--font-mono);
          font-size: 12px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        tr:nth-child(even) td {
          background: var(--surface);
        }
      }
    }
  }

  .back-nav {
    margin-top: 4rem;
    padding-top: 20px;
    border-top: 1px solid var(--border);

    a {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-family: var(--font-mono);
      font-size: 13px;
      letter-spacing: 0.1em;
      color: var(--muted);
      text-decoration: none;
      text-transform: uppercase;

      &:hover {
        color: var(--accent);
      }
    }
  }
</style>
