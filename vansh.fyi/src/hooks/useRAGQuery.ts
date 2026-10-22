'use client';

import { useCallback } from 'react';
import { trpc } from '../services/trpc';
import type { RagRequest } from '../../lib/chat';

/** Use the typed client directly: conversation history must never enter the query cache. */
export const useRAGQuery = () => {
  const { client } = trpc.useUtils();
  return useCallback((request: RagRequest, signal: AbortSignal) =>
    client.rag.send.mutate(request, { signal }), [client]);
};
