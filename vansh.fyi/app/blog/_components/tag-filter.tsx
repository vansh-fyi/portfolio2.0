import Link from 'next/link';

const chip = 'inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium font-geist ring-1 backdrop-blur-sm transition active:scale-95';

export default function TagFilter({ tags, active }: { tags: { tag: string; count: number }[]; active?: string }) {
  if (!tags.length) return null;
  return (
    <nav aria-label="Filter by tag" className="mb-10 flex flex-wrap gap-2">
      <Link href="/blog" className={`${chip} ${!active ? 'bg-white/15 text-white ring-white/20' : 'bg-white/5 text-white/80 ring-white/10 hover:bg-white/10 hover:ring-white/20'}`}>
        All
      </Link>
      {tags.map(({ tag, count }) => (
        <Link
          key={tag}
          href={`/blog/tag/${encodeURIComponent(tag)}`}
          className={`${chip} ${active === tag ? 'bg-white/15 text-white ring-white/20' : 'bg-white/5 text-white/80 ring-white/10 hover:bg-white/10 hover:ring-white/20'}`}
        >
          {tag}
          <span className="text-white/50">{count}</span>
        </Link>
      ))}
    </nav>
  );
}
