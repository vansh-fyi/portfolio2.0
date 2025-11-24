export const config = {
    runtime: 'nodejs',
};

export default async function handler(req: Request) {
    const steps: string[] = [];

    try {
        steps.push('1. Handler started');

        // Try to import config
        try {
            steps.push('2. Importing config...');
            const { config: appConfig } = await import('../src/services/config');
            steps.push('3. Config imported');
            steps.push(`   - HF key exists: ${!!appConfig.huggingFaceApiKey}`);
            steps.push(`   - Supabase URL exists: ${!!appConfig.supabase.url}`);
        } catch (err) {
            steps.push(`2. Config import FAILED: ${err instanceof Error ? err.message : 'Unknown'}`);
        }

        // Try to import api
        try {
            steps.push('4. Importing appRouter...');
            const { appRouter } = await import('../src/api');
            steps.push('5. appRouter imported');
            steps.push(`   - Router procedures: ${Object.keys(appRouter._def.procedures || {}).join(', ')}`);
        } catch (err) {
            steps.push(`4. appRouter import FAILED: ${err instanceof Error ? err.message : 'Unknown'}`);
        }

        return new Response(
            JSON.stringify({ success: true, steps }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        steps.push(`FATAL: ${message}`);
        return new Response(
            JSON.stringify({ success: false, steps, error: message }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
