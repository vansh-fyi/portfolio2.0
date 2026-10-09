import { z } from 'zod';
import { sanitizeSvg, SvgError } from './svg';

export const ID_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
export const FEATURED_LAYOUTS = ['hero', 'tall', 'standard'] as const;
export const MAX_TECHNOLOGIES = 12;

const id = (label: string) =>
    z.string().trim().min(1, `${label} is required`).max(60, `${label} is too long (60 max)`).regex(ID_PATTERN, 'Use lowercase letters, numbers and single hyphens');

const optionalText = (max: number) =>
    z
        .string()
        .trim()
        .max(max)
        .transform((v) => (v === '' ? null : v))
        .nullable()
        .optional()
        .transform((v) => v ?? null);

/** Empty means "no logo"; anything else is sanitised, and rejected with a readable message when it cannot be. */
const logoSvg = z
    .string()
    .nullable()
    .optional()
    .transform((value, ctx) => {
        if (!value || !value.trim()) return null;
        try {
            return sanitizeSvg(value).svg;
        } catch (error) {
            ctx.addIssue({ code: 'custom', message: error instanceof SvgError ? error.message : 'Invalid SVG' });
            return z.NEVER;
        }
    });

export function normalizeTechnologies(input: string[] | string): string[] {
    const raw = Array.isArray(input) ? input : input.split(',');
    const out: string[] = [];
    for (const item of raw) {
        const tech = item.trim().replace(/\s+/g, ' ').slice(0, 40);
        if (tech && !out.some((t) => t.toLowerCase() === tech.toLowerCase())) out.push(tech);
    }
    return out.slice(0, MAX_TECHNOLOGIES);
}

/** What the project editor sends when saving. The id is only accepted when creating (it is the URL). */
export const projectInputSchema = z.object({
    id: id('Id'),
    title: z.string().trim().min(1, 'Title is required').max(120, 'Title is too long (120 max)'),
    subtitle: z.string().trim().max(160, 'Subtitle is too long (160 max)').default(''),
    short_description: z.string().trim().max(400, 'Description is too long (400 max)').default(''),
    is_nda: z.boolean().default(false),
    technologies: z.union([z.array(z.string()), z.string()]).transform(normalizeTechnologies).default([]),
    logo_svg: logoSvg,
    featured: z.boolean().default(false),
    featured_layout: z.enum(FEATURED_LAYOUTS).nullable().optional().transform((v) => v ?? null),
    featured_media_id: z.string().uuid().nullable().optional().transform((v) => v ?? null),
    featured_alt: optionalText(200),
    featured_title: optionalText(120),
    featured_blurb: optionalText(200),
});

export type ProjectInput = z.infer<typeof projectInputSchema>;

/** Extra rules that only apply when a project goes live or is shown as a featured card. */
export function publishProblems(project: Pick<ProjectInput, 'title' | 'featured' | 'featured_layout' | 'featured_alt'> & { featured_image?: string | null; featured_media_id: string | null }): string[] {
    const problems: string[] = [];
    if (!project.title.trim()) problems.push('Add a title');
    if (project.featured) {
        if (!project.featured_layout) problems.push('Choose a layout for the featured card');
        if (!project.featured_media_id && !project.featured_image) problems.push('Pick an image for the featured card');
        if (!project.featured_alt) problems.push('Add alt text for the featured card image');
    }
    return problems;
}

/** One listing of a project. The URL host is checked against the allow-list by the caller (validateEmbedUrl). */
export const placementInputSchema = z.object({
    id: id('Page id'),
    project_id: id('Project'),
    section_id: z.string().uuid(),
    url: z.string().trim().min(1, 'Embed URL is required').max(2048),
});

export type PlacementInput = z.infer<typeof placementInputSchema>;

export const categoryInputSchema = z.object({
    id: id('Id'),
    name: z.string().trim().min(1, 'Name is required').max(60),
    icon_svg: logoSvg,
});

export const sectionInputSchema = z.object({
    category_id: id('Category'),
    title: z.string().trim().min(1, 'Title is required').max(80),
});
