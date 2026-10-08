import { SITE_URL } from '../../lib/site';
import { supabase } from '../services/supabase';
import { excerptFrom } from './markdown';

/**
 * A compact list of the newest published posts for Ursa's prompt. The portfolio map is generated at
 * ingest time and committed, so it cannot know about posts published after the last deploy; this is
 * read from the database instead (published posts only: row level security enforces it) and cached
 * for a few seconds so chatting never adds a query per message. The admin clears it on the same server
 * instance whenever a post changes; other instances catch up within CACHE_MS.
 */

const MAX_POSTS = 12;
const CACHE_MS = 15_000;
const MONTH_YEAR = new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric', timeZone: 'UTC' });

export interface OverviewPost {
    slug: string;
    title: string;
    excerpt: string | null;
    tags: string[];
    published_at: string | null;
}

export function formatBlogOverview(posts: OverviewPost[], siteUrl: string = SITE_URL): string {
    return posts
        .slice(0, MAX_POSTS)
        .map((p) => {
            const when = p.published_at ? ` (${MONTH_YEAR.format(new Date(p.published_at))})` : '';
            const tags = p.tags.length ? `, topics: ${p.tags.join(', ')}` : '';
            const about = p.excerpt ? ` — ${excerptFrom(p.excerpt, 140)}` : '';
            return `- "${p.title}"${when}${tags}${about} ${siteUrl}/blog/${p.slug}`;
        })
        .join('\n');
}

let cache: { at: number; text: string } | null = null;

/** Never throws: a blog hiccup must not stop Ursa from answering about everything else. */
export async function getBlogOverview(now: number = Date.now()): Promise<string> {
    if (cache && now - cache.at < CACHE_MS) return cache.text;
    try {
        const { data, error } = await supabase
            .from('posts')
            .select('slug, title, excerpt, tags, published_at')
            .eq('status', 'published')
            .order('published_at', { ascending: false })
            .limit(MAX_POSTS);
        if (error) throw new Error(error.message);
        cache = { at: now, text: formatBlogOverview((data ?? []) as OverviewPost[]) };
        return cache.text;
    } catch (error) {
        console.warn('[rag] blog overview unavailable:', error instanceof Error ? error.message : error);
        return cache?.text ?? '';
    }
}

/** Test helper */
export const resetBlogOverviewCache = () => {
    cache = null;
};
