<script lang="ts">
  import type { Project } from '$lib/utils/types';
  import ProjectCard from '$lib/components/molecules/ProjectCard.svelte';
  import ContentSection from '$lib/components/organisms/ContentSection.svelte';
  import Button from '$lib/components/atoms/Button.svelte';
  import BlogIcon from '$lib/icons/blog.svelte';

  export let projects: Project[];
</script>

<ContentSection
  id="projects"
  title="Featured Work"
  description="AI systems I've built that deliver measurable impact — from edge deployment to production infrastructure"
>
  <svelte:fragment slot="button">
    <Button href="/projects" color="primary">
      <BlogIcon slot="icon" />
      View All
    </Button>
  </svelte:fragment>

  <div class="project-grid">
    {#each projects as project}
      <ProjectCard {project} />
    {/each}
  </div>
</ContentSection>

<style lang="scss">
  @import '$lib/scss/breakpoints.scss';

  .project-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    width: 100%;

    @include for-phone-only {
      grid-template-columns: 1fr;
    }
  }
</style>
