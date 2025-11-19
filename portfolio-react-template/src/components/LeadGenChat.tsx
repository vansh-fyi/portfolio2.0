import React, { useState, useEffect, useRef } from 'react';
import { useThemeStore } from '../state/themeStore';

interface Message {
  sender: 'user' | 'agent';
  text: string;
  timestamp?: Date;
}

interface LeadGenChatProps {
  className?: string;
}

const LeadGenChat: React.FC<LeadGenChatProps> = ({ className = '' }) => {
  // Theme management - currently Contact section uses dark-only styling
  // _isLightMode kept for consistency with other components (ChatOverlay, etc.)
  // Future: implement light mode variants when Contact section gets theme support
  const { isLightMode: _isLightMode } = useThemeStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'agent',
      text: 'Hi there! Nice to meet you. Text me for collaboration or opportunities!',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = () => {
    // Validate input (non-empty messages only)
    if (inputValue.trim() === '') return;

    // Add user message to history
    const userMessage: Message = {
      sender: 'user',
      text: inputValue,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    // Clear input field after send
    setInputValue('');

    // Simulate agent response (placeholder for Story 3.2)
    setIsLoading(true);
    setTimeout(() => {
      const agentResponse: Message = {
        sender: 'agent',
        text: 'Thank you for reaching out! I\'m Ursa, your AI assistant. The conversational flow will be implemented in the next story.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, agentResponse]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={`lg:p-8 bg-gradient-to-b to-white/[0.02] border ring-1 rounded-2xl p-6 backdrop-blur-xl h-full flex flex-col from-white/5 border-white/10 ring-white/5 ${className}`}>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="inline-flex bg-white/10 w-10 h-10 ring-white/10 ring-1 rounded-xl items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-white/80">
              <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
              <path d="M20 3v4"></path>
              <path d="M22 5h-4"></path>
              <path d="M4 17v2"></path>
              <path d="M5 18H3"></path>
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
              <div className="flex flex-shrink-0 text-xs font-medium bg-white/10 w-8 h-8 ring-white/10 ring-1 rounded-full items-center justify-center text-white">
                AI
              </div>
            )}

            {/* Message Bubble Wrapper */}
            {/* FIX 2: The 80% constraint goes strictly on this wrapper, not the row */}
            <div className="max-w-[80%]">
              <div className={`text-sm rounded-2xl py-3 px-4 shadow backdrop-blur-sm ring-1 break-words whitespace-pre-wrap ${msg.sender === 'user'
                ? 'bg-white/5 ring-white/10 text-white'
                : 'bg-black/30 ring-white/10 text-white/80'
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
            <div className="flex flex-shrink-0 text-xs font-medium bg-white/10 w-8 h-8 ring-white/10 ring-1 rounded-full items-center justify-center text-white">
              AI
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
