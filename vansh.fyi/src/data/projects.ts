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
  {
    id: 'aether',
    name: 'Aether',
    shortDescription: 'AI-powered design system generator that creates customized, production-ready design systems',
    category: 'AI Tool',
    technologies: ['React', 'TypeScript', 'OpenAI GPT-4', 'Node.js', 'Figma API'],
    featured: true,
  },
  {
    id: 'vibio',
    name: 'Vibio',
    shortDescription: 'Event Platform for Creatives',
    category: 'Product Design',
    technologies: ['React', 'Node.js', 'Design Systems'],
    featured: true,
  },
  {
    id: 'driq-health',
    name: 'DriQ Health',
    shortDescription: 'Healthcare IoT solution for incontinence monitoring in seniors',
    category: 'Healthcare IoT',
    technologies: ['React Native', 'Node.js', 'IoT Sensors', 'PostgreSQL', 'AWS IoT'],
    featured: true,
  },
  {
    id: 'sparto',
    name: 'Sparto',
    shortDescription: 'Request-based e-commerce platform for automotive and industrial spare parts',
    category: 'B2B E-Commerce',
    technologies: ['Next.js', 'Node.js', 'PostgreSQL', 'Stripe', 'Socket.io'],
    featured: true,
  },
  {
    id: 'sparto-admin',
    name: 'Sparto Admin',
    shortDescription: 'Enterprise application for managing Sparto operations',
    category: 'Enterprise',
    technologies: ['React', 'TypeScript', 'Admin Dashboard'],
    featured: false,
  },
  {
    id: 'ovik-finance',
    name: 'Ovik Finance',
    shortDescription: 'Enterprise App for Ovik Finance',
    category: 'Enterprise',
    technologies: ['FinTech', 'React', 'Secure Data'],
    featured: false,
  },
  {
    id: 'syno-vein',
    name: 'Syno Vein',
    shortDescription: 'Loan Authentication System',
    category: 'B2B SaaS',
    technologies: ['SaaS', 'Authentication', 'Finance'],
    featured: false,
  },
  {
    id: 'synofin-lms',
    name: 'Synofin LMS',
    shortDescription: 'Loan Management System',
    category: 'B2B SaaS',
    technologies: ['LMS', 'Finance', 'Management'],
    featured: false,
  },
  {
    id: 'syno-assess',
    name: 'Syno Assess',
    shortDescription: 'Online Assessment Platform',
    category: 'B2B SaaS',
    technologies: ['EdTech', 'Assessment', 'React'],
    featured: false,
  },
  {
    id: 'dit-university',
    name: 'DIT University',
    shortDescription: 'School of Design Website',
    category: 'Academia',
    technologies: ['Web Design', 'Education'],
    featured: false,
  },
  {
    id: 'lalaverse',
    name: 'Lalaverse',
    shortDescription: 'Customised VR solutions',
    category: 'VR & Metaverse',
    technologies: ['VR', 'Unity', 'Metaverse'],
    featured: false,
  },
  {
    id: 'rama-rajasthan',
    name: 'RAMA Rajasthan',
    shortDescription: "State's Assosciation for multimedia",
    category: 'Branding',
    technologies: ['Branding', 'Identity'],
    featured: false,
  },
  {
    id: 'pizza-hut-rebrand',
    name: 'Pizza Hut Rebrand',
    shortDescription: "Rethinking Pizza Hut's identity",
    category: 'Branding',
    technologies: ['Branding', 'Design'],
    featured: false,
  },
  {
    id: 'unite-creatives',
    name: 'Unite Creatives',
    shortDescription: 'Online Community for creatives',
    category: 'Community',
    technologies: ['Community', 'Social'],
    featured: false,
  },
  {
    id: 'ursa-ai',
    name: 'Ursa AI',
    shortDescription: 'My personal chat assistant',
    category: 'AI',
    technologies: ['LLM', 'RAG', 'Chatbot'],
    featured: false,
  },
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
