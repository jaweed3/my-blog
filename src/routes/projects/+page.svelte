<script lang="ts">
	import type { Project } from '$lib/utils/types';
	import ProjectCard from '$lib/components/molecules/ProjectCard.svelte';
	import Header from '$lib/components/organisms/Header.svelte';
	import Footer from '$lib/components/organisms/Footer.svelte';
	import { title } from '$lib/data/meta';

	export let data: { projects: Project[] };
	const { projects } = data;
</script>

<svelte:head>
	<title>Projects — {title}</title>
</svelte:head>

<Header showBackground={true} />

<main>
	<section class="container">
	<h1>Projects</h1>
	<p class="subtitle">Things I've built — from Edge AI to MLOps pipelines</p>

	<div class="project-grid">
		{#each projects as project}
			<ProjectCard {project} />
		{/each}
	</div>
</section>
</main>

<Footer />

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	section {
		padding: 60px 0 80px;

		h1 {
			margin-bottom: 0.3rem;
		}

		.subtitle {
			color: var(--color--text-shade);
			margin-bottom: 3rem;
			font-size: 1.1rem;
		}
	}

	.project-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 24px;

		@include for-phone-only {
			grid-template-columns: 1fr;
		}
	}
</style>
