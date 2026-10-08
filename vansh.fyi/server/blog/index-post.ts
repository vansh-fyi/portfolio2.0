import { supabaseAdmin } from '../services/supabase';
import { chunkMarkdown } from '../services/kb/chunker';
import { embedMany } from '../services/kb/embed';
import { blogSourceFile, removeSourceFile, syncSourceFile } from '../services/kb/sync';
import { stripMediaTokens } from './markdown';
import { POST_COLUMNS, type Post } from './types';

/**
 * Keeps Ursa's knowledge base in step with the blog.
 *
 *  - A published post is chunked (heading-aware, like every other source) and stored in `kb_chunks`
 *    as `source_file = "blog/<slug>"`, `source_type = "blog"`.
 *  - A draft, unpublished or deleted post has NO chunks. Ursa can only ever see what is public.
 *
 * `reindexPost` always works from the post's CURRENT state in the database, never from what a caller
 * saw earlier, so two quick edits (two background jobs) can't leave the index on the older text.
 */

const MONTH_YEAR = new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric', timeZone: 'UTC' });

/** The Markdown Ursa reads: a one-line lead (so "when did he write about X?" works), then the body without image tokens. */
export function buildPostDocument(post: Pick<Post, 'title' | 'slug' | 'excerpt' | 'body_md' | 'tags' | 'published_at'>) {
    const when = post.published_at ? ` published in ${MONTH_YEAR.format(new Date(post.published_at))}` : '';
    const topics = post.tags.length ? ` Topics: ${post.tags.join(', ')}.` : '';
    const lead = `Blog post by Vansh Grover${when}.${topics}`;
    const markdown = [lead, post.excerpt?.trim(), stripMediaTokens(post.body_md).trim()].filter(Boolean).join('\n\n');
    return {
        markdown,
        title: `Blog post: ${post.title}`,
        metadata: { source_type: 'blog', source_file: blogSourceFile(post.slug), slug: post.slug, title: post.title, published_at: post.published_at, tags: post.tags },
    };
}

/** Short, public-safe wording for the admin UI: posts are readable by anyone, so raw errors never go in the table. */
export function describeIndexError(error: unknown): string {
    const message = error instanceof Error ? error.message : String(error);
    if (/embed/i.test(message)) return 'The embedding service failed. Ursa does not know this post yet; use Re-index to retry.';
    if (/insert failed|delete failed|could not read|could not remove/i.test(message)) return 'The database rejected the update. Use Re-index to retry.';
    return 'Indexing failed (see the server logs). Use Re-index to retry.';
}

async function markStatus(id: string, patch: { ursa_indexed_at: string | null; ursa_error: string | null }) {
    const { error } = await supabaseAdmin.from('posts').update(patch).eq('id', id);
    if (error) console.error('[blog-index] could not record index status:', error.message);
}

export type IndexOutcome = 'indexed' | 'removed' | 'missing';

/** Makes the index match the post: published -> indexed, anything else -> removed. Records the outcome on the post. */
export async function reindexPost(id: string): Promise<IndexOutcome> {
    const { data, error } = await supabaseAdmin.from('posts').select(POST_COLUMNS).eq('id', id).maybeSingle();
    if (error) throw new Error(`post query failed: ${error.message}`);
    if (!data) return 'missing'; // deleted in the meantime; the delete path removes its chunks by slug
    const post = data as Post;

    try {
        if (post.status !== 'published') {
            await removeSourceFile(supabaseAdmin, blogSourceFile(post.slug));
            await markStatus(id, { ursa_indexed_at: null, ursa_error: null });
            return 'removed';
        }
        const doc = buildPostDocument(post);
        const chunks = chunkMarkdown(doc.markdown, { title: doc.title });
        await syncSourceFile(supabaseAdmin, embedMany, { sourceFile: blogSourceFile(post.slug), sourceType: 'blog', projectId: null, metadata: doc.metadata, chunks });
        await markStatus(id, { ursa_indexed_at: new Date().toISOString(), ursa_error: null });
        return 'indexed';
    } catch (e) {
        console.error(`[blog-index] ${post.slug} failed:`, e);
        await markStatus(id, { ursa_indexed_at: null, ursa_error: describeIndexError(e) });
        throw e;
    }
}

/** For posts that no longer exist, or whose slug changed: drop the chunks stored under the old slug. */
export async function removePostFromIndex(slug: string): Promise<number> {
    return removeSourceFile(supabaseAdmin, blogSourceFile(slug));
}
