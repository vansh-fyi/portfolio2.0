import { supabase } from '../services/supabase';
import { POST_COLUMNS, type Media, type Post, type PostWithCover } from './types';

/**
 * Public read path for the blog. Uses the anon client, so Postgres row level security is what
 * limits it to published posts: drafts are not reachable from here even by mistake.
 *
 * During `next build` the database may be unreachable or unconfigured (previews, CI). Pages then
 * build empty and fill in on first request through incremental regeneration. At runtime errors
 * are NOT swallowed, so a failed regeneration keeps serving the last good page.
 */
const isBuildPhase = () => process.env.NEXT_PHASE === 'phase-production-build';

async function guarded<T>(fallback: T, run: () => Promise<T>): Promise<T> {
    try {
        return await run();
    } catch (error) {
        if (isBuildPhase()) {
            console.warn('[blog] skipped at build time:', error instanceof Error ? error.message : error);
            return fallback;
        }
        throw error;
    }
}

export async function getMediaByIds(ids: string[]): Promise<Map<string, Media>> {
    if (!ids.length) return new Map();
    return guarded(new Map<string, Media>(), async () => {
        const { data, error } = await supabase.from('media').select('*').in('id', ids);
        if (error) throw new Error(`media query failed: ${error.message}`);
        return new Map((data as Media[]).map((m) => [m.id, m]));
    });
}

async function attachCovers(posts: Post[]): Promise<PostWithCover[]> {
    const covers = await getMediaByIds([...new Set(posts.map((p) => p.cover_media_id).filter((id): id is string => !!id))]);
    return posts.map((p) => ({ ...p, cover: p.cover_media_id ? (covers.get(p.cover_media_id) ?? null) : null }));
}

/** Newest first. Pass `tag` to filter. */
export async function listPublishedPosts(options: { tag?: string; limit?: number } = {}): Promise<PostWithCover[]> {
    const { tag, limit = 50 } = options;
    return guarded([] as PostWithCover[], async () => {
        let query = supabase
            .from('posts')
            .select(POST_COLUMNS)
            .eq('status', 'published')
            .order('published_at', { ascending: false })
            .limit(limit);
        if (tag) query = query.contains('tags', [tag]);
        const { data, error } = await query;
        if (error) throw new Error(`posts query failed: ${error.message}`);
        return attachCovers(data as Post[]);
    });
}

export async function getPublishedPost(slug: string): Promise<PostWithCover | null> {
    return guarded(null as PostWithCover | null, async () => {
        const { data, error } = await supabase
            .from('posts')
            .select(POST_COLUMNS)
            .eq('slug', slug)
            .eq('status', 'published')
            .maybeSingle();
        if (error) throw new Error(`post query failed: ${error.message}`);
        if (!data) return null;
        return (await attachCovers([data as Post]))[0];
    });
}

export async function listPublishedSlugs(): Promise<{ slug: string; updated_at: string; published_at: string | null }[]> {
    return guarded([], async () => {
        const { data, error } = await supabase
            .from('posts')
            .select('slug, updated_at, published_at')
            .eq('status', 'published')
            .order('published_at', { ascending: false });
        if (error) throw new Error(`slugs query failed: ${error.message}`);
        return data as { slug: string; updated_at: string; published_at: string | null }[];
    });
}

/** Every tag used by published posts, with counts, most used first. */
export async function listTags(): Promise<{ tag: string; count: number }[]> {
    return guarded([], async () => {
        const { data, error } = await supabase.from('posts').select('tags').eq('status', 'published');
        if (error) throw new Error(`tags query failed: ${error.message}`);
        const counts = new Map<string, number>();
        for (const row of data as { tags: string[] }[]) for (const t of row.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
        return [...counts].map(([tag, count]) => ({ tag, count })).sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
    });
}
