type ViewState = 'main' | 'projects' | 'chat';
type ChatContext = 'personal' | 'project';
interface ViewStore {
    currentView: ViewState;
    initialChatQuery: string;
    chatContext: ChatContext;
    setView: (view: ViewState) => void;
    goToMain: () => void;
    goToProjects: () => void;
    goToChat: (query?: string) => void;
    goToProjectChat: (query?: string) => void;
}
export declare const useViewStore: import("zustand").UseBoundStore<import("zustand").StoreApi<ViewStore>>;
export declare const useOverlayStore: import("zustand").UseBoundStore<import("zustand").StoreApi<ViewStore>>;
export {};
