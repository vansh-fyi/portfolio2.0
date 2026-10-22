export const THEME_COOKIE = 'theme';
export type Theme = 'light' | 'dark';

/**
 * Runs before first paint (first child of <body>) so the right theme class is on the
 * body without a flash. Reads the cookie client-side instead of on the server so pages
 * stay statically rendered and CDN-cacheable.
 */
const heroSources = {
  dark: [publicImage('/images/hero_dark_focus.webp', 640).src, publicImage('/images/hero_dark_focus.webp', 1020).src],
  light: [publicImage('/images/hero_light_focus.webp', 640).src, publicImage('/images/hero_light_focus.webp', 1020).src],
};
export const themeInitScript = `(function(){try{var m=document.cookie.match(/(?:^|; )${THEME_COOKIE}=(light|dark)/);var light=!!(m&&m[1]==='light');if(light)document.body.classList.add('light-mode');if(location.pathname==='/'){var sources=${JSON.stringify(heroSources)};var l=document.createElement('link');l.rel='preload';l.as='image';l.fetchPriority='high';l.href=sources[light?'light':'dark'][innerWidth<768?0:1];document.head.appendChild(l);}}catch(e){}})();`;

export function writeThemeCookie(theme: Theme) {
  document.cookie = `${THEME_COOKIE}=${theme}; path=/; max-age=31536000; samesite=lax`;
}
import { publicImage } from './public-images';
