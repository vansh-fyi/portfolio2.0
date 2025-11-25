import { supabase } from '../services/supabase';
import { generateEmbedding } from '../services/embeddings';

// Cosine similarity function
function cosineSimilarity(vecA: number[], vecB: number[]) {
    const dotProduct = vecA.reduce((acc, val, i) => acc + val * vecB[i], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((acc, val) => acc + val * val, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((acc, val) => acc + val * val, 0));
    return dotProduct / (magnitudeA * magnitudeB);
}

async function debugVector() {
    console.log('📐 Debugging Vector Similarity...');

    // 1. Generate query embedding
    const queryText = "Who is Vansh?";
    console.log(`Query: "${queryText}"`);
    const queryEmbedding = await generateEmbedding(queryText);
    console.log('Query Embedding Length:', queryEmbedding.length);
    console.log('Query Embedding Sample:', queryEmbedding.slice(0, 5));

    // 2. Fetch one relevant document embedding from DB
    const { data: docs, error } = await supabase
        .from('documents')
        .select('content, embedding')
        .filter('metadata->>source_type', 'eq', 'personal')
        .limit(1);

    if (error || !docs || docs.length === 0) {
        console.error('❌ Could not fetch document:', error);
        return;
    }

    const doc = docs[0];
    const docEmbedding = JSON.parse(doc.embedding as unknown as string); // pgvector returns string in JS sometimes

    console.log('\nDoc Content:', doc.content.substring(0, 50) + '...');
    console.log('Doc Embedding Length:', docEmbedding.length);
    console.log('Doc Embedding Sample:', docEmbedding.slice(0, 5));

    // 3. Calculate Similarity
    const similarity = cosineSimilarity(queryEmbedding, docEmbedding);
    console.log(`\n🧮 Manual Cosine Similarity: ${similarity.toFixed(4)}`);

    // 4. Check DB Similarity via RPC
    // We'll call match_documents with a threshold of -1.0 to force a return
    const { data: rpcResult, error: rpcError } = await supabase.rpc('match_documents', {
        query_embedding: queryEmbedding,
        match_threshold: -1.0, // Force return
        match_count: 1
    });

    if (rpcResult && rpcResult.length > 0) {
        console.log(`🔮 RPC Returned Similarity: ${rpcResult[0].similarity.toFixed(4)}`);
    } else {
        console.log('🔮 RPC returned no results even with -1.0 threshold (This is very strange)');
        if (rpcError) console.error('RPC Error:', rpcError);
    }
}

debugVector();
