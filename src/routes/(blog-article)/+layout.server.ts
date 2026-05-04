import { importPosts } from '$lib/data/blog-posts/utils';

export async function load({ url }: { url: { pathname: string } }) {
  const { pathname } = url;
  const slug = pathname.replace('/', '');
  // Use importPosts(false) to avoid render errors — we only need metadata
  const allPosts = importPosts(false);
  const post = allPosts.find((post: any) => post.slug === slug);

  return { post };
}
