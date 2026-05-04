import { allProjects } from '$lib/data/projects';

export async function load({ url }) {
  const slug = url.pathname.replace('/projects/', '');
  const project = allProjects.find((p) => p.slug === slug);

  if (!project) {
    return {
      status: 404,
      error: new Error(`Project "${slug}" not found`)
    };
  }

  return { project };
}
