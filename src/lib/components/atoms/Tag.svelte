<script lang="ts">
  export let color: 'primary' | 'secondary' = 'primary';
</script>

<div class="tag {color}">
  <slot />
</div>

<style lang="scss">
  .tag {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    padding: 3px 10px;
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    width: fit-content;
    white-space: nowrap;
    border: 1px solid var(--border);

    &.primary {
      background: var(--surface);
      color: var(--text);
    }
    &.secondary {
      background: transparent;
      color: var(--muted);
      border-color: var(--border);
    }
  }
</style>
