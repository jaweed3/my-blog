<script>
</script>

<section id="hero">
	<h1>Jawwad</h1>
	<p class="sub">Computer Engineer — Edge ML &amp; MLOps</p>
	<nav class="links">
		<a href="/blog">Blog</a>
		<span>/</span>
		<a href="/projects">Projects</a>
		<span>/</span>
		<a href="https://github.com/jaweed3" target="_blank" rel="noopener noreferrer">GitHub</a>
	</nav>
</section>

<style lang="scss">
	@import '$lib/scss/breakpoints.scss';

	#hero {
		padding: 80px 0 60px;

		h1 {
			font-size: 2rem;
			font-weight: 700;
			margin: 0 0 8px;
		}

		.sub {
			color: var(--color--text-shade);
			font-size: 0.95rem;
			margin: 0 0 24px;
		}

		.links {
			display: flex;
			gap: 12px;
			font-size: 0.9rem;

			a {
				color: var(--color--primary);
				text-decoration: none;

				&:hover {
					text-decoration: underline;
				}
			}

			span {
				color: var(--color--text-shade);
			}
		}
	}
</style>
