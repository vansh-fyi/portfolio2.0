import { render, screen } from '@testing-library/react';
import Hero from '../Hero';

it('renders the hero section with its heading', () => {
  const { container } = render(<Hero />);
  expect(container.querySelector('#hero')).toBeInTheDocument();
  expect(screen.getAllByText(/Creating/).length).toBeGreaterThan(0);
});
