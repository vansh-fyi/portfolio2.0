export interface MediaVariant {
    /** Pixel width of this pre-generated file */
    w: number;
    /** Path inside the `media` storage bucket */
    path: string;
}

export interface Media {
    id: string;
    storage_path: string;
    variants: MediaVariant[];
    alt: string;
    width: number;
    height: number;
    blur_data_url: string | null;
    mime: string;
    bytes: number;
    created_at: string;
}

export interface Post {
    id: string;
    slug: string;
    title: string;
    excerpt: string | null;
    body_md: string;
    cover_media_id: string | null;
    tags: string[];
    status: 'draft' | 'published';
    published_at: string | null;
    created_at: string;
    updated_at: string;
    seo_title: string | null;
    seo_description: string | null;
    reading_minutes: number | null;
}

/** A post with its cover image resolved. */
export interface PostWithCover extends Post {
    cover: Media | null;
}

export const POST_COLUMNS =
    'id, slug, title, excerpt, body_md, cover_media_id, tags, status, published_at, created_at, updated_at, seo_title, seo_description, reading_minutes';
