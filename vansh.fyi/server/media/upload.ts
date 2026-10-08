/**
 * Rules for image uploads. The browser uploads straight to Supabase Storage with a signed URL, so
 * nothing here can trust the client: the server picks the storage path, and re-checks everything
 * (real file type, size, pixels) when the upload is finalised.
 */

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

export const ALLOWED_UPLOAD_TYPES = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/avif': 'avif',
    'image/gif': 'gif',
} as const;

export type UploadMime = keyof typeof ALLOWED_UPLOAD_TYPES;

export class UploadError extends Error {}

/** Throws a user-readable UploadError unless the announced file is acceptable. Returns its extension. */
export function validateUploadRequest(input: { mime: string; bytes: number }): (typeof ALLOWED_UPLOAD_TYPES)[UploadMime] {
    const ext = ALLOWED_UPLOAD_TYPES[input.mime as UploadMime];
    if (!ext) {
        if (input.mime === 'image/svg+xml') throw new UploadError('SVG files are not accepted (they can carry scripts). Export a PNG or WebP instead.');
        if (/heic|heif/.test(input.mime)) throw new UploadError('HEIC photos are not supported. Export the picture as JPEG first.');
        throw new UploadError('Use a JPEG, PNG, WebP, AVIF or GIF image.');
    }
    if (!Number.isFinite(input.bytes) || input.bytes <= 0) throw new UploadError('The file is empty.');
    if (input.bytes > MAX_UPLOAD_BYTES) throw new UploadError(`The file is too large (${(input.bytes / 1024 / 1024).toFixed(1)} MB). The limit is ${MAX_UPLOAD_BYTES / 1024 / 1024} MB.`);
    return ext;
}

const UUID = '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}';
const ORIGINAL_PATH = new RegExp(`^originals/(${UUID})\\.(jpg|png|webp|avif|gif)$`);

export const originalPath = (id: string, ext: string) => `originals/${id}.${ext}`;
export const variantPath = (id: string, width: number) => `v/${id}/${width}.webp`;

/** The media id inside an original's storage path, or null if the path is not one we generate. */
export function idFromOriginalPath(path: string): string | null {
    return ORIGINAL_PATH.exec(path)?.[1] ?? null;
}
