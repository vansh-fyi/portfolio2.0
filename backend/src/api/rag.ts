import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { generateRagResponse } from '../services/rag';
import { checkRateLimit, ragRules } from '../services/rate-limit';
import { t } from './trpc';


/**
 * tRPC RAG Router
 * Handles RAG query endpoints for conversational AI
 */

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
        .query(async ({ input, ctx }) => {
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

            // Protect the free-tier LLM quota (per-IP and global daily caps)
            const limit = await checkRateLimit(ragRules(ctx.ip ?? 'unknown'));
            if (!limit.allowed) {
                console.warn(`🚦 Rate limited: ${limit.blockedBy}`);
                throw new TRPCError({
                    code: 'TOO_MANY_REQUESTS',
                    message: 'Ursa is getting a lot of questions right now. Please try again in a little while.',
                });
            }

            try {
                const { text, sources } = await generateRagResponse(query, context, projectId);

                return {
                    success: true,
                    response: text || 'No response generated',
                    sources: sources || []
                };
            } catch (error) {
                // Details (provider names, HTTP errors) stay in the logs, not in the visitor's browser
                console.error('❌ Error in RAG query:', error);
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Ursa is unavailable at the moment. Please try again shortly.',
                });
            }
        }),
});

// Export type for frontend
export type RagRouter = typeof ragRouter;
