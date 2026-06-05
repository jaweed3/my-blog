<script lang="ts">
  import type { Project } from '$lib/utils/types';
  import ProjectCard from '$lib/components/molecules/ProjectCard.svelte';
  import ContentSection from '$lib/components/organisms/ContentSection.svelte';
  import Button from '$lib/components/atoms/Button.svelte';

  export let projects: Project[];
</script>

<ContentSection
  id="projects"
  title="Featured Work"
>
  <svelte:fragment slot="button">
    <Button href="/projects" color="secondary" style="clear">
      View All →
    </Button>
  </svelte:fragment>

  <div class="project-list">
    {#each projects as project}
      <ProjectCard {project} />
    {/each}
  </div>
</ContentSection>

<style lang="scss">
  .project-list {
    display: flex;
    flex-direction: column;
  }
</style>
