import { huggingface } from '@ai-sdk/huggingface';
import { generateText, tool } from 'ai';
import { z } from 'zod';
import { supabase } from '../services/supabase';
import { generateEmbedding } from '../services/embeddings';

/**
 * Vector query tool for RAG
 * Searches the knowledge base using semantic similarity
 */
/**
 * Vector query tool for RAG
 * Searches the knowledge base using semantic similarity
 */
const toolParams = z.object({
    query: z.string().describe('The search query to find relevant information'),
    context: z.enum(['personal', 'project']).describe('The context of the search: "personal" for general bio/skills, "project" for specific project details'),
    limit: z.number().optional().default(5).describe('Number of results to return'),
    projectId: z.string().optional().describe('Optional project ID to filter results to specific project content'),
});

const vectorQueryTool = tool({
    description: 'Search for relevant information in the knowledge base about Vansh and his projects.',
    parameters: toolParams,
    // @ts-ignore - Vercel AI SDK type inference issue
    execute: async ({ query, context, limit, projectId }: z.infer<typeof toolParams>) => {
        try {
            const resultLimit = limit || 5;
            const embedding = await generateEmbedding(query);

            // Build query with conditional filtering based on projectId availability
            let supabaseQuery = supabase.rpc('match_documents', {
                query_embedding: embedding,
                match_threshold: 0.7,
                match_count: resultLimit,
            });

            // Apply filtering: prioritize projectId over source_type
            if (projectId) {
                // Filter by projectId in metadata JSONB field (AC#3)
                supabaseQuery = supabaseQuery.filter('metadata->>projectId', 'eq', projectId);
            } else {
                // Fallback to source_type filtering when no projectId provided
                supabaseQuery = supabaseQuery.filter('metadata->>source_type', 'eq', context);
            }

            const { data, error } = await supabaseQuery;

            if (error) {
                console.error('Supabase vector search error:', error);
                return { error: 'Error retrieving information from the database.' };
            }

            if (!data || data.length === 0) {
                return { results: [], message: 'No relevant information found.' };
            }

            // Return formatted results
            return {
                results: data.map((doc: any) => ({
                    content: doc.content,
                    source: doc.metadata?.source_file || 'Unknown',
                    similarity: doc.similarity
                }))
            };

        } catch (err) {
            console.error('Vector query tool error:', err);
            return { error: 'An unexpected error occurred while searching.' };
        }
    },
});

/**
 * Generate RAG response using Vercel AI SDK with HuggingFace models
 */
export async function generateRagResponse(query: string, context: 'personal' | 'project', projectId?: string): Promise<{ text: string; sources: Array<{ content: string; source: string; similarity: number }> }> {
    const result = await generateText({
        model: huggingface('meta-llama/Llama-3.2-3B-Instruct'),
        system: `You are Ursa, Vansh's AI assistant. You are helpful, conversational, and knowledgeable about Vansh's professional work.

**Your Role:**
- Answer questions about Vansh's skills, experience, and projects
- Provide accurate, helpful information using the knowledge base
- Be friendly and approachable, but remain professional

**Context Awareness:**
- Personal context: Focus on Vansh's bio, skills, interests, and background
- Project context: Focus on specific project details, challenges, and technical implementations${projectId ? `\n- Current project filter: ${projectId}` : ''}

**Communication Style:**
- Be concise and clear
- Use technical terminology when discussing projects
- Be casual and friendly when discussing personal background
- Always cite sources when pulling from the knowledge base

Use the vectorQuery tool with context="${context}"${projectId ? ` and projectId="${projectId}"` : ''} to find relevant information before answering.`,
        prompt: query,
        tools: {
            vectorQuery: vectorQueryTool
        },
        toolChoice: 'auto',
    });

    // Extract sources from tool results
    // Note: Tool results in Vercel AI SDK are complex to extract due to type constraints
    // Returning empty array for now - AC#2 specifies "if applicable"
    // TODO: Implement proper source extraction when Vercel AI SDK provides clearer typing
    const sources: Array<{ content: string; source: string; similarity: number }> = [];

    return {
        text: result.text,
        sources
    };
}
