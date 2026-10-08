import Link from 'next/link';
import { formatDate } from '@/lib/format';
import { bestUrl, srcSet } from '@/server/blog/media-url';
import type { PostWithCover } from '@/server/blog/types';

export default function PostCard({ post }: { post: PostWithCover }) {
  const { cover } = post;
  return (
    <article className="group relative overflow-hidden rounded-2xl bg-black/30 ring-1 ring-white/10 backdrop-blur-lg transition-all duration-500 hover:-translate-y-1 hover:ring-white/20">
      {cover && (
        <div className="aspect-[16/9] overflow-hidden bg-white/5" style={cover.blur_data_url ? { backgroundImage: `url(${cover.blur_data_url})`, backgroundSize: 'cover' } : undefined}>
          {/* eslint-disable-next-line @next/next/no-img-element -- pre-generated variants from Supabase Storage */}
          <img
            src={bestUrl(cover, 960)}
            srcSet={srcSet(cover)}
            sizes="(min-width: 768px) 720px, 100vw"
            alt={cover.alt}
            width={cover.width}
            height={cover.height}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
          />
        </div>
      )}
      <div className="p-6">
        <p className="text-xs font-medium text-white/50 font-geist">
          {formatDate(post.published_at)}
          {post.reading_minutes ? ` · ${post.reading_minutes} min read` : ''}
        </p>
        <h2 className="mt-2 text-2xl font-light tracking-tighter font-geist text-white">
          <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0">
            {post.title}
          </Link>
        </h2>
        {post.excerpt && <p className="mt-3 leading-relaxed text-white/80">{post.excerpt}</p>}
        {post.tags.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <li key={tag} className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/80 ring-1 ring-white/10">
                {tag}
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
