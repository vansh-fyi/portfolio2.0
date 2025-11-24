import React, { useState, useEffect, useRef } from 'react';
import { useViewStore } from '../../state/overlayStore';
import Header from '../Header';
import OverlaySidebar from './OverlaySidebar';
import { useRAGQuery } from '../../hooks/useRAGQuery';
import { getProjectName } from '../../data/projects';

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

const ChatView: React.FC = () => {
  const { goToMain, goToProjects, chatContext, initialChatQuery, projectId } = useViewStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [pendingQuery, setPendingQuery] = useState(''); // Track query being sent
  const [isSending, setIsSending] = useState(false);

  const { data, error, isLoading, refetch } = useRAGQuery(pendingQuery);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContext === 'personal') {
      setMessages([{ sender: 'ai', text: "Hi! I'm Ursa. Ask me anything about Vansh." }]);
    } else {
      // Get the actual project name from metadata
      const projectName = projectId ? getProjectName(projectId) : undefined;
      const displayName = projectName || 'this project';
      setMessages([{ sender: 'ai', text: `Hello! Ask anything about ${displayName} here.` }]);
    }
  }, [chatContext, projectId]);

  useEffect(() => {
    if (initialChatQuery) {
      setMessages((prev) => [...prev, { sender: 'user', text: initialChatQuery }]);
      setPendingQuery(initialChatQuery); // Use pendingQuery instead
      useViewStore.setState({ initialChatQuery: '' }); // Clear it after use
    }
  }, [initialChatQuery]);

  // Trigger refetch when pendingQuery changes (and is not empty)
  useEffect(() => {
    if (pendingQuery.trim()) {
      refetch();
    }
  }, [pendingQuery, refetch]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (isLoading) {
      setIsSending(true);
    } else {
      setIsSending(false);
    }

    // Only process response if we were expecting one (pendingQuery is set)
    if (!pendingQuery) return;

    // @ts-ignore - Only add message if there's an actual response (not null from empty queries)
    if (data && data.response) {
      setMessages((prev) => [...prev, { sender: 'ai', text: data.response }]);
      setPendingQuery(''); // Clear pending query after receiving response
    } else if (error) {
      setMessages((prev) => [...prev, { sender: 'ai', text: 'Ursa is having trouble connecting. Please try again.' }]);
      setPendingQuery(''); // Clear on error too
    }
  }, [data, error, isLoading, pendingQuery]);

  const handleClose = () => {
    if (chatContext === 'project') {
      goToProjects();
    } else {
      goToMain();
    }
  };

  const handleSend = () => {
    if (input.trim() === '') return;
    setMessages((prev) => [...prev, { sender: 'user', text: input }]);
    setPendingQuery(input); // Set the query to send
    setInput(''); // Clear input field immediately for UX
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed inset-0 z-40 bg-black">
      <Header />
      <div className="pt-[84px] px-6 md:px-20 pb-6">
        <div className="z-10 relative">
          <div className="overflow-hidden h-[calc(100vh-84px-24px)] flex flex-col bg-neutral-900/80 ring-white/20 ring-1 bg-black/30 rounded-2xl shadow-[0_20px_120px_-20px_rgba(0,0,0,0.7)] backdrop-blur-md">
            <div className="flex sm:px-6 border-white/5 border-b pt-3 pr-4 pb-3 pl-4 items-center justify-between">
              <div className="flex items-center gap-3">
                <div onClick={goToMain} className="group flex items-center gap-2">
                  <button
                    className="flex h-3.5 w-3.5 rounded-full text-red-500/10 group-hover:text-red-900 bg-red-500/90 group-hover:bg-red-500 active:bg-red-200 cursor-pointer transition-colors items-center justify-center"
                    aria-label="Close"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-3 h-3"
                    >
                      <path d="M18 6 6 18"></path>
                      <path d="m6 6 12 12"></path>
                    </svg>
                  </button>
                  <button
                    className="flex h-3.5 w-3.5 rounded-full text-amber-400/10 group-hover:text-amber-900 bg-amber-400/90 group-hover:bg-amber-400 active:bg-amber-200 cursor-pointer transition-colors items-center justify-center"
                    aria-label="Minimise"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <path d="M5 12h14" />
                    </svg>
                  </button>
                  <span className="h-3.5 w-3.5 rounded-full bg-emerald-500/90"></span>
                </div>
                <a href="#" className="group flex items-center gap-2 text-white/80 ring-transparent ring-1 rounded-lg pt-1 pr-4 pb-1 pl-4">
                  <div className="inline-flex bg-center w-8 h-8 bg-[url(https://cdn.jsdelivr.net/gh/vansh-fyi/portfolio2.0@main/Images/logo_dark.png)] bg-cover rounded-md items-center justify-center"></div>
                  <div className="flex">
                    <span className="text-sm text-white/80 font-geist">Ursa</span>
                    <span className="hidden lg:inline text-sm text-white/50 font-geist">:AI Agent</span>
                  </div>
                </a>
              </div>
              <div className="flex gap-2 sm:gap-3 gap-x-2 gap-y-2 items-center">
                <button
                  onClick={handleClose}
                  className="inline-flex active:scale-95 flex-shrink-0 text-sm bg-white/5 ring-white/10 ring-1 rounded-full pt-1.5 pr-3 pb-1.5 pl-3 gap-x-2 gap-y-2 items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px] text-white/80">
                    <path d="M18 6 6 18"></path>
                    <path d="m6 6 12 12"></path>
                  </svg>
                  <span className="hidden lg:inline text-white/80">Close Ursa</span>
                  <span className="inline lg:hidden text-white/80">Close</span>
                </button>
                {chatContext === 'project' && (
                  <div className="hidden md:flex bg-black/30 ring-white/10 ring-1 rounded-full pt-1.5 pr-3 pb-1.5 pl-3 gap-x-2 gap-y-2 items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-white/50">
                      <path d="m21 21-4.34-4.34"></path>
                      <circle cx="11" cy="11" r="8"></circle>
                    </svg>
                    <input placeholder="Search projects..." className="w-48 bg-transparent text-sm focus:outline-none" />
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-12 flex-1 min-h-0">
              {chatContext === 'project' && <OverlaySidebar />}
              <section className={`${chatContext === 'project' ? 'col-span-12 md:col-span-9 lg:col-span-9' : 'col-span-12'} min-h-0 flex flex-col relative`}>
                <div className="flex flex-col min-h-0 h-full relative">
                  <div ref={chatContainerRef} className="flex-1 overflow-y-auto sm:px-8 pt-8 pr-4 pb-8 pl-4 space-y-6">
                    {messages.map((msg, index) => (
                      <div key={index} className={`flex gap-x-3 gap-y-3 items-start ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                        {msg.sender === 'ai' && (
                          <div className="flex flex-shrink-0 text-xs font-medium text-white bg-white/10 w-8 h-8 rounded-full ring-white/10 ring-1 items-center justify-center">AI</div>
                        )}
                        <div className={`text-sm max-w-[75%] ring-1 rounded-2xl pt-2.5 pr-4 pb-2.5 pl-4 shadow-sm backdrop-blur-sm ${msg.sender === 'user' ? 'bg-white/5 ring-white/10' : 'bg-black/30 ring-white/10'}`}>
                          <p className="text-white">{msg.text}</p>
                        </div>
                        {msg.sender === 'user' && (
                          <div className="inline-flex transition text-white/80 bg-white/10 w-8 h-8 ring-white/10 ring-1 rounded-full items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-user lucide-user w-[18px] h-[18px]">
                              <circle cx="12" cy="12" r="10"></circle>
                              <circle cx="12" cy="10" r="3"></circle>
                              <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"></path>
                            </svg>
                          </div>
                        )}
                      </div>
                    ))}
                    {isSending && (
                      <div className="flex gap-3 gap-x-3 gap-y-3 items-center">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs font-medium ring-1 ring-white/10 text-white">AI</div>
                        <div className="flex gap-2 text-sm text-white/80 gap-x-2 gap-y-2 items-center">
                          <svg className="animate-spin h-4 w-4 text-white/80" viewBox="0 0 24 24">
                            <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                            <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v4A4 4 0 008 12H4z"></path>
                          </svg>
                          Processing your request...
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="sm:px-8 pr-4 pb-8 pl-4">
                    <div className="sm:p-4 bg-black/30 w-full ring-white/20 ring-1 rounded-2xl mr-auto ml-auto pt-3 pr-3 pb-3 pl-3 shadow-2xl backdrop-blur-xl">
                      <div className="flex items-end gap-2 sm:gap-3">
                        <div className="relative flex-1">
                          <textarea
                            rows={2}
                            className="resize-none focus:outline-none text-sm text-slate-200 bg-transparent w-full rounded-xl pt-2.5 pr-3 pb-2.5 pl-3"
                            placeholder="Ask anything about the project in detail..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                          />
                          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                        </div>
                        <div className="flex gap-2 sm:gap-3 gap-x-2 gap-y-2 items-center">
                          <button
                            onClick={handleSend}
                            disabled={isSending}
                            className="inline-flex hover:bg-white active:scale-95 text-sm font-medium text-black bg-white/80 rounded-xl pt-2.5 pr-4 pb-2.5 pl-4 items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send w-[16px] h-[16px] mr-1.5 text-black">
                              <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"></path>
                              <path d="m21.854 2.147-10.94 10.939"></path>
                            </svg>
                            Send
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatView;
