/**
 * Shared answer checking for evals/golden.json — used by the manual eval script and the daily health cron.
 */

export interface GoldenCase {
    q: string;
    /** At least one phrase must appear (case-insensitive) */
    any?: string[];
    /** Every phrase must appear */
    all?: string[];
    /** None of these may appear (prompt-leak guard) */
    forbid?: string[];
    /** Answer must admit it lacks the information instead of inventing it */
    expectUnknown?: boolean;
    /** Known content gap: shown but not scored. Remove once the facts are in _content. */
    pending?: string;
    /** Cheap subset the daily cron runs */
    smoke?: boolean;
}

const UNKNOWN_HINTS = [
    "don't have",
    'do not have',
    "doesn't mention",
    'not mentioned',
    'no information',
    "isn't mentioned",
    'reach out',
    'not available',
];

/** Returns a list of problems; empty means the answer passes. */
export function evaluateAnswer(c: GoldenCase, answer: string): string[] {
    const lower = answer.toLowerCase();
    const problems: string[] = [];

    if (c.any?.length && !c.any.some((p) => lower.includes(p.toLowerCase()))) {
        problems.push(`none of [${c.any.join(', ')}]`);
    }
    for (const p of c.all ?? []) if (!lower.includes(p.toLowerCase())) problems.push(`missing "${p}"`);
    for (const p of c.forbid ?? []) if (lower.includes(p.toLowerCase())) problems.push(`leaked "${p}"`);
    if (c.expectUnknown && !UNKNOWN_HINTS.some((h) => lower.includes(h))) {
        problems.push('should have admitted it does not know');
    }
    return problems;
}
