import { projects, type ProjectMetadata } from '@/src/data/projects';

export const projectIds = () => projects.map((p) => p.id);

export const findProject = (id: string): ProjectMetadata | undefined => projects.find((p) => p.id === id);
