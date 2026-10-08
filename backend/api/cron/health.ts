import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Daily Ursa health check (see vercel.json "crons").
 * Vercel calls this with `Authorization: Bearer $CRON_SECRET`. Emails the owner when anything is not OK.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
    const secret = process.env.CRON_SECRET;
    if (!secret) {
        res.status(500).json({ error: 'CRON_SECRET is not configured' });
        return;
    }
    if (req.headers.authorization !== `Bearer ${secret}`) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    try {
        const { runHealthChecks, formatAlert } = await import('../../src/services/health/checks');
        const report = await runHealthChecks();
        console.log('[health]', JSON.stringify(report));

        let emailed = false;
        if (report.status !== 'ok') {
            const { sendAlertEmail } = await import('../../src/services/email');
            const { subject, text } = formatAlert(report);
            emailed = (await sendAlertEmail(subject, text)).success;
        }

        // 503 on critical so the failure also shows up in Vercel's cron/function logs
        res.status(report.status === 'critical' ? 503 : 200).json({ ...report, emailed });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        console.error('[health] check crashed:', message);

        // A crashing health check is itself an incident
        try {
            const { sendAlertEmail } = await import('../../src/services/email');
            await sendAlertEmail('[Ursa] CRITICAL — health check crashed', `The daily health check threw before finishing:\n\n${message}`);
        } catch {
            /* nothing more we can do */
        }
        res.status(500).json({ error: 'Health check crashed', details: message });
    }
}
