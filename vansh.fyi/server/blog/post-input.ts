import { z } from 'zod';
import { SLUG_PATTERN } from './markdown';

export const MAX_TAGS = 8;

/** lowercase, trimmed, de-duplicated, hyphenated tags; empty ones dropped. */
export function normalizeTags(input: string[] | string): string[] {
    const raw = Array.isArray(input) ? input : input.split(',');
    const tags: string[] = [];
    for (const item of raw) {
        const tag = item.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/^-+|-+$/g, '');
        if (tag && !tags.includes(tag)) tags.push(tag);
    }
    return tags.slice(0, MAX_TAGS);
}

const optionalText = (max: number) =>
    z
        .string()
        .trim()
        .max(max)
        .transform((v) => (v === '' ? null : v))
        .nullable()
        .optional()
        .transform((v) => v ?? null);

/** What the editor sends when saving. Publishing state is changed by separate actions, never here. */
export const postInputSchema = z.object({
    id: z.string().uuid().nullable().optional(),
    title: z.string().trim().min(1, 'Title is required').max(160, 'Title is too long (160 max)'),
    slug: z.string().trim().min(1, 'Slug is required').max(80, 'Slug is too long (80 max)').regex(SLUG_PATTERN, 'Use lowercase letters, numbers and single hyphens'),
    excerpt: optionalText(300),
    body_md: z.string().max(200_000, 'Post is too long'),
    tags: z.union([z.array(z.string()), z.string()]).transform(normalizeTags),
    seo_title: optionalText(120),
    seo_description: optionalText(200),
    cover_media_id: z.string().uuid().nullable().optional().transform((v) => v ?? null),
});

export type PostInput = z.infer<typeof postInputSchema>;

/** Extra rules that only apply when a post goes live. */
export function publishProblems(post: { title: string; slug: string; body_md: string }): string[] {
    const problems: string[] = [];
    if (!post.title.trim()) problems.push('Add a title');
    if (!SLUG_PATTERN.test(post.slug)) problems.push('Fix the slug');
    if (post.body_md.trim().length < 20) problems.push('Write something in the body first');
    return problems;
}
