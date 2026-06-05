<script>
  import TelegramIcon from '$lib/icons/socials/telegram.svelte';
  import GitHubIcon from '$lib/icons/socials/github.svelte';
  import LinkedInIcon from '$lib/icons/socials/linkedin.svelte';
  import EmailIcon from '$lib/icons/socials/email.svelte';
</script>

<div class="socials">
  <a href="https://github.com/jaweed3" target="_blank" rel="noopener noreferrer" title="GitHub">
    <GitHubIcon />
  </a>
  <a href="https://linkedin.com/in/jaweed3" target="_blank" rel="noopener noreferrer" title="LinkedIn">
    <LinkedInIcon />
  </a>
  <a href="https://t.me/jaweed3" target="_blank" rel="noopener noreferrer" title="Telegram">
    <TelegramIcon />
  </a>
  <a href="mailto:me@jaweed.site" title="Email">
    <EmailIcon />
  </a>
</div>

<style lang="scss">
  .socials {
    display: flex;
    align-items: center;
    gap: 16px;

    a {
      transition: color 0.2s ease;
      width: 20px;
      color: var(--muted);
      fill: var(--muted);

      &:hover {
        color: var(--accent);
        fill: var(--accent);
      }
    }
  }
</style>
