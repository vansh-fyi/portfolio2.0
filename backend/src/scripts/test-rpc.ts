import { supabase } from '../services/supabase';
import { generateEmbedding } from '../services/embeddings';

async function testRpc() {
    console.log('🧪 Testing similarity scores by source_type...');

    const queryText = "Who is Vansh?";
    const embedding = await generateEmbedding(queryText);

    // Get ALL results above 0.1 threshold
    const { data: allResults, error } = await supabase.rpc('match_documents', {
        query_embedding: embedding,
        match_threshold: 0.1,
        match_count: 50,
    });

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log(`\nTotal results (threshold 0.1): ${allResults?.length || 0}`);

    // Group by source_type
    const personal = allResults?.filter((d: any) => d.metadata?.source_type === 'personal') || [];
    const project = allResults?.filter((d: any) => d.metadata?.source_type === 'project') || [];

    console.log(`\n📊 Personal docs: ${personal.length}`);
    if (personal.length > 0) {
        personal.slice(0, 3).forEach((d: any) => {
            console.log(`  - ${d.similarity.toFixed(3)}: ${d.content.substring(0, 50)}...`);
        });
    }

    console.log(`\n📊 Project docs: ${project.length}`);
    if (project.length > 0) {
        project.slice(0, 3).forEach((d: any) => {
            console.log(`  - ${d.similarity.toFixed(3)}: ${d.content.substring(0, 50)}...`);
        });
    }
}

testRpc();
