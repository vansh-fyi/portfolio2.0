import { boundedHistory, compactMemoryText, CHAT_LIMITS, type ChatTurn } from '../../../lib/chat';

const pair = (index: number, size = 20): ChatTurn[] => [
    { role: 'user', content: `${index}:`.padEnd(size, 'u') },
    { role: 'assistant', content: `${index}:`.padEnd(size, 'a') },
];

it('keeps only the three latest completed exchanges', () => {
    const turns = Array.from({ length: 20 }, (_, i) => pair(i)).flat();
    const kept = boundedHistory(turns);
    expect(kept).toHaveLength(6);
    expect(kept[0].content).toMatch(/^17:/);
});

it('bounds characters without splitting an exchange or modifying its input', () => {
    const turns = [...pair(1, 1200), ...pair(2, 1200), ...pair(3, 1200)];
    const kept = boundedHistory(turns);
    expect(kept).toHaveLength(2);
    expect(kept.every((turn) => turn.content.length <= CHAT_LIMITS.historyMessageChars)).toBe(true);
    expect(kept.reduce((n, turn) => n + turn.content.length, 0)).toBeLessThanOrEqual(CHAT_LIMITS.historyChars);
    expect(turns[0].content).toHaveLength(1200);
});


it('compacts presentation without removing negation, identifiers or meaningful code whitespace', () => {
    const text = '# Context\n**Do not** store Aether  credentials.\n\n\n```py\nif enabled:\n    stop()\n```';
    const compact = compactMemoryText(text);
    expect(compact).toContain('Do not store Aether credentials.');
    expect(compact).toContain('if enabled:\n    stop()');
    expect(compact.length).toBeLessThan(text.length);
});
