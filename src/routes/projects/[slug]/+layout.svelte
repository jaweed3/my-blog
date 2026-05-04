<script lang="ts">
	import type { Project } from '$lib/utils/types';
	import Tag from '$lib/components/atoms/Tag.svelte';
	import Image from '$lib/components/atoms/Image.svelte';
	import Header from '$lib/components/organisms/Header.svelte';
	import Footer from '$lib/components/organisms/Footer.svelte';
	import BlogIcon from '$lib/icons/blog.svelte';
	import ExternalLinkIcon from '$lib/icons/external-link.svelte';
	import { siteBaseUrl } from '$lib/data/meta';

	export let data: { project: Project };
	const { project } = data;

	const statusLabels: Record<string, string> = {
		active: 'active',
		wip: 'WIP',
		archived: 'archived'
	};
</script>

<svelte:head>
	<title>{project.title} — Jawwad</title>
	<meta name="description" content={project.excerpt} />
	<meta property="og:title" content={project.title} />
	<meta property="og:description" content={project.excerpt} />
	<meta property="og:image" content={siteBaseUrl + project.coverImage} />
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<Header showBackground={true} />

<main>
	<article class="container">
		<header class="project-header">
			<div class="meta">
				<div class="badges">
					<span class="status-badge {project.status}">{statusLabels[project.status]}</span>
					{#each project.tags as tag}
						<Tag>{tag}</Tag>
					{/each}
				</div>
				<h1>{project.title}</h1>
				<p class="excerpt">{project.excerpt}</p>
				<div class="links">
					{#if project.github}
						<a href={project.github} target="_blank" rel="noopener noreferrer" class="link-btn">
							<ExternalLinkIcon /> GitHub
						</a>
					{/if}
					{#if project.demo}
						<a href={project.demo} target="_blank" rel="noopener noreferrer" class="link-btn">
							<ExternalLinkIcon /> Demo
						</a>
					{/if}
					{#if project.paper}
						<a href={project.paper} target="_blank" rel="noopener noreferrer" class="link-btn">
							<ExternalLinkIcon /> Paper
						</a>
					{/if}
				</div>
			</div>
			<div class="cover">
				<Image src="/{project.coverImage}" alt={project.title} />
			</div>
		</header>

		<div class="tech-stack">
			<span class="label">Tech stack:</span>
			{#each project.techStack as tech}
				<Tag color="secondary">{tech}</Tag>
			{/each}
		</div>

		<div id="article-content">
			<div class="content">
				<slot />
			</div>
		</div>

		<div class="back-nav">
			<a href="/projects">
				<BlogIcon /> ← All Projects
			</a>
		</div>
	</article>
</main>

<Footer />

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	.project-header {
		display: grid;
		grid-template-columns: 1fr 380px;
		gap: 40px;
		align-items: center;
		padding: 40px 0 30px;

		@include for-tablet-portrait-down {
			grid-template-columns: 1fr;
		}

		.meta {
			display: flex;
			flex-direction: column;
			gap: 12px;

			.badges {
				display: flex;
				flex-wrap: wrap;
				align-items: center;
				gap: 6px;

				.status-badge {
					font-size: 0.75rem;
					font-weight: 700;
					text-transform: uppercase;
					letter-spacing: 0.05em;
					padding: 2px 10px;
					border-radius: 12px;

					&.active {
						background: rgba(var(--color--primary-rgb), 0.12);
						color: var(--color--primary);
					}
					&.wip {
						background: rgba(var(--color--yellow-rgb), 0.12);
						color: var(--color--yellow);
					}
					&.archived {
						background: rgba(var(--color--secondary-rgb), 0.1);
						color: var(--color--secondary);
					}
				}
			}

			h1 {
				font-size: 2rem;
				margin: 0;
			}

			.excerpt {
				color: var(--color--text-shade);
				font-size: 1.05rem;
				line-height: 1.5;
			}

			.links {
				display: flex;
				flex-wrap: wrap;
				gap: 8px;

				.link-btn {
					display: flex;
					align-items: center;
					gap: 6px;
					font-size: 0.9rem;
					font-weight: 500;
					padding: 6px 14px;
					border-radius: 6px;
					border: 1px solid rgba(var(--color--primary-rgb), 0.2);
					color: var(--color--primary);
					text-decoration: none;
					transition: all 0.2s;

					&:hover {
						background: rgba(var(--color--primary-rgb), 0.06);
					}
				}
			}
		}

		.cover {
			border-radius: 8px;
			overflow: hidden;
			box-shadow: var(--image-shadow);
		}
	}

	.tech-stack {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 8px;
		padding: 20px 0;
		border-top: 1px solid rgba(var(--color--primary-rgb), 0.1);
		border-bottom: 1px solid rgba(var(--color--primary-rgb), 0.1);
		margin-bottom: 30px;

		.label {
			font-size: 0.85rem;
			font-weight: 600;
			color: var(--color--text-shade);
			margin-right: 4px;
		}
	}

	#article-content {
		.content {
			a:not(.link-btn) {
				color: var(--color--primary);
				text-decoration: underline;
				text-underline-offset: 0.15em;

				&:hover {
					text-underline-offset: 0.3em;
				}
			}

			p {
				margin: 0.75rem 0;
				line-height: 1.55em;
			}

			h2 {
				margin: 2.5rem 0 0.5rem;
			}

			h3 {
				margin: 2rem 0 0.3rem;
			}

			img {
				display: block;
				margin: 2rem auto;
				max-width: 100%;
				border-radius: 8px;
				box-shadow: var(--image-shadow);
			}

			code {
				font-family: var(--font--mono);
			}

			code:not([class^='language-']) {
				background: var(--color--code-inline-background);
				padding: 4px 8px;
				border-radius: 4px;
				font-size: 0.9em;
			}

			blockquote {
				padding: 20px 25px 10px;
				border-radius: 6px;
				font-size: 1rem;
				border-left: 4px solid var(--color--primary);
				background: var(--color--callout-background);
				margin: 1.5rem 0;
			}

			pre {
				border-radius: 8px;
				margin: 1.5rem 0;
				overflow-x: auto;
			}
		}
	}

	.back-nav {
		margin-top: 4rem;
		padding-top: 20px;
		border-top: 1px solid rgba(var(--color--primary-rgb), 0.1);

		a {
			display: inline-flex;
			align-items: center;
			gap: 6px;
			color: var(--color--text-shade);
			text-decoration: none;
			font-size: 0.9rem;

			&:hover {
				color: var(--color--primary);
			}
		}
	}
</style>
