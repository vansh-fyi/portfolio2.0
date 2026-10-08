'use client';

import { useRef, useState, useTransition } from 'react';
import { createUploadAction, deleteMediaAction, finalizeUploadAction, updateMediaAltAction } from '../../media-actions';
import { ALLOWED_UPLOAD_TYPES, MAX_UPLOAD_BYTES } from '@/server/media/upload';
import type { MediaItem } from '@/server/media/admin';

const button = 'rounded-full px-3 py-1.5 text-xs font-medium transition active:scale-95 disabled:opacity-50';
const secondary = `${button} bg-white/10 text-white ring-1 ring-white/10 hover:bg-white/15`;
const input = 'w-full rounded-xl bg-white/5 px-3 py-2 text-sm text-white ring-1 ring-white/10 outline-none transition placeholder:text-white/30 focus:ring-white/30';

const ACCEPT = Object.keys(ALLOWED_UPLOAD_TYPES).join(',');

/** `![alt](media:<id>)`: the form images take inside a post. Brackets in the alt text would break the syntax. */
export const markdownFor = (item: Pick<MediaItem, 'id' | 'alt'>) => `![${item.alt.replace(/[[\]]/g, '')}](media:${item.id})`;

const kb = (bytes: number) => (bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`);

type Setter = React.Dispatch<React.SetStateAction<MediaItem[]>>;

/**
 * Upload form + image grid. Used on the Media page (manage mode) and inside the editor's picker
 * (pick mode: clicking an image chooses it, and a fresh upload is chosen automatically).
 */
export default function MediaPanel({ items, setItems, onPick }: { items: MediaItem[]; setItems: Setter; onPick?: (item: MediaItem) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [alt, setAlt] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const previewUrl = useRef<string | null>(null);

  const choose = (next: File | null) => {
    setError(null);
    if (previewUrl.current) URL.revokeObjectURL(previewUrl.current);
    previewUrl.current = null;
    setAlt(''); // alt text describes one specific image; never carry it over to the next file
    if (!next) return setFile(null);
    if (!(next.type in ALLOWED_UPLOAD_TYPES)) {
      setFile(null);
      return setError(next.type === 'image/svg+xml' ? 'SVG files are not accepted. Export a PNG or WebP instead.' : 'Use a JPEG, PNG, WebP, AVIF or GIF image.');
    }
    if (next.size > MAX_UPLOAD_BYTES) {
      setFile(null);
      return setError(`That file is ${(next.size / 1024 / 1024).toFixed(1)} MB. The limit is ${MAX_UPLOAD_BYTES / 1024 / 1024} MB.`);
    }
    previewUrl.current = URL.createObjectURL(next);
    setFile(next);
  };

  const upload = async () => {
    if (!file || busy) return;
    if (!alt.trim()) return setError('Describe the image in a few words (alt text is required).');
    setBusy(true);
    setError(null);
    try {
      setStatus('Preparing…');
      const created = await createUploadAction({ mime: file.type, bytes: file.size });
      if (!created.ok) throw new Error(created.error);

      setStatus('Uploading…');
      const put = await fetch(created.signedUrl, { method: 'PUT', headers: { 'content-type': file.type, 'x-upsert': 'false' }, body: file });
      if (!put.ok) throw new Error('The upload failed. Check your connection and try again.');

      setStatus('Processing (resizing, removing metadata)…');
      const done = await finalizeUploadAction({ path: created.path, alt: alt.trim(), originalName: file.name });
      if (!done.ok) throw new Error(done.error);

      setItems((current) => [done.item, ...current.filter((i) => i.id !== done.item.id)]);
      choose(null);
      setAlt('');
      if (fileInput.current) fileInput.current.value = '';
      onPick?.(done.item);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed.');
    } finally {
      setBusy(false);
      setStatus(null);
    }
  };

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          choose(e.dataTransfer.files[0] ?? null);
        }}
        className={`mb-8 rounded-2xl border border-dashed p-5 transition ${dragging ? 'border-white/60 bg-white/10' : 'border-white/20 bg-black/30'}`}
      >
        {!file ? (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-white/80">
              Drop an image here, or choose one. <span className="text-white/50">JPEG, PNG, WebP, AVIF or GIF, up to 10 MB. Location data is removed automatically.</span>
            </p>
            <button type="button" onClick={() => fileInput.current?.click()} className={secondary}>
              Choose image
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4 sm:flex-row">
            {/* eslint-disable-next-line @next/next/no-img-element -- local preview */}
            <img src={previewUrl.current ?? undefined} alt="" className="h-28 w-40 flex-none rounded-xl object-cover ring-1 ring-white/10" />
            <div className="min-w-0 flex-1 space-y-3">
              <p className="truncate text-sm text-white/80">
                {file.name} <span className="text-white/50">({kb(file.size)})</span>
              </p>
              <input value={alt} onChange={(e) => setAlt(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && upload()} placeholder="Alt text: describe the image for people who can't see it" aria-label="Alt text" maxLength={300} autoFocus className={input} />
              <div className="flex flex-wrap items-center gap-2">
                <button type="button" onClick={upload} disabled={busy} className={`${button} bg-white text-black/80 hover:bg-white/80`}>
                  {busy ? 'Working…' : 'Upload'}
                </button>
                <button type="button" onClick={() => choose(null)} disabled={busy} className={secondary}>
                  Cancel
                </button>
                {status && <span className="text-xs text-white/50">{status}</span>}
              </div>
            </div>
          </div>
        )}
        <input ref={fileInput} type="file" accept={ACCEPT} className="hidden" onChange={(e) => choose(e.target.files?.[0] ?? null)} />
        {error && (
          <p role="alert" className="mt-3 text-sm text-red-300">
            {error}
          </p>
        )}
      </div>

      {items.length === 0 ? (
        <p className="rounded-2xl bg-black/30 p-8 text-center text-white/50 ring-1 ring-white/10">No images yet.</p>
      ) : (
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <MediaCard key={item.id} item={item} setItems={setItems} onPick={onPick} />
          ))}
        </ul>
      )}
    </div>
  );
}

function MediaCard({ item, setItems, onPick }: { item: MediaItem; setItems: Setter; onPick?: (item: MediaItem) => void }) {
  const [editing, setEditing] = useState(false);
  const [alt, setAlt] = useState(item.alt);
  const [message, setMessage] = useState<string | null>(null);
  const [confirm, setConfirm] = useState(false);
  const [pending, startTransition] = useTransition();
  const used = item.usedBy.length > 0;

  const saveAlt = () =>
    startTransition(async () => {
      const result = await updateMediaAltAction({ id: item.id, alt });
      if (!result.ok) return setMessage(result.error);
      setItems((all) => all.map((i) => (i.id === item.id ? { ...i, alt: alt.trim() } : i)));
      setEditing(false);
      setMessage(null);
    });

  const remove = () => {
    if (!confirm) {
      setConfirm(true);
      window.setTimeout(() => setConfirm(false), 4000);
      return;
    }
    startTransition(async () => {
      const result = await deleteMediaAction(item.id);
      if (!result.ok) return setMessage(result.error);
      setItems((all) => all.filter((i) => i.id !== item.id));
    });
  };

  const copy = async () => {
    await navigator.clipboard.writeText(markdownFor(item));
    setMessage('Markdown copied.');
    window.setTimeout(() => setMessage(null), 2000);
  };

  return (
    <li className="flex flex-col overflow-hidden rounded-2xl bg-black/30 ring-1 ring-white/10 backdrop-blur-lg">
      <button type="button" onClick={() => onPick?.(item)} disabled={!onPick} aria-label={onPick ? `Use image: ${item.alt}` : undefined} className={`block aspect-[4/3] overflow-hidden bg-white/5 ${onPick ? 'cursor-pointer transition hover:opacity-80' : 'cursor-default'}`}>
        {/* eslint-disable-next-line @next/next/no-img-element -- Supabase Storage variant */}
        <img src={item.thumbUrl} alt={item.alt} width={item.width} height={item.height} loading="lazy" className="h-full w-full object-cover" />
      </button>
      <div className="flex flex-1 flex-col gap-2 p-3 text-xs">
        {editing ? (
          <div className="space-y-2">
            <input value={alt} onChange={(e) => setAlt(e.target.value)} aria-label="Alt text" maxLength={300} className={input} />
            <div className="flex gap-2">
              <button type="button" onClick={saveAlt} disabled={pending} className={`${button} bg-white text-black/80`}>
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  setAlt(item.alt);
                  setMessage(null);
                }}
                className={secondary}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="line-clamp-2 text-white/80" title={item.alt}>
            {item.alt}
          </p>
        )}
        <p className="text-white/50">
          {item.width}×{item.height} · {kb(item.bytes)}
          {item.originalName ? ` · ${item.originalName}` : ''}
        </p>
        {used && <p className="text-white/50">Used in: {item.usedBy.map((p) => p.title).join(', ')}</p>}
        {message && (
          <p role="status" className="text-amber-300">
            {message}
          </p>
        )}
        {!onPick && (
          <div className="mt-auto flex flex-wrap gap-2 pt-1">
            <button type="button" onClick={copy} className={secondary}>
              Copy Markdown
            </button>
            <button type="button" onClick={() => setEditing(true)} disabled={editing} className={secondary}>
              Edit alt
            </button>
            <button type="button" onClick={remove} disabled={pending || used} title={used ? 'Remove it from its posts first' : undefined} className={`${button} ${confirm ? 'bg-red-500 text-white' : 'bg-white/5 text-red-300 ring-1 ring-red-400/30 hover:bg-red-500/10'}`}>
              {confirm ? 'Click again' : 'Delete'}
            </button>
          </div>
        )}
      </div>
    </li>
  );
}
