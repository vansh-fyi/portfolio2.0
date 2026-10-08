import { Document } from '../ingestion/types';

/**
 * Portfolio map: a compact one-entry-per-project overview that is always included in
 * Ursa's prompt. Retrieval finds specifics; the map answers broad / cross-project questions
 * ("what has he built?", "which projects involve fintech?") that chunk search handles badly.
 *
 * Built at ingest time (no LLM) and written to portfolio-map.generated.json.
 */

const SUMMARY_MAX = 220;
const TECH_MAX = 6;

const prettify = (s: string) => s.replace(/[_-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

/** First substantial prose paragraph, stripped of markdown, trimmed to SUMMARY_MAX. */
export function summarize(markdown: string): string {
    const paragraphs = markdown
        .split(/\n{2,}/)
        .map((p) => p.trim())
        .filter(
            (p) =>
                p &&
                !/^(#|>|[-*]\s|\d+\.\s|\||```|!\[)/.test(p) &&
                // skip "Status: … Type: … Role: …" metadata blocks and stray JSON-ish lines
                !/\b(Status|Type|Role|Timeline|Platform):/.test(p) &&
                !/:\s*\[/.test(p)
        );

    const first = paragraphs.find((p) => p.length >= 60) ?? paragraphs[0] ?? '';
    const plain = first
        .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
        .replace(/[*_`]/g, '')
        .replace(/\s+/g, ' ')
        .trim();

    if (plain.length <= SUMMARY_MAX) return plain;
    const cut = plain.slice(0, SUMMARY_MAX);
    const lastSpace = cut.lastIndexOf(' ');
    return `${cut.slice(0, lastSpace > 120 ? lastSpace : SUMMARY_MAX)}…`;
}

const asList = (v: unknown): string[] => (Array.isArray(v) ? v.map(String) : []);

export function buildPortfolioMap(documents: Document[]): string {
    const byProject = new Map<string, Document[]>();
    for (const doc of documents) {
        const id = doc.metadata.projectId as string | undefined;
        if (doc.metadata.source_type !== 'project' || !id) continue;
        byProject.set(id, [...(byProject.get(id) ?? []), doc]);
    }

    const lines: string[] = [];
    for (const [projectId, docs] of [...byProject.entries()].sort(([a], [b]) => a.localeCompare(b))) {
        // Prefer the file that carries the project's frontmatter, then an overview file
        const primary =
            docs.find((d) => d.metadata.project_name) ??
            docs.find((d) => /overview/i.test(String(d.metadata.source_file))) ??
            docs[0];
        const m = primary.metadata;

        const name = (m.project_name as string) || prettify(projectId);
        const facts = [m.role, m.timeline, m.platform].filter((v): v is string => typeof v === 'string' && v.length > 0);
        const tech = asList(m.tech_stack ?? m.technologies).slice(0, TECH_MAX);
        const features = asList(m.key_features).slice(0, 4);

        // Frontmatter beats body text: it is curated, so use it for the description when present
        const client = typeof m.client === 'string' ? m.client : '';
        const challenge = typeof m.challenge === 'string' ? m.challenge : '';
        const achievements = asList(m.key_achievements).slice(0, 2);
        const description =
            [client && `Client: ${client}.`, challenge && `Challenge: ${challenge}.`, achievements.length && `Achievements: ${achievements.join('; ')}.`]
                .filter(Boolean)
                .join(' ') || summarize(primary.content);

        const parts = [
            `- ${name} [projectId: ${projectId}]`,
            facts.length ? ` (${facts.join(' · ')})` : '',
            description ? `: ${description}` : '',
            features.length ? ` Key features: ${features.join(', ')}.` : '',
            tech.length ? ` Tech: ${tech.join(', ')}.` : '',
        ];
        lines.push(parts.join(''));
    }

    const personalSections = documents
        .filter((d) => d.metadata.source_type === 'personal')
        .map((d) => prettify(String(d.metadata.source_file).replace(/^personal\//, '').replace(/\.md$/, '')));

    return [
        `Projects (${lines.length}):`,
        ...lines,
        personalSections.length ? `\nPersonal profile sections: ${personalSections.join(', ')}.` : '',
    ]
        .filter(Boolean)
        .join('\n');
}
