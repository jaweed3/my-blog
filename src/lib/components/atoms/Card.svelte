<script lang="ts">
	import { HttpRegex } from '$lib/utils/regex';

	export let additionalClass: string | undefined = undefined;

	export let href: string | undefined = undefined;
	const isExternalLink = !!href && HttpRegex.test(href);
	export let target: '_self' | '_blank' = isExternalLink ? '_blank' : '_self';
	export let rel = isExternalLink ? 'noopener noreferrer' : undefined;

	$: tag = href ? 'a' : 'article';
	$: linkProps = { href, target, rel };
</script>

<svelte:element
	this={tag}
	class="card {additionalClass}"
	{...linkProps}
	data-sveltekit-preload-data
	{...$$restProps}
>
	{#if $$slots.image}
		<div class="image">
			<slot name="image" />
		</div>
	{/if}
	<div class="body">
		<div class="content">
			<slot name="content" />
		</div>
		{#if $$slots.footer}
			<div class="footer">
				<slot name="footer" />
			</div>
		{/if}
	</div>
</svelte:element>

<style lang="scss">
	.card {
		background: var(--color--card-background);
		color: var(--color--text);
		border: 1px solid rgba(var(--color--primary-rgb), 0.12);
		border-radius: 4px;
		transition: border-color 0.2s ease;
		position: relative;
		overflow: hidden;
		width: 100%;

		display: flex;
		flex-direction: row;
		flex-wrap: wrap;

		text-decoration: none;

		&[href],
		&[onclick] {
			cursor: pointer;
			&:hover {
				border-color: var(--color--primary);
			}
		}
	}

	.body {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: 10px;
		padding: 20px 20px;
		flex: 1 0 50%;

		.content {
			display: flex;
			flex-direction: column;
			flex: 1;
		}
	}

	.image {
		position: relative;
		flex: 1 0 max(50%, 330px);
		min-height: 280px;
		max-height: 350px;
	}

	:global(.card [slot='image']) {
		width: 100%;
		height: 100%;
		object-fit: cover;
		position: absolute;
	}
</style>
