import path from 'path';
import { supabase } from '../services/supabase';
import { generateEmbedding, chunkText } from '../services/embeddings';
import { MarkdownSource } from '../services/ingestion/markdown-source';
import { IngestionSource } from '../services/ingestion/types';

async function ingestData() {
    console.log('Starting data ingestion...');

    // Initialize sources
    // Assuming _content is at the root of the repo
    // backend/src/scripts -> backend/src -> backend -> root -> _content
    const contentDir = path.resolve(__dirname, '../../../_content');
    const sources: IngestionSource[] = [
        new MarkdownSource(contentDir)
    ];

    for (const source of sources) {
        console.log(`Processing source: ${source.name}`);
        const documents = await source.fetchDocuments();
        console.log(`Found ${documents.length} documents from ${source.name}`);

        for (const doc of documents) {
            console.log(`Processing document: ${doc.metadata.source_file}`);

            const chunks = chunkText(doc.content);
            console.log(`- Split into ${chunks.length} chunks`);

            for (const [index, chunk] of chunks.entries()) {
                try {
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
                        console.error(`Error upserting chunk ${index} of ${doc.metadata.source_file}:`, error);
                    }
                } catch (err) {
                    console.error(`Error generating embedding for chunk ${index} of ${doc.metadata.source_file}:`, err);
                }
            }
        }
    }

    console.log('Ingestion complete!');
}

ingestData().catch(console.error);
