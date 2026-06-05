<script lang="ts">
  import Hero from '$lib/components/organisms/Hero.svelte';
  import About from '$lib/components/organisms/About.svelte';
  import ProjectsSection from '$lib/components/organisms/ProjectsSection.svelte';
  import type { BlogPost, Project } from '$lib/utils/types';

  export let data: { posts: BlogPost[]; projects: Project[] };
  const { posts, projects } = data;
</script>

<div class="container">
  <Hero />
  <About />

  {#if projects && projects.length > 0}
    <div class="featured-projects">
      <ProjectsSection {projects} />
    </div>
  {/if}

  {#if posts && posts.length > 0}
    <section>
      <h2>Posts</h2>
      <ul class="post-list">
        {#each posts as post}
          <li>
            <a href="/{post.slug}">{post.title}</a>
            <span class="date">{post.date.slice(0, 10)}</span>
          </li>
        {/each}
      </ul>
      <a href="/blog" class="more">All posts →</a>
    </section>
  {/if}
</div>

<style lang="scss">
  .featured-projects {
    padding-bottom: 20px;
  }

  section {
    padding-bottom: 40px;

    h2 {
      font-size: 1rem;
      font-weight: 600;
      margin: 0 0 12px;
    }
  }

  .post-list {
    list-style: none;
    padding: 0;
    margin: 0 0 12px;

    li {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      padding: 4px 0;
      border-bottom: 1px solid rgba(var(--color--primary-rgb), 0.06);
    }

    a {
      color: var(--color--text);
      text-decoration: none;

      &:hover {
        color: var(--color--primary);
      }
    }

    .date {
      color: var(--color--text-shade);
      font-size: 0.8rem;
      flex-shrink: 0;
      margin-left: 16px;
    }
  }

  .more {
    font-size: 0.85rem;
    color: var(--color--primary);
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
</style>
