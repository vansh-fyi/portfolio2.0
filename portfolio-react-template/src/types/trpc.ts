/**
 * Placeholder AppRouter type definition for tRPC client
 *
 * This interface defines the expected backend API contract.
 * It will be replaced with the actual AppRouter type from the backend
 * once Epic 4 (Backend & Data Infrastructure) is implemented.
 *
 * @see docs/architecture.md - API Contracts section
 */

export interface RagQueryInput {
  query: string;
  context: 'personal' | 'project';
  projectId?: string;
}

export interface RagQueryOutput {
  response: string;
  sources?: { content: string; url?: string }[];
}

export interface SendLeadInput {
  name: string;
  email: string;
  message: string;
}

export interface SendLeadOutput {
  success: boolean;
  message?: string;
}

/**
 * Placeholder AppRouter type compatible with tRPC React hooks
 *
 * This uses a type assertion approach since the actual tRPC router
 * won't be available until the backend (Epic 4) is implemented.
 *
 * When the backend is ready, replace this with:
 * import type { AppRouter } from '../../../backend/src/api/index';
 */

// Using a simplified structure that works with createTRPCReact
export type AppRouter = {
  email: {
    sendLead: {
      _def: {
        _input_out: SendLeadInput;
        _output_out: SendLeadOutput;
      };
    };
  };
  rag: {
    query: {
      _def: {
        _input_out: RagQueryInput;
        _output_out: RagQueryOutput;
      };
    };
  };
};
