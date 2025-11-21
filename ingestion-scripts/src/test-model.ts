import { pipeline } from '@huggingface/transformers';

async function testModel() {
    console.log('Testing model loading...');
    try {
        const pipe = await pipeline('feature-extraction', 'Xenova/bge-small-en-v1.5', {
            dtype: 'q8',
        });
        console.log('✅ Model loaded successfully');
        const output = await pipe('Hello world', { pooling: 'mean', normalize: true });
        console.log('✅ Embedding generated:', output.data.length);
    } catch (error) {
        console.error('❌ Model loading failed:', error);
    }
}

testModel();
