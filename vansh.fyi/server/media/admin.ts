import { randomUUID } from 'node:crypto';
import type { AdminUser } from '../auth/admin';
import { bestUrl } from '../blog/media-url';
import type { Media } from '../blog/types';
import { supabaseAdmin } from '../services/supabase';
import { ImageError, processImage } from './process';
import { idFromOriginalPath, MAX_UPLOAD_BYTES, originalPath, UploadError, validateUploadRequest, variantPath } from './upload';

/**
 * Media operations. Like the blog's admin queries these use the service-role client, so each one takes
 * the `AdminUser` from requireAdmin(): calling them without the auth check does not compile.
 *
 *   originals  -> PRIVATE bucket `media-originals` (may contain EXIF/GPS; never served)
 *   variants   -> PUBLIC  bucket `media`           (processed WebP, metadata stripped)
 */

const ORIGINALS = 'media-originals';
const PUBLIC_BUCKET = 'media';

export class MediaError extends Error {}

/** What the admin UI needs to show and use an image. URLs are public and cacheable. */
export interface MediaItem {
    id: string;
    alt: string;
    width: number;
    height: number;
    bytes: number;
    originalName: string | null;
    createdAt: string;
    thumbUrl: string;
    fullUrl: string;
    usedBy: { id: string; title: string }[];
}

function toItem(media: Media & { original_name?: string | null }, usedBy: MediaItem['usedBy'] = []): MediaItem {
    return {
        id: media.id,
        alt: media.alt,
        width: media.width,
        height: media.height,
        bytes: media.bytes,
        originalName: media.original_name ?? null,
        createdAt: media.created_at,
        thumbUrl: bestUrl(media, 640),
        fullUrl: bestUrl(media, 1280),
        usedBy,
    };
}

// --- upload -----------------------------------------------------------------------------------

/** Step 1: reserve a path and hand the browser a one-time signed URL to upload the original straight to Storage. */
export async function createUpload(_admin: AdminUser, input: { mime: string; bytes: number }): Promise<{ path: string; signedUrl: string }> {
    const ext = validateUploadRequest(input);
    const path = originalPath(randomUUID(), ext);
    const { data, error } = await supabaseAdmin.storage.from(ORIGINALS).createSignedUploadUrl(path);
    if (error || !data) throw new Error(`could not create upload URL: ${error?.message}`);
    return { path, signedUrl: data.signedUrl };
}

/** Step 2: the original is in Storage; check it for real, make the variants, and record the image. */
export async function finalizeUpload(_admin: AdminUser, input: { path: string; alt: string; originalName?: string | null }): Promise<MediaItem> {
    const id = idFromOriginalPath(input.path);
    if (!id) throw new MediaError('Invalid upload.');

    // Idempotent: finishing the same upload twice returns the existing image
    const { data: existing } = await supabaseAdmin.from('media').select('*').eq('id', id).maybeSingle();
    if (existing) return toItem(existing as Media);

    const publishedPaths: string[] = [];
    const discardOriginal = () => supabaseAdmin.storage.from(ORIGINALS).remove([input.path]).catch(() => undefined);

    try {
        const { data: blob, error } = await supabaseAdmin.storage.from(ORIGINALS).download(input.path);
        if (error || !blob) throw new MediaError('The upload did not arrive. Try again.');
        const original = Buffer.from(await blob.arrayBuffer());
        if (original.length > MAX_UPLOAD_BYTES) throw new UploadError('The file is too large.');

        const processed = await processImage(original);

        const variants = processed.variants.map((v) => ({ w: v.w, path: variantPath(id, v.w) }));
        await Promise.all(
            processed.variants.map(async (v, i) => {
                const { error: uploadError } = await supabaseAdmin.storage.from(PUBLIC_BUCKET).upload(variants[i].path, v.data, {
                    contentType: 'image/webp',
                    cacheControl: '31536000', // the path contains the id and width, so the bytes never change: cache for a year
                    upsert: false,
                });
                if (uploadError) throw new Error(`variant upload failed: ${uploadError.message}`);
                publishedPaths.push(variants[i].path);
            }),
        );

        const { data: row, error: insertError } = await supabaseAdmin
            .from('media')
            .insert({
                id,
                storage_path: input.path,
                variants,
                alt: input.alt,
                width: processed.width,
                height: processed.height,
                blur_data_url: processed.blurDataUrl,
                mime: processed.mime,
                bytes: original.length,
                original_name: input.originalName?.slice(0, 200) || null,
            })
            .select('*')
            .single();
        if (insertError) throw new Error(`media insert failed: ${insertError.message}`);
        return toItem(row as Media);
    } catch (error) {
        // Never leave a half-made image behind: no variants, no original (it may be someone's private photo)
        if (publishedPaths.length) await supabaseAdmin.storage.from(PUBLIC_BUCKET).remove(publishedPaths).catch(() => undefined);
        await discardOriginal();
        if (error instanceof ImageError || error instanceof UploadError) throw new MediaError(error.message);
        throw error;
    }
}

// --- library ----------------------------------------------------------------------------------

export async function listMedia(_admin: AdminUser): Promise<MediaItem[]> {
    const [{ data: media, error }, { data: usage, error: usageError }] = await Promise.all([
        supabaseAdmin.from('media').select('*').order('created_at', { ascending: false }).limit(500),
        supabaseAdmin.from('post_media').select('media_id, posts(id, title)'),
    ]);
    if (error) throw new Error(`media query failed: ${error.message}`);
    if (usageError) throw new Error(`usage query failed: ${usageError.message}`);

    const usedBy = new Map<string, MediaItem['usedBy']>();
    for (const row of (usage ?? []) as unknown as { media_id: string; posts: { id: string; title: string } | null }[]) {
        if (!row.posts) continue;
        usedBy.set(row.media_id, [...(usedBy.get(row.media_id) ?? []), row.posts]);
    }
    return (media as Media[]).map((m) => toItem(m, usedBy.get(m.id)));
}

export async function updateAlt(_admin: AdminUser, id: string, alt: string): Promise<void> {
    const { error } = await supabaseAdmin.from('media').update({ alt }).eq('id', id);
    if (error) throw new Error(`alt update failed: ${error.message}`);
}

/** Deleting an image that a post still uses is refused, so posts never end up with broken images. */
export async function deleteMedia(_admin: AdminUser, id: string): Promise<void> {
    const { data: media } = await supabaseAdmin.from('media').select('*').eq('id', id).maybeSingle();
    if (!media) return;

    const { data: usage, error: usageError } = await supabaseAdmin.from('post_media').select('posts(title)').eq('media_id', id);
    if (usageError) throw new Error(`usage query failed: ${usageError.message}`);
    if (usage && usage.length) {
        const titles = (usage as unknown as { posts: { title: string } | null }[]).map((u) => u.posts?.title).filter(Boolean);
        throw new MediaError(`This image is still used by: ${titles.join(', ')}. Remove it from the post first.`);
    }

    const { error } = await supabaseAdmin.from('media').delete().eq('id', id);
    if (error) throw new Error(`delete failed: ${error.message}`); // post_media has ON DELETE RESTRICT: a race with a new reference lands here

    // Row first, files after: a failure now leaves invisible orphan files, never a visible broken image
    const variantPaths = (media as Media).variants.map((v) => v.path);
    if (variantPaths.length) await supabaseAdmin.storage.from(PUBLIC_BUCKET).remove(variantPaths).catch((e) => console.error('[media] variant cleanup failed', e));
    await supabaseAdmin.storage.from(ORIGINALS).remove([(media as Media).storage_path]).catch((e) => console.error('[media] original cleanup failed', e));
}
