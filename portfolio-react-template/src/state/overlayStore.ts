import { create } from 'zustand';

type ViewState = 'main' | 'projects' | 'chat';
type ChatContext = 'personal' | 'project';

interface ViewStore {
  currentView: ViewState;
  initialChatQuery: string;
  chatContext: ChatContext;
  projectId?: string;
  setView: (view: ViewState) => void;
  goToMain: () => void;
  goToProjects: () => void;
  goToChat: (query?: string) => void;
  goToProjectChat: (projectId: string, query?: string) => void;
}

export const useViewStore = create<ViewStore>((set) => ({
  currentView: 'main',
  initialChatQuery: '',
  chatContext: 'personal',
  projectId: undefined,
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
}));

// Keep old export for backward compatibility during migration
export const useOverlayStore = useViewStore;
