export interface Project {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  url: string;
}

export const projects: Project[] = [
  // Product Design
  {
    id: 'aether',
    title: 'Aether',
    subtitle: 'AI Design System Generator',
    category: 'Product Design',
    url: 'https://vansh.fyi/projects/product-design/aether'
  },
  {
    id: 'vibio',
    title: 'Vibio',
    subtitle: 'Event Platform for Creatives',
    category: 'Product Design',
    url: 'https://vansh.fyi/projects/product-design/vibio'
  },

  // Healthcare
  {
    id: 'driq-health',
    title: 'DriQ Health',
    subtitle: 'Fall & Incontinence Monitoring',
    category: 'Healthcare',
    url: 'https://vansh.fyi/projects/healthcare/driq-health'
  },

  // E-Commerce
  {
    id: 'sparto',
    title: 'Sparto',
    subtitle: 'Order Auto Spare Parts',
    category: 'E-Commerce',
    url: 'https://vansh.fyi/projects/e-commerce/sparto'
  },

  // Enterprise
  {
    id: 'sparto-admin',
    title: 'Sparto Admin',
    subtitle: 'Enterprise App for Sparto',
    category: 'Enterprise',
    url: 'https://vansh.fyi/projects/enterprise/sparto-admin'
  },
  {
    id: 'ovik-finance',
    title: 'Ovik Finance',
    subtitle: 'Enterprise App for Ovik Finance',
    category: 'Enterprise',
    url: 'https://vansh.fyi/projects/enterprise/ovik-finance'
  },

  // B2B SaaS
  {
    id: 'syno-vein',
    title: 'Syno Vein',
    subtitle: 'Loan Authentication System',
    category: 'B2B SaaS',
    url: 'https://vansh.fyi/projects/b2b-saas/syno-vein'
  },
  {
    id: 'synofin-lms',
    title: 'Synofin LMS',
    subtitle: 'Loan Management System',
    category: 'B2B SaaS',
    url: 'https://vansh.fyi/projects/b2b-saas/synofin-lms'
  },

  // Academia
  {
    id: 'dit-university',
    title: 'DIT University',
    subtitle: 'School of Design Website',
    category: 'Academia',
    url: 'https://vansh.fyi/projects/academia/dit-university'
  },

  // VR & Metaverse
  {
    id: 'lalaverse',
    title: 'Lalaverse',
    subtitle: 'Customised VR solutions',
    category: 'VR & Metaverse',
    url: 'https://vansh.fyi/projects/vr-metaverse/lalaverse'
  }
];

export const projectCategories = [
  'Product Design',
  'Healthcare',
  'E-Commerce',
  'Enterprise',
  'B2B SaaS',
  'Academia',
  'VR & Metaverse'
] as const;
