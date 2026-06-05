import { allProjects } from '$lib/data/projects';

export async function load({ url }) {
  const slug = url.pathname.replace('/projects/', '');
  const sorted = [...allProjects].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const currentIndex = sorted.findIndex((p) => p.slug === slug);
  const project = sorted[currentIndex] ?? null;

  return {
    project,
    prevProject: currentIndex > 0 ? sorted[currentIndex - 1] : null,
    nextProject: currentIndex >= 0 && currentIndex < sorted.length - 1 ? sorted[currentIndex + 1] : null,
  };
}
