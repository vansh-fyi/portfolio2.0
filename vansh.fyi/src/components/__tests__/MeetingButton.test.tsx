import { afterEach, beforeAll, beforeEach, describe, expect, it, jest } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import Hero from '../Hero';
import Contact from '../Contact';
import { useThemeStore } from '../../state/themeStore';

jest.mock('../LeadGenChat', () => function ContactChat() { return <div>Contact chat</div>; });

// jsdom does not implement native modal dialogs or their focus management.
beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute('open', ''); };
  HTMLDialogElement.prototype.close = function () { this.removeAttribute('open'); };
});

beforeEach(() => {
  useThemeStore.setState({ isLightMode: false });
  document.body.style.overflow = '';
});

afterEach(() => { document.body.style.overflow = ''; });

describe('meeting popup', () => {
  it.each(["Let's Connect", 'Schedule a meeting'])('opens from %s and restores focus and scroll on close', (name) => {
    render(<><Hero /><Contact /></>);
    expect(screen.queryByTitle('Book a 30-minute meeting with Vansh')).not.toBeInTheDocument();
    const trigger = screen.getByRole('button', { name });
    trigger.focus();
    document.body.style.overflow = 'clip';
    fireEvent.click(trigger);
    expect(screen.getByRole('dialog', { name: 'Schedule a meeting' })).toBeInTheDocument();
    expect(within(screen.getByRole('dialog')).getByRole('status')).toHaveTextContent('Loading available times');
    expect(document.body.style.overflow).toBe('hidden');
    const close = screen.getByRole('button', { name: 'Close scheduling popup' });
    expect(close).toHaveFocus();
    fireEvent.click(close);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
    expect(document.body.style.overflow).toBe('clip');
    expect(screen.getByRole('link', { name: 'Send Me a Mail' })).toHaveAttribute('href', 'mailto:design@vansh.fyi');
  });

  it.each([
    [false, '1a1a1a', 'ffffff', 'ffffff'],
    [true, 'ffffff', '18181b', '18181b'],
  ])('uses the matching Calendly palette in light mode = %s', (light, background, text, primary) => {
    useThemeStore.setState({ isLightMode: light as boolean });
    render(<Contact />);
    fireEvent.click(screen.getByRole('button', { name: 'Schedule a meeting' }));
    const frame = screen.getByTitle('Book a 30-minute meeting with Vansh');
    const url = new URL(frame.getAttribute('src')!);
    expect(`${url.origin}${url.pathname}`).toBe('https://calendly.com/design-vansh/30min');
    expect(url.searchParams.get('background_color')).toBe(background);
    expect(url.searchParams.get('text_color')).toBe(text);
    expect(url.searchParams.get('primary_color')).toBe(primary);
    expect(url.searchParams.get('embed_type')).toBe('Inline');
    expect(url.searchParams.get('embed_domain')).toBe(window.location.hostname);
    fireEvent.load(frame);
    expect(within(screen.getByRole('dialog')).queryByRole('status')).not.toBeInTheDocument();
    expect(frame.parentElement).toHaveAttribute('aria-busy', 'false');
    const fallback = screen.getByRole('link', { name: 'Open Calendly in a new tab' });
    expect(fallback).toHaveAttribute('href', 'https://calendly.com/design-vansh/30min');
  });

  it('closes on a native Escape cancel or a backdrop click', () => {
    render(<Contact />);
    const trigger = screen.getByRole('button', { name: 'Schedule a meeting' });
    fireEvent.click(trigger);
    const dialog = screen.getByRole('dialog');
    fireEvent(dialog, new Event('cancel', { cancelable: true }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    fireEvent.click(trigger);
    fireEvent.click(screen.getByRole('heading', { name: 'Schedule a meeting' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('dialog'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('updates the embedded colours if the theme changes while open', () => {
    render(<Contact />);
    fireEvent.click(screen.getByRole('button', { name: 'Schedule a meeting' }));
    fireEvent.load(screen.getByTitle('Book a 30-minute meeting with Vansh'));
    act(() => useThemeStore.setState({ isLightMode: true }));
    const url = new URL(screen.getByTitle('Book a 30-minute meeting with Vansh').getAttribute('src')!);
    expect(url.searchParams.get('background_color')).toBe('ffffff');
    expect(within(screen.getByRole('dialog')).getByRole('status')).toBeInTheDocument();
  });
});
