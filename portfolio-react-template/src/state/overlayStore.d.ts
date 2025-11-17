interface OverlayState {
    isProjectOverlayVisible: boolean;
    isChatOverlayVisible: boolean;
    openProjectOverlay: () => void;
    closeProjectOverlay: () => void;
    openChatOverlay: () => void;
    closeChatOverlay: () => void;
}
export declare const useOverlayStore: import("zustand").UseBoundStore<import("zustand").StoreApi<OverlayState>>;
export {};
