'use client';

import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { proseComponents } from '@/app/blog/_components/prose';
import { mediaIdFromSrc } from '@/server/blog/markdown';
import type { MediaItem } from '@/server/media/admin';

/**
 * Editor preview. Close to the public page (same typography), but runs in the browser, so code is not
 * syntax-highlighted.
 */
export default function Preview({ markdown, media }: { markdown: string; media: Map<string, MediaItem> }) {
  if (!markdown.trim()) return <p className="text-sm text-white/30">Nothing to preview yet.</p>;
  return (
    <Markdown
      remarkPlugins={[remarkGfm]}
      urlTransform={(url) => (url.startsWith('media:') || /^(https?:|mailto:|#|\/)/.test(url) ? url : '')}
      components={{
        ...proseComponents,
        img: ({ src, alt }) => {
          if (typeof src === 'string' && src.startsWith('media:')) {
            const item = media.get(mediaIdFromSrc(src) ?? '');
            if (!item) return <span className="my-6 block rounded-xl bg-red-500/10 p-6 text-center text-sm text-red-300 ring-1 ring-red-400/30">Missing image (deleted or wrong id)</span>;
            // eslint-disable-next-line @next/next/no-img-element
            return <img src={item.fullUrl} alt={alt || item.alt} width={item.width} height={item.height} className="my-6 h-auto w-full rounded-2xl ring-1 ring-white/10" />;
          }
          if (typeof src === 'string' && src.startsWith('https://')) {
            // eslint-disable-next-line @next/next/no-img-element
            return <img src={src} alt={alt ?? ''} className="my-6 h-auto w-full rounded-2xl ring-1 ring-white/10" />;
          }
          return null;
        },
      }}
    >
      {markdown}
    </Markdown>
  );
}
