'use client';

import { useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { create } from 'zustand';

export type ViewState = 'main' | 'projects' | 'chat';
type ChatContext = 'personal' | 'project';

/** Section ids on the main page, in page order. */
export const SECTION_IDS = ['hero', 'features', 'projects', 'about', 'testimonials', 'contact'] as const;
export type SectionId = (typeof SECTION_IDS)[number];

/** Smoothly scroll to a section on the main page. Offset is handled by CSS `scroll-margin-top`. */
export const scrollToElement = (id: SectionId, behavior: ScrollBehavior = 'smooth') => {
  document.getElementById(id)?.scrollIntoView({ behavior, block: 'start' });
};

// --- URL <-> view mapping ----------------------------------------------------
// The URL is the source of truth for which view is showing:
//   /                      -> main
//   /projects/<id>         -> project view
//   /chat                  -> personal chat
//   /projects/<id>/chat    -> project chat

export interface RouteState {
  currentView: ViewState;
  chatContext: ChatContext;
  projectId?: string;
}

export const pathToState = (pathname: string | null): RouteState => {
  const segments = (pathname ?? '/').split('/').filter(Boolean).map(decodeURIComponent);
  if (segments[0] === 'chat') return { currentView: 'chat', chatContext: 'personal' };
  if (segments[0] === 'projects' && segments[1]) {
    const projectId = segments[1];
    return segments[2] === 'chat'
      ? { currentView: 'chat', chatContext: 'project', projectId }
      : { currentView: 'projects', chatContext: 'personal', projectId };
  }
  return { currentView: 'main', chatContext: 'personal' };
};

export const projectPath = (projectId: string) => `/projects/${encodeURIComponent(projectId)}`;
export const projectChatPath = (projectId: string) => `${projectPath(projectId)}/chat`;

// --- UI state that is not part of the URL --------------------------------------

interface UiState {
  /** A question typed on the main page (hero input) that the chat view should send on mount. */
  initialChatQuery: string;
  /** Section to scroll to once the main view has mounted (set when navigating from another view). */
  pendingSection?: SectionId;
  clearInitialChatQuery: () => void;
  clearPendingSection: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  initialChatQuery: '',
  pendingSection: undefined,
  clearInitialChatQuery: () => set({ initialChatQuery: '' }),
  clearPendingSection: () => set({ pendingSection: undefined }),
}));

/**
 * View state and navigation. Which view is showing comes from the URL; the actions navigate with the
 * native history within the portfolio, so window controls don't wait for a server render.
 * Next synchronizes usePathname with pushState; direct visits still use the server routes.
 */
export const useViewStore = () => {
  const pathname = usePathname();
  const router = useRouter();
  const initialChatQuery = useUiStore((s) => s.initialChatQuery);
  const pendingSection = useUiStore((s) => s.pendingSection);
  const clearPendingSection = useUiStore((s) => s.clearPendingSection);
  const clearInitialChatQuery = useUiStore((s) => s.clearInitialChatQuery);

  const route = pathToState(pathname);
  const { projectId } = route;

  const actions = useMemo(() => {
    const navigate = (path: string) => {
      // Other pages (e.g. the blog) also use this hook, but don't render App.
      const inPortfolio = pathname === '/' || pathname === '/chat' || /^\/projects\/[^/]+(?:\/chat)?\/?$/.test(pathname ?? '');
      if (!inPortfolio) {
        router.push(path);
        return;
      }
      if (window.location.pathname !== path) window.history.pushState(null, '', path);
    };
    const goToMain = () => {
      useUiStore.setState({ initialChatQuery: '' });
      navigate('/');
    };
    const goToProject = (id: string) => navigate(projectPath(id));
    return {
      goToMain,
      goToProject,
      /** Back to the current project's page (or home when there is no project). */
      goToProjects: () => (projectId ? goToProject(projectId) : goToMain()),
      goToChat: (query = '') => {
        useUiStore.setState({ initialChatQuery: query });
        navigate('/chat');
      },
      goToProjectChat: (id: string, query = '') => {
        useUiStore.setState({ initialChatQuery: query });
        navigate(projectChatPath(id));
      },
      /** Switch the project shown in the project view. */
      selectProject: goToProject,
      /** Scroll to a section of the main page, navigating back to it first if another view is open. */
      scrollToSection: (id: SectionId) => {
        // Only the home page has the sections; /blog and friends navigate there first
        if (pathname === '/') {
          scrollToElement(id);
          return;
        }
        useUiStore.setState({ initialChatQuery: '', pendingSection: id });
        navigate('/');
      },
    };
  }, [router, pathname, projectId]);

  return { ...route, initialChatQuery, pendingSection, clearInitialChatQuery, clearPendingSection, ...actions };
};

// Keep old export for backward compatibility during migration
export const useOverlayStore = useViewStore;
