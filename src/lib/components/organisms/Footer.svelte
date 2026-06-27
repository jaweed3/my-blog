<footer>
  <div class="footer-inner">
    <div class="footer-left">
      <div class="footer-logo">FATIH JAWWAD AL-MUMTAZ</div>
      <div class="footer-subtitle">COMPUTER ENGINEERING · UNIDA GONTOR · INDONESIA</div>
    </div>
    <div class="footer-links">
      <a href="https://github.com/jaweed3" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
        GitHub
      </a>
      <a href="https://linkedin.com/in/jaweed3" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
        LinkedIn
      </a>
      <a href="mailto:jawwad@architect-ai.com" aria-label="Email">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
        Email
      </a>
    </div>
    <div class="footer-copy">&copy; 2026 DEEP-TECH SYSTEMS. ALL RIGHTS RESERVED.</div>
  </div>
</footer>

<style lang="scss">
  footer {
    width: 100%;
    padding: 48px 0;
    background: var(--surface-black);
    border-top: 1px solid var(--border);

    .footer-inner {
      max-width: var(--container-max);
      margin: 0 auto;
      padding: 0 var(--margin-mobile);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 32px;

      @media (min-width: 768px) {
        padding: 0 var(--margin-desktop);
        flex-direction: row;
        justify-content: space-between;
        flex-wrap: wrap;
      }

      .footer-left {
        display: flex;
        flex-direction: column;
        gap: 8px;

        .footer-logo {
          font-family: var(--font-mono);
          font-size: var(--label-mono);
          line-height: 1;
          color: var(--text);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .footer-subtitle {
          font-family: var(--font-mono);
          font-size: var(--caption);
          line-height: 1.4;
          color: var(--muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
      }

      .footer-links {
        display: flex;
        gap: 32px;

        a {
          font-family: var(--font-mono);
          font-size: var(--label-mono);
          line-height: 1;
          color: var(--muted);
          text-decoration: none;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          opacity: 0.8;
          transition: opacity 0.2s, color 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 6px;

          svg {
            width: 14px;
            height: 14px;
          }

          &:hover {
            opacity: 1;
            color: var(--accent-2);
          }
        }
      }

      .footer-copy {
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
