<script lang="ts">
  import type { Project } from '$lib/utils/types';
  import Header from '$lib/components/organisms/Header.svelte';
  import Footer from '$lib/components/organisms/Footer.svelte';
  import { title, siteBaseUrl } from '$lib/data/meta';

  export let data: { projects: Project[] };
  const { projects } = data;

  let activeFilter = 'all';

  $: filtered = activeFilter === 'all'
    ? projects
    : projects.filter(p => p.tags.some(t => t.toLowerCase() === activeFilter));

  const filters = ['all', 'Edge AI', 'Computer Vision', 'Rust', 'Recommendation Systems', 'Production'];
</script>

<svelte:head>
  <title>Work — {title}</title>
  <meta name="description" content="Portfolio of Edge ML, MLOps, and embedded systems projects by Fatih Jawwad." />
  <meta property="og:description" content="Portfolio of Edge ML, MLOps, and embedded systems projects." />
  <meta property="og:title" content="Work — {title}" />
  <link rel="canonical" href="{siteBaseUrl}projects" />
</svelte:head>

<Header showBackground={true} />

<main>
  <div class="page-container">
    <section class="page-header">
      <div class="badge-group">
        <span class="section-moniker">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><path d="M8 21h8"/><path d="M12 17v4"/></svg>
          // WORK
        </span>
        <h1 class="page-title">All Projects</h1>
        <p class="page-desc">Real AI systems that solve real problems — from edge deployment to production MLOps.</p>
      </div>
    </section>

    <div class="filters">
      {#each filters as filter}
        <button
          class="filter-chip"
          class:active={activeFilter === filter}
          on:click={() => activeFilter = filter}>
          {filter === 'all' ? 'All' : filter}
        </button>
      {/each}
    </div>

    <div class="projects-grid">
      {#each filtered as project}
        <a href="/projects/{project.slug}" class="project-card">
          <div class="card-header">
            <div class="card-tags">
              {#each project.tags.slice(0, 2) as tag}
                <span class="card-tag">{tag}</span>
              {/each}
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="card-arrow">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </div>
          <h3 class="card-title">{project.title}</h3>
          <p class="card-desc">{project.excerpt}</p>
          <div class="card-footer">
            <div class="card-tech">
              {#each project.stats?.slice(0, 2) as stat}
                <span class="card-stat">{stat.value} {stat.label}</span>
              {/each}
            </div>
          </div>
        </a>
      {/each}
    </div>

    <!-- System Status -->
    <section class="status-section">
      <span class="section-moniker">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        ACTIVE_METRICS
      </span>
      <div class="status-grid">
        <div class="status-item">
          <span class="status-value">08</span>
          <span class="status-label">Projects Shipped</span>
        </div>
        <div class="status-item">
          <span class="status-value">165+</span>
          <span class="status-label">Daily Active Users</span>
        </div>
        <div class="status-item">
          <span class="status-value">03</span>
          <span class="status-label">OSS PRs Merged</span>
        </div>
      </div>
    </section>
  </div>
</main>

<Footer />

<style lang="scss">
  .page-container {
    max-width: var(--container-max);
    margin: 0 auto;
    padding: 0 var(--margin-mobile) 80px;

    @media (min-width: 768px) {
      padding: 0 var(--margin-desktop) 80px;
    }
  }

  .page-header {
    padding: 128px 0 48px;

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

    .page-title {
      font-family: var(--font-display);
      font-size: var(--headline-lg-mobile);
      font-weight: 600;
      letter-spacing: -0.01em;
      line-height: 1.2;
      margin: 8px 0 12px;

      @media (min-width: 768px) {
        font-size: var(--headline-lg);
        letter-spacing: -0.02em;
        line-height: 1.1;
      }
    }

    .page-desc {
      font-family: var(--font-body);
      font-size: var(--body-lg);
      line-height: 1.6;
      color: var(--muted);
      max-width: 560px;
      margin: 0;
    }
  }

  .filters {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    margin-bottom: 48px;
  }

  .filter-chip {
    padding: 8px 16px;
    border-radius: 999px;
    border: 1px solid var(--border);
    background: transparent;
    color: var(--text-variant);
    font-family: var(--font-mono);
    font-size: var(--label-mono);
    line-height: 1;
    letter-spacing: 0.05em;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      border-color: var(--accent);
      color: var(--accent);
    }

    &.active {
      background: var(--primary-container);
      color: var(--on-primary-container);
      border-color: var(--primary-container);
    }
  }

  .projects-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--gutter);

    @media (min-width: 768px) {
      grid-template-columns: repeat(2, 1fr);
    }
    @media (min-width: 1024px) {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  .project-card {
    display: flex;
    flex-direction: column;
    padding: var(--gutter);
    background: var(--surface-charcoal);
    border: 1px solid var(--border);
    border-radius: 8px;
    text-decoration: none;
    position: relative;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(189, 194, 255, 0.3), transparent);
      transform: translateX(-100%);
      transition: transform 0.5s ease;
    }

    &:hover {
      border-color: var(--accent);
      box-shadow: inset 0 0 20px rgba(94, 106, 210, 0.05);
      transform: translateY(-2px);

      &::before {
        transform: translateX(100%);
      }

      .card-title {
        color: var(--accent);
      }
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 16px;

      .card-tags {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }

      .card-tag {
        padding: 4px 8px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid var(--border);
        border-radius: 4px;
        font-family: var(--font-mono);
        font-size: 10px;
        line-height: 1;
        color: var(--muted);
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .card-arrow {
        color: var(--muted);
        flex-shrink: 0;
      }
    }

    .card-title {
      font-family: var(--font-display);
      font-size: var(--headline-md);
      font-weight: 500;
      line-height: 1.3;
      color: var(--text);
      margin: 0 0 8px;
      transition: color 0.2s;
    }

    .card-desc {
      font-family: var(--font-body);
      font-size: var(--body-md);
      line-height: 1.5;
      color: var(--text-variant);
      margin: 0 0 24px;
      flex-grow: 1;
    }

    .card-footer {
      margin-top: auto;
      padding-top: 16px;
      border-top: 1px solid var(--border);

      .card-tech {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      .card-stat {
        font-family: var(--font-mono);
        font-size: 10px;
        line-height: 1;
        color: var(--muted);
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
    }
  }

  .status-section {
    margin-top: 128px;
    border: 1px solid var(--border);
    padding: var(--gutter);
    border-radius: 8px;
    background: var(--surface-charcoal);

    .section-moniker {
      font-family: var(--font-mono);
      font-size: var(--label-mono);
      line-height: 1;
      letter-spacing: 0.05em;
      color: var(--accent);
      text-transform: uppercase;
      display: block;
      margin-bottom: 24px;
    }
  }

  .status-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--gutter);

    .status-item {
      display: flex;
      flex-direction: column;
      gap: 4px;

      .status-value {
        font-family: var(--font-display);
        font-size: var(--headline-lg-mobile);
        font-weight: 600;
        letter-spacing: -0.01em;
        line-height: 1.2;
        color: var(--accent);
      }

      .status-label {
        font-family: var(--font-mono);
        font-size: var(--caption);
        line-height: 1.4;
        color: var(--muted);
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
    }
  }
</style>
