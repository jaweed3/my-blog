import { allProjects } from '$lib/data/projects';

export async function load({ url }) {
  const slug = url.pathname.replace('/projects/', '');
  const sorted = [...allProjects].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const project = sorted.find((p) => p.slug === slug);

  if (!project) {
    return {
      status: 404,
      error: new Error(`Project "${slug}" not found`)
    };
  }

  return { project, projects: sorted };
}
