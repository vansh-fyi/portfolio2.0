import { ragRouter } from '../api/rag';

async function testRagApi() {
    console.log('🧪 Testing RAG API...');

    const caller = ragRouter.createCaller({});

    try {
        const query = 'Tell me about Vansh\'s background and experience';
        console.log(`\n📝 Sending query: "${query}" (context: personal)`);

        const result = await caller.query({
            query: query,
            context: 'personal'
        });

        console.log('\n✅ Response received:');
        console.log('---------------------------------------------------');
        console.log(result.response);
        console.log('---------------------------------------------------');

        if (result.success && result.response && result.response !== 'No response generated') {
            console.log('✅ Test PASSED: Valid response received.');
        } else {
            console.error('❌ Test FAILED: Invalid or empty response.');
            process.exit(1);
        }

    } catch (error) {
        console.error('❌ Error calling RAG API:', error);
        process.exit(1);
    }
}

testRagApi();
