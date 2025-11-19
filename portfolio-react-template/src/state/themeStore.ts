import { create } from 'zustand';

interface ThemeState {
  isLightMode: boolean;
  toggleTheme: () => void;
  switchToLightMode: () => void;
  switchToDarkMode: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  isLightMode: false,
  toggleTheme: () => set((state) => ({ isLightMode: !state.isLightMode })),
  switchToLightMode: () => set({ isLightMode: true }),
  switchToDarkMode: () => set({ isLightMode: false }),
}));
