<script lang="ts">
  import { theme } from '$lib/stores/theme';

  function toggleTheme() {
    if ($theme === 'auto') {
      theme.set('light');
    } else if ($theme === 'light') {
      theme.set('dark');
    } else {
      theme.set('auto');
    }
  }
</script>

<noscript>
  <style>
    .theme-toggle {
      display: none !important;
    }
  </style>
</noscript>

<button
  class="theme-toggle"
  title="Toggle between light and dark theme"
  data-theme={$theme}
  on:click={toggleTheme}
>
  <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24">
    <mask id="moon">
      <rect x="0" y="0" width="100%" height="100%" fill="white" />
      <circle cx="40" cy="8" r="11" fill="black" />
    </mask>
    <circle id="sun" cx="12" cy="12" r="11" mask="url(#moon)" />
    <g id="sun-beams">
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </g>
  </svg>
</button>

<style lang="scss">
  .theme-toggle {
    height: 18px;
    padding: 0;
    appearance: none;
    border: none;
    background: none;
    cursor: pointer;
    display: flex;
    align-items: center;

    &:hover {
      #moon, #sun {
        fill: var(--accent);
      }
      #sun-beams {
        stroke: var(--accent);
      }
    }
  }

  #moon, #sun {
    fill: var(--muted);
    stroke: none;
    transition: fill 0.2s ease;
  }

  #sun {
    transition: all 0.5s var(--ease-4);
    transform-origin: center center;
  }

  #sun-beams {
    stroke: var(--muted);
    stroke-width: 2px;
    transform-origin: center center;
    transition: all 0.5s var(--ease-elastic-4), opacity 0.15s ease;
  }

  #moon > circle {
    transition: all 0.5s var(--ease-out-3);
  }

  @mixin light-icon {
    & #sun { transform: scale(0.5); }
    & #sun-beams { transform: rotateZ(0.25turn); }
  }

  @mixin dark-icon {
    & #moon > circle { transform: translateX(-20px); }
    & #sun-beams { opacity: 0; }
  }

  .theme-toggle:not([data-theme]) { @include light-icon; }

  [data-theme='auto'] {
    @media not all and (prefers-color-scheme: dark) { @include light-icon; }
    @media (prefers-color-scheme: dark) { @include dark-icon; }
  }

  [data-theme='light'] { @include light-icon; }
  [data-theme='dark'] { @include dark-icon; }
</style>
