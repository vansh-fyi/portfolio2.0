import { formatDate } from '@/lib/format';

/**
 * Whether Ursa (the AI assistant) knows this post. Indexing runs in the background after publish and
 * edit, so a just-published post briefly shows "indexing".
 */
export default function UrsaStatus({ indexedAt, error, compact = false }: { indexedAt: string | null; error: string | null; compact?: boolean }) {
  const tone = error ? 'bg-red-500/10 text-red-300 ring-red-400/30' : indexedAt ? 'bg-sky-500/10 text-sky-300 ring-sky-500/30' : 'bg-white/10 text-white/80 ring-white/10';
  const label = error ? 'Ursa: failed' : indexedAt ? 'Ursa knows this' : 'Ursa: indexing…';
  return (
    <span title={error ?? (indexedAt ? `Indexed ${formatDate(indexedAt)}` : 'Ursa will know this post within a minute')} className={`rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${tone}`}>
      {compact ? label : error ? `${label}: ${error}` : indexedAt ? `${label} (indexed ${formatDate(indexedAt)})` : label}
    </span>
  );
}
