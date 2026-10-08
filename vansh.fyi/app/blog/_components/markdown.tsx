import { MarkdownAsync, defaultUrlTransform } from 'react-markdown';
import rehypeShiki from '@shikijs/rehype';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import { mediaIdFromSrc } from '@/server/blog/markdown';
import { bestUrl, srcSet } from '@/server/blog/media-url';
import type { Media } from '@/server/blog/types';

type Components = NonNullable<React.ComponentProps<typeof MarkdownAsync>['components']>;

/**
 * Renders a post's Markdown on the server. Raw HTML in Markdown is NOT rendered (react-markdown's
 * default), `media:<id>` images are resolved to the pre-generated variants, and code is highlighted
 * with Shiki using CSS variables so it follows the site's light/dark switch.
 */
function createComponents(media: Map<string, Media>): Components {
  return {
    h2: ({ node: _node, ...props }) => <h2 className="mt-14 mb-4 scroll-mt-28 text-2xl font-light tracking-tighter font-geist text-white sm:text-3xl" {...props} />,
    h3: ({ node: _node, ...props }) => <h3 className="mt-10 mb-3 scroll-mt-28 text-xl font-medium tracking-tight font-geist text-white" {...props} />,
    h4: ({ node: _node, ...props }) => <h4 className="mt-8 mb-2 scroll-mt-28 text-lg font-medium font-geist text-white" {...props} />,
    p: ({ node: _node, ...props }) => <p className="my-5 leading-relaxed text-white/80" {...props} />,
    a: ({ node: _node, href, ...props }) => {
      const external = !!href && /^https?:\/\//.test(href);
      return <a href={href} className="text-white underline decoration-white/30 underline-offset-4 transition hover:decoration-white" {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...props} />;
    },
    ul: ({ node: _node, ...props }) => <ul className="my-5 list-disc space-y-2 pl-6 text-white/80 marker:text-white/30" {...props} />,
    ol: ({ node: _node, ...props }) => <ol className="my-5 list-decimal space-y-2 pl-6 text-white/80 marker:text-white/50" {...props} />,
    blockquote: ({ node: _node, ...props }) => <blockquote className="my-8 border-l-2 border-white/20 pl-5 italic text-white/80" {...props} />,
    hr: () => <hr className="my-12 border-white/10" />,
    table: ({ node: _node, ...props }) => (
      <div className="my-8 overflow-x-auto rounded-xl ring-1 ring-white/10">
        <table className="w-full text-left text-sm text-white/80" {...props} />
      </div>
    ),
    th: ({ node: _node, ...props }) => <th className="border-b border-white/10 bg-white/5 px-4 py-2 font-medium text-white" {...props} />,
    td: ({ node: _node, ...props }) => <td className="border-b border-white/5 px-4 py-2" {...props} />,
    pre: ({ node: _node, className, ...props }) => (
      <pre className={`${className ?? ''} my-6 overflow-x-auto rounded-xl bg-black/40 p-4 text-sm leading-relaxed ring-1 ring-white/10`} {...props} />
    ),
    code: ({ node: _node, className, ...props }) =>
      className ? <code className={className} {...props} /> : <code className="rounded bg-white/10 px-1.5 py-0.5 text-[0.9em] text-white" {...props} />,
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
