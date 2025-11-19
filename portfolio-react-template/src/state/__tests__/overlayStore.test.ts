import { useViewStore } from '../overlayStore';
import { act, renderHook } from '@testing-library/react';

describe('useViewStore', () => {
  beforeEach(() => {
    // Reset to 'main' view before each test
    useViewStore.setState({ currentView: 'main' });
  });

  it('should have the correct initial state', () => {
    const { result } = renderHook(() => useViewStore());
    expect(result.current.currentView).toBe('main');
  });

  it('should navigate to projects view', () => {
    const { result } = renderHook(() => useViewStore());
    act(() => {
      result.current.goToProjects();
    });
    expect(result.current.currentView).toBe('projects');
  });

  it('should navigate to chat view', () => {
    const { result } = renderHook(() => useViewStore());
    act(() => {
      result.current.goToChat();
    });
    expect(result.current.currentView).toBe('chat');
  });

  it('should navigate back to main view', () => {
    const { result } = renderHook(() => useViewStore());
    act(() => {
      result.current.goToProjects();
    });
    act(() => {
      result.current.goToMain();
    });
    expect(result.current.currentView).toBe('main');
  });

  it('should set view directly', () => {
    const { result } = renderHook(() => useViewStore());
    act(() => {
      result.current.setView('chat');
    });
    expect(result.current.currentView).toBe('chat');
  });
});
