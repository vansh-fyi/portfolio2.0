import { supabase } from '../services/supabase';

async function debugDb() {
    console.log('🐞 Debugging Database Metadata...');

    // 1. Fetch 5 rows without filtering
    const { data: allDocs, error: err1 } = await supabase
        .from('documents')
        .select('id, metadata, content')
        .limit(5);

    if (err1) {
        console.error('❌ Error fetching docs:', err1);
        return;
    }

    console.log('\n--- Sample Data (No Filter) ---');
    allDocs?.forEach(d => {
        console.log(`ID: ${d.id}`);
        console.log('Metadata:', JSON.stringify(d.metadata));
        console.log('Content Preview:', d.content.substring(0, 50));
        console.log('---');
    });

    // 2. Test the specific filter we use in rag.ts
    const { data: filteredDocs, error: err2 } = await supabase
        .from('documents')
        .select('id, metadata')
        .filter('metadata->>source_type', 'eq', 'personal')
        .limit(5);

    if (err2) {
        console.error('❌ Error testing filter:', err2);
    } else {
        console.log(`\n✅ Filter Test (source_type = 'personal'): Found ${filteredDocs?.length} rows`);
    }
}

debugDb();
