/**
 * End-to-end quality check: runs evals/golden.json through the real pipeline
 * (search → prompt → LLM chain) and checks each answer for expected facts.
 *
 *   npx ts-node src/scripts/eval-ursa.ts
 *
 * Checks per question (all optional):
 *   any[]           at least one phrase must appear (case-insensitive)
 *   all[]           every phrase must appear
 *   forbid[]        none of these may appear (prompt-leak guard)
 *   expectUnknown   answer must admit it lacks the information instead of inventing one
 *   pending         known content gap; answer is shown but not scored (see services/health/evaluate.ts)
 */
import fs from 'fs';
import path from 'path';
import { evaluateAnswer, GoldenCase } from '../server/services/health/evaluate';

async function main() {
    const { generateRagResponse } = await import('../server/services/rag');
    const cases: GoldenCase[] = JSON.parse(fs.readFileSync(path.resolve(import.meta.dirname, '../evals/golden.json'), 'utf-8'));

    let passed = 0;
    let scored = 0;
    for (const c of cases) {
        const started = Date.now();
        let verdict = '';
        let answer = '';
        try {
            ({ text: answer } = await generateRagResponse(c.q, 'personal'));
            const problems = evaluateAnswer(c, answer);

            if (c.pending) {
                verdict = `PENDING (${c.pending})`;
            } else {
                scored++;
                verdict = problems.length ? `FAIL (${problems.join('; ')})` : 'PASS';
                if (!problems.length) passed++;
            }
        } catch (error) {
            verdict = `ERROR (${error instanceof Error ? error.message.slice(0, 120) : error})`;
            if (!c.pending) scored++;
        }
        console.log(`\n${verdict.startsWith('PASS') ? '✅' : verdict.startsWith('PENDING') ? '⏳' : '❌'} ${c.q}  [${Date.now() - started}ms] ${verdict}`);
        if (answer) console.log(`   ${answer.replace(/\s+/g, ' ').slice(0, 260)}`);
    }

    console.log(`\n${passed}/${scored} passed (${cases.length - scored} pending)`);
    process.exit(passed === scored ? 0 : 1);
}

main();
