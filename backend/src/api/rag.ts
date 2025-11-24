import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { generateRagResponse } from '../services/rag';


/**
 * tRPC RAG Router
 * Handles RAG query endpoints for conversational AI
 */

// Initialize tRPC
const t = initTRPC.create();

// Input validation schema for RAG query
const ragQuerySchema = z.object({
    query: z.string().max(500, 'Query too long'), // Allow empty string for initial load
    context: z.enum(['personal', 'project']).describe('Context type for search'),
    projectId: z.string().optional().describe('Optional project ID for project-specific filtering'),
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
        .query(async ({ input }) => {
            try {
                const { query, context, projectId } = input;

                // Return empty response for empty queries (initial chat load / polling)
                // Frontend should handle displaying a greeting if needed
                if (!query || query.trim() === '') {
                    return {
                        success: true,
                        response: null,
                        sources: []
                    };
                }

                // Generate response using Vercel AI SDK
                const { text, sources } = await generateRagResponse(query, context, projectId);

                return {
                    success: true,
                    response: text || 'No response generated',
                    sources: sources || []
                };

            } catch (error) {
                console.error('❌ Error in RAG query:', error);
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                throw new Error(`RAG query failed: ${errorMessage}`);
            }
        }),
});

// Export type for frontend
export type RagRouter = typeof ragRouter;
