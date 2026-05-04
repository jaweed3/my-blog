import { filterProjects, importProjects } from './utils';

export const allProjects = importProjects(true);
export const featuredProjects = filterProjects(allProjects, { featured: true });
