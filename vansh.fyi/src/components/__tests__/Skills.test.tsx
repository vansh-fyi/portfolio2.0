import { render, screen } from '@testing-library/react';
import Skills from '../Skills';

it('renders the features section with its heading', () => {
  const { container } = render(<Skills />);
  expect(container.querySelector('#features')).toBeInTheDocument();
  expect(screen.getAllByText(/Illuminate Your/).length).toBeGreaterThan(0);
});
