import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
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
        } catch (err) {
            steps.push(`4. appRouter import FAILED: ${err instanceof Error ? err.message : 'Unknown'}`);
        }

        res.status(200).json({ success: true, steps });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        steps.push(`FATAL: ${message}`);
        res.status(500).json({ success: false, steps, error: message });
    }
}
