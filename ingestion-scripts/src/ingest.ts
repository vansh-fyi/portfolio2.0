import path from 'path';
import { fileURLToPath } from 'url';
import { supabase } from './supabase.js';
import { generateEmbedding, chunkText } from './embeddings.js';
import { loadMarkdownContent } from './content-loader.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function ingestData() {
    console.log('🚀 Starting data ingestion...\n');

    // Clear existing embeddings to prevent duplicates
    console.log('🧹 Clearing existing embeddings...');
    const { error: deleteError } = await supabase.from('embeddings').delete().neq('id', 0); // Delete all rows
    if (deleteError) {
        console.error('❌ Error clearing table:', deleteError.message);
        return;
    }
    console.log('✅ Table cleared\n');

    // Load content from _content directory (one level up from ingestion-scripts)
    const contentDir = path.resolve(__dirname, '../../_content');
    console.log(`📁 Loading content from: ${contentDir}`);

    const documents = await loadMarkdownContent(contentDir);
    console.log(`✅ Loaded ${documents.length} documents\n`);

    let totalChunks = 0;
    let successfulChunks = 0;

    for (const doc of documents) {
        console.log(`\n📄 Processing: ${doc.metadata.source_file}`);

        const chunks = chunkText(doc.content);
        console.log(`   Split into ${chunks.length} chunks`);
        totalChunks += chunks.length;

        for (const [index, chunk] of chunks.entries()) {
            try {
                console.log(`   Chunk ${index + 1}/${chunks.length}...`);

                // Generate embedding using local model
                const embedding = await generateEmbedding(chunk);

                // Upsert into Supabase
                const { error } = await supabase.from('embeddings').upsert({
                    content: chunk,
                    embedding,
                    metadata: {
                        ...doc.metadata,
                        chunk_index: index,
                        total_chunks: chunks.length
                    }
                });

                if (error) {
                    console.error(`   ❌ Error upserting chunk ${index}:`, error.message);
                } else {
                    successfulChunks++;
                    console.log(`   ✅ Chunk ${index + 1} ingested`);
                }
            } catch (err) {
                console.error(`   ❌ Error processing chunk ${index}:`, err);
            }
        }
    }

    console.log(`\n\n🎉 Ingestion complete!`);
    console.log(`   Total chunks processed: ${totalChunks}`);
    console.log(`   Successful: ${successfulChunks}`);
    console.log(`   Failed: ${totalChunks - successfulChunks}`);
}

ingestData().catch(console.error);
