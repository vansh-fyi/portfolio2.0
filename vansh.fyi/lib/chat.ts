/** Shared limits: history stays in browser memory and travels only with the active request. */
export const CHAT_LIMITS = {
    queryChars: 500,
    historyMessages: 6,
    historyMessageChars: 1000,
    historyChars: 3000,
    transcriptMessages: 40,
    transcriptChars: 24000,
    idleMs: 10 * 60 * 1000,
    responseTokens: 500,
} as const;

export interface ChatTurn {
    role: 'user' | 'assistant';
    content: string;
}

export type ChatScope = { context: 'personal'; projectId?: never } | { context: 'project'; projectId: string };
export type RagRequest = ChatScope & { query: string; history?: ChatTurn[] };

/** Remove presentation overhead, not words or facts. Code retains its meaningful spacing. */
export function compactMemoryText(text: string): string {
    return text.split(/(```[\s\S]*?```|`[^`\n]+`)/g).map((part, index) => index % 2 ? part : part
        .replace(/^#{1,6}\s+/gm, '')
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/[\t ]+/g, ' ')
        .replace(/ *\n */g, '\n')
        .replace(/\n{3,}/g, '\n\n')).join('').trim();
}

function memoryExcerpt(text: string): string {
    const compact = compactMemoryText(text);
    if (compact.length <= CHAT_LIMITS.historyMessageChars) return compact;
    const head = compact.slice(0, CHAT_LIMITS.historyMessageChars - 1);
    const sentence = Math.max(head.lastIndexOf('. '), head.lastIndexOf('? '), head.lastIndexOf('! '), head.lastIndexOf('\n'));
    const end = sentence > head.length / 2 ? sentence + 1 : head.lastIndexOf(' ');
    return `${head.slice(0, end > 0 ? end : head.length).trimEnd()}…`;
}

/** Keep whole, completed exchanges; the newest ones win the fixed character budget. */
export function boundedHistory(turns: readonly ChatTurn[]): ChatTurn[] {
    const result: ChatTurn[] = [];
    let chars = 0;
    for (let i = turns.length - 2; i >= 0 && result.length < CHAT_LIMITS.historyMessages; i -= 2) {
        const user = turns[i];
        const assistant = turns[i + 1];
        if (user.role !== 'user' || assistant.role !== 'assistant') continue;
        const pair = [user, assistant].map((turn) => ({ ...turn, content: memoryExcerpt(turn.content) }));
        const size = pair[0].content.length + pair[1].content.length;
        if (chars + size > CHAT_LIMITS.historyChars) break;
        result.unshift(...pair);
        chars += size;
    }
    return result;
}

export type ChatAction = 'view_projects';

/** Provider citation syntax has no matching sources in our Markdown renderer. Keep real links and code. */
export function stripCitationArtifacts(raw: string): string {
    return raw.split(/(```[\s\S]*?```|`[^`\n]+`)/g).map((part, index) => index % 2 ? part : part
        .replace(/[\t ]*(?:【[^【】\n]*†[^【】\n]*】|\uE200(?:cite|filecite)\uE202[^\uE201\n]*\uE201)/g, '')
        .replace(/^[\t ]+$/gm, '')
        .replace(/\n{3,}/g, '\n\n')).join('').trim();
}

/** Only known action markers become UI controls; model text never supplies navigation targets. */
export function parseChatActions(raw: string, context: ChatScope['context']): { text: string; actions: ChatAction[] } {
    let showProjects = false;
    const text = stripCitationArtifacts(raw.replace(/<action>\s*([^<>]*?)\s*<\/action>/gi, (_, action: string) => {
        if (action.trim() === 'view_projects') showProjects = true;
        return '';
    }));
    return { text, actions: context === 'personal' && text && showProjects ? ['view_projects'] : [] };
}
