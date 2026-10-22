import { render, screen } from '@testing-library/react';
import { afterEach, expect, it, jest } from '@jest/globals';
import '@testing-library/jest-dom/jest-globals';
import { usePathname } from 'next/navigation';
import App from '../App';

jest.mock('next/dynamic', () => () => function Chat() { return <div>Chat window</div>; });
jest.mock('../hooks/useUnicornStudio', () => ({ useUnicornStudio: () => false }));
jest.mock('../state/portfolio', () => ({ usePortfolio: () => jest.requireActual<typeof import('../../lib/portfolio-fixture')>('../../lib/portfolio-fixture').PORTFOLIO_FIXTURE }));
jest.mock('../components/Header', () => function Header() { return <nav>Navigation</nav>; });
jest.mock('../components/Hero', () => function Hero() { return <img src="/images/hero_dark_focus.webp" alt="Home background" />; });
jest.mock('../components/Skills', () => () => null);
jest.mock('../components/Projects', () => () => null);
jest.mock('../components/About', () => () => null);
jest.mock('../components/Testimonials', () => () => null);
jest.mock('../components/Contact', () => () => null);
jest.mock('../components/Footer', () => () => null);
jest.mock('../components/overlays/OverlaySidebar', () => () => null);

const pathname = usePathname as jest.Mock;

afterEach(() => document.body.classList.remove('body-lock'));

it('retains the iframe and homepage images across project, chat, and home switches', () => {
  pathname.mockReturnValue('/');
  const { rerender } = render(<App><img src="/images/hero_dark_focus.webp" alt="Home background" /></App>);
  const image = screen.getByAltText('Home background');
  expect(document.querySelector('iframe')).toBeNull();

  pathname.mockReturnValue('/projects/driq-health-ai');
  rerender(<App><img src="/images/hero_dark_focus.webp" alt="Home background" /></App>);
  const frame = screen.getByTitle(/DriQ Health/);
  expect(frame).toHaveAttribute('src', 'https://info.vansh.fyi/d-ai');
  expect(frame).toBeVisible();
  expect(image).not.toBeVisible();
  expect(image.closest('[hidden]')).toHaveAttribute('inert');

  for (const chatPath of ['/projects/driq-health-ai/chat', '/chat', '/projects/aether/chat']) {
    pathname.mockReturnValue(chatPath);
    rerender(<App><img src="/images/hero_dark_focus.webp" alt="Home background" /></App>);
    expect(screen.getByText('Chat window')).toBeVisible();
    expect(screen.getByTitle(/DriQ Health/)).toBe(frame);
    expect(frame).toHaveAttribute('src', 'https://info.vansh.fyi/d-ai');
    expect(frame).not.toBeVisible();
    expect(frame.closest('[hidden]')).toHaveAttribute('inert');
  }

  pathname.mockReturnValue('/projects/driq-health-ai');
  rerender(<App><img src="/images/hero_dark_focus.webp" alt="Home background" /></App>);
  expect(screen.getByTitle(/DriQ Health/)).toBe(frame);
  expect(frame).toBeVisible();
  expect(screen.queryByText('Chat window')).toBeNull();

  pathname.mockReturnValue('/');
  rerender(<App><img src="/images/hero_dark_focus.webp" alt="Home background" /></App>);
  expect(screen.getByAltText('Home background')).toBe(image);
  expect(image).toBeVisible();
  expect(frame).not.toBeVisible();
  expect(document.body).not.toHaveClass('body-lock');

  pathname.mockReturnValue('/projects/aether');
  rerender(<App><img src="/images/hero_dark_focus.webp" alt="Home background" /></App>);
  expect(frame).not.toBeInTheDocument();
  expect(screen.getByTitle(/Aether/)).toHaveAttribute('src', 'https://info.vansh.fyi/a');
  expect(document.querySelectorAll('iframe')).toHaveLength(1);
});

it('opens a project directly and keeps its iframe when entering chat', () => {
  pathname.mockReturnValue('/projects/aether');
  const { rerender } = render(<App><img src="/images/hero_dark_focus.webp" alt="Home background" /></App>);
  const frame = screen.getByTitle(/Aether/);
  expect(frame).toBeVisible();

  pathname.mockReturnValue('/projects/aether/chat');
  rerender(<App><img src="/images/hero_dark_focus.webp" alt="Home background" /></App>);
  expect(screen.getByTitle(/Aether/)).toBe(frame);
  expect(frame).not.toBeVisible();
});

it('does not load an iframe on a direct chat visit', () => {
  pathname.mockReturnValue('/projects/aether/chat');
  render(<App><img src="/images/hero_dark_focus.webp" alt="Home background" /></App>);
  expect(screen.getByText('Chat window')).toBeVisible();
  expect(document.querySelector('iframe')).toBeNull();
});
