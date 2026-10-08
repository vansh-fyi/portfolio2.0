import type { Heading } from '@/server/blog/markdown';

export default function Toc({ headings }: { headings: Heading[] }) {
  if (headings.length < 3) return null;
  return (
    <nav aria-label="Table of contents" className="my-10 rounded-2xl bg-black/30 p-6 ring-1 ring-white/10 backdrop-blur-lg">
      <p className="mb-3 text-sm font-medium font-geist text-white/50">On this page</p>
      <ol className="space-y-1.5 text-sm">
        {headings.map((h) => (
          <li key={h.id} className={h.depth === 3 ? 'pl-4' : undefined}>
            <a href={`#${h.id}`} className="text-white/80 transition hover:text-white">
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
