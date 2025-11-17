import { render, screen } from '@testing-library/react';
import ChatOverlay from '../ChatOverlay';

describe('ChatOverlay', () => {
  it('should render when isVisible is true', () => {
    render(<ChatOverlay isVisible={true} onClose={() => {}} />);
    expect(screen.getByPlaceholderText('Ask anything about the project in detail...')).toBeInTheDocument();
  });

  it('should not render when isVisible is false', () => {
    const { container } = render(<ChatOverlay isVisible={false} onClose={() => {}} />);
    expect(container.firstChild).toBeNull();
  });
});
