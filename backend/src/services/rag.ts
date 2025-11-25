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
    execute: async (params: z.infer<typeof toolParams>) => {
        console.log('🔧 Tool called with:', JSON.stringify(params));
        const { query, context, limit, projectId } = params || {};
        try {
            if (!query) {
                console.error('❌ Tool received no query!');
                return { error: 'No query provided to vector search tool' };
            }
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
 * Generate RAG response - simplified approach without tool calling
 * 1. Do vector search directly
 * 2. Pass results to LLM for response generation
 */
export async function generateRagResponse(query: string, context: 'personal' | 'project', projectId?: string): Promise<{ text: string; sources: Array<{ content: string; source: string; similarity: number }> }> {
    console.log('🔍 RAG Query:', { query, context, projectId });

    try {
        // Step 1: Vector search directly
        const embedding = await generateEmbedding(query);
        console.log('✅ Embedding generated');

        // Note: .filter() after .rpc() doesn't work in Supabase JS
        // So we fetch all results and filter in JavaScript
        const { data: allResults, error: searchError } = await supabase.rpc('match_documents', {
            query_embedding: embedding,
            match_threshold: 0.10, // Lowered to capture personal bio docs
            match_count: 50, // Get more results to filter
        });

        if (searchError) {
            console.error('❌ Vector search error:', searchError);
            throw new Error('Vector search failed');
        }

        // Filter results in JavaScript based on metadata
        const searchResults = allResults?.filter((doc: any) => {
            if (projectId) {
                return doc.metadata?.projectId === projectId;
            } else {
                return doc.metadata?.source_type === context;
            }
        }).slice(0, 5); // Limit to 5 after filtering

        console.log('✅ Vector search results:', searchResults?.length || 0);

        // Step 2: Build context from search results
        const contextText = searchResults && searchResults.length > 0
            ? searchResults.map((doc: any) => doc.content).join('\n\n---\n\n')
            : 'No relevant information found in the knowledge base.';

        // Step 3: Generate response with LLM (with timeout)
        const llmPromise = generateText({
            model: huggingface('meta-llama/Llama-3.1-8B-Instruct'),
            system: `You are Ursa, Vansh Grover's AI assistant. You help people learn about Vansh's background, skills, and projects.

**IMPORTANT INSTRUCTIONS:**
- Answer questions about Vansh in third person ("Vansh is...", "He has...", etc.)
- Use ONLY the context provided below to answer questions
- If the context contains relevant information, use it to give a clear, detailed answer
- If the context doesn't contain the information needed, say: "I don't have that specific information in my knowledge base"
- Be conversational and friendly, but factual
- Keep responses concise (2-3 sentences unless more detail is needed)

**Context from Vansh's portfolio:**
${contextText}

Now answer the user's question based on this context.`,
            prompt: query,
        });

        // 20s timeout for LLM generation (leaves buffer within 30s Vercel limit)
        const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('LLM generation timed out after 20s')), 20000)
        );

        const result = await Promise.race([llmPromise, timeoutPromise]);

        console.log('✅ LLM Response:', result.text?.substring(0, 100));

        const sources = searchResults?.map((doc: any) => ({
            content: doc.content?.substring(0, 200) || '',
            source: doc.metadata?.source_file || 'Unknown',
            similarity: doc.similarity || 0
        })) || [];

        return {
            text: result.text || 'I apologize, but I could not generate a response.',
            sources
        };
    } catch (error) {
        console.error('❌ RAG Error:', error);
        throw error;
    }
}
