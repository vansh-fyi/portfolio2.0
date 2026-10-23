import { evaluateAnswer } from '../evaluate';

describe('summary quality evaluation', () => {
    it('treats typographic spaces in dates as ordinary spaces', () => {
        expect(evaluateAnswer({ q: 'When?', all: ['December 2025'] }, 'Since December\u202f2025.')).toEqual([]);
    });
    it('detects verbose lists and unrendered citations', () => {
        expect(evaluateAnswer({ q: 'Projects?', maxWords: 8, maxBullets: 3 }, '- One project\n- Two projects\n- Three projects\n- Four projects 【4†L1-L4】'))
            .toEqual(['unrendered citation marker', 'exceeds 8 words', 'exceeds 3 list items']);
    });

    it('allows a concise linked answer and explicit detailed questions without a length budget', () => {
        expect(evaluateAnswer({ q: 'Projects?', maxWords: 90, maxBullets: 3 }, '- [Aether](https://www.vansh.fyi/projects/aether-ai) creates design systems.')).toEqual([]);
        expect(evaluateAnswer({ q: 'Explain every feature in detail.' }, 'A detailed explanation. '.repeat(100))).toEqual([]);
    });
});
