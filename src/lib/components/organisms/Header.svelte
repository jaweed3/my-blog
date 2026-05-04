<script lang="ts">
	import Logo from '$lib/components/atoms/Logo.svelte';
	import ThemeToggle from '$lib/components/molecules/ThemeToggle.svelte';

	export let showBackground = false;
</script>

<header>
	<nav class="container">
		<a class="logo" href="/" aria-label="Home">
			<Logo />
		</a>
		<div class="links">
			<a href="/blog">Blog</a>
			<a href="/projects">Projects</a>
			<ThemeToggle />
		</div>
	</nav>
</header>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	header {
		padding: 30px 0;

		.container {
			display: flex;
			align-items: center;
			gap: 30px;
		}

		.logo {
			height: 40px;
			flex: 1;
		}

		.links {
			display: flex;
			align-items: center;
			gap: 24px;

			a {
				text-decoration: none;
				color: var(--color--text-shade);
				font-size: 0.9rem;

				&:hover {
					color: var(--color--text);
				}
			}

			@include for-phone-only {
				a {
					display: none;
				}
			}
		}
	}
</style>
