import type { AdminUser } from '../auth/admin';
import { supabaseAdmin } from '../services/supabase';
import { extractMediaIds, readingMinutes } from './markdown';
import type { PostInput } from './post-input';
import { POST_COLUMNS, type Post } from './types';

/**
 * Writes go through the service-role client, which bypasses row level security, so every function
 * here takes the `AdminUser` that `requireAdmin()` returns. The parameter is unused at runtime; it
 * makes it a type error to call these from code that has not passed the auth check.
 */

export type PostSummary = Pick<Post, 'id' | 'slug' | 'title' | 'status' | 'published_at' | 'updated_at' | 'tags'>;

export class AdminError extends Error {
    constructor(message: string, readonly field?: string) {
        super(message);
    }
}

export async function listAllPosts(_admin: AdminUser, status?: 'draft' | 'published'): Promise<PostSummary[]> {
    let query = supabaseAdmin
        .from('posts')
        .select('id, slug, title, status, published_at, updated_at, tags')
        .order('updated_at', { ascending: false })
        .limit(200);
    if (status) query = query.eq('status', status);
    const { data, error } = await query;
    if (error) throw new Error(`posts query failed: ${error.message}`);
    return data as PostSummary[];
}

export async function getPostById(_admin: AdminUser, id: string): Promise<Post | null> {
    const { data, error } = await supabaseAdmin.from('posts').select(POST_COLUMNS).eq('id', id).maybeSingle();
    if (error) throw new Error(`post query failed: ${error.message}`);
    return data as Post | null;
}

/** Make `post_media` match the images the post actually uses (it blocks deleting an image still in use). */
async function syncPostMedia(postId: string, body: string, coverMediaId: string | null) {
    const ids = new Set(extractMediaIds(body));
    if (coverMediaId) ids.add(coverMediaId);

    if (ids.size) {
        const { data, error } = await supabaseAdmin.from('media').select('id').in('id', [...ids]);
        if (error) throw new Error(`media lookup failed: ${error.message}`);
        const found = new Set((data as { id: string }[]).map((m) => m.id));
        const missing = [...ids].filter((id) => !found.has(id));
        if (missing.length) throw new AdminError(`This post uses images that no longer exist (${missing.length}). Remove them or re-upload.`, 'body_md');
    }

    const { error: delError } = await supabaseAdmin.from('post_media').delete().eq('post_id', postId);
    if (delError) throw new Error(`post_media cleanup failed: ${delError.message}`);
    if (ids.size) {
        const { error } = await supabaseAdmin.from('post_media').insert([...ids].map((media_id) => ({ post_id: postId, media_id })));
        if (error) throw new Error(`post_media insert failed: ${error.message}`);
    }
}

/** Create or update a post's content. Never changes publishing state. Returns the saved post and its previous slug/tags (for cache invalidation). */
export async function savePost(admin: AdminUser, input: PostInput): Promise<{ post: Post; previous: Pick<Post, 'slug' | 'tags'> | null }> {
    const fields = {
        slug: input.slug,
        title: input.title,
        excerpt: input.excerpt,
        body_md: input.body_md,
        tags: input.tags,
        seo_title: input.seo_title,
        seo_description: input.seo_description,
        cover_media_id: input.cover_media_id,
        reading_minutes: readingMinutes(input.body_md),
    };

    let previous: Pick<Post, 'slug' | 'tags'> | null = null;
    let saved: Post;

    if (input.id) {
        const existing = await getPostById(admin, input.id);
        if (!existing) throw new AdminError('This post no longer exists.');
        previous = { slug: existing.slug, tags: existing.tags };
        const { data, error } = await supabaseAdmin.from('posts').update(fields).eq('id', input.id).select(POST_COLUMNS).single();
        if (error) throw mapWriteError(error);
        saved = data as Post;
    } else {
        const { data, error } = await supabaseAdmin.from('posts').insert({ ...fields, status: 'draft' }).select(POST_COLUMNS).single();
        if (error) throw mapWriteError(error);
        saved = data as Post;
    }

    await syncPostMedia(saved.id, saved.body_md, saved.cover_media_id);
    return { post: saved, previous };
}

function mapWriteError(error: { code?: string; message: string }) {
    if (error.code === '23505') return new AdminError('That URL slug is already used by another post.', 'slug');
    return new Error(`post write failed: ${error.message}`);
}

/** Publish (keeping the original publish date if it was published before). */
export async function setPublished(admin: AdminUser, id: string, published: boolean): Promise<Post> {
    const existing = await getPostById(admin, id);
    if (!existing) throw new AdminError('This post no longer exists.');
    const patch = published
        ? { status: 'published' as const, published_at: existing.published_at ?? new Date().toISOString() }
        : { status: 'draft' as const };
    const { data, error } = await supabaseAdmin.from('posts').update(patch).eq('id', id).select(POST_COLUMNS).single();
    if (error) throw new Error(`publish failed: ${error.message}`);
    return data as Post;
}

export async function deletePost(admin: AdminUser, id: string): Promise<Pick<Post, 'slug' | 'tags'> | null> {
    const existing = await getPostById(admin, id);
    if (!existing) return null;
    const { error } = await supabaseAdmin.from('posts').delete().eq('id', id); // post_media cascades
    if (error) throw new Error(`delete failed: ${error.message}`);
    return { slug: existing.slug, tags: existing.tags };
}
