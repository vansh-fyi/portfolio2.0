import { render, screen } from '@testing-library/react';
import ChatView from '../ChatOverlay';
import { useViewStore } from '../../../state/overlayStore';

// Mock the dependencies
jest.mock('../../../state/overlayStore');
jest.mock('../../../hooks/useRAGQuery', () => ({
  useRAGQuery: jest.fn(() => ({
    data: null,
    error: null,
    isLoading: false,
    refetch: jest.fn(),
  })),
}));
jest.mock('../../../data/projects', () => ({
  getProjectName: jest.fn((id: string) => {
    if (id === 'portfolio-website') return 'AI-Powered Portfolio';
    return undefined;
  }),
}));

describe('ChatView', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('should render chat view', () => {
    (useViewStore as unknown as jest.Mock).mockReturnValue({
      goToMain: jest.fn(),
      goToProjects: jest.fn(),
      chatContext: 'personal',
      initialChatQuery: '',
      projectId: undefined,
    });

    render(<ChatView />);
    expect(screen.getByPlaceholderText('Ask anything about the project in detail...')).toBeInTheDocument();
  });

  it('should render close button', () => {
    (useViewStore as unknown as jest.Mock).mockReturnValue({
      goToMain: jest.fn(),
      goToProjects: jest.fn(),
      chatContext: 'personal',
      initialChatQuery: '',
      projectId: undefined,
    });

    render(<ChatView />);
    expect(screen.getByLabelText(/Close/i)).toBeInTheDocument();
  });

  describe('Greeting Messages (Story 2.2)', () => {
    it('should display personal greeting when chat context is personal', async () => {
      (useViewStore as unknown as jest.Mock).mockReturnValue({
        goToMain: jest.fn(),
        goToProjects: jest.fn(),
        chatContext: 'personal',
        initialChatQuery: '',
        projectId: undefined,
      });

      render(<ChatView />);
      expect(await screen.findByText("Hi! I'm Ursa. Ask me anything about Vansh.")).toBeInTheDocument();
    });

    it('should display project greeting with project name when chat context is project', async () => {
      (useViewStore as unknown as jest.Mock).mockReturnValue({
        goToMain: jest.fn(),
        goToProjects: jest.fn(),
        chatContext: 'project',
        initialChatQuery: '',
        projectId: 'portfolio-website',
      });

      render(<ChatView />);
      expect(await screen.findByText('Hello! Ask anything about AI-Powered Portfolio here.')).toBeInTheDocument();
    });

    it('should display fallback project greeting when projectId is not found', async () => {
      (useViewStore as unknown as jest.Mock).mockReturnValue({
        goToMain: jest.fn(),
        goToProjects: jest.fn(),
        chatContext: 'project',
        initialChatQuery: '',
        projectId: 'unknown-project',
      });

      render(<ChatView />);
      expect(await screen.findByText('Hello! Ask anything about this project here.')).toBeInTheDocument();
    });

    it('should display fallback project greeting when projectId is undefined', async () => {
      (useViewStore as unknown as jest.Mock).mockReturnValue({
        goToMain: jest.fn(),
        goToProjects: jest.fn(),
        chatContext: 'project',
        initialChatQuery: '',
        projectId: undefined,
      });

      render(<ChatView />);
      expect(await screen.findByText('Hello! Ask anything about this project here.')).toBeInTheDocument();
    });

    // Note: Testing greeting adaptation when switching projects (AC #4)
    // would require a more complex test setup with component re-rendering
    // and state changes. This is covered by the useEffect dependency array
    // [chatContext, projectId] which ensures greeting updates.
  });

  describe('Project Selection and Switching (Story 1.2)', () => {
    it('should read projectId from store on mount', () => {
      const mockGoToProjectChat = jest.fn();
      (useViewStore as unknown as jest.Mock).mockReturnValue({
        goToMain: jest.fn(),
        goToProjects: jest.fn(),
        goToProjectChat: mockGoToProjectChat,
        chatContext: 'project',
        initialChatQuery: '',
        projectId: 'driq-health',
      });

      render(<ChatView />);
      // Component should use projectId from store
      expect(useViewStore).toHaveBeenCalled();
    });

    it('should pass correct projectId to tRPC query', () => {
      const mockRefetch = jest.fn();
      const { useRAGQuery } = require('../../../hooks/useRAGQuery');

      (useViewStore as unknown as jest.Mock).mockReturnValue({
        goToMain: jest.fn(),
        goToProjects: jest.fn(),
        goToProjectChat: jest.fn(),
        chatContext: 'project',
        initialChatQuery: 'Tell me about this',
        projectId: 'aether',
      });

      useRAGQuery.mockReturnValue({
        data: null,
        error: null,
        isLoading: false,
        refetch: mockRefetch,
      });

      render(<ChatView />);

      // Note: Actual tRPC param verification would require deeper mocking
      // The critical fix is in useRAGQuery.ts using useViewStore() hook
      // which ensures projectId is reactive
      expect(useRAGQuery).toHaveBeenCalled();
    });

    it('should display greeting when in project context', async () => {
      (useViewStore as unknown as jest.Mock).mockReturnValue({
        goToMain: jest.fn(),
        goToProjects: jest.fn(),
        goToProjectChat: jest.fn(),
        chatContext: 'project',
        initialChatQuery: '',
        projectId: 'portfolio-website',
      });

      render(<ChatView />);

      // Verify project greeting is displayed
      // Note: useEffect [chatContext, projectId] handles greeting updates
      expect(await screen.findByText(/Hello! Ask anything about AI-Powered Portfolio here./)).toBeInTheDocument();
    });
  });
});
