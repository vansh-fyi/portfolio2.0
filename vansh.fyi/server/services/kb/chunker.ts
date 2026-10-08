import { createHash } from 'crypto';

/**
 * Heading-aware markdown chunker for the Ursa knowledge base.
 *
 * Each chunk keeps its heading path ("Ursa AI > Architecture > Retrieval") so a
 * retrieved passage always says which project and section it came from. The
 * embedding model (gte-small) truncates at 512 tokens, so chunks stay well under
 * that (~1500 chars of body plus the heading path).
 */

export interface KbChunk {
    headingPath: string;
    content: string;
    contentHash: string;
    chunkIndex: number;
}

export interface ChunkOptions {
    /** Document title, used as the root of every heading path */
    title: string;
    /** Soft upper bound for chunk body size in characters */
    maxChars?: number;
    /** Sections smaller than this are merged with the following one */
    minChars?: number;
}

interface Section {
    path: string[];
    lines: string[];
}

const HEADING = /^(#{1,6})\s+(.*?)\s*#*\s*$/;
const FENCE = /^\s*(```|~~~)/;

function splitSections(markdown: string, title: string): Section[] {
    const sections: Section[] = [{ path: [title], lines: [] }];
    // stack[level - 1] = heading text at that level
    const stack: string[] = [];
    let inFence = false;

    for (const line of markdown.split('\n')) {
        if (FENCE.test(line)) inFence = !inFence;

        const match = !inFence ? HEADING.exec(line) : null;
        if (!match) {
            sections[sections.length - 1].lines.push(line);
            continue;
        }

        const level = match[1].length;
        const text = match[2].trim();
        stack.length = level - 1;
        stack[level - 1] = text;

        // A top-level heading that just repeats the title adds nothing to the path
        const headings = stack.filter(Boolean).filter((h) => h.toLowerCase() !== title.toLowerCase());
        sections.push({ path: [title, ...headings], lines: [] });
    }

    return sections;
}

/** Split an oversized body on paragraph boundaries, then hard-wrap any paragraph still too long. */
function splitBody(body: string, maxChars: number): string[] {
    if (body.length <= maxChars) return [body];

    const pieces: string[] = [];
    let current = '';

    const flush = () => {
        if (current.trim()) pieces.push(current.trim());
        current = '';
    };

    for (const paragraph of body.split(/\n{2,}/)) {
        if (paragraph.length > maxChars) {
            flush();
            // Hard wrap on sentence/line boundaries
            let piece = '';
            for (const part of paragraph.split(/(?<=[.!?\n])\s+/)) {
                if ((piece + ' ' + part).length > maxChars && piece) {
                    pieces.push(piece.trim());
                    piece = '';
                }
                piece += (piece ? ' ' : '') + part;
            }
            if (piece.trim()) pieces.push(piece.trim());
            continue;
        }
        if ((current + '\n\n' + paragraph).length > maxChars && current) flush();
        current += (current ? '\n\n' : '') + paragraph;
    }
    flush();
    return pieces;
}

export function hashChunk(headingPath: string, content: string): string {
    return createHash('sha256').update(`${headingPath}\n${content}`).digest('hex');
}

/** Text that is embedded: heading path first so the vector knows where the passage lives. */
export function embeddingInput(chunk: Pick<KbChunk, 'headingPath' | 'content'>): string {
    return `${chunk.headingPath}\n\n${chunk.content}`;
}

export function chunkMarkdown(markdown: string, options: ChunkOptions): KbChunk[] {
    const { title, maxChars = 1500, minChars = 300 } = options;
    const sections = splitSections(markdown, title)
        .map((s) => ({ path: s.path, body: s.lines.join('\n').trim() }))
        .filter((s) => s.body.length > 0);

    // Merge tiny sections into the next one so we don't index one-line chunks.
    // The merged chunk keeps the first section's path and inlines later headings.
    const merged: { path: string[]; body: string }[] = [];
    let pending: { path: string[]; body: string } | null = null;

    for (const section of sections) {
        if (pending) {
            const label = section.path[section.path.length - 1];
            pending = {
                path: pending.path,
                body: `${pending.body}\n\n${label}\n${section.body}`,
            };
        } else {
            pending = section;
        }
        if (pending.body.length >= minChars) {
            merged.push(pending);
            pending = null;
        }
    }
    if (pending) {
        const last = merged[merged.length - 1];
        if (last && last.body.length + pending.body.length <= maxChars) {
            last.body += `\n\n${pending.path[pending.path.length - 1]}\n${pending.body}`;
        } else {
            merged.push(pending);
        }
    }

    const chunks: KbChunk[] = [];
    for (const section of merged) {
        const headingPath = section.path.join(' > ');
        for (const piece of splitBody(section.body, maxChars)) {
            chunks.push({
                headingPath,
                content: piece,
                contentHash: hashChunk(headingPath, piece),
                chunkIndex: chunks.length,
            });
        }
    }
    return chunks;
}
