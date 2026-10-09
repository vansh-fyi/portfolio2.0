import { supabase } from '../services/supabase';
import { getMediaByIds } from '../blog/queries';
import { bestUrl } from '../blog/media-url';
import type { FeaturedCard, FeaturedLayout, PortfolioCategory, PortfolioData, PortfolioPlacement } from '../../lib/portfolio';
import { EMPTY_PORTFOLIO } from '../../lib/portfolio';

/**
 * Public read path for projects. Uses the anon client, so row level security limits it to
 * published projects. Like the blog, a database that is unreachable while `next build` runs makes
 * pages build empty and fill in on first request (incremental regeneration); at runtime errors are
 * NOT swallowed, so a failed regeneration keeps serving the last good page.
 */
const isBuildPhase = () => process.env.NEXT_PHASE === 'phase-production-build';

interface ProjectRow {
    id: string;
    title: string;
    subtitle: string;
    short_description: string;
    is_nda: boolean;
    logo_svg: string | null;
    featured: boolean;
    featured_position: number;
    featured_layout: FeaturedLayout | null;
    featured_media_id: string | null;
    featured_image: string | null;
    featured_alt: string | null;
    featured_title: string | null;
    featured_blurb: string | null;
}
interface PlacementRow {
    id: string;
    project_id: string;
    section_id: string;
    position: number;
    url: string;
    projects: ProjectRow | null;
}

const byPosition = <T extends { position: number }>(a: T, b: T) => a.position - b.position;

/** Pure: turns the table rows into the nested structure the site renders. */
export function buildPortfolio(
    categories: { id: string; name: string; icon_svg: string | null; position: number }[],
    sections: { id: string; category_id: string; title: string; position: number }[],
    placements: PlacementRow[],
    featuredImage: (project: ProjectRow) => string | null,
): PortfolioData {
    const result: PortfolioCategory[] = [...categories].sort(byPosition).map((c) => ({
        id: c.id,
        name: c.name,
        iconSvg: c.icon_svg,
        sections: sections
            .filter((s) => s.category_id === c.id)
            .sort(byPosition)
            .map((s) => ({
                id: s.id,
                title: s.title,
                placements: placements
                    .filter((p) => p.section_id === s.id && p.projects)
                    .sort(byPosition)
                    .map<PortfolioPlacement>((p) => ({
                        id: p.id,
                        projectId: p.project_id,
                        title: p.projects!.title,
                        subtitle: p.projects!.subtitle,
                        description: p.projects!.short_description,
                        url: p.url,
                        isNda: p.projects!.is_nda,
                        logoSvg: p.projects!.logo_svg,
                    })),
            }))
            .filter((s) => s.placements.length > 0),
    })).filter((c) => c.sections.length > 0);

    const firstPlacement = new Map<string, string>();
    for (const c of result) for (const s of c.sections) for (const p of s.placements) if (!firstPlacement.has(p.projectId)) firstPlacement.set(p.projectId, p.id);

    const seen = new Set<string>();
    const featured: FeaturedCard[] = [];
    for (const p of placements) {
        const project = p.projects;
        if (!project?.featured || seen.has(project.id) || !firstPlacement.has(project.id)) continue;
        const image = featuredImage(project);
        if (!image || !project.featured_layout) continue; // an incomplete card is left out rather than shown broken
        seen.add(project.id);
        featured.push({
            projectId: project.id,
            placementId: firstPlacement.get(project.id)!,
            title: project.featured_title || project.title,
            blurb: project.featured_blurb || project.short_description,
            alt: project.featured_alt || project.title,
            image,
            layout: project.featured_layout,
        });
    }
    const position = new Map(placements.map((p) => [p.project_id, p.projects?.featured_position ?? 0]));
    featured.sort((a, b) => (position.get(a.projectId) ?? 0) - (position.get(b.projectId) ?? 0));

    return { categories: result, featured };
}

export async function getPortfolio(): Promise<PortfolioData> {
    try {
        const [categories, sections, placements] = await Promise.all([
            supabase.from('project_categories').select('id, name, icon_svg, position'),
            supabase.from('project_sections').select('id, category_id, title, position'),
            supabase.from('project_placements').select('id, project_id, section_id, position, url, projects(*)'),
        ]);
        for (const r of [categories, sections, placements]) if (r.error) throw new Error(`projects query failed: ${r.error.message}`);

        const rows = placements.data as unknown as PlacementRow[];
        const mediaIds = [...new Set(rows.map((p) => p.projects?.featured_media_id).filter((id): id is string => !!id))];
        const media = await getMediaByIds(mediaIds);

        return buildPortfolio(categories.data!, sections.data!, rows, (project) => {
            const m = project.featured_media_id ? media.get(project.featured_media_id) : undefined;
            return (m && bestUrl(m, 1280)) || project.featured_image;
        });
    } catch (error) {
        if (isBuildPhase()) {
            console.warn('[projects] skipped at build time:', error instanceof Error ? error.message : error);
            return EMPTY_PORTFOLIO;
        }
        throw error;
    }
}
