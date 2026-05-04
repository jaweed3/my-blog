<script lang="ts">
	import Hero from '$lib/components/organisms/Hero.svelte';
	import About from '$lib/components/organisms/About.svelte';
	import type { BlogPost } from '$lib/utils/types';

	export let data: { posts: BlogPost[] };
	const { posts } = data;
</script>

<div class="container">
	<Hero />
	<About />

	{#if posts && posts.length > 0}
		<section>
			<h2>Writing</h2>
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
	section {
		padding-bottom: 50px;

		h2 {
			font-size: 1.1rem;
			font-weight: 600;
			margin-bottom: 16px;
		}
	}

	.post-list {
		list-style: none;
		padding: 0;
		margin: 0 0 16px;

		li {
			display: flex;
			justify-content: space-between;
			align-items: baseline;
			padding: 6px 0;
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
