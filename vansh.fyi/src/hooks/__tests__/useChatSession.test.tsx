import { act, renderHook } from '@testing-library/react';
import { useChatSession } from '../useChatSession';
import { useRAGQuery } from '../useRAGQuery';
import { CHAT_LIMITS } from '../../../lib/chat';

jest.mock('../useRAGQuery');
const ask = jest.fn();
const scope = { context: 'project' as const, projectId: 'aether' };
const greeting = 'Ask about Aether.';

beforeEach(() => {
  ask.mockReset().mockResolvedValue({ success: true, response: 'A complete answer.', sources: [] });
  (useRAGQuery as jest.Mock).mockReturnValue(ask);
});
afterEach(() => jest.useRealTimers());

it('sends only successful completed exchanges as memory, excluding the greeting', async () => {
  const { result } = renderHook(() => useChatSession(scope, greeting));
  await act(async () => { await result.current.send('First question'); });
  await act(async () => { await result.current.send('Follow-up'); });
  expect(ask.mock.calls[0][0].history).toEqual([]);
  expect(ask.mock.calls[1][0]).toMatchObject({ context: 'project', projectId: 'aether', history: [
    { role: 'user', content: 'First question' }, { role: 'assistant', content: 'A complete answer.' },
  ] });
});

it('caps transmitted memory and the visible transcript during long conversations', async () => {
  const { result } = renderHook(() => useChatSession(scope, greeting));
  for (let i = 0; i < 30; i++) await act(async () => { await result.current.send(`Question ${i}`); });
  for (const [input] of ask.mock.calls) {
    expect(input.history.length).toBeLessThanOrEqual(6);
    expect(input.history.reduce((size: number, turn: { content: string }) => size + turn.content.length, 0)).toBeLessThanOrEqual(3000);
  }
  expect(result.current.messages.length).toBeLessThanOrEqual(CHAT_LIMITS.transcriptMessages);
});

it('rejects overlapping submissions and ignores a late response after purging', async () => {
  let resolve!: (value: unknown) => void;
  ask.mockReturnValueOnce(new Promise((done) => { resolve = done; }));
  const { result } = renderHook(() => useChatSession(scope, greeting));
  let pending!: Promise<void>;
  act(() => { pending = result.current.send('Old question'); });
  await act(async () => { await result.current.send('Double click'); });
  expect(ask).toHaveBeenCalledTimes(1);
  expect(result.current.isSending).toBe(true);
  act(() => result.current.purge());
  expect(ask.mock.calls[0][1].aborted).toBe(true);
  await act(async () => { resolve({ response: 'Old answer' }); await pending; });
  expect(result.current.messages).toEqual([{ sender: 'ai', text: greeting }]);
  await act(async () => { await result.current.send('New question'); });
  expect(ask.mock.calls[1][0].history).toEqual([]);
});

it('aborts an in-flight request when the view is unmounted', () => {
  ask.mockReturnValueOnce(new Promise(() => {}));
  const { result, unmount } = renderHook(() => useChatSession(scope, greeting));
  act(() => { void result.current.send('Question'); });
  unmount();
  expect(ask.mock.calls[0][1].aborted).toBe(true);
});

it('purges transcript, draft and memory after ten idle minutes', async () => {
  jest.useFakeTimers();
  const { result } = renderHook(() => useChatSession(scope, greeting));
  await act(async () => { await result.current.send('First question'); });
  act(() => result.current.setInput('A private draft'));
  act(() => jest.advanceTimersByTime(CHAT_LIMITS.idleMs));
  expect(result.current.input).toBe('');
  expect(result.current.messages).toEqual([{ sender: 'ai', text: greeting }]);
  await act(async () => { await result.current.send('New question'); });
  expect(ask.mock.calls[1][0].history).toEqual([]);
});

it('checks the expiry on tab resume even if background timers were delayed', async () => {
  jest.useFakeTimers();
  const { result } = renderHook(() => useChatSession(scope, greeting));
  await act(async () => { await result.current.send('First question'); });
  jest.setSystemTime(Date.now() + CHAT_LIMITS.idleMs + 1);
  act(() => document.dispatchEvent(new Event('visibilitychange')));
  expect(result.current.messages).toEqual([{ sender: 'ai', text: greeting }]);
});

it('does not add failed answers to future memory', async () => {
  ask.mockRejectedValueOnce(new Error('Quota exhausted'));
  const { result } = renderHook(() => useChatSession(scope, greeting));
  await act(async () => { await result.current.send('Failed question'); });
  expect(result.current.isSending).toBe(false);
  await act(async () => { await result.current.send('Try again'); });
  expect(ask.mock.calls[1][0].history).toEqual([]);
});
