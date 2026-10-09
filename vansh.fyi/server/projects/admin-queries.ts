import type { AdminUser } from '../auth/admin';
import { AdminError } from '../blog/admin-queries';
import { supabaseAdmin as db } from '../services/supabase';
import type { Board } from './board';
import { validateEmbedUrl, normalizeHost, EmbedUrlError } from './embed-url';
import { publishProblems, type PlacementInput, type ProjectInput } from './project-input';

/**
 * Writes for the projects CMS. Like the blog, everything goes through the service-role client, so
 * each function takes the `AdminUser` that `requireAdmin()` returns: calling one from code that has
 * not passed the auth check is a type error.
 */

export { AdminError };

const must = (what: string, error: { message: string } | null) => {
    if (error) throw new Error(`${what}: ${error.message}`);
};

// --------------------------------------------------------------------------------- reading

export interface AdminProject {
    id: string;
    title: string;
    subtitle: string;
    short_description: string;
    is_nda: boolean;
    technologies: string[];
    logo_svg: string | null;
    featured: boolean;
    featured_position: number;
    featured_layout: 'hero' | 'tall' | 'standard' | null;
    featured_media_id: string | null;
    featured_image: string | null;
    featured_alt: string | null;
    featured_title: string | null;
    featured_blurb: string | null;
    status: 'draft' | 'published';
    updated_at: string;
}

export interface AdminPlacement {
    id: string;
    project_id: string;
    section_id: string;
    position: number;
    url: string;
}

export interface BoardData {
    board: Board;
    /** Featured projects in card order */
    featured: { projectId: string; title: string; hidden: boolean }[];
    /** Projects with no listing anywhere (invisible on the site) */
    unlisted: { id: string; title: string; status: 'draft' | 'published' }[];
}

const byPosition = <T extends { position: number }>(a: T, b: T) => a.position - b.position;

export async function loadBoard(_admin: AdminUser): Promise<BoardData> {
    const [categories, sections, placements, projects] = await Promise.all([
        db.from('project_categories').select('id, name, icon_svg, position'),
        db.from('project_sections').select('id, category_id, title, position'),
        db.from('project_placements').select('id, project_id, section_id, position'),
        db.from('projects').select('id, title, status, featured, featured_position'),
    ]);
    must('categories', categories.error);
    must('sections', sections.error);
    must('placements', placements.error);
    must('projects', projects.error);

    const projectById = new Map(projects.data!.map((p) => [p.id as string, p]));
    const board: Board = {
        categories: [...categories.data!].sort(byPosition).map((c) => ({
            id: c.id,
            name: c.name,
            iconSvg: c.icon_svg,
            sections: sections.data!
                .filter((s) => s.category_id === c.id)
                .sort(byPosition)
                .map((s) => ({
                    id: s.id,
                    title: s.title,
                    placements: placements.data!
                        .filter((p) => p.section_id === s.id)
                        .sort(byPosition)
                        .map((p) => ({
                            id: p.id,
                            projectId: p.project_id,
                            title: projectById.get(p.project_id)?.title ?? p.project_id,
                            hidden: projectById.get(p.project_id)?.status !== 'published',
                        })),
                })),
        })),
    };

    const listed = new Set(placements.data!.map((p) => p.project_id as string));
    return {
        board,
        featured: projects.data!
            .filter((p) => p.featured)
            .sort((a, b) => a.featured_position - b.featured_position)
            .map((p) => ({ projectId: p.id, title: p.title, hidden: p.status !== 'published' })),
        unlisted: projects.data!.filter((p) => !listed.has(p.id)).map((p) => ({ id: p.id, title: p.title, status: p.status })),
    };
}

export async function getProjectForEdit(_admin: AdminUser, id: string): Promise<{ project: AdminProject; placements: AdminPlacement[] } | null> {
    const { data, error } = await db.from('projects').select('*').eq('id', id).maybeSingle();
    must('project', error);
    if (!data) return null;
    const placements = await db.from('project_placements').select('id, project_id, section_id, position, url').eq('project_id', id).order('position');
    must('placements', placements.error);
    return { project: data as AdminProject, placements: placements.data as AdminPlacement[] };
}

export async function listEmbedHosts(_admin: AdminUser): Promise<string[]> {
    const { data, error } = await db.from('embed_hosts').select('host').order('host');
    must('embed hosts', error);
    return (data ?? []).map((h) => h.host as string);
}

// -------------------------------------------------------------------------------- projects

