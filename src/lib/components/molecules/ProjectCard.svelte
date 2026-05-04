<script lang="ts">
	import type { Project } from '$lib/utils/types';
	import Card from '$lib/components/atoms/Card.svelte';
	import Tag from '$lib/components/atoms/Tag.svelte';
	import Image from '../atoms/Image.svelte';

	export let project: Project;

	const statusLabels: Record<string, string> = {
		active: 'active',
		wip: 'WIP',
		archived: 'archived'
	};
</script>

<Card
	href="/projects/{project.slug}"
	additionalClass="project-card"
>
	<div class="image" slot="image">
		<Image src="/{project.coverImage}" alt={project.title} />
		<span class="status-dot {project.status}">{statusLabels[project.status]}</span>
	</div>
	<div class="content" slot="content">
		<div class="title">{project.title}</div>
		<p>{project.excerpt}</p>
	</div>
	<div class="footer" slot="footer">
		<div class="tags">
			{#each project.techStack.slice(0, 4) as tech}
				<Tag color="secondary">{tech}</Tag>
			{/each}
			{#if project.techStack.length > 4}
				<span class="more">+{project.techStack.length - 4}</span>
			{/if}
		</div>
	</div>
</Card>

<style lang="scss">
	.content {
		display: flex;
		flex-direction: column;
		gap: 10px;
		align-items: flex-start;

		.title {
			font-family: var(--font--heading);
			font-size: 1.15rem;
			font-weight: 700;
			letter-spacing: -0.02em;
		}

		p {
			color: var(--color--text-shade);
			font-size: 0.9rem;
			line-height: 1.45;
		}
	}

	.image {
		position: relative;

		.status-dot {
			position: absolute;
			top: 10px;
			right: 10px;
			font-size: 0.7rem;
			font-weight: 700;
			text-transform: uppercase;
			letter-spacing: 0.04em;
			padding: 2px 8px;
			border-radius: 10px;
			backdrop-filter: blur(8px);

			&.active {
				background: rgba(var(--color--primary-rgb), 0.85);
				color: white;
			}
			&.wip {
				background: rgba(var(--color--yellow-rgb), 0.85);
				color: #1c1e26;
			}
			&.archived {
				background: rgba(var(--color--text-shade-rgb), 0.7);
				color: white;
			}
		}
	}

	.tags {
		display: flex;
		align-items: center;
		gap: 5px;
		flex-wrap: wrap;

		.more {
			font-size: 0.8rem;
			color: var(--color--text-shade);
			font-weight: 500;
		}
	}

	.footer {
		margin-top: 16px;
	}

	:global(.project-card .image img) {
		object-fit: cover;
	}
</style>
