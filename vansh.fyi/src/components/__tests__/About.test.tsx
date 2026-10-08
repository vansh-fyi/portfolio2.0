import { render, screen } from '@testing-library/react';
import About from '../About';

it('renders the about section with its heading', () => {
  const { container } = render(<About />);
  expect(container.querySelector('#about')).toBeInTheDocument();
  expect(screen.getAllByText(/Hello! I'm Vansh\./).length).toBeGreaterThan(0);
});
