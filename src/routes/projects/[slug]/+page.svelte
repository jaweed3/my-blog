<script lang="ts">
  import { page } from '$app/stores';

  $: project = $page.data.project;
</script>

<svelte:head>
  <title>{project?.title || 'Project'} — Jawwad</title>
</svelte:head>

{#if project?.html}
  {@html project.html}
{/if}
