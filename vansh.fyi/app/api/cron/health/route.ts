import { formatAlert, runHealthChecks } from '@/server/services/health/checks';
import { sendAlertEmail } from '@/server/services/email';

// Daily Ursa health check (see vercel.json "crons"). Probes every provider and smoke-tests answers.
export const maxDuration = 60;
export const dynamic = 'force-dynamic';

/**
 * Vercel calls this with `Authorization: Bearer $CRON_SECRET`. Emails the owner when anything is not OK.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return Response.json({ error: 'CRON_SECRET is not configured' }, { status: 500 });
  }
  if (request.headers.get('authorization') !== `Bearer ${secret}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const report = await runHealthChecks();
    console.log('[health]', JSON.stringify(report));

    let emailed = false;
    if (report.status !== 'ok') {
      const { subject, text } = formatAlert(report);
      emailed = (await sendAlertEmail(subject, text)).success;
    }

    // 503 on critical so the failure also shows up in Vercel's cron/function logs
    return Response.json({ ...report, emailed }, { status: report.status === 'critical' ? 503 : 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[health] check crashed:', message);

    // A crashing health check is itself an incident
    try {
      await sendAlertEmail('[Ursa] CRITICAL — health check crashed', `The daily health check threw before finishing:\n\n${message}`);
    } catch {
      /* nothing more we can do */
    }
    return Response.json({ error: 'Health check crashed', details: message }, { status: 500 });
  }
}
