'use client';

import { projectPath, useViewStore } from '../state/overlayStore';
import { usePortfolio } from '../state/portfolio';
import { firstPlacementId } from '../../lib/portfolio';

export default function ViewProjectsLink() {
  const { goToProject, scrollToSection } = useViewStore();
  const portfolio = usePortfolio();
  const defaultProjectId = portfolio.featured[0]?.placementId ?? firstPlacementId(portfolio);
  return (
    <a
      href={defaultProjectId ? projectPath(defaultProjectId) : '#projects'}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        if (defaultProjectId) goToProject(defaultProjectId);
        else scrollToSection('projects');
      }}
      className="inline-flex items-center justify-center gap-2 whitespace-nowrap min-h-11 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white active:scale-[0.96] text-sm font-medium font-geist ring-1 rounded-full pt-2.5 pr-4 pb-2.5 pl-4 backdrop-blur-sm hover:bg-white/20 hover:ring-white/30 text-white/80 bg-white/10 ring-white/15"
    >
      View Projects
      <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right h-4 w-4">
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
      </svg>
    </a>
  );
}
