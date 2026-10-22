import { fireEvent, render, screen } from '@testing-library/react';
import Hero from '../Hero';
import { PortfolioProvider } from '../../state/portfolio';
import { PORTFOLIO_FIXTURE } from '../../../lib/portfolio-fixture';
it('renders the hero section with its heading', () => {
  const { container } = render(<Hero />);
  expect(container.querySelector('#hero')).toBeInTheDocument();
  expect(screen.getAllByText(/Creating/).length).toBeGreaterThan(0);
});

it('opens the featured project window from View Projects', () => {
  const pushState = jest.spyOn(window.history, 'pushState');
  window.history.replaceState(null, '', '/');
  render(<PortfolioProvider data={PORTFOLIO_FIXTURE}><Hero /></PortfolioProvider>);
  const link = screen.getByRole('link', { name: /View Projects/i });
  expect(link).toHaveAttribute('href', '/projects/aether');
  fireEvent.click(link);
  expect(window.location.pathname).toBe('/projects/aether');
  expect(pushState).toHaveBeenCalledWith(null, '', '/projects/aether');
  pushState.mockRestore();
  window.history.replaceState(null, '', '/');
});
