import { supabase } from './services/supabase';

async function verifyProjectIds() {
    console.log('Checking projectIds in database...\n');

    const { data, error } = await supabase
        .from('documents')
        .select('metadata')
        .limit(200);

    if (error) {
        console.error('Error:', error);
        return;
    }

    const projectIds = new Set<string>();
    const sourceTypes = new Set<string>();

    data.forEach((row: any) => {
        if (row.metadata?.projectId) {
            projectIds.add(row.metadata.projectId);
        }
        if (row.metadata?.source_type) {
            sourceTypes.add(row.metadata.source_type);
        }
    });

    console.log('Found projectIds:');
    Array.from(projectIds).sort().forEach((id: string) => console.log('  -', id));

    console.log('\nSource types:');
    Array.from(sourceTypes).sort().forEach((type: string) => console.log('  -', type));

    // Check for specific projects the user mentioned
    console.log('\n\nChecking specific projects mentioned by user:');
    const specificProjects = ['vibio', 'sparto', 'ursa-ai', 'portfolio-website'];

    for (const projectId of specificProjects) {
        const { data: projectData, count, error: projectError } = await supabase
            .from('documents')
            .select('id, metadata', { count: 'exact' })
            .eq('metadata->>projectId', projectId)
            .limit(1);

        if (projectData && projectData.length > 0) {
            console.log(`  ✅ ${projectId} - Found (${count} chunks total)`);
        } else {
            console.log(`  ❌ ${projectId} - NOT FOUND`);
        }
    }

    // Count documents per project
    console.log('\n\nDocuments per project:');
    for (const projectId of Array.from(projectIds).sort()) {
        const { count, error: countError } = await supabase
            .from('documents')
            .select('*', { count: 'exact', head: true })
            .eq('metadata->>projectId', projectId);

        if (!countError && count !== null) {
            console.log(`  ${projectId}: ${count} chunks`);
        }
    }
}

verifyProjectIds().catch(console.error);
