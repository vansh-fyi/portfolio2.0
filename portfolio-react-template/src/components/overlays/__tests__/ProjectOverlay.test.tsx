import { render, screen } from '@testing-library/react';
import ProjectView from '../ProjectOverlay';

describe('ProjectView', () => {
  it('should render project view', () => {
    render(<ProjectView />);
    expect(screen.getAllByText('Aether').length).toBeGreaterThanOrEqual(1);
  });

  it('should render close button', () => {
    render(<ProjectView />);
    expect(screen.getByLabelText(/Close/i)).toBeInTheDocument();
  });
});
