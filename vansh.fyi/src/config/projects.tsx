import React from 'react';

export const DEFAULT_PROJECT_LOGO = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="w-[16px] h-[24px] flex-shrink-0" strokeWidth="2">
    <path d="M10.2241 11.9917H13.7759L13.7593 6.66943C10.9046 6.66943 10.2241 8.79171 10.2241 10.6819V11.9917ZM11.1535 4H20V20H13.7759V14.6611H10.2241V20H4V11.4446C4 6.13886 7.56846 4 11.1535 4Z"></path>
  </svg>
);

export const DEFAULT_CATEGORY_ICON = (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layout-dashboard flex-shrink-0">
    <rect width="7" height="9" x="3" y="3" rx="1"></rect>
    <rect width="7" height="5" x="14" y="3" rx="1"></rect>
    <rect width="7" height="9" x="14" y="12" rx="1"></rect>
    <rect width="7" height="5" x="3" y="16" rx="1"></rect>
  </svg>
);

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  url: string;
  isNDA?: boolean;
  logo?: React.ReactNode;
}

export interface SubCategory {
  title: string;
  projects: Project[];
}

export interface ProjectCategory {
  id: string;
  name: string;
  sections: SubCategory[];
  icon?: React.ReactNode;
}

export const projectCategories: ProjectCategory[] = [
  {
    id: 'product-design',
    name: 'Product Design',
    icon: DEFAULT_CATEGORY_ICON,
    sections: [
      {
        title: 'Personal Projects',
        projects: [
          {
            id: 'aether',
            title: 'Aether',
            subtitle: 'AI Design System Generator',
            url: 'https://vansh.fyi/portfolio/product-design/aether',
            logo: DEFAULT_PROJECT_LOGO
          },
          {
            id: 'vibio',
            title: 'Vibio',
            subtitle: 'Event Platform for Creatives',
            url: 'https://vansh.fyi/portfolio/product-design/vibio',
            logo: DEFAULT_PROJECT_LOGO
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
            isNDA: true,
            logo: DEFAULT_PROJECT_LOGO
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
            url: 'https://vansh.fyi/portfolio/product-design/sparto',
            logo: DEFAULT_PROJECT_LOGO
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
            url: 'https://vansh.fyi/portfolio/product-design/sparto-admin',
            logo: DEFAULT_PROJECT_LOGO
          },
          {
            id: 'ovik-finance',
            title: 'Ovik Finance',
            subtitle: 'Enterprise App for Ovik Finance',
            url: 'https://vansh.fyi/portfolio/product-design/ovik',
            logo: DEFAULT_PROJECT_LOGO
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
            url: 'https://vansh.fyi/portfolio/product-design/syno-vein',
            logo: DEFAULT_PROJECT_LOGO
          },
          {
            id: 'synofin-lms',
            title: 'Synofin LMS',
            subtitle: 'Loan Management System',
            url: 'https://vansh.fyi/portfolio/product-design/synofin-lms',
            logo: DEFAULT_PROJECT_LOGO
          },
          {
            id: 'syno-assess',
            title: 'Syno Assess',
            subtitle: 'Online Assessment Platform',
            url: 'https://vansh.fyi/portfolio/product-design/syno-assess',
            logo: DEFAULT_PROJECT_LOGO
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
            url: 'https://vansh.fyi/portfolio/product-design/dit-university',
            logo: DEFAULT_PROJECT_LOGO
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
            isNDA: true,
            logo: DEFAULT_PROJECT_LOGO
          }
        ]
      }
    ]
  },
  {
    id: 'branding-logo',
    name: 'Branding & Logo',
    icon: DEFAULT_CATEGORY_ICON,
    sections: [
      {
        title: 'Personal Projects',
        projects: [
          {
            id: 'vibio-branding',
            title: 'Vibio',
            subtitle: 'Event Platform for Creatives',
            url: 'https://vansh.fyi/portfolio/branding/vibio',
            logo: DEFAULT_PROJECT_LOGO
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
            url: 'https://vansh.fyi/portfolio/branding/sparto',
            logo: DEFAULT_PROJECT_LOGO
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
            url: 'https://vansh.fyi/portfolio/branding/rama-rajasthan',
            logo: DEFAULT_PROJECT_LOGO
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
            url: 'https://vansh.fyi/portfolio/branding/pizza-hut-rebrand',
            logo: DEFAULT_PROJECT_LOGO
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
            url: 'https://vansh.fyi/portfolio/branding/unite-creatives',
            logo: DEFAULT_PROJECT_LOGO
          }
        ]
      }
    ]
  },
  {
    id: 'ai-driven',
    name: 'AI-Driven Projects',
    icon: DEFAULT_CATEGORY_ICON,
    sections: [
      {
        title: 'Personal Projects',
        projects: [
          {
            id: 'aether-ai',
            title: 'Aether',
            subtitle: 'AI-Powered Design System Generator',
            url: 'https://vansh.fyi/portfolio/ai/aether',
            logo: DEFAULT_PROJECT_LOGO
          },
          {
            id: 'ursa-ai',
            title: 'Ursa AI',
            subtitle: 'My personal chat assistant',
            url: 'https://vansh.fyi/portfolio/ai/ursa-ai',
            logo: DEFAULT_PROJECT_LOGO
          },
          {
            id: 'portfolio-website',
            title: 'This Website',
            subtitle: 'Spec Coded portfolio Website',
            url: 'https://vansh.fyi/portfolio/ai/portfolio-website',
            logo: DEFAULT_PROJECT_LOGO
          }
        ]
      },
      {
        title: 'Healthcare',
        projects: [
          {
            id: 'driq-health-ai',
            title: 'DriQ Health',
            subtitle: 'Fall & Incontinence Monitoring',
            url: 'https://vansh.fyi/portfolio/ai/driq-health',
            isNDA: true,
            logo: DEFAULT_PROJECT_LOGO
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
