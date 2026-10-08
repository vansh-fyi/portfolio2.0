import { ImageResponse } from 'next/og';
import { formatDate } from '@/lib/format';
import { getPublishedPost } from '@/server/blog/queries';

export const alt = 'Blog post';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const revalidate = 3600;

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const post = await getPublishedPost((await params).slug);
  const title = post?.title ?? 'Writing';
  const meta = [post ? formatDate(post.published_at) : '', post?.tags.slice(0, 3).join(' · ') ?? ''].filter(Boolean).join('   ·   ');

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 72, background: 'linear-gradient(135deg, #000000 0%, #0d0716 55%, #1f0f2e 100%)', color: '#ffffff' }}>
        <div style={{ display: 'flex', fontSize: 32, color: 'rgba(255,255,255,0.7)' }}>Vansh Grover</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <div style={{ display: 'flex', fontSize: title.length > 70 ? 56 : 72, lineHeight: 1.1, letterSpacing: -2, fontWeight: 300 }}>{title}</div>
          {meta && <div style={{ display: 'flex', fontSize: 28, color: '#c4a1ff' }}>{meta}</div>}
        </div>
      </div>
    ),
    size,
  );
}
