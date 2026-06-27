<script>
  import Button from '$lib/components/atoms/Button.svelte';
  import Error from '$lib/icons/error.svelte';
</script>

<div class="error-page">
  <div class="container">
    <h1>404 — Page Not Found</h1>
    <div class="svg-wrapper">
      <Error />
    </div>
    <p>It seems like coffee was spilled all over this page, and now it can't be displayed.</p>
    <br />
    <Button href="/">Start over</Button>
  </div>
</div>

<style lang="scss">
  .error-page {
    position: relative;
    min-height: 80vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 0 var(--gutter);

    h1 {
      font-size: var(--headline-lg-mobile);
      color: var(--accent);

      @media (min-width: 768px) {
        font-size: var(--headline-lg);
      }
    }

    p {
      color: var(--muted);
      max-width: 480px;
    }

    .svg-wrapper {
      width: 300px;
      margin-top: -60px;
      margin-bottom: -30px;

      :global(svg) {
        filter: drop-shadow(2px 6px 0px rgba(0, 0, 0, 0.1));
      }
    }
  }
</style>
