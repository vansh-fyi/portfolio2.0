import { render, screen } from '@testing-library/react';
import Header from '../Header';

jest.mock('react-scroll', () => ({
  Link: (props: any) => <a href={`#${props.to}`} {...props} smooth={props.smooth.toString()}>{props.children}</a>,
}));

describe('Header', () => {
  it('renders navigation links with correct react-scroll props', () => {
    render(<Header />);

    const skillsLink = screen.getByText('Skills');
    expect(skillsLink).toHaveAttribute('to', 'features');
    expect(skillsLink).toHaveAttribute('smooth', 'true');
    expect(skillsLink).toHaveAttribute('duration', '500');

    const projectsLink = screen.getByText('Projects');
    expect(projectsLink).toHaveAttribute('to', 'projects');
    expect(projectsLink).toHaveAttribute('smooth', 'true');
    expect(projectsLink).toHaveAttribute('duration', '500');

    const aboutLink = screen.getByText('About Me');
    expect(aboutLink).toHaveAttribute('to', 'about');
    expect(aboutLink).toHaveAttribute('smooth', 'true');
    expect(aboutLink).toHaveAttribute('duration', '500');

    const testimonialsLink = screen.getByText('Testimonials');
    expect(testimonialsLink).toHaveAttribute('to', 'testimonials');
    expect(testimonialsLink).toHaveAttribute('smooth', 'true');
    expect(testimonialsLink).toHaveAttribute('duration', '500');

    const contactLink = screen.getByText('Contact Me');
    expect(contactLink).toHaveAttribute('to', 'contact');
    expect(contactLink).toHaveAttribute('smooth', 'true');
    expect(contactLink).toHaveAttribute('duration', '500');
  });
});