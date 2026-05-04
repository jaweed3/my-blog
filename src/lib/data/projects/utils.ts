import type { Project } from '$lib/utils/types';

export const importProjects = (render = false) => {
  const projectImports = import.meta.glob('$routes/projects/*/*.md', { eager: true });

  const projects: Project[] = [];
  for (const path in projectImports) {
    const project = projectImports[path] as any;
    if (project) {
      projects.push({
        ...project.metadata,
        html: render && project.default.render ? project.default.render()?.html : undefined,
      });
    }
  }

  return projects;
};

export const filterProjects = (
  projects: Project[],
  { featured }: { featured?: boolean } = {}
) => {
  let filtered = projects.filter((p) => !p.hidden);
  if (featured) filtered = filtered.filter((p) => p.featured);
  return filtered.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};
