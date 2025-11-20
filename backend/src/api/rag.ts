import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { ursaAgent } from '../agents/ursa-agent';


/**
 * tRPC RAG Router
 * Handles RAG query endpoints for conversational AI
 */

// Initialize tRPC
const t = initTRPC.create();

// Input validation schema for RAG query
const ragQuerySchema = z.object({
    query: z.string().min(1, 'Query is required').max(500, 'Query too long'),
    context: z.enum(['personal', 'project']).describe('Context type for search'),
});

/**
 * RAG router with procedures
 */
export const ragRouter = t.router({
    /**
     * Query the RAG agent
     * @param input - Query text and context type
     * @returns AI response with optional sources
     */
    query: t.procedure
        .input(ragQuerySchema)
        .mutation(async ({ input }) => {
            try {
                const { query, context } = input;

                // Build context-aware prompt for the agent
                const prompt = `Context: ${context}\nUser query: ${query}\n\nPlease use the vector-query tool with context="${context}" to find relevant information and answer the user's question.`;

                // Agent.generate() automatically uses vectorQueryTool when needed
                const response = await ursaAgent.generate(prompt);

                return {
                    success: true,
                    response: response.text || 'No response generated',
                    // Sources can be extracted from tool calls if needed
                    sources: []  // TODO: Extract from agent tool calls
                };

            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                throw new Error(`RAG query failed: ${errorMessage}`);
            }
        }),
});

// Export type for frontend
export type RagRouter = typeof ragRouter;
