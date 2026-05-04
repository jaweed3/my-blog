import { allProjects } from '$lib/data/projects';

export async function load() {
  return {
    projects: allProjects
  };
}
