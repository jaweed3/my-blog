<script lang="ts">
  import Header from '$lib/components/organisms/Header.svelte';
  import Footer from '$lib/components/organisms/Footer.svelte';
  import Tag from '$lib/components/atoms/Tag.svelte';
  import dateformat from 'dateformat';

  import { keywords, siteBaseUrl, title } from '$lib/data/meta';
  import type { BlogPost } from '$lib/utils/types';
  import RelatedPosts from '$lib/components/organisms/RelatedPosts.svelte';
  import Image from '$lib/components/atoms/Image.svelte';

  export let data: { post: BlogPost };
  $: ({ post } = data);

  let metaKeywords = keywords;

  $: {
    if (post?.tags?.length) {
      metaKeywords = post.tags.concat(metaKeywords);
    }
    if (post?.keywords?.length) {
      metaKeywords = post.keywords.concat(metaKeywords);
    }
  }
</script>

<svelte:head>
  {#if post}
    <meta name="keywords" content={metaKeywords.join(', ')} />

    <meta name="description" content={post.excerpt} />
    <meta property="og:description" content={post.excerpt} />
    <meta name="twitter:description" content={post.excerpt} />
    <link rel="canonical" href="{siteBaseUrl}/{post.slug}" />

    <title>{post.title} - {title}</title>
    <meta property="og:title" content="{post.title} - {title}" />
    <meta name="twitter:title" content="{post.title} - {title}" />

    {#if post.coverImage}
      <meta property="og:image" content="{siteBaseUrl}{post.coverImage}" />
      <meta name="twitter:image" content="{siteBaseUrl}{post.coverImage}" />
    {/if}
  {/if}
</svelte:head>

<Header showBackground />

<main>
  <div class="container">
    <article id="article-content">
      <header class="article-header">
        {#if post}
          <div class="post-meta">
            <span class="post-date">{dateformat(post.date, 'UTC:dd mmmm yyyy')}</span>
            {#if post.readingTime}
              <span class="meta-sep">·</span>
              <span class="post-reading">{post.readingTime}</span>
            {/if}
          </div>
          <h1>{post.title}</h1>
          {#if post.updated}
            <div class="post-updated">Updated {dateformat(post.updated, 'UTC:dd mmmm yyyy')}</div>
          {/if}
          {#if post.tags?.length}
            <div class="tags">
              {#each post.tags as tag}
                <Tag>{tag}</Tag>
              {/each}
            </div>
          {/if}
        {/if}
      </header>

      {#if post && post.coverImage}
        <figure class="cover-image">
          <Image src={post.coverImage} alt={post.title} />
        </figure>
      {/if}

      <div class="content">
        <slot />
      </div>
    </article>

    {#if post?.relatedPosts?.length > 0}
      <section class="related-section">
        <span class="section-label">Related</span>
        <RelatedPosts posts={post.relatedPosts} />
      </section>
    {/if}
  </div>
</main>

<Footer />

<style lang="scss">
  @import '$lib/scss/breakpoints.scss';

  #article-content {
    max-width: 720px;
    margin: 0 auto;
    padding: 48px 0 64px;

    .article-header {
      margin-bottom: 48px;

      .post-meta {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 12px;

        .post-date,
        .post-reading {
          font-family: var(--font-mono);
          font-size: 12px;
          color: var(--muted);
          letter-spacing: 0.05em;
        }

        .meta-sep {
          color: var(--muted);
        }
      }

      h1 {
        margin: 0 0 8px;
      }

      .post-updated {
        font-family: var(--font-mono);
        font-size: 11px;
        color: var(--muted);
        margin-bottom: 16px;
      }

      .tags {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-top: 16px;
      }
    }

    .cover-image {
      margin: 0 0 40px;
      border: 2px solid var(--border);

      :global(img) {
        width: 100%;
        max-height: 400px;
        object-fit: cover;
        display: block;
      }
    }
  }

  /* ── Content Body (Global Styling for {@html} slot) ── */
  :global(.content) {
    max-width: 720px;
    margin: 0 auto;
  }

  :global(.content a) {
    color: var(--accent);
    text-decoration: underline;
    text-underline-offset: 0.15em;
  }

  :global(.content a:hover) {
    text-underline-offset: 0.3em;
  }

  :global(.content p) {
    font-family: var(--font-body);
    font-size: 18px;
    line-height: 1.75;
    color: var(--text);
    margin: 1em 0;
  }

  :global(.content h2) {
    font-family: var(--font-display);
    font-size: clamp(28px, 3vw, 42px);
    color: var(--text);
    margin-top: 64px;
    margin-bottom: 16px;
  }

  :global(.content h3) {
    font-family: var(--font-body);
    font-size: 22px;
    font-weight: 600;
    color: var(--text);
    margin-top: 40px;
    margin-bottom: 8px;
  }

  :global(.content ul) {
    list-style: none;
    padding: 0;
  }

  :global(.content ul li) {
    font-family: var(--font-body);
    font-size: 18px;
    padding: 10px 0 10px 20px;
    border-bottom: 1px solid var(--border);
    position: relative;
    line-height: 1.6;
  }

  :global(.content ul li::before) {
    content: '◆';
    position: absolute;
    left: 0;
    color: var(--accent);
    font-size: 10px;
    top: 14px;
  }

  :global(.content ol li) {
    font-family: var(--font-body);
    font-size: 18px;
    line-height: 1.6;
    color: var(--text);
    margin: 8px 0;
  }

  :global(.content pre) {
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
  }

  :global(.content pre code) {
    background: none;
    border: none;
    padding: 0;
    font-size: inherit;
    color: inherit;
  }

  :global(.content code) {
    font-family: var(--font-mono);
    font-size: 0.85em;
  }

  :global(.content code:not(pre code)) {
    color: var(--code);
    background: var(--surface);
    padding: 2px 6px;
    border: 1px solid var(--border);
  }

  :global(.content blockquote) {
    border-left: 3px solid var(--accent);
    background: var(--surface);
    padding: 16px 20px;
    margin: 32px 0;
  }

  :global(.content blockquote p) {
    margin: 0;
  }

  :global(.content table) {
    width: 100%;
    border-collapse: collapse;
    font-family: var(--font-mono);
    font-size: 13px;
    margin: 40px 0;
  }

  :global(.content th) {
    text-align: left;
    padding: 12px 16px;
    background: var(--surface);
    border: 1px solid var(--border);
    color: var(--accent);
    font-size: 11px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  :global(.content td) {
    padding: 14px 16px;
    border: 1px solid var(--border);
    color: var(--text);
    font-family: var(--font-body);
    font-size: 16px;
    vertical-align: top;
  }

  :global(.content tr:hover td) {
    background: var(--surface);
  }

  :global(.content strong) {
    color: var(--text);
    font-weight: 600;
  }

  :global(.content hr) {
    border: none;
    border-top: 1px solid var(--border);
    margin: 48px 0;
  }

  :global(.content img) {
    display: block;
    margin: 2rem auto;
    max-width: 100%;
    border: 2px solid var(--border);
  }

  /* ── Related Posts ── */
  .related-section {
    border-top: 1px solid var(--border);
    padding-top: 48px;
    margin-bottom: 64px;

    .section-label {
      display: block;
      font-family: var(--font-mono);
      font-size: 11px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--muted);
      margin-bottom: 24px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .content :global(a),
    .content :global(tr:hover td) {
      transition: none;
    }
  }
</style>
