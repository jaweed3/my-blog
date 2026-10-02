import { sortedProjects } from '$lib/data/projects';

export async function load({ url }: { url: URL }) {
	const slug = url.pathname.replace('/projects/', '');
	const currentIndex = sortedProjects.findIndex((p) => p.slug === slug);
	const project = sortedProjects[currentIndex] ?? null;

	return {
		project,
		prevProject: currentIndex > 0 ? sortedProjects[currentIndex - 1] : null,
		nextProject:
			currentIndex >= 0 && currentIndex < sortedProjects.length - 1
				? sortedProjects[currentIndex + 1]
				: null
	};
}
