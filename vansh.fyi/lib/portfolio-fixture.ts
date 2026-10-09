import type { PortfolioData } from './portfolio';

/** Small, fixed project data for tests. */
export const PORTFOLIO_FIXTURE: PortfolioData = {
    categories: [
        {
            id: 'product-design',
            name: 'Product Design',
            iconSvg: null,
            sections: [
                {
                    id: 's1',
                    title: 'Personal Projects',
                    placements: [
                        { id: 'aether', projectId: 'aether', title: 'Aether', subtitle: 'AI Design System Generator', description: 'Design systems', url: 'https://info.vansh.fyi/a', isNda: false, logoSvg: null },
                    ],
                },
                {
                    id: 's2',
                    title: 'Healthcare',
                    placements: [
                        { id: 'driq-health', projectId: 'driq-health', title: 'DriQ Health', subtitle: 'Monitoring', description: '', url: 'https://info.vansh.fyi/d', isNda: true, logoSvg: null },
                    ],
                },
            ],
        },
        {
            id: 'ai-driven',
            name: 'AI Driven',
            iconSvg: null,
            sections: [
                {
                    id: 's3',
                    title: 'Portfolio',
                    placements: [
                        { id: 'portfolio-website', projectId: 'portfolio-website', title: 'AI-Powered Portfolio', subtitle: 'This site', description: '', url: 'https://info.vansh.fyi/p', isNda: false, logoSvg: null },
                        { id: 'driq-health-ai', projectId: 'driq-health', title: 'DriQ Health', subtitle: 'Monitoring', description: '', url: 'https://info.vansh.fyi/d-ai', isNda: true, logoSvg: null },
                    ],
                },
            ],
        },
    ],
    featured: [
        { projectId: 'aether', placementId: 'aether', title: 'Aether', blurb: 'Design systems', alt: 'Aether', image: '/images/aether.webp', layout: 'hero' },
    ],
};
