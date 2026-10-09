import { arrayMove, movePlacement, moveSection, moveCategory, toOrderPayload, sectionOptions, type Board } from '../board';

const p = (id: string) => ({ id, projectId: id, title: id, hidden: false });
const board = (): Board => ({
    categories: [
        { id: 'c1', name: 'One', iconSvg: null, sections: [
            { id: 's1', title: 'S1', placements: [p('a'), p('b'), p('c')] },
            { id: 's2', title: 'S2', placements: [] },
        ] },
        { id: 'c2', name: 'Two', iconSvg: null, sections: [{ id: 's3', title: 'S3', placements: [p('d')] }] },
    ],
});
const ids = (b: Board, section: string) => b.categories.flatMap((c) => c.sections).find((s) => s.id === section)!.placements.map((x) => x.id);

describe('arrayMove', () => {
    it('moves and clamps', () => {
        expect(arrayMove([1, 2, 3], 0, 2)).toEqual([2, 3, 1]);
        expect(arrayMove([1, 2, 3], 2, 99)).toEqual([1, 2, 3]);
        expect(arrayMove([1, 2, 3], 1, -5)).toEqual([2, 1, 3]);
        expect(arrayMove([1, 2, 3], 9, 0)).toEqual([1, 2, 3]);
    });
});

describe('movePlacement', () => {
    it('reorders within a section', () => expect(ids(movePlacement(board(), 'a', 's1', 2), 's1')).toEqual(['b', 'c', 'a']));
    it('moves into an empty section', () => {
        const b = movePlacement(board(), 'b', 's2', 0);
        expect(ids(b, 's1')).toEqual(['a', 'c']);
        expect(ids(b, 's2')).toEqual(['b']);
    });
    it('moves across categories at an index', () => {
        const b = movePlacement(board(), 'a', 's3', 0);
        expect(ids(b, 's3')).toEqual(['a', 'd']);
        expect(ids(b, 's1')).toEqual(['b', 'c']);
    });
    it('never loses or duplicates a listing', () => {
        const b = movePlacement(movePlacement(board(), 'c', 's3', 1), 'd', 's1', 0);
        const all = b.categories.flatMap((c) => c.sections.flatMap((s) => s.placements.map((x) => x.id))).sort();
        expect(all).toEqual(['a', 'b', 'c', 'd']);
    });
    it('ignores unknown listings and sections, returning the same board', () => {
        const b = board();
        expect(movePlacement(b, 'nope', 's1', 0)).toBe(b);
        expect(movePlacement(b, 'a', 'nope', 0)).toBe(b);
    });
    it('does not mutate its input', () => {
        const b = board();
        const snapshot = JSON.stringify(b);
        movePlacement(b, 'a', 's3', 0);
        expect(JSON.stringify(b)).toBe(snapshot);
    });
});

describe('moveSection / moveCategory', () => {
    it('reorders sections within a category', () => {
        expect(moveSection(board(), 's2', 'c1', 0).categories[0].sections.map((s) => s.id)).toEqual(['s2', 's1']);
    });
    it('moves a section, with its listings, to another category', () => {
        const b = moveSection(board(), 's1', 'c2', 1);
        expect(b.categories[0].sections.map((s) => s.id)).toEqual(['s2']);
        expect(b.categories[1].sections.map((s) => s.id)).toEqual(['s3', 's1']);
        expect(ids(b, 's1')).toEqual(['a', 'b', 'c']);
    });
    it('reorders categories', () => expect(moveCategory(board(), 'c2', 0).categories.map((c) => c.id)).toEqual(['c2', 'c1']));
});

describe('toOrderPayload', () => {
    it('flattens the board in display order', () => {
        const payload = toOrderPayload(movePlacement(board(), 'a', 's2', 0), ['x', 'y']);
        expect(payload.categories).toEqual(['c1', 'c2']);
        expect(payload.sections).toEqual([{ id: 's1', categoryId: 'c1' }, { id: 's2', categoryId: 'c1' }, { id: 's3', categoryId: 'c2' }]);
        expect(payload.placements).toEqual([
            { id: 'b', sectionId: 's1' }, { id: 'c', sectionId: 's1' }, { id: 'a', sectionId: 's2' }, { id: 'd', sectionId: 's3' },
        ]);
        expect(payload.featured).toEqual(['x', 'y']);
    });
    it('lists section options with category names', () => expect(sectionOptions(board())[2]).toEqual({ id: 's3', label: 'Two › S3' }));
});
