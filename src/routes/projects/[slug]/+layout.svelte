<script lang="ts">
  import type { Project } from '$lib/utils/types';
  import Tag from '$lib/components/atoms/Tag.svelte';
  import Image from '$lib/components/atoms/Image.svelte';
  import Header from '$lib/components/organisms/Header.svelte';
  import Footer from '$lib/components/organisms/Footer.svelte';
  import BlogIcon from '$lib/icons/blog.svelte';
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
      <div class="label">Problem</div>
      <p>{project.problem}</p>
    </div>

    {#if project.results && project.results.length > 0}
      <div class="results-section">
        <div class="label">Key Results</div>
        <div class="results-grid">
          {#each project.results as result}
            <div class="result-item">{result}</div>
          {/each}
        </div>
      </div>
    {/if}

    <div class="tech-stack">
      <span class="label">Tech stack:</span>
      {#each project.techStack as tech}
        <Tag color="secondary">{tech}</Tag>
      {/each}
    </div>

    {#if project.outcome}
      <div class="outcome-section">
        <div class="label">Outcome</div>
        <p>{project.outcome}</p>
      </div>
    {/if}

    <div class="content-divider"></div>

    <div id="article-content">
      <div class="content">
        <slot />
      </div>
    </div>

    <div class="back-nav">
      <a href="/projects">
        <BlogIcon /> ← All Projects
      </a>
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
    align-items: center;
    padding: 40px 0 24px;

    @include for-tablet-portrait-down {
      grid-template-columns: 1fr;
    }

    .meta {
      display: flex;
      flex-direction: column;
      gap: 10px;

      .badges {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }

      h1 {
        font-size: 2rem;
        margin: 0;
      }

      .impact {
        color: var(--color--primary);
        font-size: 1.1rem;
        font-weight: 600;
        line-height: 1.45;
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
          font-size: 0.9rem;
          font-weight: 500;
          padding: 6px 14px;
          border-radius: 6px;
          border: 1px solid rgba(var(--color--primary-rgb), 0.2);
          color: var(--color--primary);
          text-decoration: none;
          transition: all 0.2s;

          &:hover {
            background: rgba(var(--color--primary-rgb), 0.06);
          }
        }
      }
    }

    .cover {
      border-radius: 8px;
      overflow: hidden;
      box-shadow: var(--image-shadow);
    }
  }

  .label {
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--color--text-shade);
    margin-bottom: 8px;
  }

  .problem-section {
    background: rgba(var(--color--yellow-rgb), 0.06);
    border-left: 3px solid var(--color--yellow);
    padding: 16px 20px;
    margin: 8px 0 20px;
    border-radius: 0 6px 6px 0;

    p {
      margin: 0;
      font-size: 0.95rem;
      line-height: 1.55;
      color: var(--color--text);
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
        font-size: 0.85rem;
        line-height: 1.4;
        padding: 10px 14px;
        border-radius: 6px;
        background: rgba(var(--color--primary-rgb), 0.06);
        border: 1px solid rgba(var(--color--primary-rgb), 0.1);
      }
    }
  }

  .tech-stack {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    padding: 16px 0;
    border-top: 1px solid rgba(var(--color--primary-rgb), 0.1);
    border-bottom: 1px solid rgba(var(--color--primary-rgb), 0.1);
    margin-bottom: 20px;

    .label {
      margin-bottom: 0;
      margin-right: 4px;
      font-size: 0.85rem;
      font-weight: 600;
      text-transform: none;
      letter-spacing: normal;
    }
  }

  .outcome-section {
    background: rgba(var(--color--primary-rgb), 0.04);
    border-left: 3px solid var(--color--primary);
    padding: 16px 20px;
    margin-bottom: 24px;
    border-radius: 0 6px 6px 0;

    p {
      margin: 0;
      font-size: 0.95rem;
      line-height: 1.55;
      color: var(--color--text);
    }
  }

  .content-divider {
    height: 1px;
    background: rgba(var(--color--primary-rgb), 0.1);
    margin-bottom: 30px;
  }

  #article-content {
    .content {
      a:not(.link-btn) {
        color: var(--color--primary);
        text-decoration: underline;
        text-underline-offset: 0.15em;

        &:hover {
          text-underline-offset: 0.3em;
        }
      }

      p {
        margin: 0.75rem 0;
        line-height: 1.55em;
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
        border-radius: 8px;
        box-shadow: var(--image-shadow);
      }

      code {
        font-family: var(--font--mono);
      }

      code:not([class^='language-']) {
        background: var(--color--code-inline-background);
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 0.9em;
      }

      blockquote {
        padding: 20px 25px 10px;
        border-radius: 6px;
        font-size: 1rem;
        border-left: 4px solid var(--color--primary);
        background: var(--color--callout-background);
        margin: 1.5rem 0;
      }

      pre {
        border-radius: 8px;
        margin: 1.5rem 0;
        overflow-x: auto;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        margin: 1.5rem 0;
        font-size: 0.9rem;

        th, td {
          padding: 8px 12px;
          border: 1px solid rgba(var(--color--primary-rgb), 0.15);
          text-align: left;
        }

        th {
          background: rgba(var(--color--primary-rgb), 0.06);
          font-weight: 600;
        }

        tr:nth-child(even) {
          background: rgba(var(--color--primary-rgb), 0.03);
        }
      }
    }
  }

  .back-nav {
    margin-top: 4rem;
    padding-top: 20px;
    border-top: 1px solid rgba(var(--color--primary-rgb), 0.1);

    a {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      color: var(--color--text-shade);
      text-decoration: none;
      font-size: 0.9rem;

      &:hover {
        color: var(--color--primary);
      }
    }
  }
</style>
