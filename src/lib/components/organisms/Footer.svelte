<script>
  import Socials from '$lib/components/molecules/Socials.svelte';
</script>

<footer>
  <div class="container">
    <div class="footer-top">
      <div class="footer-brand">
        <span class="footer-name">FATIH JAWWAD AL-MUMTAZ</span>
        <span class="footer-desc">Computer Engineering · UNIDA Gontor · Ponorogo, Indonesia</span>
      </div>
      <Socials />
    </div>
    <div class="footer-bottom">
      <span class="footer-credit">Built with Svelte · Deployed on Vercel</span>
      <span class="footer-copy">© 2026</span>
    </div>
  </div>
</footer>

<style lang="scss">
  @import '$lib/scss/breakpoints.scss';

  footer {
    padding: 48px 0 32px;
    border-top: 1px solid var(--border);
    margin-top: 80px;

    .footer-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 32px;
      gap: 24px;

      @include for-phone-only {
        flex-direction: column;
        gap: 20px;
      }
    }

    .footer-brand {
      display: flex;
      flex-direction: column;
      gap: 4px;

      .footer-name {
        font-family: var(--font-mono);
        font-size: 12px;
        letter-spacing: 0.1em;
        color: var(--text);
        text-transform: uppercase;
      }

      .footer-desc {
        font-family: var(--font-mono);
        font-size: 11px;
        color: var(--muted);
      }
    }

    .footer-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 16px;
      border-top: 1px solid var(--border);

      font-family: var(--font-mono);
      font-size: 11px;
      color: var(--muted);

      @include for-phone-only {
        flex-direction: column;
        gap: 8px;
        align-items: flex-start;
      }
    }
  }
</style>
