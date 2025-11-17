import { render, screen } from '@testing-library/react';
import ProjectOverlay from '../ProjectOverlay';

describe('ProjectOverlay', () => {
  it('should render when isVisible is true', () => {
    render(<ProjectOverlay isVisible={true} onClose={() => {}} />);
    expect(screen.getAllByText('Aether').length).toBe(2);
  });

  it('should not render when isVisible is false', () => {
    const { container } = render(<ProjectOverlay isVisible={false} onClose={() => {}} />);
    expect(container.firstChild).toBeNull();
  });
});
