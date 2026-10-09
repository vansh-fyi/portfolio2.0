/**
 * The admin's arrangement board: categories contain sections, sections contain listings
 * (placements). Everything here is pure and immutable so the drag-and-drop UI can be tested
 * without a browser. Ids are the database ids; the UI prefixes them for dnd-kit.
 */

export interface BoardPlacement {
    id: string;
    projectId: string;
    title: string;
    /** The project is a draft: the listing exists but is not shown on the site */
    hidden: boolean;
}
export interface BoardSection {
    id: string;
    title: string;
    placements: BoardPlacement[];
}
export interface BoardCategory {
    id: string;
    name: string;
    iconSvg: string | null;
    sections: BoardSection[];
}
export interface Board {
    categories: BoardCategory[];
}

/** What gets saved: order is the array order. */
export interface OrderPayload {
    categories: string[];
    sections: { id: string; categoryId: string }[];
    placements: { id: string; sectionId: string }[];
    /** Project ids of the home-page cards, in display order */
    featured: string[];
}

export function arrayMove<T>(list: readonly T[], from: number, to: number): T[] {
    const copy = [...list];
    if (from < 0 || from >= copy.length) return copy;
    const [item] = copy.splice(from, 1);
    copy.splice(Math.max(0, Math.min(to, copy.length)), 0, item);
    return copy;
}

export const sectionOfPlacement = (board: Board, placementId: string): BoardSection | undefined =>
    board.categories.flatMap((c) => c.sections).find((s) => s.placements.some((p) => p.id === placementId));

export const categoryOfSection = (board: Board, sectionId: string): BoardCategory | undefined =>
    board.categories.find((c) => c.sections.some((s) => s.id === sectionId));

/** Move a listing into `toSectionId` at `toIndex` (clamped). Works within and across sections. */
export function movePlacement(board: Board, placementId: string, toSectionId: string, toIndex: number): Board {
    const source = sectionOfPlacement(board, placementId);
    const placement = source?.placements.find((p) => p.id === placementId);
    if (!source || !placement) return board;
    if (!board.categories.some((c) => c.sections.some((s) => s.id === toSectionId))) return board;

    return {
        categories: board.categories.map((c) => ({
            ...c,
            sections: c.sections.map((s) => {
                let list = s.placements;
                if (s.id === source.id) list = list.filter((p) => p.id !== placementId);
                if (s.id === toSectionId) {
                    const clamped = Math.max(0, Math.min(toIndex, list.length));
                    list = [...list.slice(0, clamped), placement, ...list.slice(clamped)];
                }
                return list === s.placements ? s : { ...s, placements: list };
            }),
        })),
    };
}

/** Move a section to `toIndex` within its category, or into another category. */
export function moveSection(board: Board, sectionId: string, toCategoryId: string, toIndex: number): Board {
    const from = categoryOfSection(board, sectionId);
    const section = from?.sections.find((s) => s.id === sectionId);
    if (!from || !section || !board.categories.some((c) => c.id === toCategoryId)) return board;

    return {
        categories: board.categories.map((c) => {
            let list = c.sections;
            if (c.id === from.id) list = list.filter((s) => s.id !== sectionId);
            if (c.id === toCategoryId) {
                const clamped = Math.max(0, Math.min(toIndex, list.length));
                list = [...list.slice(0, clamped), section, ...list.slice(clamped)];
            }
            return list === c.sections ? c : { ...c, sections: list };
        }),
    };
}

export function moveCategory(board: Board, categoryId: string, toIndex: number): Board {
    const from = board.categories.findIndex((c) => c.id === categoryId);
    return from === -1 ? board : { categories: arrayMove(board.categories, from, toIndex) };
}

export function toOrderPayload(board: Board, featured: readonly string[]): OrderPayload {
    return {
        categories: board.categories.map((c) => c.id),
        sections: board.categories.flatMap((c) => c.sections.map((s) => ({ id: s.id, categoryId: c.id }))),
        placements: board.categories.flatMap((c) => c.sections.flatMap((s) => s.placements.map((p) => ({ id: p.id, sectionId: s.id })))),
        featured: [...featured],
    };
}

/** Sections a listing can be moved to, as "Category › Section" labels (the keyboard/touch fallback to dragging). */
export function sectionOptions(board: Board): { id: string; label: string }[] {
    return board.categories.flatMap((c) => c.sections.map((s) => ({ id: s.id, label: `${c.name} › ${s.title}` })));
}
