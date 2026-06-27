<script lang="ts">
  import { title } from '$lib/data/meta';
  import type { BlogPost } from '$lib/utils/types';

  export let data: { posts: BlogPost[] };
  let { posts } = data;
</script>

<svelte:head>
  <title>Writing — {title}</title>
</svelte:head>

<section class="blog-hero">
  <div class="blog-hero-inner">
    <div class="badge-group">
      <span class="section-moniker">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
        06 — WRITING
      </span>
    </div>
    <h1 class="blog-title">Technical Logs</h1>
    <p class="blog-desc">Engineering case studies — real systems, honest results, production scars.</p>
  </div>
</section>

<div class="blog-layout">
  <div class="blog-feed">
    {#each posts as post}
      <a href="/{post.slug}" class="post-item">
        <span class="post-date">{post.date.slice(0, 10)}</span>
        <div class="post-body">
          <h2 class="post-title">{post.title}</h2>
          <p class="post-excerpt">{post.excerpt}</p>
          <div class="post-footer">
            <div class="post-tags">
              {#each post.tags?.slice(0, 3) as tag}
                <span class="post-tag">{tag}</span>
              {/each}
            </div>
          </div>
        </div>
      </a>
    {/each}
  </div>

  <aside class="blog-sidebar">
    <div class="sidebar-card">
      <h3 class="sidebar-card-title">Stay Updated</h3>
      <p class="sidebar-card-desc">Get notified when new engineering deep-dives land.</p>
      <input type="email" placeholder="your@email.com" class="sidebar-input" />
      <button class="sidebar-btn">Subscribe</button>
      <div class="sidebar-status">
        <span class="status-indicator"></span>
        <span>System Online · 842 Readers</span>
      </div>
    </div>

    <div class="sidebar-card sidebar-card-dashed">
      <h3 class="sidebar-card-title">RSS Feed</h3>
      <p class="sidebar-card-desc">Subscribe via any RSS reader.</p>
      <a href="/rss.xml" class="sidebar-link">Subscribe →</a>
    </div>

    <div class="sidebar-card sidebar-card-accent">
      <h3 class="sidebar-card-title">Live Stream</h3>
      <div class="sidebar-live">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <polygon points="5 3 19 12 5 21 5 3" fill="currentColor"/>
        </svg>
        <div>
          <p class="sidebar-live-desc">Watch me build edge AI systems live on Twitch.</p>
          <a href="https://twitch.tv/jaweed3" target="_blank" rel="noopener noreferrer" class="sidebar-link">Watch →</a>
        </div>
      </div>
    </div>
  </aside>
</div>

<style lang="scss">
  .blog-hero {
    padding: 128px var(--margin-mobile) 48px;
    max-width: var(--container-max);
    margin: 0 auto;

    @media (min-width: 768px) {
      padding: 128px var(--margin-desktop) 48px;
    }

    .blog-hero-inner {
      max-width: 896px;
    }

    .section-moniker {
      display: inline-block;
      padding: 4px 12px;
      background: var(--surface-container-high);
      border-radius: 999px;
      font-family: var(--font-mono);
      font-size: var(--label-mono);
      line-height: 1;
      letter-spacing: 0.05em;
      color: var(--accent);
      margin-bottom: 16px;
      display: inline-flex;
      align-items: center;
      gap: 6px;

      svg {
        width: 18px;
        height: 18px;
      }
    }

    .blog-title {
      font-family: var(--font-display);
      font-size: var(--headline-lg-mobile);
      font-weight: 600;
      letter-spacing: -0.01em;
      line-height: 1.2;
      color: var(--text);
      margin: 0 0 12px;

      @media (min-width: 768px) {
        font-size: var(--headline-lg);
        letter-spacing: -0.02em;
        line-height: 1.1;
      }
    }

    .blog-desc {
      font-family: var(--font-body);
      font-size: var(--body-lg);
      line-height: 1.6;
      color: var(--text-variant);
      margin: 0;
    }
  }

  .blog-layout {
    max-width: var(--container-max);
    margin: 0 auto;
    padding: 0 var(--margin-mobile) 96px;
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--gutter);

    @media (min-width: 768px) {
      padding: 0 var(--margin-desktop) 96px;
      grid-template-columns: 8fr 4fr;
    }
  }

  .blog-feed {
    display: flex;
    flex-direction: column;
  }

  .post-item {
    display: block;
    padding: 32px 0;
    text-decoration: none;
    transition: all 0.2s;

    &:not(:last-child) {
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }

    &:hover {
      padding-left: 16px;

      .post-title {
        color: var(--accent);
      }
    }

    @media (min-width: 768px) {
      display: flex;
      gap: 16px;
      align-items: baseline;
    }
  }

  .post-date {
    font-family: var(--font-mono);
    font-size: var(--label-mono);
    line-height: 1;
    color: var(--muted);
    flex-shrink: 0;
    min-width: 120px;
    display: block;
    margin-bottom: 8px;

    @media (min-width: 768px) {
      margin-bottom: 0;
    }
  }

  .post-body {
    flex-grow: 1;
  }

  .post-title {
    font-family: var(--font-display);
    font-size: var(--headline-md);
    font-weight: 500;
    line-height: 1.3;
    color: var(--text);
    margin: 0 0 12px;
    transition: color 0.2s;
  }

  .post-excerpt {
    font-family: var(--font-body);
    font-size: var(--body-md);
    line-height: 1.5;
    color: var(--text-variant);
    margin: 0 0 16px;
    max-width: 640px;
  }

  .post-footer {
    .post-tags {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .post-tag {
      padding: 2px 8px;
      background: var(--surface-container-low);
      border: 1px solid var(--border);
      border-radius: 4px;
      font-family: var(--font-mono);
      font-size: 11px;
      line-height: 1.4;
      color: var(--accent-2);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
  }

  .blog-sidebar {
    margin-top: 32px;

    @media (min-width: 768px) {
      margin-top: 0;
    }
  }

  .sidebar-card {
    padding: 24px;
    border-radius: 12px;
    background: rgba(8, 8, 8, 0.7);
    backdrop-filter: blur(12px);
    border: 1px solid var(--border);
    transition: border-color 0.3s, box-shadow 0.3s;
    margin-bottom: var(--gutter);

    &:hover {
      border-color: var(--accent);
      box-shadow: inset 0 0 20px rgba(94, 106, 210, 0.05);
    }

    &.sidebar-card-dashed {
      border-style: dashed;
    }

    &.sidebar-card-accent {
      border-color: rgba(189, 194, 255, 0.3);
    }

    .sidebar-card-title {
      font-family: var(--font-display);
      font-size: var(--headline-md);
      font-weight: 500;
      line-height: 1.3;
      color: var(--text);
      margin: 0 0 8px;
    }

    .sidebar-card-desc {
      font-family: var(--font-body);
      font-size: var(--body-md);
      line-height: 1.5;
      color: var(--text-variant);
      margin: 0 0 16px;
    }

    .sidebar-input {
      width: 100%;
      padding: 8px 16px;
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: 8px;
      color: var(--text);
      font-family: var(--font-mono);
      font-size: var(--body-md);
      line-height: 1.5;
      margin-bottom: 8px;
      box-sizing: border-box;

      &::placeholder {
        color: var(--muted);
      }
    }

    .sidebar-btn {
      width: 100%;
      padding: 8px;
      background: var(--primary-container);
      color: var(--on-primary);
      border: none;
      border-radius: 8px;
      font-family: var(--font-body);
      font-size: var(--body-md);
      font-weight: 700;
      line-height: 1.5;
      cursor: pointer;
      margin-bottom: 16px;
    }

    .sidebar-status {
      display: flex;
      align-items: center;
      gap: 8px;
      font-family: var(--font-mono);
      font-size: var(--caption);
      line-height: 1.4;
      color: var(--muted);

      .status-indicator {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--accent-2);
        animation: pulse 2s infinite;
      }
    }

    .sidebar-link {
      font-family: var(--font-mono);
      font-size: var(--caption);
      line-height: 1.4;
      color: var(--accent);
      text-decoration: none;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .sidebar-live {
      display: flex;
      gap: 12px;
      align-items: flex-start;

      svg {
        color: var(--accent-2);
        flex-shrink: 0;
      }

      .sidebar-live-desc {
        font-family: var(--font-body);
        font-size: var(--body-md);
        line-height: 1.5;
        color: var(--text-variant);
        margin: 0 0 8px;
      }
    }
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
</style>
