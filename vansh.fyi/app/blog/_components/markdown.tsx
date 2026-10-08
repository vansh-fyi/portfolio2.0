import { MarkdownAsync, defaultUrlTransform } from 'react-markdown';
import rehypeShiki from '@shikijs/rehype';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import { mediaIdFromSrc } from '@/server/blog/markdown';
import { bestUrl, srcSet } from '@/server/blog/media-url';
import type { Media } from '@/server/blog/types';
import { proseComponents } from './prose';

type Components = NonNullable<React.ComponentProps<typeof MarkdownAsync>['components']>;

/**
 * Renders a post's Markdown on the server. Raw HTML in Markdown is NOT rendered (react-markdown's
 * default), `media:<id>` images are resolved to the pre-generated variants, and code is highlighted
 * with Shiki using CSS variables so it follows the site's light/dark switch.
 */
function createComponents(media: Map<string, Media>): Components {
  return {
    ...proseComponents,
    img: ({ node: _node, src, alt }) => {
      const id = mediaIdFromSrc(typeof src === 'string' ? src : undefined);
      const item = id ? media.get(id) : undefined;
      if (item) {
        return (
          <span className="my-8 block overflow-hidden rounded-2xl ring-1 ring-white/10" style={item.blur_data_url ? { backgroundImage: `url(${item.blur_data_url})`, backgroundSize: 'cover' } : undefined}>
            {/* eslint-disable-next-line @next/next/no-img-element -- pre-generated variants from Supabase Storage */}
            <img src={bestUrl(item, 1280)} srcSet={srcSet(item)} sizes="(min-width: 768px) 720px, 100vw" alt={alt || item.alt} width={item.width} height={item.height} loading="lazy" decoding="async" className="h-auto w-full" />
          </span>
        );
      }
      // Unknown media id (deleted or not found): show nothing rather than a broken image
      if (typeof src === 'string' && src.startsWith('media:')) return null;
      // Ordinary https images are allowed; anything else (data:, javascript:) is dropped
      if (typeof src === 'string' && /^https:\/\//.test(src)) {
        // eslint-disable-next-line @next/next/no-img-element
        return <img src={src} alt={alt ?? ''} loading="lazy" decoding="async" className="my-8 h-auto w-full rounded-2xl ring-1 ring-white/10" />;
      }
      return null;
    },
  };
}

export default function PostMarkdown({ markdown, media }: { markdown: string; media: Map<string, Media> }) {
  return (
    <MarkdownAsync
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeSlug, [rehypeShiki, { themes: { light: 'github-light', dark: 'github-dark' }, defaultColor: false, fallbackLanguage: 'text' }]]}
      urlTransform={(url) => (url.startsWith('media:') ? url : defaultUrlTransform(url))}
      components={createComponents(media)}
    >
      {markdown}
    </MarkdownAsync>
  );
}
