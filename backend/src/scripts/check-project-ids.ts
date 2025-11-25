import { supabase } from '../services/supabase';

async function checkProjectIds() {
    console.log('🔍 Checking project IDs in database...\n');

    // Get all unique projectId values
    const { data: docs, error } = await supabase
        .from('documents')
        .select('metadata')
        .filter('metadata->>source_type', 'eq', 'project')
        .limit(50);

    if (error) {
        console.error('Error:', error);
        return;
    }

    const projectIds = new Set<string>();
    docs?.forEach((doc: any) => {
        if (doc.metadata?.projectId) {
            projectIds.add(doc.metadata.projectId);
        }
    });

    console.log(`Found ${projectIds.size} unique project IDs:`);
    projectIds.forEach(id => console.log(`  - ${id}`));

    // Show sample for each
    console.log('\nSample documents per project:');
    for (const pid of projectIds) {
        const { data: sample } = await supabase
            .from('documents')
            .select('content, metadata')
            .filter('metadata->>projectId', 'eq', pid)
            .limit(1);

        if (sample && sample.length > 0) {
            const doc = sample[0];
            console.log(`\n[${pid}]`);
            console.log(`  Content: ${doc.content.substring(0, 60)}...`);
            console.log(`  File: ${doc.metadata.source_file}`);
        }
    }
}

checkProjectIds();