/** Create (`isNew`) or update a project's content. Never changes publishing state. */
export async function saveProject(_admin: AdminUser, input: ProjectInput, isNew: boolean): Promise<AdminProject> {
    const existing = await db.from('projects').select('id, featured_image, status').eq('id', input.id).maybeSingle();
    must('project lookup', existing.error);
    if (isNew && existing.data) throw new AdminError('A project with this id already exists.', 'id');
    if (!isNew && !existing.data) throw new AdminError('This project no longer exists.');

    if (input.featured) {
        const problems = publishProblems({ ...input, featured_image: existing.data?.featured_image ?? null });
        if (problems.length) throw new AdminError(`Featured card is incomplete: ${problems.join('; ')}.`, 'featured');
    }

    if (input.featured_media_id) {
        const media = await db.from('media').select('id').eq('id', input.featured_media_id).maybeSingle();
        must('media lookup', media.error);
        if (!media.data) throw new AdminError('The chosen card image no longer exists.', 'featured_media_id');
    }

    if (isNew) {
        // New featured cards go to the end
        const last = await db.from('projects').select('featured_position').eq('featured', true).order('featured_position', { ascending: false }).limit(1);
        must('featured order', last.error);
        const featured_position = (last.data?.[0]?.featured_position ?? -1) + 1;
        const { data, error } = await db.from('projects').insert({ ...input, featured_position, status: 'draft' }).select('*').single();
        must('create project', error);
        return data as AdminProject;
    }
    const { id: _id, ...changes } = input; // the id is the URL and never changes
    void _id;
    const { data, error } = await db.from('projects').update(changes).eq('id', input.id).select('*').single();
    must('update project', error);
    return data as AdminProject;
}

export async function setProjectStatus(_admin: AdminUser, id: string, status: 'draft' | 'published'): Promise<AdminProject> {
    const current = await getProjectForEdit(_admin, id);
    if (!current) throw new AdminError('This project no longer exists.');
    if (status === 'published') {
        const problems = publishProblems(current.project);
        if (current.placements.length === 0) problems.push('Add at least one listing (a page that embeds it)');
        if (problems.length) throw new AdminError(`Cannot publish yet: ${problems.join('; ')}.`);
    }
    const { data, error } = await db.from('projects').update({ status }).eq('id', id).select('*').single();
    must('set status', error);
    return data as AdminProject;
}

/** Deleting a project also deletes its listings (foreign key cascade). */
export async function deleteProject(_admin: AdminUser, id: string): Promise<void> {
    const { error } = await db.from('projects').delete().eq('id', id);
    must('delete project', error);
}

// ------------------------------------------------------------------------------ placements

/** Create (`isNew`) or update a listing. The URL's host must be in `embed_hosts`. */
export async function savePlacement(_admin: AdminUser, input: PlacementInput, isNew: boolean): Promise<AdminPlacement> {
    let url: string;
    try {
        url = validateEmbedUrl(input.url, await listEmbedHosts(_admin));
    } catch (error) {
        if (error instanceof EmbedUrlError) throw new AdminError(error.message, 'url');
        throw error;
    }

    const [project, section, existing] = await Promise.all([
        db.from('projects').select('id').eq('id', input.project_id).maybeSingle(),
        db.from('project_sections').select('id').eq('id', input.section_id).maybeSingle(),
        db.from('project_placements').select('id, section_id').eq('id', input.id).maybeSingle(),
    ]);
    must('project lookup', project.error);
    must('section lookup', section.error);
    must('listing lookup', existing.error);
    if (!project.data) throw new AdminError('Choose a project that exists.', 'project_id');
    if (!section.data) throw new AdminError('Choose a section that exists.', 'section_id');
    if (isNew && existing.data) throw new AdminError('A page with this id already exists.', 'id');
    if (!isNew && !existing.data) throw new AdminError('This listing no longer exists.');

    // A listing that is new or moved to another section goes to the end of that section
    let position: number | undefined;
    if (isNew || existing.data!.section_id !== input.section_id) {
        const last = await db.from('project_placements').select('position').eq('section_id', input.section_id).order('position', { ascending: false }).limit(1);
        must('order lookup', last.error);
        position = (last.data?.[0]?.position ?? -1) + 1;
    }

    if (isNew) {
        const { data, error } = await db.from('project_placements').insert({ ...input, url, position }).select('*').single();
        must('create listing', error);
        return data as AdminPlacement;
    }
    const { data, error } = await db
        .from('project_placements')
        .update({ section_id: input.section_id, url, ...(position === undefined ? {} : { position }) })
        .eq('id', input.id)
        .select('*')
        .single();
    must('update listing', error);
    return data as AdminPlacement;
}

export async function deletePlacement(_admin: AdminUser, id: string): Promise<void> {
    const { error } = await db.from('project_placements').delete().eq('id', id);
    must('delete listing', error);
}

// ---------------------------------------------------------------------- categories & sections

export async function saveCategory(_admin: AdminUser, input: { id: string; name: string; icon_svg: string | null }, isNew: boolean): Promise<void> {
    if (isNew) {
        const last = await db.from('project_categories').select('position').order('position', { ascending: false }).limit(1);
        must('order lookup', last.error);
        const { error } = await db.from('project_categories').insert({ ...input, position: (last.data?.[0]?.position ?? -1) + 1 });
        if (error?.code === '23505') throw new AdminError('A category with this id already exists.', 'id');
        must('create category', error);
        return;
    }
    const { error } = await db.from('project_categories').update({ name: input.name, icon_svg: input.icon_svg }).eq('id', input.id);
    must('update category', error);
}

