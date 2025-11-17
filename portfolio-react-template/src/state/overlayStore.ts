import { create } from 'zustand';

interface OverlayState {
  isProjectOverlayVisible: boolean;
  isChatOverlayVisible: boolean;
  openProjectOverlay: () => void;
  closeProjectOverlay: () => void;
  openChatOverlay: () => void;
  closeChatOverlay: () => void;
}

export const useOverlayStore = create<OverlayState>((set) => ({
  isProjectOverlayVisible: false,
  isChatOverlayVisible: false,
  openProjectOverlay: () => set({ isProjectOverlayVisible: true }),
  closeProjectOverlay: () => set({ isProjectOverlayVisible: false }),
  openChatOverlay: () => set({ isChatOverlayVisible: true }),
  closeChatOverlay: () => set({ isChatOverlayVisible: false }),
}));
