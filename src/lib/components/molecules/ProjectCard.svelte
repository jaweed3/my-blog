<script lang="ts">
  import type { Project } from '$lib/utils/types';
  import Card from '$lib/components/atoms/Card.svelte';
  import Tag from '$lib/components/atoms/Tag.svelte';
  import Image from '../atoms/Image.svelte';

  export let project: Project;
</script>

<Card
  href="/projects/{project.slug}"
  additionalClass="project-card"
>
  <div class="image" slot="image" class:empty={!project.coverImage}>
    {#if project.coverImage}
      <Image src="/{project.coverImage}" alt={project.title} />
    {/if}
  </div>
  <div class="content" slot="content">
    <div class="impact">{project.impact}</div>
    <p>{project.excerpt}</p>
    {#if project.results && project.results.length > 0}
      <div class="results">
        {#each project.results.slice(0, 3) as result}
          <span class="result-chip">{result}</span>
        {/each}
      </div>
    {/if}
  </div>
  <div class="footer" slot="footer">
    <div class="tags">
      {#each project.tags.slice(0, 3) as tag}
        <Tag>{tag}</Tag>
      {/each}
    </div>
  </div>
</Card>

<style lang="scss">
  .content {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;

    .impact {
      font-family: var(--font--heading);
      font-size: 1.05rem;
      font-weight: 700;
      letter-spacing: -0.01em;
      line-height: 1.35;
    }

    p {
      color: var(--color--text-shade);
      font-size: 0.88rem;
      line-height: 1.45;
      margin: 0;
    }

    .results {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
      margin-top: 2px;

      .result-chip {
        font-size: 0.72rem;
        font-weight: 600;
        padding: 2px 8px;
        border-radius: 10px;
        background: rgba(var(--color--primary-rgb), 0.08);
        color: var(--color--primary);
        white-space: nowrap;
      }
    }
  }

  .image {
    position: relative;

    &.empty {
      display: none;
    }
  }

  .tags {
    display: flex;
    align-items: center;
    gap: 5px;
    flex-wrap: wrap;
  }

  .footer {
    margin-top: 16px;
  }

  :global(.project-card .image img) {
    object-fit: cover;
  }
</style>
