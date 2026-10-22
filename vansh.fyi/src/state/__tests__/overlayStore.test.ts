import { act, renderHook } from '@testing-library/react';
import { usePathname, useRouter } from 'next/navigation';
import { pathToState, projectChatPath, projectPath, useUiStore, useViewStore } from '../overlayStore';

const push = jest.fn();
let pushState: jest.SpyInstance;
const mockPathname = usePathname as jest.Mock;
const mockRouter = useRouter as jest.Mock;

beforeEach(() => {
  window.history.replaceState(null, '', '/');
  pushState = jest.spyOn(window.history, 'pushState');
  push.mockClear();
  mockPathname.mockReturnValue('/');
  mockRouter.mockReturnValue({ push });
  useUiStore.setState({ initialChatQuery: '', pendingSection: undefined });
});

afterEach(() => jest.restoreAllMocks());

describe('pathToState', () => {
  it('maps every route to a view', () => {
    expect(pathToState('/')).toEqual({ currentView: 'main', chatContext: 'personal' });
    expect(pathToState('/chat')).toEqual({ currentView: 'chat', chatContext: 'personal' });
    expect(pathToState('/projects/aether')).toEqual({ currentView: 'projects', chatContext: 'personal', projectId: 'aether' });
    expect(pathToState('/projects/aether/chat')).toEqual({ currentView: 'chat', chatContext: 'project', projectId: 'aether' });
  });

  it('falls back to main for unknown paths and a missing pathname', () => {
    expect(pathToState('/nonsense').currentView).toBe('main');
    expect(pathToState('/projects').currentView).toBe('main');
    expect(pathToState(null).currentView).toBe('main');
  });

  it('builds the matching paths', () => {
    expect(projectPath('aether')).toBe('/projects/aether');
    expect(projectChatPath('aether')).toBe('/projects/aether/chat');
  });
});

describe('useViewStore', () => {
  it('derives the view from the URL', () => {
    mockPathname.mockReturnValue('/projects/driq-health/chat');
    const { result } = renderHook(() => useViewStore());
    expect(result.current).toMatchObject({ currentView: 'chat', chatContext: 'project', projectId: 'driq-health' });
  });

  it('navigates to a project and to project chat', () => {
    const { result } = renderHook(() => useViewStore());
    act(() => result.current.selectProject('sparto'));
    expect(pushState).toHaveBeenLastCalledWith(null, '', '/projects/sparto');
    act(() => result.current.goToProjectChat('sparto', 'Tell me about this project'));
    expect(pushState).toHaveBeenLastCalledWith(null, '', '/projects/sparto/chat');
    expect(useUiStore.getState().initialChatQuery).toBe('Tell me about this project');
  });

  it('navigates to personal chat with an initial query', () => {
    const { result } = renderHook(() => useViewStore());
    act(() => result.current.goToChat("What is Vansh's experience?"));
    expect(pushState).toHaveBeenLastCalledWith(null, '', '/chat');
    expect(useUiStore.getState().initialChatQuery).toBe("What is Vansh's experience?");
  });

  it('goToProjects returns to the current project, or home without one', () => {
    mockPathname.mockReturnValue('/projects/aether/chat');
    const inProject = renderHook(() => useViewStore());
    act(() => inProject.result.current.goToProjects());
    expect(pushState).toHaveBeenLastCalledWith(null, '', '/projects/aether');

    window.history.replaceState(null, '', '/chat');
    mockPathname.mockReturnValue('/chat');
    const noProject = renderHook(() => useViewStore());
    act(() => noProject.result.current.goToProjects());
    expect(pushState).toHaveBeenLastCalledWith(null, '', '/');
  });

  it('goToMain clears a pending chat query', () => {
    useUiStore.setState({ initialChatQuery: 'leftover' });
    window.history.replaceState(null, '', '/chat');
    mockPathname.mockReturnValue('/chat');
    const { result } = renderHook(() => useViewStore());
    act(() => result.current.goToMain());
    expect(pushState).toHaveBeenLastCalledWith(null, '', '/');
    expect(useUiStore.getState().initialChatQuery).toBe('');
  });

  it('uses the router when entering the portfolio from a blog page', () => {
    mockPathname.mockReturnValue('/blog/a-post');
    const { result } = renderHook(() => useViewStore());
    act(() => result.current.scrollToSection('projects'));
    expect(push).toHaveBeenCalledWith('/');
    expect(pushState).not.toHaveBeenCalled();
    expect(useUiStore.getState().pendingSection).toBe('projects');
  });

  it('does not add duplicate history entries for repeated project clicks', () => {
    const { result } = renderHook(() => useViewStore());
    act(() => result.current.goToProject('aether'));
    act(() => result.current.goToProject('aether'));
    expect(pushState).toHaveBeenCalledTimes(1);
    expect(push).not.toHaveBeenCalled();
  });

  it('updates the URL without waiting for the router or a server response', () => {
    const { result, rerender } = renderHook(() => useViewStore());
    act(() => result.current.goToProject('aether'));
    expect(window.location.pathname).toBe('/projects/aether');
    mockPathname.mockReturnValue('/projects/aether');
    rerender();
    expect(result.current.currentView).toBe('projects');
    act(() => result.current.scrollToSection('projects'));
    expect(window.location.pathname).toBe('/');
    expect(push).not.toHaveBeenCalled();
  });

  describe('scrollToSection', () => {
    it('scrolls in place on the main page', () => {
      const scrollIntoView = jest.fn();
      document.body.innerHTML = '<section id="about"></section>';
      document.getElementById('about')!.scrollIntoView = scrollIntoView;
      const { result } = renderHook(() => useViewStore());
      act(() => result.current.scrollToSection('about'));
      expect(scrollIntoView).toHaveBeenCalled();
      expect(push).not.toHaveBeenCalled();
    });

    it('navigates home and remembers the section from another view', () => {
      window.history.replaceState(null, '', '/projects/aether');
      mockPathname.mockReturnValue('/projects/aether');
      const { result } = renderHook(() => useViewStore());
      act(() => result.current.scrollToSection('projects'));
      expect(pushState).toHaveBeenLastCalledWith(null, '', '/');
      expect(useUiStore.getState().pendingSection).toBe('projects');
    });
  });
});