export async function deleteCategory(_admin: AdminUser, id: string): Promise<void> {
    const { count, error } = await db.from('project_sections').select('id', { count: 'exact', head: true }).eq('category_id', id);
    must('section count', error);
    if ((count ?? 0) > 0) throw new AdminError('Move or delete this category\'s sections first.');
    must('delete category', (await db.from('project_categories').delete().eq('id', id)).error);
}

export async function saveSection(_admin: AdminUser, input: { id?: string; category_id: string; title: string }): Promise<void> {
    if (input.id) {
        must('rename section', (await db.from('project_sections').update({ title: input.title }).eq('id', input.id)).error);
        return;
    }
    const last = await db.from('project_sections').select('position').eq('category_id', input.category_id).order('position', { ascending: false }).limit(1);
    must('order lookup', last.error);
    must('create section', (await db.from('project_sections').insert({ category_id: input.category_id, title: input.title, position: (last.data?.[0]?.position ?? -1) + 1 })).error);
}

export async function deleteSection(_admin: AdminUser, id: string): Promise<void> {
    const { count, error } = await db.from('project_placements').select('id', { count: 'exact', head: true }).eq('section_id', id);
    must('listing count', error);
    if ((count ?? 0) > 0) throw new AdminError('Move or delete this section\'s listings first.');
    must('delete section', (await db.from('project_sections').delete().eq('id', id)).error);
}

// ------------------------------------------------------------------------------- embed hosts

export async function addEmbedHost(_admin: AdminUser, raw: string): Promise<string> {
    const host = normalizeHost(raw);
    if (!host) throw new AdminError('Enter just the host name, like info.vansh.fyi (no https://, path or port).', 'host');
    must('add host', (await db.from('embed_hosts').upsert({ host }, { onConflict: 'host' })).error);
    return host;
}

export async function removeEmbedHost(_admin: AdminUser, host: string): Promise<void> {
    const { data, error } = await db.from('project_placements').select('id, url');
    must('listings', error);
    const using = (data ?? []).filter((p) => {
        try {
            return new URL(p.url).hostname === host;
        } catch {
            return false;
        }
    });
    if (using.length) throw new AdminError(`${using.length} listing(s) still embed ${host} (${using.slice(0, 3).map((p) => p.id).join(', ')}). Change them first.`);
    must('remove host', (await db.from('embed_hosts').delete().eq('host', host)).error);
}

// -------------------------------------------------------------------------------- ordering

export interface OrderInput {
    categories: string[];
    sections: { id: string; categoryId: string }[];
    placements: { id: string; sectionId: string }[];
    featured: string[];
}

/**
 * Saves the arrangement from the board. Refuses when it does not account for exactly the
 * categories, sections, listings and featured cards that exist now (a stale tab, or an item added
 * elsewhere), so nothing can be dropped by an old copy of the page.
 */
export async function saveOrder(_admin: AdminUser, order: OrderInput): Promise<void> {
    const [categories, sections, placements, featured] = await Promise.all([
        db.from('project_categories').select('id'),
        db.from('project_sections').select('id'),
        db.from('project_placements').select('id'),
        db.from('projects').select('id').eq('featured', true),
    ]);
    must('categories', categories.error);
    must('sections', sections.error);
    must('listings', placements.error);
    must('featured', featured.error);

    const same = (have: string[], want: string[]) => have.length === want.length && new Set(want).size === want.length && have.every((id) => want.includes(id));
    const stale =
        !same(categories.data!.map((r) => r.id), order.categories) ||
        !same(sections.data!.map((r) => r.id), order.sections.map((s) => s.id)) ||
        !same(placements.data!.map((r) => r.id), order.placements.map((p) => p.id)) ||
        !same(featured.data!.map((r) => r.id), order.featured);
    if (stale) throw new AdminError('The board is out of date (something was added or removed). Reload the page and try again.');
    if (order.sections.some((s) => !order.categories.includes(s.categoryId))) throw new AdminError('A section points at a category that does not exist.');
    if (order.placements.some((p) => !order.sections.some((s) => s.id === p.sectionId))) throw new AdminError('A listing points at a section that does not exist.');

    const positions = new Map<string, number>();
    const next = (key: string) => {
        const n = positions.get(key) ?? 0;
        positions.set(key, n + 1);
        return n;
    };
    const writes = [
        ...order.categories.map((id, position) => db.from('project_categories').update({ position }).eq('id', id)),
        ...order.sections.map((s) => db.from('project_sections').update({ category_id: s.categoryId, position: next(`c:${s.categoryId}`) }).eq('id', s.id)),
        ...order.placements.map((p) => db.from('project_placements').update({ section_id: p.sectionId, position: next(`s:${p.sectionId}`) }).eq('id', p.id)),
        ...order.featured.map((id, featured_position) => db.from('projects').update({ featured_position }).eq('id', id)),
    ];
    const results = await Promise.all(writes);
    const failed = results.find((r) => r.error);
    if (failed) throw new Error(`save order: ${failed.error!.message}`);
}
