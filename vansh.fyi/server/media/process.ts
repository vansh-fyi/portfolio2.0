import sharp, { type Metadata } from 'sharp';

/**
 * The image pipeline: original bytes in, privacy-safe responsive WebP variants out.
 *  - EXIF (including GPS location) and every other metadata block is stripped from the outputs
 *  - the EXIF orientation is applied first, so phone photos are upright without the tag
 *  - images are never enlarged; small images get a single variant at their own width
 *  - the real file type is checked from the bytes, never from the file name or declared MIME type
 */

export const VARIANT_WIDTHS = [640, 1280, 1920] as const;
export const MAX_INPUT_PIXELS = 64_000_000;

/** Raised with a message that is safe to show the admin. */
export class ImageError extends Error {}

export interface ProcessedVariant {
    w: number;
    data: Buffer;
}

export interface ProcessedImage {
    /** Size of the largest variant (what visitors can see at most) */
    width: number;
    height: number;
    variants: ProcessedVariant[];
    blurDataUrl: string;
    animated: boolean;
    /** MIME type of the original, from its real contents */
    mime: string;
}

const MIME_BY_FORMAT: Record<string, string> = { jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', gif: 'image/gif', avif: 'image/avif' };

export function targetWidths(sourceWidth: number): number[] {
    const widths: number[] = VARIANT_WIDTHS.filter((w) => w < sourceWidth);
    widths.push(Math.min(sourceWidth, VARIANT_WIDTHS[VARIANT_WIDTHS.length - 1]));
    return [...new Set(widths)];
}

export async function processImage(input: Buffer): Promise<ProcessedImage> {
    let meta: Metadata;
    try {
        meta = await sharp(input, { limitInputPixels: MAX_INPUT_PIXELS, animated: true }).metadata();
    } catch (error) {
        if (error instanceof Error && /pixel limit/i.test(error.message)) throw new ImageError('This image has too many pixels. Resize it below 64 megapixels first.');
        throw new ImageError('This file is not a valid image.');
    }

    const format = meta.format === 'heif' && meta.compression === 'av1' ? 'avif' : meta.format;
    const mime = format ? MIME_BY_FORMAT[format] : undefined;
    if (!mime) {
        if (meta.format === 'svg') throw new ImageError('SVG files are not accepted (they can carry scripts).');
        if (meta.format === 'heif') throw new ImageError('HEIC photos are not supported. Export the picture as JPEG first.');
        throw new ImageError(`Unsupported image type${meta.format ? ` (${meta.format})` : ''}. Use JPEG, PNG, WebP, AVIF or GIF.`);
    }

    const pages = meta.pages ?? 1;
    const animated = pages > 1;
    const rawWidth = meta.width ?? 0;
    const rawHeight = animated ? (meta.pageHeight ?? 0) : (meta.height ?? 0);
    if (!rawWidth || !rawHeight) throw new ImageError('This image has no size.');
    const turned = (meta.orientation ?? 1) >= 5; // 90/270 degree EXIF rotations swap width and height
    const sourceWidth = turned ? rawHeight : rawWidth;

    const open = (animate: boolean) => sharp(input, { limitInputPixels: MAX_INPUT_PIXELS, animated: animate }).rotate(); // rotate() with no argument applies the EXIF orientation

    const variants: ProcessedVariant[] = [];
    let width = 0;
    let height = 0;
    for (const w of targetWidths(sourceWidth)) {
        const { data, info } = await open(animated).resize({ width: w, withoutEnlargement: true }).webp({ quality: 80, effort: 4 }).toBuffer({ resolveWithObject: true });
        // No .withMetadata()/.keepExif(): sharp drops EXIF, XMP and ICC from the output
        variants.push({ w: info.width, data });
        width = info.width;
        height = animated ? (info.pageHeight ?? info.height) : info.height;
    }

    const tiny = await open(false).resize({ width: 16 }).webp({ quality: 30 }).toBuffer();
    return { width, height, variants, blurDataUrl: `data:image/webp;base64,${tiny.toString('base64')}`, animated, mime };
}
