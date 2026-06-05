import { filteredPosts } from '$lib/data/blog-posts';
import { featuredProjects } from '$lib/data/projects';

export async function load() {
  const posts = filteredPosts.slice(0, 5);

  return { posts, projects: featuredProjects };
}
