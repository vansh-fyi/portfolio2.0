import GithubSlugger from 'github-slugger';

/**
 * Pure helpers for the blog's Markdown. Posts are stored as plain Markdown; images are written as
 * `![alt](media:<uuid>)` and resolved to real URLs at render time, so moving storage never means
 * editing posts, and "which posts use this image?" is a simple query at save time.
 */

const UUID = '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}';
const MEDIA_TOKEN = new RegExp(`!\\[([^\\]]*)\\]\\(media:(${UUID})\\)`, 'gi');
export const MEDIA_PREFIX = 'media:';

/** Ids of every image a post uses, in order of first appearance. */
export function extractMediaIds(markdown: string): string[] {
    const ids: string[] = [];
    for (const match of markdown.matchAll(MEDIA_TOKEN)) {
        const id = match[2].toLowerCase();
        if (!ids.includes(id)) ids.push(id);
    }
    return ids;
}

/** Markdown with image tokens replaced by their alt text, for indexing and excerpts. */
export function stripMediaTokens(markdown: string): string {
    return markdown.replace(MEDIA_TOKEN, (_all, alt: string) => (alt.trim() ? `(Image: ${alt.trim()})` : ''));
}

/** The media id inside a `media:<uuid>` image source, or null for ordinary URLs. */
export function mediaIdFromSrc(src: string | undefined): string | null {
    if (!src?.startsWith(MEDIA_PREFIX)) return null;
    const id = src.slice(MEDIA_PREFIX.length).toLowerCase();
    return new RegExp(`^${UUID}$`).test(id) ? id : null;
}

/** Whole minutes to read, at least 1 (about 220 words per minute). */
export function readingMinutes(markdown: string): number {
    const words = stripMediaTokens(markdown).split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 220));
}

export interface Heading {
    depth: 2 | 3;
    text: string;
    /** Same id rehype-slug puts on the rendered heading (both use github-slugger, in document order). */
    id: string;
}

/** Plain text of a heading line's inline Markdown (links, emphasis, code), as rehype-slug sees it. */
function plainText(inline: string): string {
    return inline
        .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
        .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
        .replace(/`([^`]*)`/g, '$1')
        .replace(/(\*\*|__|\*|_|~~)/g, '')
        .replace(/\s+#+\s*$/, '')
        .trim();
}

/** h2/h3 headings for the table of contents. Headings inside code fences are ignored. */
export function extractHeadings(markdown: string): Heading[] {
    const slugger = new GithubSlugger();
    const headings: Heading[] = [];
    let fence: string | null = null;

    for (const line of markdown.split('\n')) {
        const fenceMatch = line.match(/^\s*(```+|~~~+)/);
        if (fenceMatch) {
            if (!fence) fence = fenceMatch[1][0];
            else if (fenceMatch[1][0] === fence) fence = null;
            continue;
        }
        if (fence) continue;

        const match = line.match(/^(#{1,6})\s+(.+?)\s*$/);
        if (!match) continue;
        const text = plainText(match[2]);
        const id = slugger.slug(text); // every heading consumes a slug, so duplicates match rehype-slug
        const depth = match[1].length;
        if (depth === 2 || depth === 3) headings.push({ depth, text, id });
    }
    return headings;
}

/** A short plain-text summary when a post has no hand-written excerpt. */
export function excerptFrom(markdown: string, maxLength = 180): string {
    const text = stripMediaTokens(markdown)
        .replace(/```[\s\S]*?```/g, ' ')
        .replace(/^#{1,6}\s+.*$/gm, ' ')
        .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
        .replace(/[*_`>#~-]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
    if (text.length <= maxLength) return text;
    return `${text.slice(0, maxLength).replace(/\s+\S*$/, '')}…`;
}

/** URL slug from a title: lowercase ascii words joined by hyphens. */
export function slugify(title: string): string {
    return title
        .normalize('NFKD')
        .replace(/[̀-ͯ]/g, '')
        .toLowerCase()
        .replace(/&/g, ' and ')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 80)
        .replace(/-+$/, '');
}

export const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
