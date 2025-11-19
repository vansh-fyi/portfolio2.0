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
 * Placeholder AppRouter interface matching the backend API specification
 * This provides type safety for the tRPC client until the real backend is ready
 *
 * Note: This is a simplified type definition for tRPC router structure.
 * The actual tRPC AppRouter from the backend will have more complex types
 * with procedure definitions, middleware, etc.
 */
export type AppRouter = {
  rag: {
    query: {
      _def: {
        _config: unknown;
        _meta: unknown;
        _ctx_out: unknown;
        _input_in: RagQueryInput;
        _input_out: RagQueryInput;
        _output_in: RagQueryOutput;
        _output_out: RagQueryOutput;
      };
    };
  };
  email: {
    sendLead: {
      _def: {
        _config: unknown;
        _meta: unknown;
        _ctx_out: unknown;
        _input_in: SendLeadInput;
        _input_out: SendLeadInput;
        _output_in: SendLeadOutput;
        _output_out: SendLeadOutput;
      };
    };
  };
};
