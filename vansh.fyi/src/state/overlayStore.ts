'use client';

import { create } from 'zustand';

export type ViewState = 'main' | 'projects' | 'chat';
type ChatContext = 'personal' | 'project';

/** Section ids on the main page, in page order. */
export const SECTION_IDS = ['hero', 'features', 'projects', 'about', 'testimonials', 'contact'] as const;
export type SectionId = (typeof SECTION_IDS)[number];

interface ViewStore {
  currentView: ViewState;
  initialChatQuery: string;
  chatContext: ChatContext;
  projectId?: string;
  /** Section to scroll to once the main view has mounted (set when navigating from an overlay). */
  pendingSection?: SectionId;
  setView: (view: ViewState) => void;
  goToMain: () => void;
  goToProjects: () => void;
  goToChat: (query?: string) => void;
  goToProjectChat: (projectId: string, query?: string) => void;
  selectProject: (projectId: string) => void;
  /** Scroll to a section of the main page, switching back to it first if an overlay is open. */
  scrollToSection: (id: SectionId) => void;
  clearPendingSection: () => void;
}

/** Smoothly scroll to a section on the main page. Offset is handled by CSS `scroll-margin-top`. */
export const scrollToElement = (id: SectionId, behavior: ScrollBehavior = 'smooth') => {
  document.getElementById(id)?.scrollIntoView({ behavior, block: 'start' });
};

// --- URL <-> state mapping -------------------------------------------------
// Query params (not paths) so deep links work on any static host without rewrites.
//   /                                  -> main
//   /?view=projects&project=aether     -> project overlay
//   /?view=chat                        -> personal chat
//   /?view=chat&project=aether         -> project chat

type UrlState = Pick<ViewStore, 'currentView' | 'chatContext' | 'projectId'>;

export const stateToSearch = ({ currentView, chatContext, projectId }: UrlState): string => {
  if (currentView === 'main') return '';
  const params = new URLSearchParams({ view: currentView });
  if (projectId && (currentView === 'projects' || chatContext === 'project')) {
    params.set('project', projectId);
  }
  return `?${params.toString()}`;
};

export const searchToState = (search: string): UrlState => {
  const params = new URLSearchParams(search);
  const view = params.get('view');
  const projectId = params.get('project') || undefined;
  if (view === 'projects') return { currentView: 'projects', chatContext: 'personal', projectId };
  if (view === 'chat') {
    return { currentView: 'chat', chatContext: projectId ? 'project' : 'personal', projectId };
  }
  return { currentView: 'main', chatContext: 'personal', projectId: undefined };
};

// Always start on the main view so server and client render the same markup;
// `useUrlSync` applies the real URL right after hydration.
const initialUrlState: UrlState = { currentView: 'main', chatContext: 'personal', projectId: undefined };

export const useViewStore = create<ViewStore>((set, get) => ({
  ...initialUrlState,
  initialChatQuery: '',
  pendingSection: undefined,
  setView: (view) => {
    set({ currentView: view });
  },
  goToMain: () => {
    set({ currentView: 'main', initialChatQuery: '', chatContext: 'personal', projectId: undefined });
  },
  goToProjects: () => {
    set({ currentView: 'projects' });
  },
  goToChat: (query = '') => {
    set({ currentView: 'chat', initialChatQuery: query, chatContext: 'personal', projectId: undefined });
  },
  goToProjectChat: (projectId: string, query = '') => {
    set({ currentView: 'chat', initialChatQuery: query, chatContext: 'project', projectId });
  },
  selectProject: (projectId: string) => {
    set({ projectId });
  },
  scrollToSection: (id) => {
    if (get().currentView === 'main') {
      scrollToElement(id);
      return;
    }
    set({
      currentView: 'main',
      initialChatQuery: '',
      chatContext: 'personal',
      projectId: undefined,
      pendingSection: id,
    });
  },
  clearPendingSection: () => {
    set({ pendingSection: undefined });
  },
}));

// Keep old export for backward compatibility during migration
export const useOverlayStore = useViewStore;
