<script>
	import TelegramIcon from '$lib/icons/socials/telegram.svelte';
	import GitHubIcon from '$lib/icons/socials/github.svelte';
	import LinkedInIcon from '$lib/icons/socials/linkedin.svelte';
	import EmailIcon from '$lib/icons/socials/email.svelte';
</script>

<div class="socials">
	<a
		href="https://github.com/jaweed3"
		target="_blank"
		rel="noopener noreferrer"
		title="GitHub — jaweed3"
	>
		<GitHubIcon />
	</a>
	<a
		href="https://linkedin.com/in/jaweed3"
		target="_blank"
		rel="noopener noreferrer"
		title="LinkedIn"
	>
		<LinkedInIcon />
	</a>
	<a
		href="https://t.me/jaweed3"
		target="_blank"
		rel="noopener noreferrer"
		title="Telegram"
	>
		<TelegramIcon />
	</a>
	<a
		href="mailto:me@jaweed.site"
		target="_blank"
		rel="noopener noreferrer"
		title="Email"
	>
		<EmailIcon />
	</a>
</div>

<style lang="scss">
	@import '../../scss/breakpoints.scss';
	.socials {
		display: flex;
		align-items: center;
		gap: 20px;

		a {
			transition: all 0.2s ease-in-out;
			width: 24px;
			color: var(--color--text);
			fill: var(--color--text);

			&:hover {
				color: var(--color--primary);
				fill: var(--color--primary);
				filter: drop-shadow(0px 0px 3px var(--color--primary));
			}
		}
	}
</style>
