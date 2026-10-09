import { render, screen } from '@testing-library/react';
import ProjectView from '../ProjectOverlay';
import { useViewStore } from '../../../state/overlayStore';

jest.mock('../../../state/overlayStore');
jest.mock('../../../state/portfolio', () => ({ usePortfolio: () => require('../../../../lib/portfolio-fixture').PORTFOLIO_FIXTURE }));

const mockStore = (projectId?: string) =>
  (useViewStore as unknown as jest.Mock).mockReturnValue({ scrollToSection: jest.fn(), goToProjectChat: jest.fn(), selectProject: jest.fn(), projectId });

describe('ProjectView', () => {
  beforeEach(() => mockStore('aether'));

  it('should render project view', () => {
    render(<ProjectView />);
    expect(screen.getAllByText('Aether').length).toBeGreaterThanOrEqual(1);
  });

  it('should render close button', () => {
    render(<ProjectView />);
    expect(screen.getByLabelText(/Close/i)).toBeInTheDocument();
  });
});

describe('ProjectView embed', () => {
  it('sandboxes the iframe and shows the placement\'s own URL', async () => {
    mockStore('driq-health-ai');
    render(<ProjectView />);
    const frame = await screen.findByTitle(/DriQ Health/, undefined, { timeout: 2000 });
    expect(frame).toHaveAttribute('src', 'https://info.vansh.fyi/d-ai');
    expect(frame.getAttribute('sandbox')).toContain('allow-scripts');
    expect(frame.getAttribute('sandbox')).not.toContain('allow-top-navigation');
    expect(frame).toHaveAttribute('referrerpolicy', 'no-referrer');
  });
});
