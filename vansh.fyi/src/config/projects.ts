export interface Project {
  id: string;
  title: string;
  subtitle: string;
  url: string;
  isNDA?: boolean;
}

export interface SubCategory {
  title: string;
  projects: Project[];
}

export interface ProjectCategory {
  id: string;
  name: string;
  sections: SubCategory[];
}

export const projectCategories: ProjectCategory[] = [
  {
    id: 'product-design',
    name: 'Product Design',
    sections: [
      {
        title: 'Personal Projects',
        projects: [
          {
            id: 'aether',
            title: 'Aether',
            subtitle: 'AI Design System Generator',
            url: 'https://vansh.fyi/portfolio/product-design/aether'
          },
          {
            id: 'vibio',
            title: 'Vibio',
            subtitle: 'Event Platform for Creatives',
            url: 'https://vansh.fyi/portfolio/product-design/vibio'
          }
        ]
      },
      {
        title: 'Healthcare',
        projects: [
          {
            id: 'driq-health',
            title: 'DriQ Health',
            subtitle: 'Fall & Incontinence Monitoring',
            url: 'https://vansh.fyi/portfolio/product-design/driq-health',
            isNDA: true
          }
        ]
      },
      {
        title: 'E-Commerce',
        projects: [
          {
            id: 'sparto',
            title: 'Sparto',
            subtitle: 'Order Auto Spare Parts',
            url: 'https://vansh.fyi/portfolio/product-design/sparto'
          }
        ]
      },
      {
        title: 'Enterprise',
        projects: [
          {
            id: 'sparto-admin',
            title: 'Sparto Admin',
            subtitle: 'Enterprise App for Sparto',
            url: 'https://vansh.fyi/portfolio/product-design/sparto-admin'
          },
          {
            id: 'ovik-finance',
            title: 'Ovik Finance',
            subtitle: 'Enterprise App for Ovik Finance',
            url: 'https://vansh.fyi/portfolio/product-design/ovik'
          }
        ]
      },
      {
        title: 'B2B SaaS',
        projects: [
          {
            id: 'syno-vein',
            title: 'Syno Vein',
            subtitle: 'Loan Authentication System',
            url: 'https://vansh.fyi/portfolio/product-design/syno-vein'
          },
          {
            id: 'synofin-lms',
            title: 'Synofin LMS',
            subtitle: 'Loan Management System',
            url: 'https://vansh.fyi/portfolio/product-design/synofin-lms'
          },
          {
            id: 'syno-assess',
            title: 'Syno Assess',
            subtitle: 'Online Assessment Platform',
            url: 'https://vansh.fyi/portfolio/product-design/syno-assess'
          }
        ]
      },
      {
        title: 'Academia',
        projects: [
          {
            id: 'dit-university',
            title: 'DIT University',
            subtitle: 'School of Design Website',
            url: 'https://vansh.fyi/portfolio/product-design/dit-university'
          }
        ]
      },
      {
        title: 'VR & Metaverse',
        projects: [
          {
            id: 'lalaverse',
            title: 'Lalaverse',
            subtitle: 'Customised VR solutions',
            url: 'https://vansh.fyi/portfolio/product-design/lalaverse',
            isNDA: true
          }
        ]
      }
    ]
  },
  {
    id: 'branding-logo',
    name: 'Branding & Logo',
    sections: [
      {
        title: 'Personal Projects',
        projects: [
          {
            id: 'vibio-branding',
            title: 'Vibio',
            subtitle: 'Event Platform for Creatives',
            url: 'https://vansh.fyi/portfolio/branding/vibio'
          }
        ]
      },
      {
        title: 'E-Commerce',
        projects: [
          {
            id: 'sparto-branding',
            title: 'Sparto',
            subtitle: 'Auto Spare Parts',
            url: 'https://vansh.fyi/portfolio/branding/sparto'
          }
        ]
      },
      {
        title: 'Association',
        projects: [
          {
            id: 'rama-rajasthan',
            title: 'RAMA Rajasthan',
            subtitle: "State's Assosciation for multimedia",
            url: 'https://vansh.fyi/portfolio/branding/rama-rajasthan'
          }
        ]
      },
      {
        title: 'Food & Beverage',
        projects: [
          {
            id: 'pizza-hut-rebrand',
            title: 'Pizza Hut Rebrand',
            subtitle: "Rethinking Pizza Hut's identity",
            url: 'https://vansh.fyi/portfolio/branding/pizza-hut-rebrand'
          }
        ]
      },
      {
        title: 'Community',
        projects: [
          {
            id: 'unite-creatives',
            title: 'Unite Creatives',
            subtitle: 'Online Community for creatives',
            url: 'https://vansh.fyi/portfolio/branding/unite-creatives'
          }
        ]
      }
    ]
  },
  {
    id: 'ai-driven',
    name: 'AI-Driven Projects',
    sections: [
      {
        title: 'Personal Projects',
        projects: [
          {
            id: 'aether',
            title: 'Aether',
            subtitle: 'AI-Powered Design System Generator',
            url: 'https://vansh.fyi/portfolio/ai/aether'
          },
          {
            id: 'ursa-ai',
            title: 'Ursa AI',
            subtitle: 'My personal chat assistant',
            url: 'https://vansh.fyi/portfolio/ai/ursa-ai'
          },
          {
            id: 'portfolio-website',
            title: 'This Website',
            subtitle: 'Spec Coded portfolio Website',
            url: 'https://vansh.fyi/portfolio/ai/portfolio-website'
          }
        ]
      },
      {
        title: 'Healthcare',
        projects: [
          {
            id: 'driq-health',
            title: 'DriQ Health',
            subtitle: 'Fall & Incontinence Monitoring',
            url: 'https://vansh.fyi/portfolio/ai/driq-health',
            isNDA: true
          }
        ]
      }
    ]
  }
];

// Helper to get all projects flat list if needed
export const getAllProjects = (): Project[] => {
  const allProjects: Project[] = [];
  projectCategories.forEach(cat => {
    cat.sections.forEach(sec => {
      allProjects.push(...sec.projects);
    });
  });
  return allProjects;
};
