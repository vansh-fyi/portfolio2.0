import React, { useState, useEffect, useRef } from 'react';
import { useThemeStore } from '../state/themeStore';
import { trpc } from '../services/trpc';

interface Message {
  sender: 'user' | 'agent';
  text: string;
  timestamp?: Date;
}

type ConversationStep =
  | 'GREETING'
  | 'NAME'
  | 'EMAIL'
  | 'PROJECT_NAME'
  | 'SERVICE_TYPE'
  | 'PROJECT_DETAILS'
  | 'CONFIRMATION'
  | 'COMPLETE';

interface CollectedData {
  name?: string;
  email?: string;
  projectName?: string;
  serviceType?: string;
  projectDetails?: string;
}

interface ConversationState {
  currentStep: ConversationStep;
  collectedData: CollectedData;
}

interface LeadGenChatProps {
  className?: string;
}

const LeadGenChat: React.FC<LeadGenChatProps> = ({ className = '' }) => {
  // Theme management - currently Contact section uses dark-only styling
  // _isLightMode kept for consistency with other components (ChatOverlay, etc.)
  // Future: implement light mode variants when Contact section gets theme support
  const { isLightMode: _isLightMode } = useThemeStore();

  // tRPC mutation for sending email
  const sendEmailMutation = trpc.email.sendLead.useMutation();

  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'agent',
      text: 'Hi! I am Ursa. I didn\'t catch your name. What\'s your name?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationState, setConversationState] = useState<ConversationState>({
    currentStep: 'NAME',
    collectedData: {}
  });
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Helper: Extract name from user input (flexible parsing)
  const extractName = (input: string): string | null => {
    const trimmed = input.trim();

    // Pattern: "I'm [Name]" or "I am [Name]" (stop at common separators)
    const imPattern = /^(?:I'?m|I am)\s+([a-zA-Z\s\-']+?)(?:\s+and|\s+,|$)/i;
    const imMatch = trimmed.match(imPattern);
    if (imMatch) return imMatch[1].trim();

    // Pattern: "My name is [Name]" (stop at common separators)
    const namePattern = /^(?:My name is|my name's)\s+([a-zA-Z\s\-']+?)(?:\s+and|\s+,|$)/i;
    const nameMatch = trimmed.match(namePattern);
    if (nameMatch) return nameMatch[1].trim();

    // Pattern: "Call me [Name]" (stop at common separators)
    const callPattern = /^Call me\s+([a-zA-Z\s\-']+?)(?:\s+and|\s+,|$)/i;
    const callMatch = trimmed.match(callPattern);
    if (callMatch) return callMatch[1].trim();

    // If input looks like a plain name (2-100 chars, letters/spaces/hyphens/apostrophes only)
    if (trimmed.length >= 2 && trimmed.length <= 100) {
      // Allow letters, spaces, hyphens, apostrophes, AND simple greetings followed by name
      // e.g. "Hello Vansh", "Hi I'm Vansh"

      // If it's just a single word or two (likely a name), accept it
      // But filter out common greetings if they are the ONLY thing said
      const commonGreetings = ['hi', 'hello', 'hey', 'greetings', 'sup', 'yo'];
      if (commonGreetings.includes(trimmed.toLowerCase())) {
        return null; // Ask for name again if they just said "Hi"
      }

      const nameRegex = /^[a-zA-Z\s\-']+$/;
      if (nameRegex.test(trimmed)) {
        return trimmed;
      }
    }

    return null;
  };

  // Helper: Validate email format
  const isValidEmail = (email: string): boolean => {
    // Match backend zod validation: requires valid TLD (2+ chars)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return emailRegex.test(email);
  };

  // Helper: Send email via tRPC API
  const sendEmail = async (data: CollectedData): Promise<string> => {
    // Safe env access that works in both dev and test environments
    // Temporary fix: Hardcoded to avoid TS1343 in tests (import.meta issue)
    const contactEmail = 'design@vansh.fyi';

    try {
      // Compile comprehensive message from all collected data
      const messageContent = `
Project Name: ${data.projectName || 'Not provided'}
Service Type: ${data.serviceType || 'Not provided'}
Details: ${data.projectDetails || 'No details provided'}
      `.trim();

      // Map CollectedData to SendLeadInput format
      const result = await sendEmailMutation.mutateAsync({
        name: data.name!,
        email: data.email!,
        message: messageContent
      });

      // Check if email sent successfully
      if (result.success) {
        // Success message with Ursa personality
        return "Got it! I've sent your message to Vansh. He'll get back to you soon. Thanks for reaching out! 🚀";
      } else {
        // Backend returned failure - always include fallback email
        return `Hmm, something went wrong on my end. ${result.message || 'Please try again'}, or you can email Vansh directly at ${contactEmail}.`;
      }
    } catch (error) {
      // Network error or timeout
      console.error('Email send error:', error);
      return `Oops! I couldn't send that message right now. Please try again in a moment, or reach out directly at ${contactEmail}.`;
    }
  };

  // Helper: Get summary of collected data
  const getSummary = (data: CollectedData): string => {
    const items: string[] = [];

    if (data.name) items.push(`Name: ${data.name}`);
    if (data.email) items.push(`Email: ${data.email}`);
    if (data.projectName) items.push(`Project Name: ${data.projectName}`);
    if (data.serviceType) items.push(`Service Type: ${data.serviceType}`);
    if (data.projectDetails) items.push(`Details: ${data.projectDetails}`);

    if (items.length === 0) {
      return "I haven't collected any info yet! Let's start fresh - what's your name?";
    }

    return `Here's what I have so far:\n\n${items.join('\n')}\n\nAnything you'd like to change? Just type "back" to revise!`;
  };

  // Helper: Go back one step
  const goBack = (): ConversationStep => {
    const stepOrder: ConversationStep[] = ['NAME', 'EMAIL', 'PROJECT_NAME', 'SERVICE_TYPE', 'PROJECT_DETAILS', 'COMPLETE'];
    const currentIndex = stepOrder.indexOf(conversationState.currentStep);

    if (currentIndex > 0) {
      return stepOrder[currentIndex - 1];
    }
    return conversationState.currentStep;
  };

  // Process conversation based on current step
  const processConversationStep = async (userInput: string): Promise<Message> => {
    const { currentStep, collectedData } = conversationState;
    const input = userInput.trim();
    let responseText = '';
    let nextStep: ConversationStep = currentStep;
    const updatedData = { ...collectedData };

    // Check for special commands first
    if (input.toLowerCase() === 'summarise' || input.toLowerCase() === 'summarize') {
      return {
        sender: 'agent',
        text: getSummary(collectedData),
        timestamp: new Date()
      };
    }

    if (input.toLowerCase() === 'back') {
      const previousStep = goBack();
      setConversationState({
        currentStep: previousStep,
        collectedData: updatedData
      });

      // Give contextual message based on which step we went back to
      const backMessages: Record<string, string> = {
        'NAME': "No problem! Let's start over. What's your name?",
        'EMAIL': `Okay! Your name is ${updatedData.name}. What's your email address?`,
        'PROJECT_NAME': `Got it! What's the name of your project?`,
        'SERVICE_TYPE': `What kind of service does ${updatedData.projectName || 'your project'} offer? (e.g., E-commerce, Food delivery, SaaS, etc.)`,
        'PROJECT_DETAILS': `Tell me more details about ${updatedData.projectName || 'your project'}.`
      };

      return {
        sender: 'agent',
        text: backMessages[previousStep] || "Let's go back!",
        timestamp: new Date()
      };
    }

    // Regular conversation flow
    switch (currentStep) {
      case 'NAME': {
        const extractedName = extractName(input);

        if (extractedName) {
          updatedData.name = extractedName;
          responseText = `Nice to meet you, ${extractedName}! 👋 What's the best email to reach you?`;
          nextStep = 'EMAIL';
        } else {
          responseText = "I didn't quite catch your name. What should I call you?";
        }
        break;
      }

      case 'EMAIL': {
        if (isValidEmail(input)) {
          updatedData.email = input;
          responseText = `Perfect! Got your email: ${input}\n\nWhat's the name of your project?`;
          nextStep = 'PROJECT_NAME';
        } else {
          responseText = "Hmm, that doesn't look like a valid email. Could you double-check it? 📧";
        }
        break;
      }

      case 'PROJECT_NAME': {
        if (input.length > 0) {
          updatedData.projectName = input;
          responseText = `Awesome! What kind of service does ${input} offer? (e.g., E-commerce, Food delivery, SaaS, Marketing, etc.)`;
          nextStep = 'SERVICE_TYPE';
        } else {
          responseText = "Oops, looks like you forgot to type something! 😅";
        }
        break;
      }

      case 'SERVICE_TYPE': {
        if (input.length > 0) {
          updatedData.serviceType = input;
          responseText = `Got it! Now tell me more about ${updatedData.projectName || 'your project'}. What are you looking to build or improve?`;
          nextStep = 'PROJECT_DETAILS';
        } else {
          responseText = "Please tell me what type of service your project offers!";
        }
        break;
      }

      case 'PROJECT_DETAILS': {
        if (input.length > 0) {
          updatedData.projectDetails = input;

          // Send email via API - we have all the data now
          responseText = await sendEmail(updatedData);
          nextStep = 'COMPLETE';
        } else {
          responseText = "Oops, looks like you forgot to type something! 😅";
        }
        break;
      }

      case 'COMPLETE': {
        responseText = "Thanks! Your message has been sent. Vansh will get back to you shortly! 🚀";
        break;
      }
    }

    // Update conversation state
    setConversationState({
      currentStep: nextStep,
      collectedData: updatedData
    });

    return {
      sender: 'agent',
      text: responseText,
      timestamp: new Date()
    };
  };

  const handleSend = async () => {
    // Validate input (non-empty messages only)
    if (inputValue.trim() === '') return;

    // Add user message to history
    const userMessage: Message = {
      sender: 'user',
      text: inputValue.trim(),
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    // Clear input field after send
    setInputValue('');

    // Process conversation step (async now to handle email sending)
    setIsLoading(true);
    try {
      const agentResponse = await processConversationStep(userMessage.text);

      // Wait for 1.5s for UX
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (isMounted.current) {
        setMessages(prev => [...prev, agentResponse]);
      }
    } catch (error) {
      console.error('Error processing conversation:', error);
      // Add error message
      if (isMounted.current) {
        setMessages(prev => [...prev, {
          sender: 'agent',
          text: "Oops! Something went wrong. Please try again.",
          timestamp: new Date()
        }]);
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={`lg:p-8 bg-black/30 border ring-1 rounded-2xl p-6 backdrop-blur-xl h-full flex flex-col from-white/5 border-white/10 ring-white/5 ${className}`}>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="inline-flex bg-white/10 w-10 h-10 ring-white/10 ring-1 rounded-xl items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="w-[16px] h-[32px] flex-shrink-0" stroke-width="2" data-icon-replaced="true">
              <path opacity="0.5" fill-rule="evenodd" clip-rule="evenodd" d="M11.8401 2.3723C12.1332 2.32759 12.4306 2.29559 12.7316 2.27688C12.5229 2.26391 12.3125 2.25732 12.1005 2.25732C11.8001 2.25732 11.5027 2.27055 11.209 2.29645C11.4213 2.31518 11.6317 2.34053 11.8401 2.3723Z" />
              <path fill-rule="evenodd" clip-rule="evenodd" d="M7.13151 9.67024C7.25322 9.67024 7.35188 9.57157 7.35188 9.44987C7.35188 9.32816 7.25322 9.22949 7.13151 9.22949C7.0098 9.22949 6.91113 9.32816 6.91113 9.44987C6.91113 9.57157 7.0098 9.67024 7.13151 9.67024Z" />
              <path fill-rule="evenodd" clip-rule="evenodd" d="M16.0075 9.67024C16.1292 9.67024 16.2279 9.57157 16.2279 9.44987C16.2279 9.32816 16.1292 9.22949 16.0075 9.22949C15.8858 9.22949 15.7871 9.32816 15.7871 9.44987C15.7871 9.57157 15.8858 9.67024 16.0075 9.67024Z" />
              <path fill-rule="evenodd" clip-rule="evenodd" d="M7.13151 9.67024C7.25322 9.67024 7.35188 9.57157 7.35188 9.44987C7.35188 9.32816 7.25322 9.22949 7.13151 9.22949C7.0098 9.22949 6.91113 9.32816 6.91113 9.44987C6.91113 9.57157 7.0098 9.67024 7.13151 9.67024Z" />
              <path fill-rule="evenodd" clip-rule="evenodd" d="M17.8295 21.2188L17.8294 21.2191L17.8292 21.2197L17.8291 21.2202L17.828 21.2246L17.8278 21.2251L17.8269 21.2285L17.8259 21.2323L17.8248 21.2364L17.8244 21.2382L17.8243 21.2385L17.8238 21.2405L17.8222 21.2464C21.1165 19.6059 23.3799 16.2044 23.3799 12.2743C23.3799 10.452 22.8933 8.74331 22.0429 7.27116C21.8683 6.96891 21.6784 6.67664 21.4742 6.3954C21.0893 5.86527 20.6537 5.37433 20.1745 4.92972C19.9193 4.69291 19.6517 4.46923 19.3728 4.25978C17.6987 3.00239 15.6178 2.25732 13.3629 2.25732C13.151 2.25732 12.9405 2.26391 12.7318 2.27688C12.4309 2.29559 12.1335 2.32759 11.8403 2.3723C11.632 2.34053 11.4216 2.31518 11.2093 2.29645C10.9156 2.27055 10.6182 2.25732 10.3178 2.25732C8.17639 2.25732 6.19196 2.92925 4.5638 4.07377C4.29986 4.2593 4.04529 4.45726 3.80092 4.66678C3.20434 5.17831 2.66862 5.7588 2.20612 6.3959C2.01715 6.65621 1.84041 6.92597 1.67673 7.20434C0.802273 8.69151 0.300781 10.4243 0.300781 12.2743C0.300781 16.2044 2.56414 19.6059 5.8585 21.2464C5.74689 20.828 5.67802 20.3921 5.65684 19.9437C5.6522 19.8453 5.64985 19.7463 5.64985 19.6468C5.64985 19.3401 5.67214 19.0387 5.71521 18.744C5.80821 18.1075 5.99807 17.5024 6.26935 16.9443C6.63802 17.534 7.16292 18.0161 7.7861 18.3326C8.30573 18.5965 8.8937 18.7453 9.5164 18.7453C10.1391 18.7453 10.7271 18.5965 11.2467 18.3326C11.4047 18.163 11.538 17.9702 11.641 17.7598C11.7512 17.5346 11.8266 17.2894 11.8604 17.031C11.8941 17.2894 11.9696 17.5346 12.0798 17.7598C12.1828 17.9702 12.3161 18.163 12.474 18.3326C12.9937 18.5965 13.5816 18.7453 14.2043 18.7453C14.827 18.7453 15.415 18.5965 15.9346 18.3326C16.5451 18.0226 17.0613 17.5536 17.4287 16.9802C17.6907 17.5284 17.8745 18.1211 17.9655 18.744C18.0085 19.0387 18.0308 19.3401 18.0308 19.6468C18.0308 19.8637 18.0197 20.0781 17.9979 20.2893C17.9952 20.3157 17.9923 20.342 17.9892 20.3683L17.989 20.3706L17.9887 20.3732L17.9886 20.3737L17.9883 20.3764L17.9879 20.3796C17.9596 20.62 17.9174 20.8561 17.8624 21.0872C17.8581 21.105 17.8538 21.1228 17.8494 21.1405C17.8482 21.1454 17.847 21.1503 17.8457 21.1553L17.8439 21.1628L17.8437 21.1634L17.8431 21.1657L17.8431 21.1659L17.843 21.1662L17.8425 21.168L17.8424 21.1686L17.842 21.1701L17.8416 21.1719L17.8415 21.1723L17.8398 21.1789L17.8397 21.1792L17.8396 21.1794L17.8396 21.1797L17.8394 21.1803C17.8366 21.1912 17.8338 21.202 17.831 21.2129L17.8303 21.2158L17.83 21.2166L17.8297 21.2179L17.8295 21.2188ZM11.8604 17.031C11.8472 16.9298 11.8403 16.8266 11.8403 16.7218C11.4201 16.7218 11.0255 16.6122 10.6836 16.42C9.96316 16.015 9.47645 15.2434 9.47633 14.3582V14.3578C9.47633 14.2033 9.49115 14.0523 9.51945 13.9061C9.87134 13.7637 10.2393 13.6527 10.6199 13.5766C11.0144 13.4977 11.4226 13.4563 11.8403 13.4563C12.2734 13.4563 12.6962 13.5008 13.1042 13.5854C13.4693 13.6612 13.8227 13.7691 14.1612 13.9061C14.1895 14.0523 14.2043 14.2033 14.2043 14.3578C14.2043 15.2213 13.7414 15.9767 13.0502 16.3892C12.7069 16.5941 12.3074 16.7144 11.8804 16.7215V16.7218C11.8804 16.8266 11.8736 16.9298 11.8604 17.031ZM16.2879 10.6315C16.7858 10.6315 17.1894 10.2279 17.1894 9.72999C17.1894 9.23209 16.7858 8.82846 16.2879 8.82846C15.79 8.82846 15.3863 9.23209 15.3863 9.72999C15.3863 10.2279 15.79 10.6315 16.2879 10.6315ZM7.41283 10.6315C7.91073 10.6315 8.31436 10.2279 8.31436 9.72999C8.31436 9.23209 7.91073 8.82846 7.41283 8.82846C6.91493 8.82846 6.51131 9.23209 6.51131 9.72999C6.51131 10.2279 6.91493 10.6315 7.41283 10.6315Z" />
              <path d="M11.8589 18.2354C12.0499 18.3836 12.2553 18.5141 12.4726 18.6244C12.9042 19.0878 13.5197 19.3777 14.2029 19.3777C14.4004 19.3777 14.5924 19.3534 14.7758 19.3078C13.9019 19.7796 12.9017 20.0474 11.8389 20.0474C10.7604 20.0474 9.74627 19.7716 8.86328 19.2867C9.07028 19.3459 9.2889 19.3777 9.51493 19.3777C10.1981 19.3777 10.8136 19.0878 11.2452 18.6244C11.4626 18.5141 11.6679 18.3836 11.8589 18.2354Z" />
              <path fill-rule="evenodd" clip-rule="evenodd" d="M0.901528 4.94213C0.901528 5.6964 1.47253 6.3173 2.20585 6.39616C2.01688 6.65647 1.84013 6.92623 1.67645 7.2046C0.706189 6.91012 0 6.0086 0 4.94213C0 3.63653 1.0584 2.57812 2.36401 2.57812C3.36312 2.57812 4.21747 3.19793 4.56353 4.07402C4.29959 4.25956 4.04502 4.45751 3.80065 4.66704C3.67195 3.99084 3.07768 3.47965 2.36401 3.47965C1.5563 3.47965 0.901528 4.13443 0.901528 4.94213Z" />
              <path fill-rule="evenodd" clip-rule="evenodd" d="M21.4734 6.39566C21.5269 6.40157 21.5812 6.40461 21.6362 6.40461C22.4439 6.40461 23.0987 5.74984 23.0987 4.94213C23.0987 4.13443 22.4439 3.47965 21.6362 3.47965C20.8325 3.47965 20.1803 4.12787 20.1738 4.92998C19.9185 4.69316 19.6509 4.46949 19.3721 4.26003C19.6648 3.28696 20.5677 2.57812 21.6362 2.57812C22.9418 2.57812 24.0002 3.63653 24.0002 4.94213C24.0002 6.10932 23.1543 7.07894 22.0421 7.27142C21.8675 6.96917 21.6776 6.6769 21.4734 6.39566Z" />
            </svg>
          </div>
          <div>
            <p className="font-semibold tracking-tight text-white">Ursa: AI Personal Assistant</p>
            <p className="text-xs text-white/50">Online · Responds instantly</p>
          </div>
        </div>
        <div className="inline-flex items-center gap-2 text-xs text-white/50">
          <span className="inline-block h-2 w-2 rounded-full bg-green-500"></span>
          Live
        </div>
      </div>

      {/* Message Display Area */}
      <div
        ref={chatContainerRef}
        className="flex-1 min-h-[260px] overflow-auto max-h-[420px] pt-1 pr-4 pb-4 pl-2 mb-4 space-y-4"
        id="chat-thread"
        role="log"
        aria-live="polite"
        aria-label="Chat message history"
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            // FIX 1: The container is w-full. We use justify-end to push User to the right.
            className={`flex gap-3 w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {/* Agent Avatar (Left Side) */}
            {msg.sender === 'agent' && (
              <div className="flex flex-shrink-0 font-medium bg-white/10 w-8 h-8 ring-white/10 ring-1 rounded-full items-center justify-center text-white">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="w-[16px] h-[32px] flex-shrink-0" stroke-width="2" data-icon-replaced="true">
                  <path opacity="0.5" fill-rule="evenodd" clip-rule="evenodd" d="M11.8401 2.3723C12.1332 2.32759 12.4306 2.29559 12.7316 2.27688C12.5229 2.26391 12.3125 2.25732 12.1005 2.25732C11.8001 2.25732 11.5027 2.27055 11.209 2.29645C11.4213 2.31518 11.6317 2.34053 11.8401 2.3723Z" />
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M7.13151 9.67024C7.25322 9.67024 7.35188 9.57157 7.35188 9.44987C7.35188 9.32816 7.25322 9.22949 7.13151 9.22949C7.0098 9.22949 6.91113 9.32816 6.91113 9.44987C6.91113 9.57157 7.0098 9.67024 7.13151 9.67024Z" />
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M16.0075 9.67024C16.1292 9.67024 16.2279 9.57157 16.2279 9.44987C16.2279 9.32816 16.1292 9.22949 16.0075 9.22949C15.8858 9.22949 15.7871 9.32816 15.7871 9.44987C15.7871 9.57157 15.8858 9.67024 16.0075 9.67024Z" />
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M7.13151 9.67024C7.25322 9.67024 7.35188 9.57157 7.35188 9.44987C7.35188 9.32816 7.25322 9.22949 7.13151 9.22949C7.0098 9.22949 6.91113 9.32816 6.91113 9.44987C6.91113 9.57157 7.0098 9.67024 7.13151 9.67024Z" />
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M17.8295 21.2188L17.8294 21.2191L17.8292 21.2197L17.8291 21.2202L17.828 21.2246L17.8278 21.2251L17.8269 21.2285L17.8259 21.2323L17.8248 21.2364L17.8244 21.2382L17.8243 21.2385L17.8238 21.2405L17.8222 21.2464C21.1165 19.6059 23.3799 16.2044 23.3799 12.2743C23.3799 10.452 22.8933 8.74331 22.0429 7.27116C21.8683 6.96891 21.6784 6.67664 21.4742 6.3954C21.0893 5.86527 20.6537 5.37433 20.1745 4.92972C19.9193 4.69291 19.6517 4.46923 19.3728 4.25978C17.6987 3.00239 15.6178 2.25732 13.3629 2.25732C13.151 2.25732 12.9405 2.26391 12.7318 2.27688C12.4309 2.29559 12.1335 2.32759 11.8403 2.3723C11.632 2.34053 11.4216 2.31518 11.2093 2.29645C10.9156 2.27055 10.6182 2.25732 10.3178 2.25732C8.17639 2.25732 6.19196 2.92925 4.5638 4.07377C4.29986 4.2593 4.04529 4.45726 3.80092 4.66678C3.20434 5.17831 2.66862 5.7588 2.20612 6.3959C2.01715 6.65621 1.84041 6.92597 1.67673 7.20434C0.802273 8.69151 0.300781 10.4243 0.300781 12.2743C0.300781 16.2044 2.56414 19.6059 5.8585 21.2464C5.74689 20.828 5.67802 20.3921 5.65684 19.9437C5.6522 19.8453 5.64985 19.7463 5.64985 19.6468C5.64985 19.3401 5.67214 19.0387 5.71521 18.744C5.80821 18.1075 5.99807 17.5024 6.26935 16.9443C6.63802 17.534 7.16292 18.0161 7.7861 18.3326C8.30573 18.5965 8.8937 18.7453 9.5164 18.7453C10.1391 18.7453 10.7271 18.5965 11.2467 18.3326C11.4047 18.163 11.538 17.9702 11.641 17.7598C11.7512 17.5346 11.8266 17.2894 11.8604 17.031C11.8941 17.2894 11.9696 17.5346 12.0798 17.7598C12.1828 17.9702 12.3161 18.163 12.474 18.3326C12.9937 18.5965 13.5816 18.7453 14.2043 18.7453C14.827 18.7453 15.415 18.5965 15.9346 18.3326C16.5451 18.0226 17.0613 17.5536 17.4287 16.9802C17.6907 17.5284 17.8745 18.1211 17.9655 18.744C18.0085 19.0387 18.0308 19.3401 18.0308 19.6468C18.0308 19.8637 18.0197 20.0781 17.9979 20.2893C17.9952 20.3157 17.9923 20.342 17.9892 20.3683L17.989 20.3706L17.9887 20.3732L17.9886 20.3737L17.9883 20.3764L17.9879 20.3796C17.9596 20.62 17.9174 20.8561 17.8624 21.0872C17.8581 21.105 17.8538 21.1228 17.8494 21.1405C17.8482 21.1454 17.847 21.1503 17.8457 21.1553L17.8439 21.1628L17.8437 21.1634L17.8431 21.1657L17.8431 21.1659L17.843 21.1662L17.8425 21.168L17.8424 21.1686L17.842 21.1701L17.8416 21.1719L17.8415 21.1723L17.8398 21.1789L17.8397 21.1792L17.8396 21.1794L17.8396 21.1797L17.8394 21.1803C17.8366 21.1912 17.8338 21.202 17.831 21.2129L17.8303 21.2158L17.83 21.2166L17.8297 21.2179L17.8295 21.2188ZM11.8604 17.031C11.8472 16.9298 11.8403 16.8266 11.8403 16.7218C11.4201 16.7218 11.0255 16.6122 10.6836 16.42C9.96316 16.015 9.47645 15.2434 9.47633 14.3582V14.3578C9.47633 14.2033 9.49115 14.0523 9.51945 13.9061C9.87134 13.7637 10.2393 13.6527 10.6199 13.5766C11.0144 13.4977 11.4226 13.4563 11.8403 13.4563C12.2734 13.4563 12.6962 13.5008 13.1042 13.5854C13.4693 13.6612 13.8227 13.7691 14.1612 13.9061C14.1895 14.0523 14.2043 14.2033 14.2043 14.3578C14.2043 15.2213 13.7414 15.9767 13.0502 16.3892C12.7069 16.5941 12.3074 16.7144 11.8804 16.7215V16.7218C11.8804 16.8266 11.8736 16.9298 11.8604 17.031ZM16.2879 10.6315C16.7858 10.6315 17.1894 10.2279 17.1894 9.72999C17.1894 9.23209 16.7858 8.82846 16.2879 8.82846C15.79 8.82846 15.3863 9.23209 15.3863 9.72999C15.3863 10.2279 15.79 10.6315 16.2879 10.6315ZM7.41283 10.6315C7.91073 10.6315 8.31436 10.2279 8.31436 9.72999C8.31436 9.23209 7.91073 8.82846 7.41283 8.82846C6.91493 8.82846 6.51131 9.23209 6.51131 9.72999C6.51131 10.2279 6.91493 10.6315 7.41283 10.6315Z" />
                  <path d="M11.8589 18.2354C12.0499 18.3836 12.2553 18.5141 12.4726 18.6244C12.9042 19.0878 13.5197 19.3777 14.2029 19.3777C14.4004 19.3777 14.5924 19.3534 14.7758 19.3078C13.9019 19.7796 12.9017 20.0474 11.8389 20.0474C10.7604 20.0474 9.74627 19.7716 8.86328 19.2867C9.07028 19.3459 9.2889 19.3777 9.51493 19.3777C10.1981 19.3777 10.8136 19.0878 11.2452 18.6244C11.4626 18.5141 11.6679 18.3836 11.8589 18.2354Z" />
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M0.901528 4.94213C0.901528 5.6964 1.47253 6.3173 2.20585 6.39616C2.01688 6.65647 1.84013 6.92623 1.67645 7.2046C0.706189 6.91012 0 6.0086 0 4.94213C0 3.63653 1.0584 2.57812 2.36401 2.57812C3.36312 2.57812 4.21747 3.19793 4.56353 4.07402C4.29959 4.25956 4.04502 4.45751 3.80065 4.66704C3.67195 3.99084 3.07768 3.47965 2.36401 3.47965C1.5563 3.47965 0.901528 4.13443 0.901528 4.94213Z" />
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M21.4734 6.39566C21.5269 6.40157 21.5812 6.40461 21.6362 6.40461C22.4439 6.40461 23.0987 5.74984 23.0987 4.94213C23.0987 4.13443 22.4439 3.47965 21.6362 3.47965C20.8325 3.47965 20.1803 4.12787 20.1738 4.92998C19.9185 4.69316 19.6509 4.46949 19.3721 4.26003C19.6648 3.28696 20.5677 2.57812 21.6362 2.57812C22.9418 2.57812 24.0002 3.63653 24.0002 4.94213C24.0002 6.10932 23.1543 7.07894 22.0421 7.27142C21.8675 6.96917 21.6776 6.6769 21.4734 6.39566Z" />
                </svg>
              </div>
            )}

            {/* Message Bubble Wrapper */}
            {/* FIX 2: The 80% constraint goes strictly on this wrapper, not the row */}
            <div className="max-w-[80%]">
              <div className={`text-sm rounded-2xl py-3 px-4 shadow backdrop-blur-sm ring-1 break-words whitespace-pre-wrap ${msg.sender === 'user'
                ? 'bg-white/10 ring-white/10 text-white'
                : 'bg-black/30 ring-white/20 text-white/80'
                }`}>
                {msg.text}
              </div>
            </div>

            {/* User Avatar (Right Side) */}
            {msg.sender === 'user' && (
              // FIX 3: Fixed typo 'flexx-shrink-0' to 'flex-shrink-0'
              <div className="flex flex-shrink-0 transition text-white/80 bg-white/10 w-8 h-8 ring-white/10 ring-1 rounded-full items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <circle cx="12" cy="10" r="3"></circle>
                  <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"></path>
                </svg>
              </div>
            )}
          </div>
        ))}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-3 gap-x-3 gap-y-3 items-start">
            <div className="flex flex-shrink-0 font-medium bg-white/10 w-8 h-8 ring-white/10 ring-1 rounded-full items-center justify-center text-white">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="w-[16px] h-[32px] flex-shrink-0" stroke-width="2" data-icon-replaced="true">
                <path opacity="0.5" fill-rule="evenodd" clip-rule="evenodd" d="M11.8401 2.3723C12.1332 2.32759 12.4306 2.29559 12.7316 2.27688C12.5229 2.26391 12.3125 2.25732 12.1005 2.25732C11.8001 2.25732 11.5027 2.27055 11.209 2.29645C11.4213 2.31518 11.6317 2.34053 11.8401 2.3723Z" />
                <path fill-rule="evenodd" clip-rule="evenodd" d="M7.13151 9.67024C7.25322 9.67024 7.35188 9.57157 7.35188 9.44987C7.35188 9.32816 7.25322 9.22949 7.13151 9.22949C7.0098 9.22949 6.91113 9.32816 6.91113 9.44987C6.91113 9.57157 7.0098 9.67024 7.13151 9.67024Z" />
                <path fill-rule="evenodd" clip-rule="evenodd" d="M16.0075 9.67024C16.1292 9.67024 16.2279 9.57157 16.2279 9.44987C16.2279 9.32816 16.1292 9.22949 16.0075 9.22949C15.8858 9.22949 15.7871 9.32816 15.7871 9.44987C15.7871 9.57157 15.8858 9.67024 16.0075 9.67024Z" />
                <path fill-rule="evenodd" clip-rule="evenodd" d="M7.13151 9.67024C7.25322 9.67024 7.35188 9.57157 7.35188 9.44987C7.35188 9.32816 7.25322 9.22949 7.13151 9.22949C7.0098 9.22949 6.91113 9.32816 6.91113 9.44987C6.91113 9.57157 7.0098 9.67024 7.13151 9.67024Z" />
                <path fill-rule="evenodd" clip-rule="evenodd" d="M17.8295 21.2188L17.8294 21.2191L17.8292 21.2197L17.8291 21.2202L17.828 21.2246L17.8278 21.2251L17.8269 21.2285L17.8259 21.2323L17.8248 21.2364L17.8244 21.2382L17.8243 21.2385L17.8238 21.2405L17.8222 21.2464C21.1165 19.6059 23.3799 16.2044 23.3799 12.2743C23.3799 10.452 22.8933 8.74331 22.0429 7.27116C21.8683 6.96891 21.6784 6.67664 21.4742 6.3954C21.0893 5.86527 20.6537 5.37433 20.1745 4.92972C19.9193 4.69291 19.6517 4.46923 19.3728 4.25978C17.6987 3.00239 15.6178 2.25732 13.3629 2.25732C13.151 2.25732 12.9405 2.26391 12.7318 2.27688C12.4309 2.29559 12.1335 2.32759 11.8403 2.3723C11.632 2.34053 11.4216 2.31518 11.2093 2.29645C10.9156 2.27055 10.6182 2.25732 10.3178 2.25732C8.17639 2.25732 6.19196 2.92925 4.5638 4.07377C4.29986 4.2593 4.04529 4.45726 3.80092 4.66678C3.20434 5.17831 2.66862 5.7588 2.20612 6.3959C2.01715 6.65621 1.84041 6.92597 1.67673 7.20434C0.802273 8.69151 0.300781 10.4243 0.300781 12.2743C0.300781 16.2044 2.56414 19.6059 5.8585 21.2464C5.74689 20.828 5.67802 20.3921 5.65684 19.9437C5.6522 19.8453 5.64985 19.7463 5.64985 19.6468C5.64985 19.3401 5.67214 19.0387 5.71521 18.744C5.80821 18.1075 5.99807 17.5024 6.26935 16.9443C6.63802 17.534 7.16292 18.0161 7.7861 18.3326C8.30573 18.5965 8.8937 18.7453 9.5164 18.7453C10.1391 18.7453 10.7271 18.5965 11.2467 18.3326C11.4047 18.163 11.538 17.9702 11.641 17.7598C11.7512 17.5346 11.8266 17.2894 11.8604 17.031C11.8941 17.2894 11.9696 17.5346 12.0798 17.7598C12.1828 17.9702 12.3161 18.163 12.474 18.3326C12.9937 18.5965 13.5816 18.7453 14.2043 18.7453C14.827 18.7453 15.415 18.5965 15.9346 18.3326C16.5451 18.0226 17.0613 17.5536 17.4287 16.9802C17.6907 17.5284 17.8745 18.1211 17.9655 18.744C18.0085 19.0387 18.0308 19.3401 18.0308 19.6468C18.0308 19.8637 18.0197 20.0781 17.9979 20.2893C17.9952 20.3157 17.9923 20.342 17.9892 20.3683L17.989 20.3706L17.9887 20.3732L17.9886 20.3737L17.9883 20.3764L17.9879 20.3796C17.9596 20.62 17.9174 20.8561 17.8624 21.0872C17.8581 21.105 17.8538 21.1228 17.8494 21.1405C17.8482 21.1454 17.847 21.1503 17.8457 21.1553L17.8439 21.1628L17.8437 21.1634L17.8431 21.1657L17.8431 21.1659L17.843 21.1662L17.8425 21.168L17.8424 21.1686L17.842 21.1701L17.8416 21.1719L17.8415 21.1723L17.8398 21.1789L17.8397 21.1792L17.8396 21.1794L17.8396 21.1797L17.8394 21.1803C17.8366 21.1912 17.8338 21.202 17.831 21.2129L17.8303 21.2158L17.83 21.2166L17.8297 21.2179L17.8295 21.2188ZM11.8604 17.031C11.8472 16.9298 11.8403 16.8266 11.8403 16.7218C11.4201 16.7218 11.0255 16.6122 10.6836 16.42C9.96316 16.015 9.47645 15.2434 9.47633 14.3582V14.3578C9.47633 14.2033 9.49115 14.0523 9.51945 13.9061C9.87134 13.7637 10.2393 13.6527 10.6199 13.5766C11.0144 13.4977 11.4226 13.4563 11.8403 13.4563C12.2734 13.4563 12.6962 13.5008 13.1042 13.5854C13.4693 13.6612 13.8227 13.7691 14.1612 13.9061C14.1895 14.0523 14.2043 14.2033 14.2043 14.3578C14.2043 15.2213 13.7414 15.9767 13.0502 16.3892C12.7069 16.5941 12.3074 16.7144 11.8804 16.7215V16.7218C11.8804 16.8266 11.8736 16.9298 11.8604 17.031ZM16.2879 10.6315C16.7858 10.6315 17.1894 10.2279 17.1894 9.72999C17.1894 9.23209 16.7858 8.82846 16.2879 8.82846C15.79 8.82846 15.3863 9.23209 15.3863 9.72999C15.3863 10.2279 15.79 10.6315 16.2879 10.6315ZM7.41283 10.6315C7.91073 10.6315 8.31436 10.2279 8.31436 9.72999C8.31436 9.23209 7.91073 8.82846 7.41283 8.82846C6.91493 8.82846 6.51131 9.23209 6.51131 9.72999C6.51131 10.2279 6.91493 10.6315 7.41283 10.6315Z" />
                <path d="M11.8589 18.2354C12.0499 18.3836 12.2553 18.5141 12.4726 18.6244C12.9042 19.0878 13.5197 19.3777 14.2029 19.3777C14.4004 19.3777 14.5924 19.3534 14.7758 19.3078C13.9019 19.7796 12.9017 20.0474 11.8389 20.0474C10.7604 20.0474 9.74627 19.7716 8.86328 19.2867C9.07028 19.3459 9.2889 19.3777 9.51493 19.3777C10.1981 19.3777 10.8136 19.0878 11.2452 18.6244C11.4626 18.5141 11.6679 18.3836 11.8589 18.2354Z" />
                <path fill-rule="evenodd" clip-rule="evenodd" d="M0.901528 4.94213C0.901528 5.6964 1.47253 6.3173 2.20585 6.39616C2.01688 6.65647 1.84013 6.92623 1.67645 7.2046C0.706189 6.91012 0 6.0086 0 4.94213C0 3.63653 1.0584 2.57812 2.36401 2.57812C3.36312 2.57812 4.21747 3.19793 4.56353 4.07402C4.29959 4.25956 4.04502 4.45751 3.80065 4.66704C3.67195 3.99084 3.07768 3.47965 2.36401 3.47965C1.5563 3.47965 0.901528 4.13443 0.901528 4.94213Z" />
                <path fill-rule="evenodd" clip-rule="evenodd" d="M21.4734 6.39566C21.5269 6.40157 21.5812 6.40461 21.6362 6.40461C22.4439 6.40461 23.0987 5.74984 23.0987 4.94213C23.0987 4.13443 22.4439 3.47965 21.6362 3.47965C20.8325 3.47965 20.1803 4.12787 20.1738 4.92998C19.9185 4.69316 19.6509 4.46949 19.3721 4.26003C19.6648 3.28696 20.5677 2.57812 21.6362 2.57812C22.9418 2.57812 24.0002 3.63653 24.0002 4.94213C24.0002 6.10932 23.1543 7.07894 22.0421 7.27142C21.8675 6.96917 21.6776 6.6769 21.4734 6.39566Z" />
              </svg>
            </div>
            <div className="flex gap-2 text-sm text-white/80 gap-x-2 gap-y-2 pt-1 items-center">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                style={{
                  width: '16px',
                  height: '16px',
                  animation: 'spin 1s linear infinite'
                }}
              >
                <style>{`
                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                `}</style>
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4A4 4 0 008 12H4z"
                ></path>
              </svg>
              <span className="">Typing...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="group transition-all duration-200 hover-glow focus-within:ring-2 focus-within:ring-white/50 hover:bg-black/30 hover:ring-white/20 bg-black/50 ring-white/10 ring-1 rounded-xl pt-2 pr-2 pb-2 pl-2">
        <div className="flex gap-2 gap-x-2 gap-y-2 items-center">
          <div className="hidden sm:flex w-9 h-9 border rounded-lg items-center justify-center text-white/80 bg-white/10 border-white/10">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] text-white/80">
              <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
              <path d="M20 3v4"></path>
              <path d="M22 5h-4"></path>
              <path d="M4 17v2"></path>
              <path d="M5 18H3"></path>
            </svg>
          </div>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            aria-label="Share the details with my AI agent"
            className="focus:outline-none text-sm text-white bg-transparent w-full h-10 pr-3 pl-3"
            placeholder="Tell the details to my agent.."
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="inline-flex transition-colors active:scale-95 w-9 h-9 border rounded-lg items-center justify-center hover:bg-white bg-white/80 border-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] text-black/80">
              <path d="M3.714 3.048a.498.498 0 0 0-.683.627l2.843 7.627a2 2 0 0 1 0 1.396l-2.842 7.627a.498.498 0 0 0 .682.627l18-8.5a.5.5 0 0 0 0-.904z"></path>
              <path d="M6 12h16"></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Privacy Note */}
      <p className="mt-3 text-xs text-white/50">
        Your info is private and only used to respond to your message. Type "back" to revise or "summarise" anytime.
      </p>
    </div>
  );
};

export default LeadGenChat;
