<script lang="ts">
  export let id: string | undefined = undefined;
  export let title: string | undefined = undefined;
  export let description: string | undefined = undefined;
  export let align: 'left' | 'top' | 'right' = 'top';
</script>

<section {id} class="content-section {align}">
  <div class="title-area">
    {#if title || description}
      <div class="text">
        {#if title}
          <h2>{title}</h2>
        {/if}
        {#if description}
          <p class="section-desc">{description}</p>
        {/if}
      </div>
    {/if}
    {#if $$slots['button']}
      <div class="button">
        <slot name="button" />
      </div>
    {/if}
  </div>
  <div class="content-area">
    <slot />
  </div>
</section>

<style lang="scss">
  @import '../../scss/breakpoints.scss';

  .content-section {
    display: flex;
    flex-direction: column;
    gap: 32px;
    padding: min(80px, 8vw) 0;

    .title-area {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      gap: 24px;

      @include for-phone-only {
        flex-direction: column;
        align-items: flex-start;
      }

      .text {
        h2 {
          margin: 0;
        }

        .section-desc {
          font-family: var(--font-body);
          font-size: 18px;
          color: var(--muted);
          line-height: 1.6;
          margin: 8px 0 0;
          max-width: 560px;
        }
      }
    }

    .content-area {
      width: 100%;
    }
  }
</style>
