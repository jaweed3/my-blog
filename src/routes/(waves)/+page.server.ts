import { filteredPosts } from '$lib/data/blog-posts';

export async function load() {
  const posts = filteredPosts.slice(0, 5);

  return { posts };
}
