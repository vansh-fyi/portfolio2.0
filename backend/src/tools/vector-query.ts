import { createTool } from '@mastra/core';
import { z } from 'zod';
import { supabase } from '../services/supabase';
import { generateEmbedding } from '../services/embeddings';

export const vectorQueryTool = createTool({
    id: 'vector-query',
    description: 'Search for relevant information in the knowledge base about Vansh and his projects.',
    inputSchema: z.object({
        query: z.string().describe('The search query to find relevant information'),
        context: z.enum(['personal', 'project']).describe('The context of the search: "personal" for general bio/skills, "project" for specific project details'),
        limit: z.number().optional().default(5).describe('Number of results to return'),
    }),
    execute: async ({ context }) => {
        const { query, context: searchContext, limit } = context;
        try {
            const embedding = await generateEmbedding(query);

            const { data, error } = await supabase.rpc('match_documents', {
                query_embedding: embedding,
                match_threshold: 0.7, // Adjust as needed
                match_count: limit,
                filter: { type: searchContext } // Assuming metadata has a 'type' field
            });

            if (error) {
                console.error('Supabase vector search error:', error);
                return 'Error retrieving information from the database.';
            }

            if (!data || data.length === 0) {
                return 'No relevant information found.';
            }

            // Format results for the agent
            return data.map((doc: any) => `Content: ${doc.content}\nSource: ${doc.metadata?.source_file || 'Unknown'}`).join('\n\n');

        } catch (err) {
            console.error('Vector query tool error:', err);
            return 'An unexpected error occurred while searching.';
        }
    },
});
