import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LeadGenChat from '../LeadGenChat';

describe('LeadGenChat Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without errors', () => {
    render(<LeadGenChat />);

    // Check that the component renders
    expect(screen.getByText(/AI Personal Assistant/i)).toBeInTheDocument();
    expect(screen.getByText(/Online · Responds instantly/i)).toBeInTheDocument();
  });

  it('displays message input and send button', () => {
    render(<LeadGenChat />);

    // Check for input field
    const input = screen.getByPlaceholderText(/Tell the details to my agent/i);
    expect(input).toBeInTheDocument();

    // Check for send button
    const sendButton = screen.getByLabelText(/Send message/i);
    expect(sendButton).toBeInTheDocument();
  });

  it('displays initial greeting message from agent', () => {
    render(<LeadGenChat />);

    // Check for initial agent greeting
    expect(screen.getByText(/Hi there! Nice to meet you/i)).toBeInTheDocument();
  });

  it('displays message history correctly', () => {
    render(<LeadGenChat />);

    // Initial message should be visible
    const messages = screen.getAllByRole('log');
    expect(messages.length).toBeGreaterThan(0);
  });

  it('adds user message to history after submission', async () => {
    render(<LeadGenChat />);

    const input = screen.getByPlaceholderText(/Tell the details to my agent/i) as HTMLInputElement;
    const sendButton = screen.getByLabelText(/Send message/i);

    // Type a message
    fireEvent.change(input, { target: { value: 'Hello, I need help with a project' } });
    expect(input.value).toBe('Hello, I need help with a project');

    // Send the message
    fireEvent.click(sendButton);

    // Check that the message appears in the chat
    await waitFor(() => {
      expect(screen.getByText('Hello, I need help with a project')).toBeInTheDocument();
    });
  });

  it('clears input field after message submission', async () => {
    render(<LeadGenChat />);

    const input = screen.getByPlaceholderText(/Tell the details to my agent/i) as HTMLInputElement;
    const sendButton = screen.getByLabelText(/Send message/i);

    // Type and send a message
    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.click(sendButton);

    // Input should be cleared
    await waitFor(() => {
      expect(input.value).toBe('');
    });
  });

  it('displays loading indicator during agent response', async () => {
    render(<LeadGenChat />);

    const input = screen.getByPlaceholderText(/Tell the details to my agent/i);
    const sendButton = screen.getByLabelText(/Send message/i);

    // Send a message
    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.click(sendButton);

    // Loading indicator should appear
    await waitFor(() => {
      expect(screen.getByText(/Typing.../i)).toBeInTheDocument();
    });
  });

  it('does not send empty messages', () => {
    render(<LeadGenChat />);

    const input = screen.getByPlaceholderText(/Tell the details to my agent/i);
    const sendButton = screen.getByLabelText(/Send message/i);

    // Try to send an empty message
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.click(sendButton);

    // Only the initial greeting should be present (no new user message)
    const aiLabels = screen.getAllByText('AI');
    expect(aiLabels.length).toBe(1); // Only initial AI message
  });

  it('does not send whitespace-only messages', () => {
    render(<LeadGenChat />);

    const input = screen.getByPlaceholderText(/Tell the details to my agent/i);
    const sendButton = screen.getByLabelText(/Send message/i);

    // Try to send whitespace
    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.click(sendButton);

    // Only the initial greeting should be present
    const aiLabels = screen.getAllByText('AI');
    expect(aiLabels.length).toBe(1);
  });

  it('sends message when Enter key is pressed', async () => {
    render(<LeadGenChat />);

    const input = screen.getByPlaceholderText(/Tell the details to my agent/i);

    // Type a message and press Enter
    fireEvent.change(input, { target: { value: 'Message via Enter key' } });
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });

    // Check that the message appears
    await waitFor(() => {
      expect(screen.getByText('Message via Enter key')).toBeInTheDocument();
    });
  });

  it('has proper ARIA labels for accessibility', () => {
    render(<LeadGenChat />);

    // Check for ARIA labels
    expect(screen.getByLabelText(/Share the details with my AI agent/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Send message/i)).toBeInTheDocument();
    expect(screen.getByRole('log')).toBeInTheDocument();
  });

  it('accepts className prop for custom styling', () => {
    const { container } = render(<LeadGenChat className="custom-class" />);

    // Check if custom class is applied to the root element
    const rootElement = container.firstChild;
    expect(rootElement).toHaveClass('custom-class');
  });

  it('disables send button while loading', async () => {
    render(<LeadGenChat />);

    const input = screen.getByPlaceholderText(/Tell the details to my agent/i);
    const sendButton = screen.getByLabelText(/Send message/i) as HTMLButtonElement;

    // Send a message
    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.click(sendButton);

    // Button should be disabled during loading
    await waitFor(() => {
      expect(sendButton.disabled).toBe(true);
    });

    // Button should be enabled again after loading completes
    await waitFor(() => {
      expect(sendButton.disabled).toBe(false);
    }, { timeout: 2000 });
  });

  it('displays agent response after user message', async () => {
    render(<LeadGenChat />);

    const input = screen.getByPlaceholderText(/Tell the details to my agent/i);
    const sendButton = screen.getByLabelText(/Send message/i);

    // Send a message
    fireEvent.change(input, { target: { value: 'Hello agent' } });
    fireEvent.click(sendButton);

    // Wait for agent response
    await waitFor(() => {
      expect(screen.getByText(/Thank you for reaching out/i)).toBeInTheDocument();
    }, { timeout: 2000 });
  });
});
