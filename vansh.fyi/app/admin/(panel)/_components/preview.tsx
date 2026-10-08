'use client';

import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { proseComponents } from '@/app/blog/_components/prose';

/**
 * Editor preview. Close to the public page (same typography), but runs in the browser, so code is not
 * syntax-highlighted and uploaded images show as placeholders until the post is published.
 */
export default function Preview({ markdown }: { markdown: string }) {
  if (!markdown.trim()) return <p className="text-sm text-white/30">Nothing to preview yet.</p>;
  return (
    <Markdown
      remarkPlugins={[remarkGfm]}
      urlTransform={(url) => (url.startsWith('media:') || /^(https?:|mailto:|#|\/)/.test(url) ? url : '')}
      components={{
        ...proseComponents,
        img: ({ src, alt }) => {
          if (typeof src === 'string' && src.startsWith('media:')) {
            return <span className="my-6 block rounded-xl bg-white/5 p-6 text-center text-sm text-white/50 ring-1 ring-white/10">Image: {alt || 'uploaded image'}</span>;
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
