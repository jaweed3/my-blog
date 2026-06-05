<script lang="ts">
  import { HttpRegex } from '$lib/utils/regex';

  export let color: 'primary' | 'secondary' = 'primary';
  export let style: 'solid' | 'understated' | 'clear' = 'solid';
  export let size: 'small' | 'medium' | 'large' = 'medium';
  export let href: string | undefined = undefined;
  export let additionalClass: string | undefined = undefined;

  const isExternalLink = !!href && HttpRegex.test(href);
  export let target: '_self' | '_blank' = isExternalLink ? '_blank' : '_self';
  export let rel = isExternalLink ? 'noopener noreferrer' : undefined;

  $: tag = href ? 'a' : 'button';
  $: linkProps = { href, target, rel };
</script>

<svelte:element
  this={tag}
  {...linkProps}
  class={['button', `style--${style}`, `size--${size}`, `color--${color}`, additionalClass].join(' ')}
  data-sveltekit-preload-data
  on:click
  {...$$restProps}
>
  {#if $$slots['icon']}
    <div class="icon">
      <slot name="icon" />
    </div>
  {/if}
  <slot />
</svelte:element>

<style lang="scss">
  .button {
    appearance: none;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    border: 1px solid var(--border);
    font-family: var(--font-mono);
    font-size: 12px;
    letter-spacing: 0.1em;
    text-transform: uppercase;

    &.color--primary {
      background: var(--accent);
      color: var(--bg);
      border-color: var(--accent);
      &:hover {
        background: transparent;
        color: var(--accent);
      }
    }

    &.color--secondary {
      background: transparent;
      color: var(--muted);
      &:hover {
        border-color: var(--accent);
        color: var(--accent);
      }
    }

    &.style--understated {
      background: var(--surface);
      color: var(--text);
      &:hover {
        border-color: var(--accent);
        color: var(--accent);
      }
    }

    &.style--clear {
      background: transparent;
      color: var(--muted);
      border: none;
      &:hover {
        color: var(--accent);
      }
    }

    &.size--small { padding: 4px 10px; }
    &.size--medium { padding: 8px 16px; }
    &.size--large { padding: 12px 24px; font-size: 14px; }
  }
</style>
