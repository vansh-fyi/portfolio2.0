import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { StrictMode } from 'react';
import ChatView from '../ChatOverlay';
import { useViewStore } from '../../../state/overlayStore';
import { useRAGQuery } from '../../../hooks/useRAGQuery';

jest.mock('../../../services/trpc');

jest.mock('@tanstack/react-virtual', () => ({
  useVirtualizer: ({ count }: { count: number }) => ({
    getTotalSize: () => count * 80,
    getVirtualItems: () => Array.from({ length: count }, (_, index) => ({ index, start: index * 80, size: 80, key: index })),
    measureElement: () => undefined,
    scrollToIndex: () => undefined,
  }),
}));
jest.mock('../../../state/overlayStore', () => ({
  ...jest.requireActual('../../../state/overlayStore'),
  useViewStore: jest.fn(),
}));
jest.mock('../../../hooks/useRAGQuery');
jest.mock('../../../state/portfolio', () => ({ usePortfolio: () => require('../../../../lib/portfolio-fixture').PORTFOLIO_FIXTURE }));
jest.mock('../../StreamingMarkdown', () => function Markdown({ content }: { content: string }) { return <p>{content}</p>; });

const ask = jest.fn();
const goToMain = jest.fn();
const goToProjects = jest.fn();
const goToProject = jest.fn();
const scrollToSection = jest.fn();
const goToProjectChat = jest.fn();
const clearInitialChatQuery = jest.fn();
const setScope = (chatContext: 'personal' | 'project', projectId?: string, initialChatQuery = '') =>
  (useViewStore as unknown as jest.Mock).mockReturnValue({ goToMain, goToProjects, goToProject, scrollToSection, goToProjectChat, clearInitialChatQuery, chatContext, projectId, initialChatQuery });

beforeEach(() => {
  jest.clearAllMocks();
  ask.mockResolvedValue({ success: true, response: 'A complete answer.', sources: [] });
  (useRAGQuery as jest.Mock).mockReturnValue(ask);
  setScope('personal');
});

it.each([
  ['personal', undefined, ' Know more about Vansh'],
  ['project', 'aether', ' Know more about Aether'],
  ['project', 'driq-health-ai', ' Know more about DriQ Health'],
] as const)('shows the spaced contextual title for %s/%s', (context, project, title) => {
  setScope(context, project);
  render(<ChatView />);
  const subtitle = screen.getByText((_, element) => element?.tagName === 'SPAN' && element.textContent === title);
  expect(subtitle.previousSibling?.textContent).toBe('Ask Ursa:');
  expect(subtitle.parentElement?.textContent).toBe(`Ask Ursa:${title}`);
});

it.each([
  ['personal', undefined, "Hi! I'm Ursa. Ask me anything about Vansh."],
  ['project', 'portfolio-website', 'Hello! Ask anything about AI-Powered Portfolio here.'],
  ['project', 'unknown', 'Hello! Ask anything about this project here.'],
] as const)('shows the greeting for %s/%s', (context, project, greeting) => {
  setScope(context, project);
  render(<ChatView />);
  expect(screen.getByText(greeting)).toBeInTheDocument();
});

it('closes personal chat to the home page and project chat to its project', () => {
  const { rerender } = render(<ChatView />);
  fireEvent.click(screen.getByLabelText('Close'));
  expect(goToMain).toHaveBeenCalledTimes(1);
  setScope('project', 'aether');
  rerender(<ChatView />);
  fireEvent.click(screen.getByLabelText('Close'));
  expect(goToProjects).toHaveBeenCalledTimes(1);
});

it('maps a listing to its canonical project before sending', async () => {
  setScope('project', 'driq-health-ai');
  render(<ChatView />);
  fireEvent.change(screen.getByRole('textbox', { name: 'Chat message' }), { target: { value: 'What did Vansh build?' } });
  fireEvent.click(screen.getByRole('button', { name: 'Send' }));
  await waitFor(() => expect(ask).toHaveBeenCalledTimes(1));
  expect(ask.mock.calls[0][0]).toMatchObject({ projectId: 'driq-health', history: [] });
});

it('starts a fresh session on project change and ignores the previous project response', async () => {
  let finish!: (answer: unknown) => void;
  ask.mockReturnValueOnce(new Promise((resolve) => { finish = resolve; }));
  setScope('project', 'aether');
  const { rerender } = render(<ChatView />);
  const input = screen.getByRole('textbox', { name: 'Chat message' });
  fireEvent.change(input, { target: { value: 'Old question' } });
  fireEvent.click(screen.getByRole('button', { name: 'Send' }));
  fireEvent.change(input, { target: { value: 'Old draft' } });
  setScope('project', 'driq-health');
  rerender(<ChatView />);
  expect(ask.mock.calls[0][1].aborted).toBe(true);
  expect(screen.getByRole('textbox', { name: 'Chat message' })).toHaveValue('');
  expect(screen.queryByText('Old question')).not.toBeInTheDocument();
  await act(async () => { finish({ response: 'Late Aether answer.' }); });
  expect(screen.queryByText('Late Aether answer.')).not.toBeInTheDocument();
  fireEvent.change(screen.getByRole('textbox', { name: 'Chat message' }), { target: { value: 'New question' } });
  fireEvent.click(screen.getByRole('button', { name: 'Send' }));
  await waitFor(() => expect(ask).toHaveBeenCalledTimes(2));
  expect(ask.mock.calls[1][0]).toMatchObject({ projectId: 'driq-health', history: [] });
});

it('submits an initial question only once under StrictMode', async () => {
  setScope('personal', undefined, 'Initial question');
  render(<StrictMode><ChatView /></StrictMode>);
  await waitFor(() => expect(ask).toHaveBeenCalledTimes(1));
  expect(clearInitialChatQuery).toHaveBeenCalledTimes(1);
});

it('renders the model action and opens the same featured project as the hero', async () => {
  ask.mockResolvedValueOnce({ response: 'Explore his work.', actions: ['view_projects'] });
  setScope('personal', undefined, 'Can I see those?');
  render(<ChatView />);
  const link = await screen.findByRole('link', { name: /View Projects/i });
  expect(link).toHaveAttribute('href', '/projects/aether');
  fireEvent.click(link);
  expect(goToProject).toHaveBeenCalledWith('aether');
  expect(ask).toHaveBeenCalledTimes(1);
});

it.each(['personal', 'project'] as const)('shows no action for an ordinary %s answer', async (context) => {
  setScope(context, context === 'project' ? 'aether' : undefined, 'Hello');
  render(<ChatView />);
  await screen.findByText('A complete answer.');
  expect(screen.queryByRole('link', { name: /View Projects/i })).not.toBeInTheDocument();
});

it('suppresses actions inside project chat', async () => {
  ask.mockResolvedValueOnce({ response: 'Project details.', actions: ['view_projects'] });
  setScope('project', 'aether', 'Show examples');
  render(<ChatView />);
  await screen.findByText('Project details.');
  expect(screen.queryByRole('link', { name: /View Projects/i })).not.toBeInTheDocument();
});
