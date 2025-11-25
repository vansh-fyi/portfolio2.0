import { supabase } from '../services/supabase';
import { generateEmbedding } from '../services/embeddings';

async function debugVectorDist() {
    console.log('📏 Debugging Vector Distance (Exact Match Attempt)...');

    // Try to match the first chunk's content roughly
    const queryText = "type: personal category: bio";
    const embedding = await generateEmbedding(queryText);

    const { data, error } = await supabase.rpc('debug_vector_distance', {
        query_embedding: embedding
    });

    if (error) {
        console.error('❌ RPC Error:', error);
    } else {
        console.log('✅ Distance Results:', data);
    }
}

debugVectorDist();