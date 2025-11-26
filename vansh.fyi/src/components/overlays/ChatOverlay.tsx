import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
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
  const { goToMain, goToProjects, goToProjectChat, chatContext, initialChatQuery, projectId } = useViewStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [pendingQuery, setPendingQuery] = useState(''); // Track query being sent
  const [isSending, setIsSending] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { data, error, isLoading, refetch } = useRAGQuery(pendingQuery);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Virtualization setup for performance with long message lists
  const virtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => chatContainerRef.current,
    estimateSize: useCallback(() => 80, []), // Estimated message height
    overscan: 5, // Render 5 extra items above/below viewport
  });

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

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      virtualizer.scrollToIndex(messages.length - 1, { align: 'end' });
    }
  }, [messages.length, isLoading, virtualizer]);

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

  // Cleanup on unmount - defensive measure to clear chat state
  useEffect(() => {
    return () => {
      setMessages([]);
      setPendingQuery('');
    };
  }, []);

  return (
    <div className="fixed inset-0 z-40 bg-black">
      <Header />
      <div className="pt-[80px] md:pt-[84px] px-6 lg:px-20 pb-16 lg:pb-6">
        <div className="z-10 relative">
          <div className="overflow-hidden h-[calc(100vh-120px-24px)] lg:h-[calc(100vh-84px-24px)] flex flex-col bg-neutral-900/80 ring-white/20 ring-1 bg-black/30 rounded-2xl shadow-[0_20px_120px_-20px_rgba(0,0,0,0.7)] backdrop-blur-md">
            <div className="flex sm:px-6 border-white/5 border-b pt-3 pr-4 pb-3 pl-4 items-center justify-between">
              <div className="flex items-center gap-3">
                <div onClick={goToMain} className="group flex items-center gap-2">
                  <button
                    className="flex md:h-3.5 md:w-3.5 h-4 w-4 rounded-full text-red-900 md:text-red-500/10 group-hover:text-red-900 bg-red-500/90 group-hover:bg-red-500 active:bg-red-200 cursor-pointer transition-colors items-center justify-center"
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
                    className="hidden md:inline flex h-3.5 w-3.5 rounded-full text-amber-400/10 group-hover:text-amber-900 bg-amber-400/90 group-hover:bg-amber-400 active:bg-amber-200 cursor-pointer transition-colors items-center justify-center"
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
                  <span className="hidden md:inline h-3.5 w-3.5 rounded-full bg-emerald-500/90"></span>
                </div>
                <a href="#" className="group flex items-center gap-2 text-white/80 ring-transparent ring-1 rounded-lg pt-1 pr-4 pb-1 pl-4">
                  <div className="flex">
                    <span className="text-sm text-white/80 font-geist">Ask Ursa:</span>
                    <span className="hidden lg:inline text-sm text-white/50 font-geist">Know More about projects</span>
                  </div>
                </a>
              </div>
              <div className="flex gap-2 sm:gap-3 gap-x-2 gap-y-2 items-center">
                <button
                  onClick={handleClose}
                  className="inline-flex items-center gap-2 transition-colors active:scale-95 text-sm font-medium text-white/80 bg-white/5 hover:bg-white/10 ring-white/10 ring-1 rounded-full pt-1.5 pr-3 pb-1.5 pl-3"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px] text-white/80">
                    <path d="M15 18l-6-6 6-6"></path>
                  </svg>
                  <span className="text-white/80">Back</span>
                </button>
                {chatContext === 'project' && (
                  <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="md:hidden inline-flex active:scale-95 flex-shrink-0 text-sm bg-white/5 ring-white/10 ring-1 rounded-full pt-1.5 pr-3 pb-1.5 pl-3 gap-x-2 gap-y-2 items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px] text-white/80">
                      <line x1="3" y1="12" x2="21" y2="12"></line>
                      <line x1="3" y1="6" x2="21" y2="6"></line>
                      <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                  </button>
                )}
                {chatContext === 'project' && (
                  <div className="hidden md:flex bg-black/30 ring-white/10 ring-1 rounded-full pt-1.5 pr-3 pb-1.5 pl-3 gap-x-2 gap-y-2 items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-white/50">
                      <path d="m21 21-4.34-4.34"></path>
                      <circle cx="11" cy="11" r="8"></circle>
                    </svg>
                    <input
                      placeholder="Search projects..."
                      className="w-48 bg-transparent text-sm focus:outline-none"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-12 flex-1 min-h-0">
              {chatContext === 'project' && (
                <OverlaySidebar
                  selectedProjectId={projectId}
                  onProjectSelect={(id) => goToProjectChat(id)}
                  isOpen={isSidebarOpen}
                  onClose={() => setIsSidebarOpen(false)}
                  searchQuery={searchQuery}
                  onClearSearch={() => setSearchQuery('')}
                />
              )}
              <section className={`${chatContext === 'project' ? 'col-span-12 md:col-span-9 lg:col-span-9' : 'col-span-12'} min-h-0 flex flex-col relative`}>
                <div className="flex flex-col min-h-0 h-full relative">
                  <div ref={chatContainerRef} className="flex-1 overflow-y-auto sm:px-8 pt-8 pr-4 pb-8 pl-4">
                    <div
                      style={{
                        height: `${virtualizer.getTotalSize()}px`,
                        width: '100%',
                        position: 'relative',
                      }}
                    >
                      {virtualizer.getVirtualItems().map((virtualRow) => {
                        const msg = messages[virtualRow.index];
                        return (
                          <div
                            key={virtualRow.index}
                            data-index={virtualRow.index}
                            ref={virtualizer.measureElement}
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              transform: `translateY(${virtualRow.start}px)`,
                              paddingBottom: '24px', // Equivalent to space-y-6
                            }}
                          >
                            <div className={`flex gap-x-3 gap-y-3 items-start ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                              {msg.sender === 'ai' && (
                                <div className="flex flex-shrink-0 text-white bg-white/10 w-8 h-8 rounded-full ring-white/10 ring-1 items-center justify-center">
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
                          </div>
                        );
                      })}
                    </div>
                    {isSending && (
                      <div className="flex gap-3 gap-x-3 gap-y-3 items-center">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/10 text-white">
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
                        <div className="flex gap-2 text-sm text-white/80 gap-x-2 gap-y-2 items-center">
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
                            className="resize-none focus:outline-none text-sm text-white bg-transparent w-full rounded-xl pt-2.5 pr-3 pb-2.5 pl-3"
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
