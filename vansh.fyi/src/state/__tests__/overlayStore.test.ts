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

  describe('Project Context Management (Story 1.2)', () => {
    it('should navigate to project chat with correct state', () => {
      const { result } = renderHook(() => useViewStore());
      act(() => {
        result.current.goToProjectChat('driq-health', 'Tell me about this project');
      });
      expect(result.current.currentView).toBe('chat');
      expect(result.current.chatContext).toBe('project');
      expect(result.current.projectId).toBe('driq-health');
      expect(result.current.initialChatQuery).toBe('Tell me about this project');
    });

    it('should preserve projectId when navigating to projects view', () => {
      const { result } = renderHook(() => useViewStore());
      // Start with project chat
      act(() => {
        result.current.goToProjectChat('aether');
      });
      expect(result.current.projectId).toBe('aether');

      // Navigate to projects view (e.g., closing chat)
      act(() => {
        result.current.goToProjects();
      });
      expect(result.current.currentView).toBe('projects');
      expect(result.current.projectId).toBe('aether'); // Project ID preserved
    });

    it('should clear projectId when navigating to main view', () => {
      const { result } = renderHook(() => useViewStore());
      // Start with project selected
      act(() => {
        result.current.goToProjectChat('portfolio-website');
      });
      expect(result.current.projectId).toBe('portfolio-website');

      // Navigate to main (reset everything)
      act(() => {
        result.current.goToMain();
      });
      expect(result.current.currentView).toBe('main');
      expect(result.current.chatContext).toBe('personal');
      expect(result.current.projectId).toBeUndefined();
    });

    it('should navigate to personal chat without projectId', () => {
      const { result } = renderHook(() => useViewStore());
      act(() => {
        result.current.goToChat('What is Vansh\'s experience?');
      });
      expect(result.current.currentView).toBe('chat');
      expect(result.current.chatContext).toBe('personal');
      expect(result.current.projectId).toBeUndefined();
      expect(result.current.initialChatQuery).toBe('What is Vansh\'s experience?');
    });
  });
});
