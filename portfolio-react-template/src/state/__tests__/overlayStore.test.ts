import { useOverlayStore } from '../overlayStore';
import { act, renderHook } from '@testing-library/react';

describe('useOverlayStore', () => {
  it('should have the correct initial state', () => {
    const { result } = renderHook(() => useOverlayStore());
    expect(result.current.isProjectOverlayVisible).toBe(false);
    expect(result.current.isChatOverlayVisible).toBe(false);
  });

  it('should open the project overlay', () => {
    const { result } = renderHook(() => useOverlayStore());
    act(() => {
      result.current.openProjectOverlay();
    });
    expect(result.current.isProjectOverlayVisible).toBe(true);
  });

  it('should close the project overlay', () => {
    const { result } = renderHook(() => useOverlayStore());
    act(() => {
      result.current.openProjectOverlay();
    });
    act(() => {
      result.current.closeProjectOverlay();
    });
    expect(result.current.isProjectOverlayVisible).toBe(false);
  });

  it('should open the chat overlay', () => {
    const { result } = renderHook(() => useOverlayStore());
    act(() => {
      result.current.openChatOverlay();
    });
    expect(result.current.isChatOverlayVisible).toBe(true);
  });

  it('should close the chat overlay', () => {
    const { result } = renderHook(() => useOverlayStore());
    act(() => {
      result.current.openChatOverlay();
    });
    act(() => {
      result.current.closeChatOverlay();
    });
    expect(result.current.isChatOverlayVisible).toBe(false);
  });
});
