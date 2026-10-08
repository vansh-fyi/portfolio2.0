import { render, screen } from '@testing-library/react';
import Contact from '../Contact';

jest.mock('../../services/trpc');

it('renders the contact section with its heading', () => {
  const { container } = render(<Contact />);
  expect(container.querySelector('#contact')).toBeInTheDocument();
  expect(screen.getAllByText(/Let's Create Something/).length).toBeGreaterThan(0);
});
