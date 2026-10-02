import { filteredPosts } from '$lib/data/blog-posts';
import { allProjects, featuredProjects, sortedProjects } from '$lib/data/projects';

// The bento grid above it is a hand-picked set of five, so the newest work would
// otherwise never surface on the homepage.
const RECENT_COUNT = 6;

export async function load() {
	const posts = filteredPosts.slice(0, 5);
	const recentProjects = sortedProjects.slice(0, RECENT_COUNT);

	return { posts, projects: featuredProjects, recentProjects, projectCount: allProjects.length };
}
