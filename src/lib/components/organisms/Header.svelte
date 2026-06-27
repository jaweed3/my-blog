<script lang="ts">
  import { page } from '$app/stores';

  export let showBackground = false;

  const navLinks = [
    { href: '/projects', label: 'Work' },
    { href: '/playground', label: 'Playground' },
    { href: '/roadmap', label: 'Roadmap' },
    { href: '/writing', label: 'Writing' },
  ];
</script>

<header class:scrolled={showBackground}>
  <div class="header-inner">
    <a href="/" class="logo" aria-label="Home">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="var(--accent)" stroke-width="1.5">
        <path d="M10 2L2 7v6l8 5 8-5V7l-8-5z"/><path d="M2 7l8 5 8-5"/><path d="M10 12v6"/>
      </svg>
      ARCHITECT_AI
    </a>
    <nav class="desktop-nav">
      {#each navLinks as link}
        <a href={link.href}
          class="nav-link"
          class:active={$page.url.pathname === link.href || ($page.url.pathname.startsWith(link.href + '/') && link.href !== '/')}>
          {link.label}
        </a>
      {/each}
      <a href="/resume" class="glass-btn">Resume</a>
    </nav>
  </div>
</header>

<!-- sidebar -->
<aside class="sidebar">
  <div class="sidebar-inner">
    <div class="sidebar-header">
      <h2 class="sidebar-title">ML Engineer</h2>
      <p class="sidebar-subtitle">Edge AI Specialist</p>
    </div>
    <nav class="sidebar-nav">
      {#each navLinks as link}
        <a href={link.href}
          class="sidebar-link"
          class:active={$page.url.pathname === link.href}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" stroke-width="1.5"/>
          </svg>
          {link.label}
        </a>
      {/each}
      <a href="/resume" class="sidebar-link"
        class:active={$page.url.pathname === '/resume'}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" stroke-width="1.5"/>
        </svg>
        Resume
      </a>
    </nav>
    <div class="sidebar-footer">
      <button class="download-cv">Download CV</button>
    </div>
  </div>
</aside>

<style lang="scss">
  header {
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 50;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(24px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    transition: all 0.2s;

    .header-inner {
      max-width: var(--container-max);
      margin: 0 auto;
      padding: 0 var(--margin-mobile);
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 72px;

      @media (min-width: 768px) {
        padding: 0 var(--margin-desktop);
      }
    }

    .logo {
      font-family: var(--font-mono);
      font-size: var(--label-mono);
      letter-spacing: 0.05em;
      line-height: 1;
      color: var(--accent);
      text-decoration: none;
      text-transform: uppercase;
      display: inline-flex;
      align-items: center;
      gap: 8px;

      svg {
        width: 20px;
        height: 20px;
      }
    }

    .desktop-nav {
      display: none;
      align-items: center;
      gap: 40px;

      @media (min-width: 768px) {
        display: flex;
      }

      .nav-link {
        font-family: var(--font-body);
        font-size: var(--body-md);
        font-weight: 500;
        color: var(--text-variant);
        text-decoration: none;
        transition: color 0.2s;

        &:hover {
          color: var(--accent);
        }

        &.active {
          color: var(--accent);
          font-weight: 700;
          border-bottom: 2px solid var(--accent);
          padding-bottom: 4px;
        }
      }

      .glass-btn {
        padding: 10px 28px;
        border-radius: 8px;
        font-family: var(--font-mono);
        font-size: var(--caption);
        font-weight: 500;
        line-height: 1;
        text-decoration: none;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--accent-2);
        background: rgba(0, 238, 252, 0.06);
        backdrop-filter: blur(12px);
        border: 1px solid rgba(0, 238, 252, 0.2);
        transition: all 0.2s;

        &:hover {
          background: rgba(0, 238, 252, 0.12);
          border-color: var(--accent-2);
        }
      }
    }
  }

  .sidebar {
    display: none;

    @media (min-width: 1024px) {
      display: flex;
      position: fixed;
      left: 0;
      top: 0;
      height: 100vh;
      width: 256px;
      border-right: 1px solid var(--border);
      background: var(--surface-charcoal);
      flex-direction: column;
      padding: var(--gutter);
      gap: 16px;
      z-index: 40;
      transform: translateX(-100%);
      transition: transform 0.5s ease-in-out;

      &:hover {
        transform: translateX(0);
      }
    }

    .sidebar-inner {
      display: flex;
      flex-direction: column;
      gap: 16px;
      height: 100%;
    }

    .sidebar-header {
      .sidebar-title {
        font-family: var(--font-display);
        font-size: var(--headline-md);
        font-weight: 500;
        color: var(--accent);
        margin: 0;
      }
      .sidebar-subtitle {
        font-family: var(--font-body);
        font-size: var(--body-md);
        color: var(--text-variant);
        margin: 0;
      }
    }

    .sidebar-nav {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .sidebar-link {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      color: var(--text-variant);
      text-decoration: none;
      border-radius: 8px;
      transition: all 0.2s;
      font-family: var(--font-body);
      font-size: var(--body-md);

      &:hover {
        background: var(--surface-container-low);
      }

      &.active {
        background: var(--surface-container-high);
        color: var(--accent-2);
      }
    }

    .sidebar-footer {
      margin-top: auto;

      .download-cv {
        width: 100%;
        padding: 12px;
        background: var(--surface-container-highest);
        border: 1px solid var(--border);
        color: var(--accent);
        border-radius: 8px;
        font-family: var(--font-mono);
        font-size: var(--label-mono);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        cursor: pointer;
        transition: background 0.2s;

        &:hover {
          background: var(--surface-container);
        }
      }
    }
  }
</style>
