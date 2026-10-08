export const THEME_COOKIE = 'theme';
export type Theme = 'light' | 'dark';

/**
 * Runs before first paint (first child of <body>) so the right theme class is on the
 * body without a flash. Reads the cookie client-side instead of on the server so pages
 * stay statically rendered and CDN-cacheable.
 */
export const themeInitScript = `(function(){try{var m=document.cookie.match(/(?:^|; )${THEME_COOKIE}=(light|dark)/);if(m&&m[1]==='light')document.body.classList.add('light-mode');}catch(e){}})();`;

export function writeThemeCookie(theme: Theme) {
  document.cookie = `${THEME_COOKIE}=${theme}; path=/; max-age=31536000; samesite=lax`;
}
