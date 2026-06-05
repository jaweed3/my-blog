<script lang="ts">
  import type { Project } from '$lib/utils/types';

  export let project: Project;
</script>

<a href="/projects/{project.slug}" class="project-row">
  <div class="project-row-main">
    <span class="project-index">{String(project.slug).padStart(2, '0')}</span>
    <span class="project-title">{project.title}</span>
    <span class="project-tags">{project.tags.slice(0, 2).join(' · ')}</span>
    <span class="project-arrow">→</span>
  </div>
  <p class="project-excerpt">{project.excerpt}</p>
</a>

<style lang="scss">
  .project-row {
    display: block;
    text-decoration: none;
    padding: 16px 0;
    border-bottom: 1px solid var(--border);
    transition: all 0.2s ease;
    position: relative;

    &:hover {
      padding-left: 16px;
      border-left: 2px solid var(--accent);

      .project-title {
        color: var(--accent);
      }
      .project-arrow {
        opacity: 1;
        transform: translateX(0);
      }
    }
  }

  @import '$lib/scss/breakpoints.scss';

  .project-row-main {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 4px;

    .project-index {
      font-family: var(--font-mono);
      font-size: 11px;
      color: var(--muted);
      min-width: 28px;
    }

    .project-title {
      font-family: var(--font-display);
      font-size: clamp(18px, 2vw, 24px);
      text-transform: uppercase;
      letter-spacing: -0.01em;
      color: var(--text);
      transition: color 0.2s ease;
      flex: 1;
    }

    .project-tags {
      font-family: var(--font-mono);
      font-size: 11px;
      letter-spacing: 0.05em;
      color: var(--muted);
      text-transform: uppercase;

      @include for-phone-only {
        display: none;
      }
    }

    .project-arrow {
      font-family: var(--font-mono);
      font-size: 14px;
      color: var(--accent);
      opacity: 0;
      transform: translateX(-4px);
      transition: all 0.2s ease;
    }
  }

  .project-excerpt {
    font-family: var(--font-body);
    font-size: 15px;
    color: var(--muted);
    margin: 0;
    padding-left: 44px;
    line-height: 1.5;

    @include for-phone-only {
      padding-left: 0;
      font-size: 14px;
    }
  }
</style>
