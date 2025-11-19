/**
 * Project Metadata
 *
 * This file contains metadata for all projects displayed in the portfolio.
 * Used for project-specific chat context, greetings, and project display.
 *
 * Note: This is a static data source for now. In the future, this could be
 * fetched from a CMS or backend API for dynamic content management.
 */

export interface ProjectMetadata {
  id: string;
  name: string;
  shortDescription: string;
  category: string;
  technologies: string[];
  featured: boolean;
}

/**
 * Project data - Update this array when adding new projects
 */
export const projects: ProjectMetadata[] = [
  {
    id: 'portfolio-website',
    name: 'AI-Powered Portfolio',
    shortDescription: 'A modern portfolio website with conversational AI integration',
    category: 'Web Application',
    technologies: ['React', 'TypeScript', 'Mastra.AI', 'RAG', 'tRPC'],
    featured: true,
  },
  // Add more projects here as they are completed
  // Example:
  // {
  //   id: 'ecommerce-platform',
  //   name: 'E-Commerce Platform',
  //   shortDescription: 'Full-stack e-commerce solution with payment integration',
  //   category: 'Web Application',
  //   technologies: ['Next.js', 'Node.js', 'Stripe', 'PostgreSQL'],
  //   featured: true,
  // },
];

/**
 * Get project by ID
 * @param projectId - The unique identifier for the project
 * @returns Project metadata or undefined if not found
 */
export const getProjectById = (projectId: string): ProjectMetadata | undefined => {
  return projects.find(project => project.id === projectId);
};

/**
 * Get project name by ID (convenience function)
 * @param projectId - The unique identifier for the project
 * @returns Project name or undefined if not found
 */
export const getProjectName = (projectId: string): string | undefined => {
  return getProjectById(projectId)?.name;
};

/**
 * Get all featured projects
 * @returns Array of featured project metadata
 */
export const getFeaturedProjects = (): ProjectMetadata[] => {
  return projects.filter(project => project.featured);
};

/**
 * Get projects by category
 * @param category - The category to filter by
 * @returns Array of project metadata matching the category
 */
export const getProjectsByCategory = (category: string): ProjectMetadata[] => {
  return projects.filter(project => project.category === category);
};
