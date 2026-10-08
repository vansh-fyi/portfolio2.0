import { render, screen } from '@testing-library/react';
import About from '../About';

const LINKEDIN = 'https://www.linkedin.com/in/vansh-fyi/';

describe('About: "See all" links', () => {
  it('shows a LinkedIn "See all" link for Education and for Certifications', () => {
    render(<About />);

    for (const section of ['education', 'certifications']) {
      const link = screen.getByRole('link', { name: `See all ${section} on LinkedIn` });
      expect(link).toHaveAttribute('href', LINKEDIN);
      expect(link).toHaveAttribute('target', '_blank');
      expect(link.getAttribute('rel')).toContain('noopener');
    }
  });

  it('puts each link in the same row as its heading, after it', () => {
    render(<About />);

    for (const [heading, section] of [['Education', 'education'], ['Certifications', 'certifications']]) {
      const title = screen.getByRole('heading', { name: heading });
      const link = screen.getByRole('link', { name: `See all ${section} on LinkedIn` });

      expect(title.parentElement).toBe(link.parentElement); // shared header row
      expect(title.parentElement).toHaveClass('justify-between'); // heading left, link far right
      expect(title.compareDocumentPosition(link) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    }
  });
});
