/**
 * One-time seed for the projects CMS (migration 011). Reads the three hand-kept lists and writes
 * them to the database:
 *
 *   src/config/projects.tsx   categories -> sections -> placements (url, NDA flag, JSX logo)
 *   src/data/projects.ts      description, technologies
 *   src/components/Projects.tsx  the five featured home cards (copied below, they are not exported)
 *
 *   npm run seed-projects            # dry run: print what would be written, change nothing
 *   npm run seed-projects -- --apply # upsert into Supabase (safe to re-run)
 *
 * `driq-health` and `driq-health-ai` are one project listed twice (confirmed by the owner), so they
 * become one project with two placements. Logos are converted from JSX to plain SVG here; the
 * strict sanitiser (phase 2) runs on them again before anything is rendered from the database.
 */
import { renderToStaticMarkup } from 'react-dom/server';
import type { ReactNode } from 'react';

const APPLY = process.argv.includes('--apply');

/** placement id -> project id, for projects that are listed more than once */
const MERGE: Record<string, string> = { 'driq-health-ai': 'driq-health' };

interface FeaturedCard {
    image: string;
    alt: string;
    title: string;
    blurb: string;
    layout: 'hero' | 'tall' | 'standard';
}
// Copied from the featuredProjects array in src/components/Projects.tsx
const FEATURED: Record<string, FeaturedCard> = {
    aether: { image: '/images/aether.webp', alt: 'Aether: AI Powered Design System Generator', title: 'Aether: AI Powered Design Systems', blurb: 'Customise your design system and generate code components.', layout: 'hero' },
    'driq-health': { image: '/images/driq.webp', alt: 'DriQ Health: Incontinence Monitoring for Seniors', title: 'DriQ Health 🔒', blurb: 'Incontinence Monitoring for Seniors', layout: 'standard' },
    sparto: { image: '/images/sparto.webp', alt: 'Sparto: Request based Ecommerce Application to sell Spare parts', title: 'Sparto', blurb: 'Request based Ecommerce application to sell spare parts.', layout: 'tall' },
    'sparto-admin': { image: '/images/sparto_admin.webp', alt: 'Sparto Admin: Enterprise App for Sparto', title: 'Sparto Admin', blurb: 'Enterprise application for managing Sparto', layout: 'standard' },
    vibio: { image: '/images/vibio.webp', alt: 'Vibio: Event Platform for Creatives', title: 'Vibio', blurb: 'Event Platform for Creatives', layout: 'standard' },
};

