// Simple RAG chat endpoint for Vercel
// Bypasses tRPC to avoid TypeScript compilation issues

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        // Parse input from query string (GET) or body (POST)
        let input;
        if (req.method === 'GET' && req.query.input) {
            input = JSON.parse(req.query.input);
        } else if (req.method === 'POST') {
            input = req.body;
        } else {
            return res.status(400).json({ error: 'Missing input' });
        }

        const { query, context, projectId } = input;

        if (!query) {
            return res.status(400).json({ error: 'Query is required' });
        }

        // Get HuggingFace API key
        const hfApiKey = process.env.HUGGINGFACE_API_KEY;
        if (!hfApiKey) {
            return res.status(500).json({ error: 'HuggingFace API key not configured' });
        }

        // Step 1: Generate embedding using HuggingFace Inference SDK
        const { HfInference } = await import('@huggingface/inference');
        const hf = new HfInference(hfApiKey);

        console.log('Generating embedding for:', query.substring(0, 50));
        const embeddingResult = await hf.featureExtraction({
            model: 'sentence-transformers/all-MiniLM-L6-v2',
            inputs: query,
        });
        const embedding = Array.isArray(embeddingResult[0]) ? embeddingResult[0] : embeddingResult;
        console.log('Embedding generated, dimensions:', embedding.length);

        // Step 2: Vector search in Supabase
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_ANON_KEY
        );

        let supabaseQuery = supabase.rpc('match_documents', {
            query_embedding: embedding,
            match_threshold: 0.3,
            match_count: 5,
        });

        if (projectId) {
            supabaseQuery = supabaseQuery.filter('metadata->>projectId', 'eq', projectId);
        } else if (context) {
            supabaseQuery = supabaseQuery.filter('metadata->>source_type', 'eq', context);
        }

        const { data: searchResults, error: searchError } = await supabaseQuery;
        console.log('Vector search results:', searchResults?.length || 0);

        if (searchError) {
            console.error('Vector search error:', searchError);
        }

        // Step 3: Build context and generate response with LLM
        const contextText = searchResults && searchResults.length > 0
            ? searchResults.map(doc => doc.content).join('\n\n---\n\n')
            : 'No relevant information found in the knowledge base.';

        const { generateText } = await import('ai');
        const { huggingface } = await import('@ai-sdk/huggingface');

        const result = await generateText({
            model: huggingface('meta-llama/Llama-3.2-3B-Instruct'),
            system: `You are Ursa, Vansh's AI assistant. You are helpful, conversational, and knowledgeable about Vansh's professional work.

Use the following context to answer the user's question. If the context doesn't contain relevant information, say so politely.

**Context from knowledge base:**
${contextText}

**Guidelines:**
- Be concise and friendly
- Reference the context when answering
- If you don't have enough information, be honest about it`,
            prompt: query,
        });

        console.log('LLM Response generated');

        const sources = searchResults?.map(doc => ({
            content: doc.content?.substring(0, 200) || '',
            source: doc.metadata?.source_file || 'Unknown',
            similarity: doc.similarity || 0
        })) || [];

        // Return in tRPC-compatible format
        res.status(200).json({
            result: {
                data: {
                    success: true,
                    response: result.text || 'I apologize, but I could not generate a response.',
                    sources
                }
            }
        });

    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({
            error: {
                message: error.message || 'Internal server error',
                code: -32603
            }
        });
    }
}
