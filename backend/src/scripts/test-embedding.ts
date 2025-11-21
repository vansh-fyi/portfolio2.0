import { generateEmbedding } from '../services/embeddings';

async function testEmbedding() {
    console.log('Testing embedding generation...');

    try {
        const text = 'Who is Vansh?';
        console.log(`\nGenerating embedding for: "${text}"`);

        const embedding = await generateEmbedding(text);

        console.log(`✅ Embedding generated successfully`);
        console.log(`   Dimensions: ${embedding.length}`);
        console.log(`   First 5 values: ${embedding.slice(0, 5).join(', ')}`);

        if (embedding.length !== 384) {
            console.error(`❌ Dimension mismatch! Expected 384, got ${embedding.length}`);
            process.exit(1);
        }

        console.log('✅ All checks passed');

    } catch (error) {
        console.error('❌ Error generating embedding:', error);
        process.exit(1);
    }
}

testEmbedding();
