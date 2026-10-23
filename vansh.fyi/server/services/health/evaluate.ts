import type { ChatTurn } from '../../../lib/chat';

/**
 * Shared answer checking for evals/golden.json — used by the manual eval script and the daily health cron.
 */

export interface GoldenCase {
    q: string;
    context?: 'personal' | 'project';
    projectId?: string;
    history?: ChatTurn[];
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
    maxWords?: number;
    maxBullets?: number;
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
    const normalize = (text: string) => text.toLowerCase().replace(/\s+/gu, ' ');
    const lower = normalize(answer);
    const problems: string[] = [];
    if (/【[^】\n]*†[^】\n]*】|\uE200(?:cite|filecite)\uE202/.test(answer)) problems.push('unrendered citation marker');
    if (c.maxWords && answer.trim().split(/\s+/).length > c.maxWords) problems.push(`exceeds ${c.maxWords} words`);
    if (c.maxBullets && (answer.match(/^\s*(?:[-*]|\d+[.)])\s+/gm)?.length ?? 0) > c.maxBullets) problems.push(`exceeds ${c.maxBullets} list items`);

    if (c.any?.length && !c.any.some((p) => lower.includes(normalize(p)))) {
        problems.push(`none of [${c.any.join(', ')}]`);
    }
    for (const p of c.all ?? []) if (!lower.includes(normalize(p))) problems.push(`missing "${p}"`);
    for (const p of c.forbid ?? []) if (lower.includes(normalize(p))) problems.push(`leaked "${p}"`);
    if (c.expectUnknown && !UNKNOWN_HINTS.some((h) => lower.includes(h))) {
        problems.push('should have admitted it does not know');
    }
    return problems;
}
