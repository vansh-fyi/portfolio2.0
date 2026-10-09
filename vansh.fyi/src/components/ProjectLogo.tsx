import React from 'react';

// Shown when a project or category has no logo of its own
const DEFAULT_PROJECT_LOGO =
  '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M10.2241 11.9917H13.7759L13.7593 6.66943C10.9046 6.66943 10.2241 8.79171 10.2241 10.6819V11.9917ZM11.1535 4H20V20H13.7759V14.6611H10.2241V20H4V11.4446C4 6.13886 7.56846 4 11.1535 4Z"></path></svg>';
const DEFAULT_CATEGORY_ICON =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"></rect><rect width="7" height="5" x="14" y="3" rx="1"></rect><rect width="7" height="9" x="14" y="12" rx="1"></rect><rect width="7" height="5" x="3" y="16" rx="1"></rect></svg>';

/**
 * Renders a stored logo. The markup was sanitised on the way into the database (server/projects/svg.ts)
 * and is only ever rendered from there; size comes from this wrapper, never from the stored SVG.
 */
export const ProjectLogo: React.FC<{ svg: string | null }> = ({ svg }) => (
  <span
    aria-hidden="true"
    className="inline-flex w-4 h-6 flex-shrink-0 items-center justify-center [&>svg]:w-full [&>svg]:h-full"
    dangerouslySetInnerHTML={{ __html: svg || DEFAULT_PROJECT_LOGO }}
  />
);

export const CategoryIcon: React.FC<{ svg: string | null }> = ({ svg }) => (
  <span
    aria-hidden="true"
    className="inline-flex w-4 h-4 flex-shrink-0 [&>svg]:w-full [&>svg]:h-full"
    dangerouslySetInnerHTML={{ __html: svg || DEFAULT_CATEGORY_ICON }}
  />
);
