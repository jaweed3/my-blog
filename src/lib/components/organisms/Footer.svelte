<script>
	import Socials from '$lib/components/molecules/Socials.svelte';
	import ThemeToggle from '$lib/components/molecules/ThemeToggle.svelte';
	import RssLink from '$lib/components/atoms/RssLink.svelte';
</script>

<footer>
	<div class="content">
		<div class="socials">
			<Socials />
			<RssLink />
			<ThemeToggle />
		</div>
	</div>
</footer>

<style lang="scss">
	footer {
		padding: 60px 0 30px;

		.content {
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 12px;
			font-size: 0.85rem;
			color: var(--color--text-shade);
		}

		.socials {
			display: flex;
			align-items: center;
			gap: 20px;
		}

		a {
			color: var(--color--text-shade);
			&:hover {
				color: var(--color--primary);
			}
		}
	}
</style>
