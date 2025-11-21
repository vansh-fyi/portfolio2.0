import { supabase } from './supabase.js';
import { generateEmbedding } from './embeddings.js';

async function verifyRetrieval() {
    console.log('🔍 Verifying retrieval...');

    const query = "What is Vansh's experience with AI?";
    console.log(`Query: "${query}"`);

    try {
        const embedding = await generateEmbedding(query);

        const { data, error } = await supabase.rpc('match_documents', {
            query_embedding: embedding,
            match_threshold: 0.01, // Extremely low threshold for debugging
            match_count: 5
        });

        if (error) {
            console.error('❌ Supabase error:', error);
            return;
        }

        if (!data || data.length === 0) {
            console.warn('⚠️ No results found even with threshold 0.01.');

            // Debug: Fetch a raw row to check if embeddings are not null
            const { data: rawData } = await supabase.from('embeddings').select('content, embedding').limit(1);
            if (rawData && rawData.length > 0) {
                console.log('🔍 Raw row check:');
                console.log('   Content:', rawData[0].content.substring(0, 50));
                console.log('   Embedding length:', rawData[0].embedding?.length);
            }
        } else {
            console.log(`✅ Found ${data.length} results:`);
            data.forEach((doc: any, i: number) => {
                console.log(`\n[${i + 1}] Similarity: ${doc.similarity.toFixed(4)}`);
                console.log(`    Source: ${doc.metadata.source_file}`);
                console.log(`    Content: ${doc.content.substring(0, 100)}...`);
            });
        }

        // Check total count
        const { count, error: countError } = await supabase
            .from('embeddings')
            .select('*', { count: 'exact', head: true });

        if (countError) {
            console.error('❌ Error counting rows:', countError);
        } else {
            console.log(`\n📊 Total embeddings in DB: ${count}`);
        }

    } catch (err) {
        console.error('❌ Verification failed:', err);
    }
}

verifyRetrieval();
