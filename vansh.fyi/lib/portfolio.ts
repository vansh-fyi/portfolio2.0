/**
 * Shape of the project data the public site renders, plus pure helpers. Client-safe: it imports
 * nothing from the server, because the data is passed to client components as props/context.
 */

export interface PortfolioPlacement {
    /** Route id: /projects/<id> */
    id: string;
    /** The project behind this listing (Ursa's scope and the shared content) */
    projectId: string;
    title: string;
    subtitle: string;
    /** Longer description, used for page metadata */
    description: string;
    url: string;
    isNda: boolean;
    /** Sanitised SVG markup, or null */
    logoSvg: string | null;
}

export interface PortfolioSection {
    id: string;
    title: string;
    placements: PortfolioPlacement[];
}

export interface PortfolioCategory {
    id: string;
    name: string;
    iconSvg: string | null;
    sections: PortfolioSection[];
}

export type FeaturedLayout = 'hero' | 'tall' | 'standard';

export interface FeaturedCard {
    projectId: string;
    /** Placement the card opens */
    placementId: string;
    title: string;
    blurb: string;
    alt: string;
    image: string;
    layout: FeaturedLayout;
}

export interface PortfolioData {
    categories: PortfolioCategory[];
    featured: FeaturedCard[];
}

export const EMPTY_PORTFOLIO: PortfolioData = { categories: [], featured: [] };

export function allPlacements(data: PortfolioData): PortfolioPlacement[] {
    return data.categories.flatMap((c) => c.sections.flatMap((s) => s.placements));
}

export function findPlacement(data: PortfolioData, id: string | undefined): PortfolioPlacement | undefined {
    return id ? allPlacements(data).find((p) => p.id === id) : undefined;
}

/** The project a route id belongs to; unknown ids map to themselves so scoping still works. */
export function projectIdFor(data: PortfolioData, placementId: string | undefined): string | undefined {
    return findPlacement(data, placementId)?.projectId ?? placementId;
}

/** Display name for chat greetings. */
export function projectNameFor(data: PortfolioData, placementId: string | undefined): string | undefined {
    return findPlacement(data, placementId)?.title;
}

/** Where "See all projects" starts: the first listing. */
export function firstPlacementId(data: PortfolioData): string | undefined {
    return allPlacements(data)[0]?.id;
}

/** Tailwind classes for each featured card layout. Layouts are a small fixed set, never stored as CSS. */
export const FEATURED_CARD_CLASS: Record<FeaturedLayout, string> = {
    hero: 'md:col-span-2 lg:row-span-2',
    tall: 'aspect-auto lg:row-span-2 md:row-span-3 xs:row-span-1',
    standard: 'aspect-[4/3]',
};
