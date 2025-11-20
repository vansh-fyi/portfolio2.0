import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LeadGenChat from '../LeadGenChat';

// Mock tRPC service
jest.mock('../../services/trpc');

describe('LeadGenChat Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Helper function to complete full lead-gen flow (5 steps)
  const completeLeadGenFlow = async (
    input: HTMLElement,
    sendButton: HTMLElement,
    data: {
      name: string;
      email: string;
      projectName: string;
      serviceType: string;
      projectDetails: string;
    }
  ) => {
    // Step 1: Name
    fireEvent.change(input, { target: { value: data.name } });
    fireEvent.click(sendButton);
    await waitFor(() => expect(screen.getByText(/Nice to meet you/i)).toBeInTheDocument(), { timeout: 2000 });

    // Step 2: Email
    fireEvent.change(input, { target: { value: data.email } });
    fireEvent.click(sendButton);
    await waitFor(() => expect(screen.getByText(/What's the name of your project/i)).toBeInTheDocument(), { timeout: 2000 });

    // Step 3: Project Name
    fireEvent.change(input, { target: { value: data.projectName } });
    fireEvent.click(sendButton);
    await waitFor(() => expect(screen.getByText(/What kind of service/i)).toBeInTheDocument(), { timeout: 2000 });

    // Step 4: Service Type
    fireEvent.change(input, { target: { value: data.serviceType } });
    fireEvent.click(sendButton);
    await waitFor(() => expect(screen.getByText(/tell me more about/i)).toBeInTheDocument(), { timeout: 2000 });

    // Step 5: Project Details
    fireEvent.change(input, { target: { value: data.projectDetails } });
    fireEvent.click(sendButton);
  };

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
    // Mock successful email send (Story 3.3)
    const mockMutateAsync = jest.fn().mockResolvedValue({ success: true });
    const { trpc } = require('../../services/trpc');
    trpc.email.sendLead.useMutation.mockReturnValue({
      mutateAsync: mockMutateAsync
    });

    render(<LeadGenChat />);

    const input = screen.getByPlaceholderText(/Tell the details to my agent/i);
    const sendButton = screen.getByLabelText(/Send message/i);

    // Use helper to complete full 5-step flow
    await completeLeadGenFlow(input, sendButton, {
      name: "John",
      email: "john@example.com",
      projectName: "MyApp",
      serviceType: "E-commerce",
      projectDetails: "I need help building a web app"
    });

    // Wait for email success message
    await waitFor(() => {
      expect(screen.getByText(/Got it! I've sent your message to Vansh/i)).toBeInTheDocument();
      expect(screen.getByText(/Thanks for reaching out! 🚀/i)).toBeInTheDocument();
    }, { timeout: 3000 });
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
    // Mock successful email send (Story 3.3)
    const mockMutateAsync = jest.fn().mockResolvedValue({ success: true });
    const { trpc } = require('../../services/trpc');
    trpc.email.sendLead.useMutation.mockReturnValue({
      mutateAsync: mockMutateAsync
    });

    render(<LeadGenChat />);

    const input = screen.getByPlaceholderText(/Tell the details to my agent/i);
    const sendButton = screen.getByLabelText(/Send message/i);

    // Initial greeting
    expect(screen.getByText(/Hi! I am Ursa. Please mention your requirements./i)).toBeInTheDocument();

    // Complete full 5-step flow
    await completeLeadGenFlow(input, sendButton, {
      name: "Alice",
      email: "alice@example.com",
      projectName: "ShopSmart",
      serviceType: "E-commerce",
      projectDetails: "Build an e-commerce site"
    });

    // Email success message with Ursa personality
    await waitFor(() => {
      expect(screen.getByText(/Got it! I've sent your message to Vansh/i)).toBeInTheDocument();
      expect(screen.getByText(/Thanks for reaching out! 🚀/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('handles 5-step structured flow correctly (AC #2)', async () => {
    // Mock successful email send
    const mockMutateAsync = jest.fn().mockResolvedValue({ success: true });
    const { trpc } = require('../../services/trpc');
    trpc.email.sendLead.useMutation.mockReturnValue({
      mutateAsync: mockMutateAsync
    });

    render(<LeadGenChat />);

    const input = screen.getByPlaceholderText(/Tell the details to my agent/i);
    const sendButton = screen.getByLabelText(/Send message/i);

    // Complete structured 5-step flow
    await completeLeadGenFlow(input, sendButton, {
      name: "Sarah",
      email: "sarah@example.com",
      projectName: "MobileApp Pro",
      serviceType: "Mobile Application",
      projectDetails: "I need help with a mobile app project"
    });

    // Should display email success message (Story 3.3 - email API integration)
    await waitFor(() => {
      expect(screen.getByText(/Got it! I've sent your message to Vansh/i)).toBeInTheDocument();
      expect(screen.getByText(/Thanks for reaching out! 🚀/i)).toBeInTheDocument();
    }, { timeout: 3000 });
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

  // NEW TESTS FOR EMAIL API INTEGRATION (Story 3.3)

  it('calls tRPC email.sendLead API when all data collected (AC #1, #2)', async () => {
    // Mock the tRPC mutation
    const mockMutateAsync = jest.fn().mockResolvedValue({ success: true });
    const { trpc } = require('../../services/trpc');
    trpc.email.sendLead.useMutation.mockReturnValue({
      mutateAsync: mockMutateAsync,
      isLoading: false,
      isError: false,
      isSuccess: false
    });

    render(<LeadGenChat />);

    const input = screen.getByPlaceholderText(/Tell the details to my agent/i);
    const sendButton = screen.getByLabelText(/Send message/i);

    // Complete full 5-step flow
    await completeLeadGenFlow(input, sendButton, {
      name: "John Doe",
      email: "john@example.com",
      projectName: "WebApp Builder",
      serviceType: "SaaS",
      projectDetails: "Need help with a web app"
    });

    // Verify API was called with correct structured data
    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        name: "John Doe",
        email: "john@example.com",
        message: expect.stringContaining("Project Name: WebApp Builder")
      });
      expect(mockMutateAsync).toHaveBeenCalledWith({
        name: "John Doe",
        email: "john@example.com",
        message: expect.stringContaining("Service Type: SaaS")
      });
      expect(mockMutateAsync).toHaveBeenCalledWith({
        name: "John Doe",
        email: "john@example.com",
        message: expect.stringContaining("Details: Need help with a web app")
      });
    }, { timeout: 3000 });
  });

  it('displays success message when email API returns success (AC #3, #6)', async () => {
    // Mock successful API response
    const mockMutateAsync = jest.fn().mockResolvedValue({ success: true });
    const { trpc } = require('../../services/trpc');
    trpc.email.sendLead.useMutation.mockReturnValue({
      mutateAsync: mockMutateAsync
    });

    render(<LeadGenChat />);

    const input = screen.getByPlaceholderText(/Tell the details to my agent/i);
    const sendButton = screen.getByLabelText(/Send message/i);

    // Complete full flow
    await completeLeadGenFlow(input, sendButton, {
      name: "Alice",
      email: "alice@example.com",
      projectName: "ShopNow",
      serviceType: "E-commerce",
      projectDetails: "Build an e-commerce site"
    });

    // Verify success message with Ursa personality (conversational, emoji)
    await waitFor(() => {
      expect(screen.getByText(/Got it! I've sent your message to Vansh/i)).toBeInTheDocument();
      expect(screen.getByText(/Thanks for reaching out! 🚀/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('displays error message when email API fails (AC #4, #6)', async () => {
    // Mock failed API response
    const mockMutateAsync = jest.fn().mockResolvedValue({
      success: false,
      message: 'Server error'
    });
    const { trpc } = require('../../services/trpc');
    trpc.email.sendLead.useMutation.mockReturnValue({
      mutateAsync: mockMutateAsync
    });

    render(<LeadGenChat />);

    const input = screen.getByPlaceholderText(/Tell the details to my agent/i);
    const sendButton = screen.getByLabelText(/Send message/i);

    // Complete full flow
    await completeLeadGenFlow(input, sendButton, {
      name: "Bob",
      email: "bob@example.com",
      projectName: "TestApp",
      serviceType: "Testing",
      projectDetails: "Testing error handling"
    });

    // Verify error message with Ursa personality and fallback contact
    await waitFor(() => {
      expect(screen.getByText(/Hmm, something went wrong on my end/i)).toBeInTheDocument();
      expect(screen.getByText(/design@vansh.fyi/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('handles network timeout gracefully (AC #4)', async () => {
    // Mock network error
    const mockMutateAsync = jest.fn().mockRejectedValue(new Error('Network timeout'));
    const { trpc } = require('../../services/trpc');
    trpc.email.sendLead.useMutation.mockReturnValue({
      mutateAsync: mockMutateAsync
    });

    render(<LeadGenChat />);

    const input = screen.getByPlaceholderText(/Tell the details to my agent/i);
    const sendButton = screen.getByLabelText(/Send message/i);

    // Complete full flow
    await completeLeadGenFlow(input, sendButton, {
      name: "Carol",
      email: "carol@example.com",
      projectName: "TimeoutTest",
      serviceType: "Testing",
      projectDetails: "Testing timeout"
    });

    // Verify empathetic error message with fallback email
    await waitFor(() => {
      expect(screen.getByText(/Oops! I couldn't send that message right now/i)).toBeInTheDocument();
      expect(screen.getByText(/design@vansh.fyi/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('shows loading indicator while email is being sent (AC #5)', async () => {
    // Mock delayed API response
    const mockMutateAsync = jest.fn().mockImplementation(() =>
      new Promise(resolve => setTimeout(() => resolve({ success: true }), 1500))
    );
    const { trpc } = require('../../services/trpc');
    trpc.email.sendLead.useMutation.mockReturnValue({
      mutateAsync: mockMutateAsync
    });

    render(<LeadGenChat />);

    const input = screen.getByPlaceholderText(/Tell the details to my agent/i);
    const sendButton = screen.getByLabelText(/Send message/i);

    // Complete flow up to last step
    fireEvent.change(input, { target: { value: "David" } });
    fireEvent.click(sendButton);
    await waitFor(() => expect(screen.getByText(/Nice to meet you, David!/i)).toBeInTheDocument(), { timeout: 2000 });

    fireEvent.change(input, { target: { value: "david@example.com" } });
    fireEvent.click(sendButton);
    await waitFor(() => expect(screen.getByText(/What's the name of your project/i)).toBeInTheDocument(), { timeout: 2000 });

    fireEvent.change(input, { target: { value: "LoadTest" } });
    fireEvent.click(sendButton);
    await waitFor(() => expect(screen.getByText(/What kind of service/i)).toBeInTheDocument(), { timeout: 2000 });

    fireEvent.change(input, { target: { value: "Testing" } });
    fireEvent.click(sendButton);
    await waitFor(() => expect(screen.getByText(/tell me more about/i)).toBeInTheDocument(), { timeout: 2000 });

    // Final step - trigger loading
    fireEvent.change(input, { target: { value: "Testing loading state" } });
    fireEvent.click(sendButton);

    // Verify loading indicator appears during API call
    await waitFor(() => {
      expect(screen.getByText(/Typing.../i)).toBeInTheDocument();
    }, { timeout: 500 });

    // Verify loading clears after response
    await waitFor(() => {
      expect(screen.queryByText(/Typing.../i)).not.toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('disables send button while email is being sent (AC #5)', async () => {
    // Mock delayed API response
    const mockMutateAsync = jest.fn().mockImplementation(() =>
      new Promise(resolve => setTimeout(() => resolve({ success: true }), 1000))
    );
    const { trpc } = require('../../services/trpc');
    trpc.email.sendLead.useMutation.mockReturnValue({
      mutateAsync: mockMutateAsync
    });

    render(<LeadGenChat />);

    const input = screen.getByPlaceholderText(/Tell the details to my agent/i);
    const sendButton = screen.getByLabelText(/Send message/i) as HTMLButtonElement;

    // Complete flow up to last step
    fireEvent.change(input, { target: { value: "Eve" } });
    fireEvent.click(sendButton);
    await waitFor(() => expect(screen.getByText(/Nice to meet you, Eve!/i)).toBeInTheDocument(), { timeout: 2000 });

    fireEvent.change(input, { target: { value: "eve@example.com" } });
    fireEvent.click(sendButton);
    await waitFor(() => expect(screen.getByText(/What's the name of your project/i)).toBeInTheDocument(), { timeout: 2000 });

    fireEvent.change(input, { target: { value: "ButtonTest" } });
    fireEvent.click(sendButton);
    await waitFor(() => expect(screen.getByText(/What kind of service/i)).toBeInTheDocument(), { timeout: 2000 });

    fireEvent.change(input, { target: { value: "Testing" } });
    fireEvent.click(sendButton);
    await waitFor(() => expect(screen.getByText(/tell me more about/i)).toBeInTheDocument(), { timeout: 2000 });

    // Final step - trigger button disable
    fireEvent.change(input, { target: { value: "Testing button disable" } });
    fireEvent.click(sendButton);

    // Verify button is disabled during loading
    await waitFor(() => {
      expect(sendButton.disabled).toBe(true);
    }, { timeout: 500 });

    // Verify button is re-enabled after completion
    await waitFor(() => {
      expect(sendButton.disabled).toBe(false);
    }, { timeout: 2500 });
  });

  it('maps CollectedData to SendLeadInput.message with structured format (AC #2)', async () => {
    const mockMutateAsync = jest.fn().mockResolvedValue({ success: true });
    const { trpc } = require('../../services/trpc');
    trpc.email.sendLead.useMutation.mockReturnValue({
      mutateAsync: mockMutateAsync
    });

    render(<LeadGenChat />);

    const input = screen.getByPlaceholderText(/Tell the details to my agent/i);
    const sendButton = screen.getByLabelText(/Send message/i);

    const testData = {
      name: "Frank",
      email: "frank@example.com",
      projectName: "CollabPlatform",
      serviceType: "SaaS",
      projectDetails: "Building a complex SaaS platform with real-time collaboration features"
    };

    await completeLeadGenFlow(input, sendButton, testData);

    // Verify all data is correctly mapped to structured message format
    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        name: testData.name,
        email: testData.email,
        message: expect.stringContaining(`Project Name: ${testData.projectName}`)
      });
      expect(mockMutateAsync).toHaveBeenCalledWith({
        name: testData.name,
        email: testData.email,
        message: expect.stringContaining(`Service Type: ${testData.serviceType}`)
      });
      expect(mockMutateAsync).toHaveBeenCalledWith({
        name: testData.name,
        email: testData.email,
        message: expect.stringContaining(`Details: ${testData.projectDetails}`)
      });
    }, { timeout: 3000 });
  });

  // NEW TESTS FOR SPECIAL COMMANDS (Story 3.3 enhancements)

  it('handles "summarise" command and displays collected data', async () => {
    render(<LeadGenChat />);

    const input = screen.getByPlaceholderText(/Tell the details to my agent/i);
    const sendButton = screen.getByLabelText(/Send message/i);

    // Collect partial data
    fireEvent.change(input, { target: { value: "George" } });
    fireEvent.click(sendButton);
    await waitFor(() => expect(screen.getByText(/Nice to meet you, George!/i)).toBeInTheDocument(), { timeout: 2000 });

    fireEvent.change(input, { target: { value: "george@example.com" } });
    fireEvent.click(sendButton);
    await waitFor(() => expect(screen.getByText(/What's the name of your project/i)).toBeInTheDocument(), { timeout: 2000 });

    // Type "summarise" to see collected data
    fireEvent.change(input, { target: { value: "summarise" } });
    fireEvent.click(sendButton);

    // Should display summary of collected data so far
    await waitFor(() => {
      const summaryMessage = screen.getByText(/Here's what I have so far/i);
      expect(summaryMessage).toBeInTheDocument();
      expect(summaryMessage.textContent).toContain('Name: George');
      expect(summaryMessage.textContent).toContain('Email: george@example.com');
    }, { timeout: 2000 });
  });

  it('handles "back" command and goes to previous step', async () => {
    render(<LeadGenChat />);

    const input = screen.getByPlaceholderText(/Tell the details to my agent/i);
    const sendButton = screen.getByLabelText(/Send message/i);

    // Progress to PROJECT_NAME step
    fireEvent.change(input, { target: { value: "Helen" } });
    fireEvent.click(sendButton);
    await waitFor(() => expect(screen.getByText(/Nice to meet you, Helen!/i)).toBeInTheDocument(), { timeout: 2000 });

    fireEvent.change(input, { target: { value: "helen@example.com" } });
    fireEvent.click(sendButton);
    await waitFor(() => expect(screen.getByText(/What's the name of your project/i)).toBeInTheDocument(), { timeout: 2000 });

    // Type "back" to go back to EMAIL step
    fireEvent.change(input, { target: { value: "back" } });
    fireEvent.click(sendButton);

    // Should show EMAIL step prompt
    await waitFor(() => {
      expect(screen.getByText(/Your name is Helen. What's your email address?/i)).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('handles "back" from first step gracefully', async () => {
    render(<LeadGenChat />);

    const input = screen.getByPlaceholderText(/Tell the details to my agent/i);
    const sendButton = screen.getByLabelText(/Send message/i);

    // Type "back" from NAME step (first step)
    fireEvent.change(input, { target: { value: "back" } });
    fireEvent.click(sendButton);

    // Should stay at NAME step with fresh prompt
    await waitFor(() => {
      expect(screen.getByText(/Let's start over. What's your name?/i)).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('accepts "summarize" (American spelling) as well as "summarise"', async () => {
    render(<LeadGenChat />);

    const input = screen.getByPlaceholderText(/Tell the details to my agent/i);
    const sendButton = screen.getByLabelText(/Send message/i);

    // Collect some data
    fireEvent.change(input, { target: { value: "Ian" } });
    fireEvent.click(sendButton);
    await waitFor(() => expect(screen.getByText(/Nice to meet you, Ian!/i)).toBeInTheDocument(), { timeout: 2000 });

    // Type "summarize" (American spelling)
    fireEvent.change(input, { target: { value: "summarize" } });
    fireEvent.click(sendButton);

    // Should display summary
    await waitFor(() => {
      expect(screen.getByText(/Here's what I have so far/i)).toBeInTheDocument();
      expect(screen.getByText(/Name: Ian/i)).toBeInTheDocument();
    }, { timeout: 2000 });
  });
});
