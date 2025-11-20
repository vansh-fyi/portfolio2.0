import { useThemeStore } from '../themeStore';

describe('themeStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useThemeStore.setState({ isLightMode: false });
  });

  it('should initialize with dark mode', () => {
    const { isLightMode } = useThemeStore.getState();
    expect(isLightMode).toBe(false);
  });

  it('should toggle theme from dark to light', () => {
    const { toggleTheme } = useThemeStore.getState();
    toggleTheme();
    const { isLightMode } = useThemeStore.getState();
    expect(isLightMode).toBe(true);
  });

  it('should toggle theme from light to dark', () => {
    useThemeStore.setState({ isLightMode: true });
    const { toggleTheme } = useThemeStore.getState();
    toggleTheme();
    const { isLightMode } = useThemeStore.getState();
    expect(isLightMode).toBe(false);
  });

  it('should switch to light mode', () => {
    const { switchToLightMode } = useThemeStore.getState();
    switchToLightMode();
    const { isLightMode } = useThemeStore.getState();
    expect(isLightMode).toBe(true);
  });

  it('should switch to dark mode', () => {
    useThemeStore.setState({ isLightMode: true });
    const { switchToDarkMode } = useThemeStore.getState();
    switchToDarkMode();
    const { isLightMode } = useThemeStore.getState();
    expect(isLightMode).toBe(false);
  });
});
