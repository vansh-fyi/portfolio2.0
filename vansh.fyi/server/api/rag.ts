import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { generateRagResponse } from '../services/rag';
import { checkRateLimit, ragRules } from '../services/rate-limit';
import { t, type Context } from './trpc';
import { CHAT_LIMITS } from '../../lib/chat';
import { supabase } from '../services/supabase';


/**
 * tRPC RAG Router
 * Handles RAG query endpoints for conversational AI
 */

// Input validation schema for RAG query
const ragQuerySchema = z.object({
    query: z.string().trim().max(CHAT_LIMITS.queryChars, 'Query too long'),
    context: z.enum(['personal', 'project']).describe('Context type for search'),
    projectId: z.string().max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
    history: z.array(z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string().trim().min(1).max(CHAT_LIMITS.historyMessageChars),
    })).max(CHAT_LIMITS.historyMessages).default([]),
}).superRefine((input, ctx) => {
    if (input.context === 'project' && !input.projectId) {
        ctx.addIssue({ code: 'custom', path: ['projectId'], message: 'Project chat requires a project ID' });
    }
    if (input.context === 'personal' && input.projectId) {
        ctx.addIssue({ code: 'custom', path: ['projectId'], message: 'Personal chat cannot select a project scope' });
    }
    if (input.history.length % 2 || input.history.some((turn, index) => turn.role !== (index % 2 ? 'assistant' : 'user'))) {
        ctx.addIssue({ code: 'custom', path: ['history'], message: 'History must contain completed user/assistant exchanges' });
    }
    if (input.history.reduce((size, turn) => size + turn.content.length, 0) > CHAT_LIMITS.historyChars) {
        ctx.addIssue({ code: 'custom', path: ['history'], message: 'Conversation history is too long' });
    }
});

async function answer({ input, ctx }: { input: z.output<typeof ragQuerySchema>; ctx: Context }) {
    const { query, context, projectId, history } = input;

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
    const limit = await checkRateLimit(ragRules(ctx.ip ?? 'unknown'), { failClosed: true });
    if (!limit.allowed) {
        console.warn(`🚦 Rate limited: ${limit.blockedBy}`);
        throw new TRPCError({
            code: 'TOO_MANY_REQUESTS',
            message: 'Ursa is getting a lot of questions right now. Please try again in a little while.',
        });
    }

    // Check the canonical ID on the server; a client route is not proof of publication.
    if (context === 'project') {
        const { data, error } = await supabase.from('projects').select('id').eq('id', projectId!).eq('status', 'published').maybeSingle();
        if (error) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Unable to check this project. Please try again.' });
        if (!data) throw new TRPCError({ code: 'NOT_FOUND', message: 'This project is not available for chat.' });
    }

    try {
        const { text, sources } = await generateRagResponse(query, context, projectId, history, ctx.signal);

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
}

export const ragRouter = t.router({
    // Kept for existing links and deployment probes. History is accepted only via POST below.
    query: t.procedure.input(ragQuerySchema).query((options) => {
        if (options.input.history.length) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Use rag.send for conversations with history.' });
        return answer(options);
    }),
    send: t.procedure.input(ragQuerySchema).mutation(answer),
});


// Export type for frontend
export type RagRouter = typeof ragRouter;
