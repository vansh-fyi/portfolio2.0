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

  it('displays initial greeting message from agent (AC #1)', () => {
    render(<LeadGenChat />);

    // Check for initial agent greeting - updated to match AC #1
    expect(screen.getByText(/Hi! I am Ursa. Please mention your requirements./i)).toBeInTheDocument();
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
    fireEvent.change(input, { target: { value: 'John' } });
    expect(input.value).toBe('John');

    // Send the message
    fireEvent.click(sendButton);

    // Check that the message appears in the chat
    await waitFor(() => {
      expect(screen.getByText('John')).toBeInTheDocument();
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
    fireEvent.change(input, { target: { value: 'John' } });
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
    fireEvent.change(input, { target: { value: 'Jane' } });
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });

    // Check that the message appears
    await waitFor(() => {
      expect(screen.getByText('Jane')).toBeInTheDocument();
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

  // NEW TESTS FOR CONVERSATION FLOW (AC #2, #3)

  it('extracts name from "I\'m [Name]" format and advances to EMAIL step (AC #2)', async () => {
    render(<LeadGenChat />);

    const input = screen.getByPlaceholderText(/Tell the details to my agent/i);
    const sendButton = screen.getByLabelText(/Send message/i);

    // User provides name in "I'm [Name]" format
    fireEvent.change(input, { target: { value: "I'm John" } });
    fireEvent.click(sendButton);

    // Wait for agent response asking for email
    await waitFor(() => {
      expect(screen.getByText(/Nice to meet you, John!/i)).toBeInTheDocument();
      expect(screen.getByText(/What's the best email to reach you?/i)).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('extracts name from plain name format and advances to EMAIL step (AC #2)', async () => {
    render(<LeadGenChat />);

    const input = screen.getByPlaceholderText(/Tell the details to my agent/i);
    const sendButton = screen.getByLabelText(/Send message/i);

    // User provides plain name
    fireEvent.change(input, { target: { value: "Jane Doe" } });
    fireEvent.click(sendButton);

    // Wait for agent response
    await waitFor(() => {
      expect(screen.getByText(/Nice to meet you, Jane Doe!/i)).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('validates email format and accepts valid email (AC #2)', async () => {
    render(<LeadGenChat />);

    const input = screen.getByPlaceholderText(/Tell the details to my agent/i);
    const sendButton = screen.getByLabelText(/Send message/i);

    // Step 1: Provide name
    fireEvent.change(input, { target: { value: "John" } });
    fireEvent.click(sendButton);

    // Wait for email prompt
    await waitFor(() => {
      expect(screen.getByText(/What's the best email/i)).toBeInTheDocument();
    }, { timeout: 2000 });

    // Step 2: Provide valid email
    fireEvent.change(input, { target: { value: "john@example.com" } });
    fireEvent.click(sendButton);

    // Wait for confirmation
    await waitFor(() => {
      expect(screen.getByText(/Perfect! Got your email: john@example.com/i)).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('rejects invalid email and shows error message (AC #2, #3)', async () => {
    render(<LeadGenChat />);

    const input = screen.getByPlaceholderText(/Tell the details to my agent/i);
    const sendButton = screen.getByLabelText(/Send message/i);

    // Step 1: Provide name
    fireEvent.change(input, { target: { value: "John" } });
    fireEvent.click(sendButton);

    // Wait for email prompt
    await waitFor(() => {
      expect(screen.getByText(/What's the best email/i)).toBeInTheDocument();
    }, { timeout: 2000 });

    // Step 2: Provide invalid email
    fireEvent.change(input, { target: { value: "invalid-email" } });
    fireEvent.click(sendButton);

    // Wait for error message with Ursa personality
    await waitFor(() => {
      expect(screen.getByText(/Hmm, that doesn't look like a valid email/i)).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('collects project details and displays confirmation summary (AC #2)', async () => {
    render(<LeadGenChat />);

    const input = screen.getByPlaceholderText(/Tell the details to my agent/i);
    const sendButton = screen.getByLabelText(/Send message/i);

    // Step 1: Provide name
    fireEvent.change(input, { target: { value: "John" } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText(/What's the best email/i)).toBeInTheDocument();
    }, { timeout: 2000 });

    // Step 2: Provide email
    fireEvent.change(input, { target: { value: "john@example.com" } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText(/Tell me more about your project/i)).toBeInTheDocument();
    }, { timeout: 2000 });

    // Step 3: Provide project details
    fireEvent.change(input, { target: { value: "I need help building a web app" } });
    fireEvent.click(sendButton);

    // Wait for final summary with all collected data
    await waitFor(() => {
      expect(screen.getByText(/Got it! Here's what I have:/i)).toBeInTheDocument();
      expect(screen.getByText(/Name: John/i)).toBeInTheDocument();
      expect(screen.getByText(/Project: I need help building a web app/i)).toBeInTheDocument();
      expect(screen.getByText(/I'll pass this along to Vansh. He'll be in touch soon!/i)).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('displays Ursa personality in all responses (AC #3)', async () => {
    render(<LeadGenChat />);

    const input = screen.getByPlaceholderText(/Tell the details to my agent/i);
    const sendButton = screen.getByLabelText(/Send message/i);

    // Check initial greeting has Ursa personality
    expect(screen.getByText(/Hi! I am Ursa/i)).toBeInTheDocument();

    // Provide name
    fireEvent.change(input, { target: { value: "John" } });
    fireEvent.click(sendButton);

    // Check response uses conversational tone with emoji
    await waitFor(() => {
      expect(screen.getByText(/Nice to meet you, John! 👋/i)).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('handles full conversation flow from NAME to COMPLETE (AC #1, #2, #3)', async () => {
    render(<LeadGenChat />);

    const input = screen.getByPlaceholderText(/Tell the details to my agent/i);
    const sendButton = screen.getByLabelText(/Send message/i);

    // Initial greeting
    expect(screen.getByText(/Hi! I am Ursa. Please mention your requirements./i)).toBeInTheDocument();

    // NAME step
    fireEvent.change(input, { target: { value: "Alice" } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText(/Nice to meet you, Alice!/i)).toBeInTheDocument();
    }, { timeout: 2000 });

    // EMAIL step
    fireEvent.change(input, { target: { value: "alice@example.com" } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText(/Perfect! Got your email: alice@example.com/i)).toBeInTheDocument();
    }, { timeout: 2000 });

    // PROJECT_DETAILS step
    fireEvent.change(input, { target: { value: "Build an e-commerce site" } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText(/Got it!/i)).toBeInTheDocument();
    }, { timeout: 2000 });

    // CONFIRMATION step - summary with Ursa personality
    await waitFor(() => {
      expect(screen.getByText(/I'll pass this along to Vansh. He'll be in touch soon! 🚀/i)).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('handles combined name and project details in first message (AC #2)', async () => {
    render(<LeadGenChat />);

    const input = screen.getByPlaceholderText(/Tell the details to my agent/i);
    const sendButton = screen.getByLabelText(/Send message/i);

    // User provides both name and project info in first message
    fireEvent.change(input, { target: { value: "I'm Sarah and I need help with a mobile app project" } });
    fireEvent.click(sendButton);

    // Agent should extract both name and project details
    await waitFor(() => {
      expect(screen.getByText(/Nice to meet you, Sarah!/i)).toBeInTheDocument();
    }, { timeout: 2000 });

    // Provide email
    fireEvent.change(input, { target: { value: "sarah@example.com" } });
    fireEvent.click(sendButton);

    // Should display full confirmation with all collected data
    await waitFor(() => {
      expect(screen.getByText(/Got it! Here's what I have:/i)).toBeInTheDocument();
      expect(screen.getByText(/Name: Sarah/i)).toBeInTheDocument();
      expect(screen.getByText(/I'll pass this along to Vansh. He'll be in touch soon!/i)).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('handles unclear name input with clarifying question (AC #2, #3)', async () => {
    render(<LeadGenChat />);

    const input = screen.getByPlaceholderText(/Tell the details to my agent/i);
    const sendButton = screen.getByLabelText(/Send message/i);

    // User provides unclear input (numbers/special chars)
    fireEvent.change(input, { target: { value: "12345" } });
    fireEvent.click(sendButton);

    // Agent should ask for clarification
    await waitFor(() => {
      expect(screen.getByText(/I didn't quite catch your name. What should I call you?/i)).toBeInTheDocument();
    }, { timeout: 2000 });
  });
});
