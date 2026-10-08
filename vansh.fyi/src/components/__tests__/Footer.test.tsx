import { render, screen } from '@testing-library/react';
import Footer from '../Footer';

it('renders the footer with brand and social links', () => {
  render(<Footer />);
  expect(screen.getByText('Vansh.fyi')).toBeInTheDocument();
  expect(screen.getByLabelText('LinkedIn')).toHaveAttribute('href', 'https://www.linkedin.com/in/vansh-fyi/');
  expect(screen.getAllByLabelText('GitHub').map((a) => a.getAttribute('href'))).toContain('https://github.com/vansh-fyi');
});
