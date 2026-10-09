import { buildPortfolio } from '../queries';
import { firstPlacementId, projectIdFor, projectNameFor } from '../../../lib/portfolio';

const project = (id: string, extra: Record<string, unknown> = {}) => ({
    id, title: id.toUpperCase(), subtitle: `${id} sub`, short_description: `${id} desc`, is_nda: false, logo_svg: null,
    featured: false, featured_position: 0, featured_layout: null, featured_media_id: null, featured_image: null,
    featured_alt: null, featured_title: null, featured_blurb: null, ...extra,
});
const placement = (id: string, projectId: string, section: string, position: number, p = project(projectId)) =>
    ({ id, project_id: projectId, section_id: section, position, url: `https://x.test/${id}`, projects: p as never });

const categories = [
    { id: 'b', name: 'B', icon_svg: null, position: 1 },
    { id: 'a', name: 'A', icon_svg: '<svg></svg>', position: 0 },
    { id: 'empty', name: 'Empty', icon_svg: null, position: 2 },
];
const sections = [
    { id: 's-a1', category_id: 'a', title: 'First', position: 0 },
    { id: 's-a2', category_id: 'a', title: 'Second', position: 1 },
    { id: 's-b1', category_id: 'b', title: 'Third', position: 0 },
    { id: 's-empty', category_id: 'empty', title: 'Nothing here', position: 0 },
];
const img = (p: { featured_image: string | null }) => p.featured_image;

describe('buildPortfolio', () => {
    const rows = [
        placement('two', 'two', 's-a1', 1),
        placement('one', 'one', 's-a1', 0),
        placement('three', 'three', 's-a2', 0),
        placement('one-again', 'one', 's-b1', 0),
    ];
    const data = buildPortfolio(categories, sections, rows, img);

    it('orders categories, sections and placements by position and drops empty ones', () => {
        expect(data.categories.map((c) => c.id)).toEqual(['a', 'b']);
        expect(data.categories[0].sections.map((s) => s.title)).toEqual(['First', 'Second']);
        expect(data.categories[0].sections[0].placements.map((p) => p.id)).toEqual(['one', 'two']);
    });

    it('lists one project under several placements, each with its own route and URL', () => {
        const again = data.categories[1].sections[0].placements[0];
        expect(again).toMatchObject({ id: 'one-again', projectId: 'one', title: 'ONE', url: 'https://x.test/one-again' });
        expect(projectIdFor(data, 'one-again')).toBe('one');
        expect(projectNameFor(data, 'one-again')).toBe('ONE');
        expect(projectIdFor(data, 'unknown')).toBe('unknown');
        expect(firstPlacementId(data)).toBe('one');
    });

    it('skips placements whose project is not visible (draft rows are hidden by RLS)', () => {
        const hidden = buildPortfolio(categories, sections, [{ ...placement('x', 'x', 's-a1', 0), projects: null }], img);
        expect(hidden.categories).toEqual([]);
    });
});

describe('buildPortfolio featured cards', () => {
    const card = (id: string, position: number, extra = {}) =>
        project(id, { featured: true, featured_position: position, featured_layout: 'standard', featured_image: `/images/${id}.webp`, ...extra });

    it('orders cards by featured_position, not by listing order, and links the first listing', () => {
        const rows = [
            placement('late', 'late', 's-a1', 0, card('late', 2)),
            placement('early', 'early', 's-a1', 1, card('early', 0)),
            placement('early-2', 'early', 's-a2', 0, card('early', 0)),
        ];
        const { featured } = buildPortfolio(categories, sections, rows, img);
        expect(featured.map((f) => f.projectId)).toEqual(['early', 'late']);
        expect(featured[0].placementId).toBe('early');
    });

    it('leaves out a card with no image or layout instead of rendering it broken', () => {
        const rows = [
            placement('a1', 'a1', 's-a1', 0, card('a1', 0, { featured_image: null })),
            placement('a2', 'a2', 's-a1', 1, card('a2', 1, { featured_layout: null })),
            placement('a3', 'a3', 's-a1', 2, card('a3', 2)),
        ];
        expect(buildPortfolio(categories, sections, rows, img).featured.map((f) => f.projectId)).toEqual(['a3']);
    });

    it('falls back to the project title and description for the card text', () => {
        const rows = [placement('p', 'p', 's-a1', 0, card('p', 0))];
        expect(buildPortfolio(categories, sections, rows, img).featured[0]).toMatchObject({ title: 'P', blurb: 'p desc', alt: 'P' });
    });
});
