import { act, render, screen } from '@testing-library/react';
import RetainedProjectFrame from '../RetainedProjectFrame';

beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());

it('retains a project for quick reopening and releases it after prolonged inactivity', () => {
  const props = { src: 'https://info.vansh.fyi/a', title: 'Aether' };
  const { rerender } = render(<RetainedProjectFrame {...props} active />);
  const frame = screen.getByTitle('Aether');
  rerender(<RetainedProjectFrame {...props} active={false} />);
  act(() => jest.advanceTimersByTime(59_000));
  rerender(<RetainedProjectFrame {...props} active />);
  expect(screen.getByTitle('Aether')).toBe(frame);
  act(() => jest.advanceTimersByTime(60_000));
  expect(screen.getByTitle('Aether')).toBe(frame);
  rerender(<RetainedProjectFrame {...props} active={false} />);
  act(() => jest.advanceTimersByTime(60_000));
  expect(screen.queryByTitle('Aether')).toBeNull();
  rerender(<RetainedProjectFrame {...props} active />);
  expect(screen.getByTitle('Aether')).not.toBe(frame);
  expect(screen.getByTitle('Aether')).toHaveAttribute('src', props.src);
});

it('notifies the embed of visibility changes using its exact origin', () => {
  const { rerender } = render(<RetainedProjectFrame src="https://info.vansh.fyi/a" title="Aether" active />);
  const frame = screen.getByTitle('Aether') as HTMLIFrameElement;
  const post = jest.spyOn(frame.contentWindow!, 'postMessage');
  rerender(<RetainedProjectFrame src="https://info.vansh.fyi/a" title="Aether" active={false} />);
  expect(post).toHaveBeenCalledWith({ type: 'portfolio:visibility', visible: false }, 'https://info.vansh.fyi');
});
