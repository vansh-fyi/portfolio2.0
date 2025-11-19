/**
 * Mock RAG API for development and testing
 *
 * This mock implementation simulates the RAG backend API responses
 * for frontend development before the actual backend (Epic 4) is ready.
 *
 * Usage:
 * - Set VITE_USE_MOCK_API=true in .env to use mock responses
 * - Useful for testing and parallel frontend development
 *
 * @see docs/sprint-artifacts/stories/2-1-rag-backend-integration-chat-functionality.md#Mock-Strategy
 */

import type { RagQueryInput, RagQueryOutput } from '../types/trpc';

const MOCK_DELAY_MS = 1500; // Simulate network delay

/**
 * Mock personal context responses about Vansh
 */
const personalResponses: Record<string, string> = {
  default: "I'm Ursa, Vansh's AI assistant! I can tell you all about his skills, experience, and projects. What would you like to know?",
  skills: "Vansh is a full-stack developer with expertise in React, TypeScript, Node.js, and AI integration. He's particularly skilled in building modern web applications with great user experiences.",
  experience: "Vansh has worked on various projects ranging from portfolio websites to complex AI-powered applications. He's passionate about creating innovative solutions that solve real problems.",
  contact: "You can reach Vansh through the contact form on this site, or connect with him on LinkedIn and GitHub. He's always open to interesting opportunities and collaborations!",
};

/**
 * Mock project context responses
 */
const projectResponses: Record<string, Record<string, string>> = {
  'portfolio-website': {
    default: "This is Vansh's portfolio website - a React-based SPA with AI-powered chat capabilities. I can tell you about the technical implementation!",
    tech: "This portfolio is built with React, TypeScript, Vite, and integrates tRPC for type-safe API communication. The AI chat uses RAG (Retrieval-Augmented Generation) with Mastra.AI.",
    features: "Key features include dual-context chat (personal and project-specific), real-time AI responses, and a beautiful modern UI with smooth animations.",
  },
};

/**
 * Mock RAG query implementation
 *
 * Analyzes the query and context to return appropriate mock responses
 */
export const mockRAGQuery = async (
  input: RagQueryInput
): Promise<RagQueryOutput> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, MOCK_DELAY_MS));

  const { query, context, projectId } = input;
  const queryLower = query.toLowerCase();

  let response: string;
  let sources: { content: string; url?: string }[] = [];

  if (context === 'personal') {
    // Match query keywords to mock responses
    if (queryLower.includes('skill') || queryLower.includes('technolog')) {
      response = personalResponses.skills;
      sources = [
        { content: 'From: Skills & Expertise section', url: '#skills' },
      ];
    } else if (
      queryLower.includes('experience') ||
      queryLower.includes('work')
    ) {
      response = personalResponses.experience;
      sources = [{ content: 'From: About & Experience section', url: '#about' }];
    } else if (
      queryLower.includes('contact') ||
      queryLower.includes('reach')
    ) {
      response = personalResponses.contact;
      sources = [{ content: 'From: Contact section', url: '#contact' }];
    } else {
      response = personalResponses.default;
    }
  } else {
    // Project context
    const projectKey = projectId || 'portfolio-website';
    const projectMocks = projectResponses[projectKey] || projectResponses['portfolio-website'];

    if (queryLower.includes('tech') || queryLower.includes('stack')) {
      response = projectMocks.tech || projectMocks.default;
      sources = [
        { content: `From: ${projectKey} technical documentation` },
      ];
    } else if (
      queryLower.includes('feature') ||
      queryLower.includes('what')
    ) {
      response = projectMocks.features || projectMocks.default;
      sources = [{ content: `From: ${projectKey} feature list` }];
    } else {
      response = projectMocks.default;
    }
  }

  return {
    response,
    sources,
  };
};

/**
 * Check if mock API should be used
 */
export const shouldUseMockAPI = (): boolean => {
  return import.meta.env.VITE_USE_MOCK_API === 'true';
};
