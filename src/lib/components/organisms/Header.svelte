<script lang="ts">
  import Logo from '$lib/components/atoms/Logo.svelte';
  import ThemeToggle from '$lib/components/molecules/ThemeToggle.svelte';

  export let showBackground = false;
</script>

<header class:scrolled={showBackground}>
  <nav class="container">
    <a class="logo-link" href="/" aria-label="Home">
      <Logo />
    </a>
    <div class="links">
      <a href="/blog">Blog</a>
      <a href="/projects">Projects</a>
      <a href="/Fatih%20Jawwad%20Resume.pdf" target="_blank" rel="noopener noreferrer" class="resume-link">Resume →</a>
      <ThemeToggle />
    </div>
  </nav>
</header>

<style lang="scss">
  @import '$lib/scss/breakpoints.scss';

  header {
    padding: 24px 0;
    position: sticky;
    top: 0;
    z-index: 100;
    transition: background 0.2s ease;

    &.scrolled {
      background: var(--bg);
      border-bottom: 1px solid var(--border);
    }

    nav {
      display: flex;
      align-items: center;
      gap: 30px;
    }

    .logo-link {
      flex: 1;
      text-decoration: none;
    }

    .links {
      display: flex;
      align-items: center;
      gap: 20px;

      a {
        font-family: var(--font-mono);
        font-size: 13px;
        letter-spacing: 0.1em;
        text-decoration: none;
        color: var(--muted);
        transition: color 0.2s ease;

        &:hover {
          color: var(--accent);
        }
      }

      .resume-link {
        border: 1px solid var(--border);
        padding: 6px 12px;
        transition: all 0.2s ease;

        &:hover {
          background: var(--accent);
          color: var(--bg);
          border-color: var(--accent);
        }
      }

      @include for-phone-only {
        a:not(.resume-link) {
          display: none;
        }
      }
    }
  }
</style>
