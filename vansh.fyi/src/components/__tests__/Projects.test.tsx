import { render, screen } from '@testing-library/react';
import Projects from '../Projects';

it('renders the projects section with its heading', () => {
  const { container } = render(<Projects />);
  expect(container.querySelector('#projects')).toBeInTheDocument();
  expect(screen.getAllByText(/Where creativity meets/).length).toBeGreaterThan(0);
});