/** JSX element -> plain SVG markup. Sizing and styling belong to the wrapper, so they are dropped. */
function toPlainSvg(node: ReactNode): string | null {
    if (!node) return null;
    const markup = renderToStaticMarkup(node as never);
    // Only the root <svg> loses its size; width/height on inner shapes (e.g. <rect>) are geometry
    return markup
        .replace(/^<svg[^>]*>/, (root) => root.replace(/\s(class|width|height)="[^"]*"/g, ''))
        .replace(/\sdata-[a-z-]+="[^"]*"/g, '')
        .replace(/\sclass="[^"]*"/g, '');
}

interface Plan {
    categories: { id: string; name: string; icon_svg: string | null; position: number }[];
    sections: { category_id: string; title: string; position: number }[];
    projects: Record<string, unknown>[];
    placements: { id: string; project_id: string; category_id: string; section_title: string; position: number; url: string }[];
    hosts: string[];
    notes: string[];
}

async function build(): Promise<Plan> {
    const { projectCategories } = await import('../src/config/projects');
    const { projects: metadata } = await import('../src/data/projects');
    const byMeta = new Map(metadata.map((m) => [m.id, m]));

    const plan: Plan = { categories: [], sections: [], projects: [], placements: [], hosts: [], notes: [] };
    const seenProjects = new Map<string, { title: string; subtitle: string; isNda: boolean }>();
    const hosts = new Set<string>();

    projectCategories.forEach((category, ci) => {
        plan.categories.push({ id: category.id, name: category.name, icon_svg: toPlainSvg(category.icon), position: ci });
        category.sections.forEach((section, si) => {
            plan.sections.push({ category_id: category.id, title: section.title, position: si });
            section.projects.forEach((p, pi) => {
                const projectId = MERGE[p.id] ?? p.id;
                plan.placements.push({ id: p.id, project_id: projectId, category_id: category.id, section_title: section.title, position: pi, url: p.url });
                hosts.add(new URL(p.url).host);

                const known = seenProjects.get(projectId);
                if (known) {
                    const same = known.title === p.title && known.subtitle === p.subtitle && known.isNda === !!p.isNDA;
                    plan.notes.push(`${p.id} is a second listing of ${projectId}${same ? '' : ' — WARNING: title/subtitle/NDA differ, kept the first'}`);
                    return;
                }
                seenProjects.set(projectId, { title: p.title, subtitle: p.subtitle, isNda: !!p.isNDA });

                const meta = byMeta.get(projectId);
                if (!meta) plan.notes.push(`${projectId}: no entry in data/projects.ts, description and technologies left empty`);
                const card = FEATURED[projectId];
                plan.projects.push({
                    id: projectId,
                    title: p.title,
                    subtitle: p.subtitle,
                    short_description: meta?.shortDescription ?? '',
                    is_nda: !!p.isNDA,
                    technologies: meta?.technologies ?? [],
                    logo_svg: toPlainSvg(p.logo),
                    featured: !!card,
                    featured_layout: card?.layout ?? null,
                    featured_image: card?.image ?? null,
                    featured_alt: card?.alt ?? null,
                    featured_title: card?.title ?? null,
                    featured_blurb: card?.blurb ?? null,
                    status: 'published',
                });
            });
        });
    });

    for (const id of Object.keys(FEATURED)) {
        if (!seenProjects.has(id)) plan.notes.push(`featured card ${id} matches no project in config/projects.tsx`);
    }
    for (const m of metadata) {
        if (!seenProjects.has(m.id) && !MERGE[m.id]) plan.notes.push(`${m.id} is in data/projects.ts but has no listing in config/projects.tsx; not seeded`);
    }
    plan.hosts = [...hosts].sort();
    return plan;
}

async function apply(plan: Plan) {
    const { supabaseAdmin: db } = await import('../server/services/supabase');
    const check = (what: string, error: { message: string } | null) => {
        if (error) throw new Error(`${what}: ${error.message}`);
    };

    check('categories', (await db.from('project_categories').upsert(plan.categories, { onConflict: 'id' })).error);

    // Sections have generated ids, so match them by (category, title)
    const { data: existing, error: readError } = await db.from('project_sections').select('id, category_id, title');
    check('read sections', readError);
    const sectionId = new Map((existing ?? []).map((s) => [`${s.category_id}|${s.title}`, s.id as string]));
    for (const s of plan.sections) {
        const key = `${s.category_id}|${s.title}`;
        const id = sectionId.get(key);
        if (id) check('update section', (await db.from('project_sections').update({ position: s.position }).eq('id', id)).error);
        else {
            const { data, error } = await db.from('project_sections').insert(s).select('id').single();
            check('insert section', error);
            sectionId.set(key, data!.id as string);
        }
    }

    check('projects', (await db.from('projects').upsert(plan.projects, { onConflict: 'id' })).error);
    const rows = plan.placements.map(({ category_id, section_title, ...p }) => ({ ...p, section_id: sectionId.get(`${category_id}|${section_title}`)! }));
    check('placements', (await db.from('project_placements').upsert(rows, { onConflict: 'id' })).error);
    check('embed_hosts', (await db.from('embed_hosts').upsert(plan.hosts.map((host) => ({ host, note: 'seeded from existing project URLs' })), { onConflict: 'host' })).error);
}

async function main() {
    const plan = await build();

    console.log(`📂 ${plan.categories.length} categories, ${plan.sections.length} sections`);
    console.log(`🗂  ${plan.projects.length} projects (${plan.projects.filter((p) => p.featured).length} featured), ${plan.placements.length} placements`);
    console.log(`🌐 embed hosts: ${plan.hosts.join(', ')}`);
    const noLogo = plan.projects.filter((p) => !p.logo_svg).map((p) => p.id);
    if (noLogo.length) console.log(`🖼  no logo: ${noLogo.join(', ')}`);
    const big = plan.projects.filter((p) => String(p.logo_svg ?? '').length > 65536).map((p) => p.id);
    if (big.length) console.log(`⚠️  logo over 64 KB (the database would reject it): ${big.join(', ')}`);
    for (const note of plan.notes) console.log(`ℹ️  ${note}`);

    if (!APPLY) {
        console.log('\nDry run. Re-run with --apply to write to Supabase.');
        return;
    }
    await apply(plan);
    console.log('\n✅ Seeded.');
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
