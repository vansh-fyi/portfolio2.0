import { renderHook } from '@testing-library/react';
import { useRAGQuery } from '../useRAGQuery';
import { useViewStore } from '../../state/overlayStore';
import { trpc } from '../../services/trpc';

// Mock the Zustand store
jest.mock('../../state/overlayStore', () => ({
  useViewStore: jest.fn(),
}));

// Mock the tRPC client
jest.mock('../../services/trpc', () => ({
  trpc: {
    rag: {
      query: {
        useQuery: jest.fn(),
      },
    },
  },
}));

const mockUseQuery = (trpc as any).rag.query.useQuery as jest.Mock;

describe('useRAGQuery', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    mockUseQuery.mockClear();
    (useViewStore as unknown as jest.Mock).mockClear();
  });

  it('should call the tRPC query with personal context', () => {
    // Arrange
    (useViewStore as unknown as jest.Mock).mockReturnValue({
      chatContext: 'personal',
      projectId: undefined,
    });
    mockUseQuery.mockReturnValue({
      data: null,
      error: null,
      isLoading: false,
      refetch: jest.fn(),
    });

    // Act
    renderHook(() => useRAGQuery('test query'));

    // Assert
    expect(mockUseQuery).toHaveBeenCalledWith(
      {
        query: 'test query',
        context: 'personal',
        projectId: undefined,
      },
      {
        enabled: false,
        gcTime: 1000 * 60 * 5,
        staleTime: Infinity,
      }
    );
  });

  it('should call the tRPC query with project context and projectId', () => {
    // Arrange
    (useViewStore as unknown as jest.Mock).mockReturnValue({
      chatContext: 'project',
      projectId: 'test-project-id',
    });
    mockUseQuery.mockReturnValue({
      data: null,
      error: null,
      isLoading: false,
      refetch: jest.fn(),
    });

    // Act
    renderHook(() => useRAGQuery('test query'));

    // Assert
    expect(mockUseQuery).toHaveBeenCalledWith(
      {
        query: 'test query',
        context: 'project',
        projectId: 'test-project-id',
      },
      {
        enabled: false,
        gcTime: 1000 * 60 * 5,
        staleTime: Infinity,
      }
    );
  });

  it('should return the correct loading state', () => {
    // Arrange
    (useViewStore as unknown as jest.Mock).mockReturnValue({
      chatContext: 'personal',
    });
    mockUseQuery.mockReturnValue({
      data: null,
      error: null,
      isLoading: true,
      refetch: jest.fn(),
    });

    // Act
    const { result } = renderHook(() => useRAGQuery('test query'));

    // Assert
    expect(result.current.isLoading).toBe(true);
  });

  it('should return the correct data on success', () => {
    // Arrange
    const mockData = { response: 'This is a test response.' };
    (useViewStore as unknown as jest.Mock).mockReturnValue({
      chatContext: 'personal',
    });
    mockUseQuery.mockReturnValue({
      data: mockData,
      error: null,
      isLoading: false,
      refetch: jest.fn(),
    });

    // Act
    const { result } = renderHook(() => useRAGQuery('test query'));

    // Assert
    expect(result.current.data).toEqual(mockData);
  });

  it('should return an error on failure', () => {
    // Arrange
    const mockError = new Error('Test error');
    (useViewStore as unknown as jest.Mock).mockReturnValue({
      chatContext: 'personal',
    });
    mockUseQuery.mockReturnValue({
      data: null,
      error: mockError,
      isLoading: false,
      refetch: jest.fn(),
    });

    // Act
    const { result } = renderHook(() => useRAGQuery('test query'));

    // Assert
    expect(result.current.error).toEqual(mockError);
  });
});
