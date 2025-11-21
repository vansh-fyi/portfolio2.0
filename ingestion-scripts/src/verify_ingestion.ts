import { supabase } from './supabase.js';

async function verify() {
    console.log('Verifying ingestion...');
    const { data, error } = await supabase
        .from('embeddings')
        .select('metadata')
        .limit(5);

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log('Sample Metadata:', JSON.stringify(data, null, 2));
}

verify();
