<script lang="ts">
  import { title } from '$lib/data/meta';
  import type { BlogPost } from '$lib/utils/types';
  import dateformat from 'dateformat';

  export let data: { posts: BlogPost[] };
  let { posts } = data;
</script>

<svelte:head>
  <title>Blog — {title}</title>
</svelte:head>

<div class="container">
  <section class="page-header">
    <span class="section-label">Blog</span>
    <h1>All Posts</h1>
    <p class="page-subtitle">
      Engineering case studies — real systems, honest results, production scars.
    </p>
  </section>

  <div class="posts-index">
    {#each posts as post, i}
      <a href="/{post.slug}" class="post-row">
        <span class="post-num">{String(i + 1).padStart(2, '0')}</span>
        <div class="post-info">
          <span class="post-title">{post.title}</span>
          <span class="post-meta-line">
            <span class="post-date">{dateformat(post.date, 'UTC:dd mmm yyyy')}</span>
            {#if post.readingTime}
              <span class="meta-sep">·</span>
              <span class="post-reading">{post.readingTime}</span>
            {/if}
          </span>
        </div>
        <span class="post-arrow">→</span>
      </a>
    {/each}
  </div>
</div>

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

  .posts-index {
    display: flex;
    flex-direction: column;
    padding-bottom: 80px;
  }

  .post-row {
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

      .post-title {
        color: var(--accent);
      }
      .post-arrow {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @include for-phone-only {
      gap: 12px;
    }

    .post-num {
      font-family: var(--font-mono);
      font-size: 11px;
      color: var(--muted);
      min-width: 28px;
    }

    .post-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;

      .post-title {
        font-family: var(--font-display);
        font-size: clamp(20px, 2.5vw, 28px);
        text-transform: uppercase;
        letter-spacing: -0.01em;
        color: var(--text);
        transition: color 0.2s ease;
      }

      .post-meta-line {
        font-family: var(--font-mono);
        font-size: 12px;
        color: var(--muted);
        display: flex;
        align-items: center;
        gap: 6px;

        .meta-sep {
          color: var(--muted);
        }
      }
    }

    .post-arrow {
      font-family: var(--font-mono);
      font-size: 16px;
      color: var(--accent);
      opacity: 0;
      transform: translateX(-4px);
      transition: all 0.2s ease;
    }
  }
</style>
