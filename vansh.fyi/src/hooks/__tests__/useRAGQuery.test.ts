import { renderHook } from '@testing-library/react';
import { useRAGQuery } from '../useRAGQuery';
import { trpc } from '../../services/trpc';

jest.mock('../../services/trpc', () => ({ trpc: { useUtils: jest.fn() } }));

it('uses a cancellable POST mutation without putting history in a query cache', async () => {
  const mutate = jest.fn().mockResolvedValue({ success: true, response: 'Answer.', sources: [] });
  (trpc.useUtils as jest.Mock).mockReturnValue({ client: { rag: { send: { mutate } } } });
  const { result } = renderHook(() => useRAGQuery());
  const request = { context: 'project' as const, projectId: 'aether', query: 'Why?', history: [{ role: 'user' as const, content: 'Question' }, { role: 'assistant' as const, content: 'Answer' }] };
  const signal = new AbortController().signal;
  await result.current(request, signal);
  expect(mutate).toHaveBeenCalledWith(request, { signal });
});
