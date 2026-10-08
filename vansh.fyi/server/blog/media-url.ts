import { config } from '../services/config';
import type { Media, MediaVariant } from './types';

const BUCKET = 'media';

/** Public URL of a file in the media bucket. */
export function mediaPublicUrl(path: string): string {
    const encoded = path.split('/').map(encodeURIComponent).join('/');
    return `${config.supabase.url}/storage/v1/object/public/${BUCKET}/${encoded}`;
}

/** Variants sorted from smallest to largest. */
export function sortedVariants(media: Pick<Media, 'variants'>): MediaVariant[] {
    return [...media.variants].sort((a, b) => a.w - b.w);
}

/** The best single URL for a target display width: the smallest variant that is wide enough. */
export function bestUrl(media: Pick<Media, 'variants' | 'storage_path'>, targetWidth: number): string {
    const variants = sortedVariants(media);
    const pick = variants.find((v) => v.w >= targetWidth) ?? variants.at(-1);
    return mediaPublicUrl(pick ? pick.path : media.storage_path);
}

/** `srcset` for responsive images, or undefined when there are no pre-generated variants. */
export function srcSet(media: Pick<Media, 'variants'>): string | undefined {
    const variants = sortedVariants(media);
    if (!variants.length) return undefined;
    return variants.map((v) => `${mediaPublicUrl(v.path)} ${v.w}w`).join(', ');
}
