<script>
	import { onMount } from 'svelte';
	import renderMathInElement from 'katex/contrib/auto-render';

	export let targetSelector = '#article-content .content, .math-content, #projects-content';

	onMount(() => {
		const containers = document.querySelectorAll(targetSelector);
		if (!containers.length) return;

		containers.forEach((container) => {
			renderMathInElement(container, {
				delimiters: [
					{ left: '$$', right: '$$', display: true },
					{ left: '$', right: '$', display: false }
				],
				throwOnError: false
			});
		});
	});
</script>
