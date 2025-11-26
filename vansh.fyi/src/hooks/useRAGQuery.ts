import { trpc } from '../services/trpc';
import { useViewStore } from '../state/overlayStore';
import { useState, useCallback } from 'react';

/**
 * Custom hook for RAG queries with support for both streaming and non-streaming responses
 *
 * Current implementation: Non-streaming (one-shot query)
 * Future enhancement: Will support streaming responses using tRPC subscriptions
 * when backend implements streaming (see AC #4)
 *
 * @param query - The user's question/query
 * @returns Query result with data, loading state, error, and refetch function
 */
export const useRAGQuery = (query: string) => {
  const { chatContext, projectId } = useViewStore();

  // Type assertion needed due to placeholder AppRouter type
  // This will be properly typed when backend AppRouter is imported
  const ragQuery = (trpc as any).rag.query.useQuery(
    {
      query,
      context: chatContext,
      projectId: chatContext === 'project' ? projectId : undefined,
    },
    {
      enabled: false, // We will call this query manually
      gcTime: 1000 * 60 * 5, // Cache for 5 minutes to prevent GC thrashing
      staleTime: Infinity, // Keep data fresh to avoid refetches
    }
  );

  return ragQuery;
};

/**
 * Hook for streaming RAG queries (FUTURE IMPLEMENTATION)
 *
 * This hook will be implemented once the backend supports streaming responses.
 * Infrastructure is ready - just needs backend tRPC subscription endpoint.
 *
 * Planned implementation:
 * - Use tRPC subscriptions for real-time token streaming
 * - Accumulate tokens as they arrive
 * - Return streaming state (isStreaming, tokens, complete)
 *
 * @see docs/architecture.md - RAG API contract specifies AsyncIterable<{ token: string }>
 * @see https://trpc.io/docs/subscriptions
 */
export const useRAGQueryStreaming = (query: string) => {
  const { chatContext, projectId } = useViewStore.getState();
  const [tokens] = useState<string[]>([]);
  const [isStreaming] = useState(false);
  const [isComplete] = useState(false);
  const [error] = useState<Error | null>(null);

  const startStream = useCallback(() => {
    // TODO: Implement tRPC subscription when backend is ready
    // Example implementation:
    /*
    setIsStreaming(true);
    setTokens([]);
    setIsComplete(false);
    setError(null);

    const subscription = trpc.rag.queryStream.useSubscription(
      {
        query,
        context: chatContext,
        projectId: chatContext === 'project' ? projectId : undefined,
      },
      {
        onData(token) {
          setTokens(prev => [...prev, token.token]);
        },
        onError(err) {
          setError(err);
          setIsStreaming(false);
        },
        onComplete() {
          setIsComplete(true);
          setIsStreaming(false);
        },
      }
    );

    return () => subscription.unsubscribe();
    */

    // Placeholder for now
    console.warn(
      'Streaming not yet implemented - waiting for backend support (Epic 4)'
    );
  }, [query, chatContext, projectId]);

  return {
    tokens,
    isStreaming,
    isComplete,
    error,
    startStream,
    fullResponse: tokens.join(''),
  };
};
