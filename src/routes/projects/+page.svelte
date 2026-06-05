<script lang="ts">
  import type { Project } from '$lib/utils/types';
  import Header from '$lib/components/organisms/Header.svelte';
  import Footer from '$lib/components/organisms/Footer.svelte';
  import { title } from '$lib/data/meta';

  export let data: { projects: Project[] };
  const { projects } = data;
</script>

<svelte:head>
  <title>Projects — {title}</title>
</svelte:head>

<Header showBackground={true} />

<main>
  <div class="container">
    <section class="page-header">
      <span class="section-label">Projects</span>
      <h1>All Work</h1>
      <p class="page-subtitle">
        Real AI systems that solve real problems — from edge deployment to production MLOps.
        Every project here shipped working code, not just concepts.
      </p>
    </section>

    <div class="projects-index">
      {#each projects as project, i}
        <a href="/projects/{project.slug}" class="project-row">
          <span class="project-num">{String(i + 1).padStart(2, '0')}</span>
          <div class="project-info">
            <span class="project-name">{project.title}</span>
            <span class="project-desc">{project.impact}</span>
          </div>
          <span class="project-arrow">→</span>
        </a>
      {/each}
    </div>
  </div>
</main>

<Footer />

<style lang="scss">
  @import '$lib/scss/breakpoints.scss';

  .page-header {
    padding: 48px 0 40px;

    h1 {
      margin: 8px 0 12px;
    }

    .page-subtitle {
      font-family: var(--font-body);
      font-size: 18px;
      color: var(--muted);
      line-height: 1.6;
      max-width: 560px;
    }
  }

  .projects-index {
    display: flex;
    flex-direction: column;
    padding-bottom: 80px;
  }

  .project-row {
    display: flex;
    align-items: center;
    gap: 24px;
    padding: 20px 0;
    border-bottom: 1px solid var(--border);
    text-decoration: none;
    transition: all 0.2s ease;

    &:hover {
      padding-left: 16px;
      border-left: 2px solid var(--accent);

      .project-name {
        color: var(--accent);
      }
      .project-arrow {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @include for-phone-only {
      gap: 12px;
    }

    .project-num {
      font-family: var(--font-mono);
      font-size: 11px;
      color: var(--muted);
      min-width: 28px;
    }

    .project-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2px;

      .project-name {
        font-family: var(--font-display);
        font-size: clamp(20px, 2.5vw, 28px);
        text-transform: uppercase;
        letter-spacing: -0.01em;
        color: var(--text);
        transition: color 0.2s ease;
      }

      .project-desc {
        font-family: var(--font-body);
        font-size: 15px;
        color: var(--muted);
        line-height: 1.4;
      }
    }

    .project-arrow {
      font-family: var(--font-mono);
      font-size: 16px;
      color: var(--accent);
      opacity: 0;
      transform: translateX(-4px);
      transition: all 0.2s ease;
    }
  }
</style>
