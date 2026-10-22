import { act, render, screen } from '@testing-library/react';
import StreamingMarkdown from '../StreamingMarkdown';

beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());

it('reveals a long answer in bounded batches and completes without character-by-character work', () => {
  const content = 'Aether makes design systems. '.repeat(100);
  const onProgress = jest.fn();
  const onComplete = jest.fn();
  render(<StreamingMarkdown content={content} onProgress={onProgress} onComplete={onComplete} />);
  act(() => jest.advanceTimersByTime(600));
  expect(screen.queryByText(content.trim())).toBeNull();
  act(() => jest.advanceTimersByTime(600));
  expect(screen.getByText(content.trim())).toBeInTheDocument();
  expect(onComplete).toHaveBeenCalledWith(content);
  expect(onProgress.mock.calls.length).toBeLessThanOrEqual(25);
});

it('shows completed answers immediately when a virtualized message mounts again', () => {
  render(<StreamingMarkdown content="Already read." isComplete />);
  expect(screen.getByText('Already read.')).toBeInTheDocument();
  expect(jest.getTimerCount()).toBe(0);
});
