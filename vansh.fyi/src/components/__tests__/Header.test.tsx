import { fireEvent, render, screen } from '@testing-library/react';
import Header from '../Header';
import { usePathname, useRouter } from 'next/navigation';
import { useUiStore } from '../../state/overlayStore';

const push = jest.fn();

describe('Header', () => {
  beforeEach(() => {
    push.mockClear();
    (usePathname as jest.Mock).mockReturnValue('/');
    (useRouter as jest.Mock).mockReturnValue({ push });
    useUiStore.setState({ pendingSection: undefined });
    document.body.innerHTML = '';
  });

  it('renders section links pointing at their anchors', () => {
    render(<Header />);

    expect(screen.getByText('Skills')).toHaveAttribute('href', '#features');
    expect(screen.getByText('Projects')).toHaveAttribute('href', '#projects');
    expect(screen.getByText('About Me')).toHaveAttribute('href', '#about');
    expect(screen.getByText('Testimonials')).toHaveAttribute('href', '#testimonials');
    expect(screen.getByText('Contact Me')).toHaveAttribute('href', '#contact');
  });

  it('smooth-scrolls to the section when on the main view', () => {
    const scrollIntoView = jest.fn();
    const target = document.createElement('div');
    target.id = 'about';
    target.scrollIntoView = scrollIntoView;
    document.body.appendChild(target);

    render(<Header />);
    fireEvent.click(screen.getByText('About Me'));

    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
  });

  it('returns to the main view with a pending section when clicked from an overlay', () => {
    (usePathname as jest.Mock).mockReturnValue('/projects/aether');

    render(<Header />);
    fireEvent.click(screen.getByText('Contact Me'));

    expect(push).toHaveBeenCalledWith('/');
    expect(useUiStore.getState().pendingSection).toBe('contact');
  });
});
