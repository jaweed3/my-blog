<script>
	import Header from '$lib/components/organisms/Header.svelte';
	import Footer from '$lib/components/organisms/Footer.svelte';
	import { page } from '$app/stores';

	import { description, image, keywords, title, siteBaseUrl } from '$lib/data/meta';
</script>

<svelte:head>
	<link rel="canonical" href={siteBaseUrl} />
	<meta name="keywords" content={keywords.join(', ')} />

	<meta name="description" content={description} />
	<meta property="og:description" content={description} />
	<meta name="twitter:description" content={description} />

	<title>{title}</title>
	<meta property="og:title" content={title} />
	<meta name="twitter:title" content={title} />

	<meta property="og:image" content={image} />
	<meta name="twitter:image" content={image} />

	<meta name="twitter:card" content="summary_large_image" />

	<script type="application/ld+json">
		{{
			"@context": "https://schema.org",
			"@type": "Person",
			"name": "Fatih Jawwad",
			"url": {siteBaseUrl},
			"jobTitle": "Machine Learning Engineer",
			"knowsAbout": ["Edge ML", "MLOps", "Quantization", "Embedded Systems", "Computer Vision"],
			"sameAs": [
				"https://github.com/jaweed3",
				"https://linkedin.com/in/jaweed3"
			]
		}}
	</script>
</svelte:head>

<Header />

<main>
	<slot />
</main>

<Footer />
