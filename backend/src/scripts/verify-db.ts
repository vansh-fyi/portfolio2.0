import { supabase } from '../services/supabase';

async function verifyDb() {
    console.log('Verifying database connection and schema...');
    try {
        // Check if we can query the documents table
        const { count, error } = await supabase
            .from('documents')
            .select('*', { count: 'exact', head: true });

        if (error) {
            console.error('❌ Error querying documents table:', error.message);
            console.error('   Hint: Has the migration "create-documents-table.sql" been run?');
            process.exit(1);
        }

        console.log('✅ "documents" table exists and is accessible.');
        console.log(`   Current row count: ${count}`);

        if (count === 0) {
            console.warn('⚠️ Table is empty. You need to run the ingestion script.');
        } else {
            console.log('✅ Table has data.');
        }

    } catch (err) {
        console.error('❌ Unexpected error:', err);
        process.exit(1);
    }
}

verifyDb();
