import { render, screen } from '@testing-library/react';
import Testimonials from '../Testimonials';

it('renders the testimonials section with its heading', () => {
  const { container } = render(<Testimonials />);
  expect(container.querySelector('#testimonials')).toBeInTheDocument();
  expect(screen.getAllByText(/Voice of/).length).toBeGreaterThan(0);
});
