'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { deletePostAction, reindexPostAction, savePostAction, setPublishedAction } from '../../actions';
import { normalizeTags } from '@/server/blog/post-input';
import { slugify } from '@/server/blog/markdown';
import type { MediaItem } from '@/server/media/admin';
import MediaPicker from './media-picker';
import { markdownFor } from './media-panel';
import Preview from './preview';
import UrsaStatus from './ursa-status';

export interface EditablePost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body_md: string;
  /** Comma-separated for editing */
  tags: string;
  seo_title: string;
  seo_description: string;
  cover_media_id: string | null;
  status: 'draft' | 'published';
  published_at: string | null;
  updated_at: string;
  ursa_indexed_at: string | null;
  ursa_error: string | null;
}

type Fields = Pick<EditablePost, 'title' | 'slug' | 'excerpt' | 'body_md' | 'tags' | 'seo_title' | 'seo_description' | 'cover_media_id'>;

const EMPTY: Fields = { title: '', slug: '', excerpt: '', body_md: '', tags: '', seo_title: '', seo_description: '', cover_media_id: null };

const input = 'w-full rounded-xl bg-white/5 px-4 py-2.5 text-white ring-1 ring-white/10 outline-none transition placeholder:text-white/30 focus:ring-white/30';
const button = 'rounded-full px-4 py-2 text-sm font-medium transition active:scale-95 disabled:opacity-50';
const secondary = `${button} bg-white/10 text-white ring-1 ring-white/10 hover:bg-white/15`;
const primary = `${button} bg-white text-black/80 hover:bg-white/80`;

const pick = (post: EditablePost | null): Fields =>
  post ? { title: post.title, slug: post.slug, excerpt: post.excerpt, body_md: post.body_md, tags: post.tags, seo_title: post.seo_title, seo_description: post.seo_description, cover_media_id: post.cover_media_id } : EMPTY;

