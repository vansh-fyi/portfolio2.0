/**
 * Runs the same checks as the daily cron.
 *   npx ts-node src/scripts/run-health.ts            # print the report
 *   npx ts-node src/scripts/run-health.ts --email    # also email the alert if anything is not OK
 *   npx ts-node src/scripts/run-health.ts --force-email  # email the report even when everything is OK (test the mail path)
 */
import { runHealthChecks, formatAlert } from '../services/health/checks';

async function main() {
    const report = await runHealthChecks();
    const icon = { ok: '✅', degraded: '⚠️ ', critical: '🚨' } as const;

    console.log(`\nOverall: ${icon[report.status]} ${report.status.toUpperCase()}  (${report.checkedAt})\n`);
    for (const c of report.checks) console.log(`${icon[c.status]} ${c.name.padEnd(11)} ${c.detail}`);

    const wantEmail = process.argv.includes('--email') && report.status !== 'ok';
    if (wantEmail || process.argv.includes('--force-email')) {
        const { sendAlertEmail } = await import('../services/email');
        const { subject, text } = formatAlert(report);
        const result = await sendAlertEmail(process.argv.includes('--force-email') ? `[TEST] ${subject}` : subject, text);
        console.log(`\n📧 Alert email ${result.success ? 'sent' : `FAILED: ${result.error}`}`);
    }
    process.exit(report.status === 'critical' ? 1 : 0);
}

main();
