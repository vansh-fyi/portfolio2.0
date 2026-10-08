import { act, renderHook } from '@testing-library/react';
import { usePathname, useRouter } from 'next/navigation';
import { pathToState, projectChatPath, projectPath, useUiStore, useViewStore } from '../overlayStore';

const push = jest.fn();
const mockPathname = usePathname as jest.Mock;
const mockRouter = useRouter as jest.Mock;

beforeEach(() => {
  push.mockClear();
  mockPathname.mockReturnValue('/');
  mockRouter.mockReturnValue({ push });
  useUiStore.setState({ initialChatQuery: '', pendingSection: undefined });
});

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
    expect(push).toHaveBeenLastCalledWith('/projects/sparto');
    act(() => result.current.goToProjectChat('sparto', 'Tell me about this project'));
    expect(push).toHaveBeenLastCalledWith('/projects/sparto/chat');
    expect(useUiStore.getState().initialChatQuery).toBe('Tell me about this project');
  });

  it('navigates to personal chat with an initial query', () => {
    const { result } = renderHook(() => useViewStore());
    act(() => result.current.goToChat("What is Vansh's experience?"));
    expect(push).toHaveBeenLastCalledWith('/chat');
    expect(useUiStore.getState().initialChatQuery).toBe("What is Vansh's experience?");
  });

  it('goToProjects returns to the current project, or home without one', () => {
    mockPathname.mockReturnValue('/projects/aether/chat');
    const inProject = renderHook(() => useViewStore());
    act(() => inProject.result.current.goToProjects());
    expect(push).toHaveBeenLastCalledWith('/projects/aether');

    mockPathname.mockReturnValue('/chat');
    const noProject = renderHook(() => useViewStore());
    act(() => noProject.result.current.goToProjects());
    expect(push).toHaveBeenLastCalledWith('/');
  });

  it('goToMain clears a pending chat query', () => {
    useUiStore.setState({ initialChatQuery: 'leftover' });
    mockPathname.mockReturnValue('/chat');
    const { result } = renderHook(() => useViewStore());
    act(() => result.current.goToMain());
    expect(push).toHaveBeenLastCalledWith('/');
    expect(useUiStore.getState().initialChatQuery).toBe('');
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
      mockPathname.mockReturnValue('/projects/aether');
      const { result } = renderHook(() => useViewStore());
      act(() => result.current.scrollToSection('projects'));
      expect(push).toHaveBeenLastCalledWith('/');
      expect(useUiStore.getState().pendingSection).toBe('projects');
    });
  });
});