export default function PostEditor({ initial, media: initialMedia }: { initial: EditablePost | null; media: MediaItem[] }) {
  const router = useRouter();
  const [fields, setFields] = useState<Fields>(pick(initial));
  const [saved, setSaved] = useState<Fields>(pick(initial));
  const [id, setId] = useState<string | null>(initial?.id ?? null);
  const [status, setStatus] = useState<'draft' | 'published'>(initial?.status ?? 'draft');
  const [slugTouched, setSlugTouched] = useState(!!initial);
  const [message, setMessage] = useState<{ kind: 'ok' | 'error'; text: string; field?: string } | null>(null);
  const [view, setView] = useState<'write' | 'preview'>('write');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [ursa, setUrsa] = useState<{ indexedAt: string | null; error: string | null }>({ indexedAt: initial?.ursa_indexed_at ?? null, error: initial?.ursa_error ?? null });
  const [pending, startTransition] = useTransition();
  const previewText = useDeferredValue(fields.body_md);
  const [media, setMedia] = useState(initialMedia);
  const mediaById = useMemo(() => new Map(media.map((m) => [m.id, m])), [media]);
  const [picker, setPicker] = useState<'insert' | 'cover' | null>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const cover = fields.cover_media_id ? mediaById.get(fields.cover_media_id) : undefined;

  const dirty = JSON.stringify(fields) !== JSON.stringify(saved);
  const set = <K extends keyof Fields>(key: K, value: Fields[K]) => {
    setFields((f) => ({ ...f, [key]: value }));
    setMessage(null);
  };

  const onTitle = (title: string) => {
    setFields((f) => ({ ...f, title, ...(slugTouched ? {} : { slug: slugify(title) }) }));
    setMessage(null);
  };

  /** Saves; resolves true when the post is stored (so publish can continue). */
  const save = useCallback(async (): Promise<boolean> => {
    const result = await savePostAction({ id, ...fields });
    if (!result.ok) {
      setMessage({ kind: 'error', text: result.error, field: result.field });
      return false;
    }
    setSaved(fields);
    setMessage({ kind: 'ok', text: 'Saved.' });
    if (!id) {
      setId(result.id);
      router.replace(`/admin/posts/${result.id}`);
    }
    return true;
  }, [id, fields, router]);

  const onSave = () => startTransition(() => void save());

  const onPublish = (publish: boolean) =>
    startTransition(async () => {
      if (publish && (dirty || !id) && !(await save())) return;
      const target = id ?? (await savedId());
      if (!target) return;
      const result = await setPublishedAction(target, publish);
      if (!result.ok) return setMessage({ kind: 'error', text: result.error });
      setStatus(result.status);
      setUrsa({ indexedAt: null, error: null }); // the background job is running; Re-index shows the result
      setMessage({ kind: 'ok', text: publish ? 'Published. The site is updated.' : 'Moved back to drafts.' });
    });

  // After the first save of a new post the id state updates on the next render; read it from the URL-safe ref
  const idRef = useRef(id);
  useEffect(() => {
    idRef.current = id;
  }, [id]);
  const savedId = async () => idRef.current;

  const onReindex = () =>
    startTransition(async () => {
      if (!id) return;
      const result = await reindexPostAction(id);
      if (!result.ok) {
        setUrsa({ indexedAt: null, error: result.error });
        return setMessage({ kind: 'error', text: result.error });
      }
      setUrsa({ indexedAt: result.outcome === 'indexed' ? new Date().toISOString() : null, error: null });
      setMessage({ kind: 'ok', text: result.outcome === 'indexed' ? 'Ursa now knows the current version of this post.' : 'Removed from Ursa.' });
    });

  const onDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      window.setTimeout(() => setConfirmDelete(false), 4000);
      return;
    }
    if (!id) return;
    startTransition(async () => {
      const result = await deletePostAction(id); // redirects to /admin on success
      if (result && !result.ok) setMessage({ kind: 'error', text: result.error });
    });
  };

  // Cmd/Ctrl+S saves
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        if (!pending) onSave();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  // Warn before leaving with unsaved changes
  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [dirty]);

  const onPick = (item: MediaItem) => {
    if (picker === 'cover') {
      set('cover_media_id', item.id);
    } else {
      const el = bodyRef.current;
      const body = fields.body_md;
      const start = el?.selectionStart ?? body.length;
      const end = el?.selectionEnd ?? body.length;
      const before = body.slice(0, start);
      const after = body.slice(end);
      const insert = `${before && !before.endsWith('\n\n') ? (before.endsWith('\n') ? '\n' : '\n\n') : ''}${markdownFor(item)}${after.startsWith('\n') ? '' : '\n\n'}`;
      set('body_md', before + insert + after);
      window.requestAnimationFrame(() => {
        el?.focus();
        const caret = (before + insert).length;
        el?.setSelectionRange(caret, caret);
      });
    }
    setPicker(null);
  };

  const tagChips = normalizeTags(fields.tags);
  const fieldError = (name: string) => (message?.kind === 'error' && message.field === name ? 'ring-red-400/60' : '');

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link href="/admin" className="text-sm text-white/50 transition hover:text-white">
            ← Posts
          </Link>
          <span className={`rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${status === 'published' ? 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/30' : 'bg-white/10 text-white/80 ring-white/10'}`}>
            {status === 'published' ? 'Published' : 'Draft'}
          </span>
          {dirty && <span className="text-xs text-white/50">Unsaved changes</span>}
          {status === 'published' && id && <UrsaStatus indexedAt={ursa.indexedAt} error={ursa.error} />}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {status === 'published' && fields.slug && (
            <a href={`/blog/${fields.slug}`} target="_blank" rel="noopener noreferrer" className={secondary}>
              View live ↗
            </a>
          )}
          {status === 'published' && id && !dirty && (
            <button type="button" onClick={onReindex} disabled={pending} className={secondary} title="Make Ursa re-read this post now">
              Re-index
            </button>
          )}
          <button type="button" onClick={onSave} disabled={pending || (!dirty && !!id)} className={secondary}>
            {pending ? 'Working…' : 'Save'}
          </button>
          {status === 'draft' ? (
            <button type="button" onClick={() => onPublish(true)} disabled={pending} className={primary}>
              Publish
            </button>
          ) : (
            <>
              {dirty && (
                <button type="button" onClick={() => onPublish(true)} disabled={pending} className={primary}>
                  Save &amp; update live
                </button>
              )}
              <button type="button" onClick={() => onPublish(false)} disabled={pending} className={secondary}>
                Unpublish
              </button>
            </>
          )}
          {id && (
            <button type="button" onClick={onDelete} disabled={pending} className={`${button} ${confirmDelete ? 'bg-red-500 text-white' : 'bg-white/5 text-red-300 ring-1 ring-red-400/30 hover:bg-red-500/10'}`}>
              {confirmDelete ? 'Click again to delete' : 'Delete'}
            </button>
          )}
        </div>
      </div>

      {message && (
        <p role={message.kind === 'error' ? 'alert' : 'status'} className={`mb-6 rounded-xl px-4 py-3 text-sm ring-1 ${message.kind === 'error' ? 'bg-red-500/10 text-red-300 ring-red-400/30' : 'bg-emerald-500/10 text-emerald-300 ring-emerald-500/30'}`}>
          {message.text}
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <section className={view === 'preview' ? 'hidden lg:block' : ''} aria-label="Write">
          <input value={fields.title} onChange={(e) => onTitle(e.target.value)} placeholder="Title" aria-label="Title" className={`${input} mb-4 text-2xl font-light tracking-tighter font-geist ${fieldError('title')}`} />
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs text-white/50">Markdown</span>
            <button type="button" onClick={() => setPicker('insert')} className={secondary}>
              Insert image
            </button>
          </div>
          <textarea
            ref={bodyRef}
            value={fields.body_md}
            onChange={(e) => set('body_md', e.target.value)}
            placeholder="Write in Markdown…"
            aria-label="Body (Markdown)"
            spellCheck
            className={`${input} min-h-[60vh] resize-y font-mono text-sm leading-relaxed ${fieldError('body_md')}`}
          />
        </section>

        <section className={view === 'write' ? 'hidden lg:block' : ''} aria-label="Preview">
          <div className="min-h-[60vh] rounded-2xl bg-black/30 p-6 ring-1 ring-white/10 backdrop-blur-lg">
            <h2 className="mb-6 text-3xl font-light tracking-tighter font-geist text-white">{fields.title || 'Untitled'}</h2>
            <Preview markdown={previewText} media={mediaById} />
          </div>
        </section>
      </div>

      <div className="my-4 flex gap-2 lg:hidden">
        <button type="button" onClick={() => setView('write')} className={`${secondary} ${view === 'write' ? 'ring-white/40' : ''}`}>
          Write
        </button>
        <button type="button" onClick={() => setView('preview')} className={`${secondary} ${view === 'preview' ? 'ring-white/40' : ''}`}>
          Preview
        </button>
      </div>

      <section aria-label="Details" className="mt-8 grid gap-5 rounded-2xl bg-black/30 p-6 ring-1 ring-white/10 backdrop-blur-lg md:grid-cols-2">
        <label className="block md:col-span-2">
          <span className="mb-2 block text-sm text-white/50">URL slug — <code className="text-white/80">/blog/{fields.slug || '…'}</code></span>
          <input
            value={fields.slug}
            onChange={(e) => {
              setSlugTouched(true);
              set('slug', e.target.value);
            }}
            placeholder="my-post-title"
            className={`${input} ${fieldError('slug')}`}
          />
          {status === 'published' && initial && fields.slug !== initial.slug && (
            <span className="mt-2 block text-xs text-amber-300">This post is live. Changing the slug breaks existing links to it.</span>
          )}
        </label>
        <label className="block md:col-span-2">
          <span className="mb-2 block text-sm text-white/50">Excerpt <span className="text-white/30">({fields.excerpt.length}/300) — shown in lists and link previews</span></span>
          <textarea value={fields.excerpt} onChange={(e) => set('excerpt', e.target.value)} rows={2} maxLength={300} className={`${input} ${fieldError('excerpt')}`} />
        </label>
        <label className="block md:col-span-2">
          <span className="mb-2 block text-sm text-white/50">Tags — comma separated (up to 8)</span>
          <input value={fields.tags} onChange={(e) => set('tags', e.target.value)} placeholder="design, ai, notes" className={input} />
          {tagChips.length > 0 && (
            <span className="mt-2 flex flex-wrap gap-2">
              {tagChips.map((t) => (
                <span key={t} className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/80 ring-1 ring-white/10">
                  {t}
                </span>
              ))}
            </span>
          )}
        </label>
        <div className="md:col-span-2">
          <span className="mb-2 block text-sm text-white/50">Cover image <span className="text-white/30">(shown in lists and link previews)</span></span>
          <div className="flex flex-wrap items-center gap-4">
            {cover ? (
              // eslint-disable-next-line @next/next/no-img-element -- Supabase Storage variant
              <img src={cover.thumbUrl} alt={cover.alt} className="h-20 w-32 rounded-xl object-cover ring-1 ring-white/10" />
            ) : (
              <span className="flex h-20 w-32 items-center justify-center rounded-xl bg-white/5 text-xs text-white/30 ring-1 ring-white/10">No cover</span>
            )}
            <button type="button" onClick={() => setPicker('cover')} className={secondary}>
              {cover ? 'Change' : 'Choose cover'}
            </button>
            {cover && (
              <button type="button" onClick={() => set('cover_media_id', null)} className={secondary}>
                Remove
              </button>
            )}
          </div>
        </div>
        <label className="block">
          <span className="mb-2 block text-sm text-white/50">SEO title <span className="text-white/30">(optional, defaults to the title)</span></span>
          <input value={fields.seo_title} onChange={(e) => set('seo_title', e.target.value)} maxLength={120} className={input} />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm text-white/50">SEO description <span className="text-white/30">(optional, defaults to the excerpt)</span></span>
          <input value={fields.seo_description} onChange={(e) => set('seo_description', e.target.value)} maxLength={200} className={input} />
        </label>
      </section>
      {picker && <MediaPicker title={picker === 'cover' ? 'Choose a cover image' : 'Insert an image'} items={media} setItems={setMedia} onPick={onPick} onClose={() => setPicker(null)} />}
    </div>
  );
}
