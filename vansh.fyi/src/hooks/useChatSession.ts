'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { boundedHistory, CHAT_LIMITS, type ChatScope, type ChatTurn } from '../../lib/chat';
import { useRAGQuery } from './useRAGQuery';

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
  isNew?: boolean;
}

function boundedTranscript(messages: ChatMessage[]): ChatMessage[] {
  const kept: ChatMessage[] = [];
  let chars = 0;
  for (const message of messages.slice(-CHAT_LIMITS.transcriptMessages).reverse()) {
    if (chars + message.text.length > CHAT_LIMITS.transcriptChars) break;
    kept.unshift(message);
    chars += message.text.length;
  }
  return kept;
}

/** Owned by one keyed chat view; closing/switching discards all state and aborts its request. */
export function useChatSession(scope: ChatScope, greeting: string) {
  const { context, projectId } = scope;
  const ask = useRAGQuery();
  const [messages, setMessages] = useState<ChatMessage[]>([{ sender: 'ai', text: greeting }]);
  const [input, updateInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const history = useRef<ChatTurn[]>([]);
  const request = useRef<AbortController | null>(null);
  const lastActivity = useRef(Date.now());
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const purge = useCallback(() => {
    request.current?.abort();
    request.current = null;
    history.current = [];
    updateInput('');
    setIsSending(false);
    setMessages([{ sender: 'ai', text: greeting }]);
    lastActivity.current = Date.now();
  }, [greeting]);

  const touch = useCallback(() => {
    lastActivity.current = Date.now();
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(purge, CHAT_LIMITS.idleMs);
  }, [purge]);

  useEffect(() => {
    touch();
    const checkExpiry = () => { if (Date.now() - lastActivity.current >= CHAT_LIMITS.idleMs) purge(); };
    document.addEventListener('visibilitychange', checkExpiry);
    window.addEventListener('pagehide', purge);
    return () => {
      if (timer.current) clearTimeout(timer.current);
      request.current?.abort();
      request.current = null;
      history.current = [];
      document.removeEventListener('visibilitychange', checkExpiry);
      window.removeEventListener('pagehide', purge);
    };
  }, [purge, touch]);

  const append = useCallback((message: ChatMessage) => {
    setMessages((prev) => boundedTranscript([...prev.map((item) => ({ ...item, isNew: false })), message]));
  }, []);

  const send = useCallback(async (question: string) => {
    const query = question.trim().slice(0, CHAT_LIMITS.queryChars);
    if (!query) return;
    if (Date.now() - lastActivity.current >= CHAT_LIMITS.idleMs) purge();
    if (request.current) return;
    const controller = new AbortController();
    request.current = controller;
    setIsSending(true);
    updateInput('');
    append({ sender: 'user', text: query });
    touch();
    try {
      const selected: ChatScope = context === 'project' ? { context, projectId } : { context };
      const result = await ask({ ...selected, query, history: boundedHistory(history.current) }, controller.signal);
      if (request.current !== controller || controller.signal.aborted) return;
      const response = result.response?.slice(0, 6000);
      if (!response) throw new Error('Empty chat response');
      history.current = boundedHistory([...history.current, { role: 'user', content: query }, { role: 'assistant', content: response }]);
      append({ sender: 'ai', text: response, isNew: true });
    } catch {
      if (request.current !== controller || controller.signal.aborted) return;
      append({ sender: 'ai', text: 'Ursa is having trouble connecting. Please try again.', isNew: true });
    } finally {
      if (request.current === controller) {
        request.current = null;
        setIsSending(false);
      }
    }
  }, [ask, context, projectId, append, purge, touch]);

  const setInput = useCallback((value: string) => {
    if (Date.now() - lastActivity.current >= CHAT_LIMITS.idleMs) purge();
    updateInput(value.slice(0, CHAT_LIMITS.queryChars));
    touch();
  }, [purge, touch]);

  return { messages, input, setInput, isSending, send, purge };
}
