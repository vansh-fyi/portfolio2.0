import { SITE_URL } from '../../lib/site';
import { supabase } from '../services/supabase';

export interface ChatProjectLink {
    projectId: string;
    title: string;
    url: string;
}

/** Supply one useful project link when a provider leaves all project names as plain text. */
export function linkProjectMention(text: string, links: ChatProjectLink[]): string {
    if (links.some((link) => text.includes(`](${link.url})`))) return text;
    let linked = false;
    return text.split(/(```[\s\S]*?```|`[^`\n]+`|\[[^\]\n]*\]\([^\s)]+\)|https?:\/\/[^\s<]+)/g).map((part, index) => {
        if (index % 2 || linked) return part;
        const candidates = links.flatMap((link) => {
            const escaped = link.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const match = new RegExp(`(?<![\\p{L}\\p{N}])${escaped}(?![\\p{L}\\p{N}])`, 'iu').exec(part);
            return match ? [{ link, start: match.index, label: match[0] }] : [];
        }).sort((a, b) => a.start - b.start);
        const first = candidates[0];
        if (!first) return part;
        linked = true;
        return `${part.slice(0, first.start)}[${first.label}](${first.link.url})${part.slice(first.start + first.label.length)}`;
    }).join('');
}

/** Project pages use placement IDs, which can differ from the knowledge base's project IDs. */
export async function getChatProjectLinks(signal: AbortSignal): Promise<ChatProjectLink[]> {
    const { data, error } = await supabase.from('project_placements')
        .select('id, project_id, projects!inner(title)')
        .eq('projects.status', 'published')
        .order('position', { ascending: true })
        .abortSignal(signal);
    signal.throwIfAborted();
    if (error) {
        console.warn('[chat] project links unavailable:', error.message);
        return [];
    }
    const links = new Map<string, ChatProjectLink>();
    for (const row of data ?? []) {
        const project = Array.isArray(row.projects) ? row.projects[0] : row.projects;
        if (project?.title && !links.has(row.project_id)) {
            links.set(row.project_id, { projectId: row.project_id, title: project.title, url: `${SITE_URL}/projects/${encodeURIComponent(row.id)}` });
        }
    }
    return [...links.values()];
}
