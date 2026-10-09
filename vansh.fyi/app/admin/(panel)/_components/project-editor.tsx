'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState, useTransition } from 'react';
import {
  deletePlacementAction, deleteProjectAction, savePlacementAction, saveProjectAction, setProjectStatusAction,
} from '../../project-actions';
import { slugify } from '@/server/blog/markdown';
import { sanitizeSvg, SvgError } from '@/server/projects/svg';
import { normalizeTechnologies } from '@/server/projects/project-input';
import type { MediaItem } from '@/server/media/admin';
import MediaPicker from './media-picker';
import { badge, button, danger, input, panel, primary, secondary } from './ui';

export interface EditableProject {
  id: string;
  title: string;
  subtitle: string;
  short_description: string;
  is_nda: boolean;
  technologies: string; // comma separated for editing
  logo_svg: string;
  featured: boolean;
  featured_layout: 'hero' | 'tall' | 'standard' | '';
  featured_media_id: string | null;
  featured_image: string | null; // static fallback shown until an image is picked
  featured_alt: string;
  featured_title: string;
  featured_blurb: string;
  status: 'draft' | 'published';
}

export interface EditablePlacement {
  id: string;
  section_id: string;
  url: string;
}

const EMPTY: EditableProject = {
  id: '', title: '', subtitle: '', short_description: '', is_nda: false, technologies: '', logo_svg: '', featured: false,
  featured_layout: '', featured_media_id: null, featured_image: null, featured_alt: '', featured_title: '', featured_blurb: '', status: 'draft',
};

type Fields = Omit<EditableProject, 'status' | 'featured_image'>;
const toFields = (p: EditableProject): Fields => {
  const { status: _s, featured_image: _i, ...rest } = p;
  void _s; void _i;
  return rest;
};

const label = 'mb-1.5 block text-xs font-medium text-white/60';
const err = (message: { field?: string } | null, name: string) => (message?.field === name ? 'ring-red-400/60' : '');

export default function ProjectEditor({
  initial, placements: initialPlacements, sections, hosts, media: initialMedia,
}: {
  initial: EditableProject | null;
  placements: EditablePlacement[];
  sections: { id: string; label: string }[];
  hosts: string[];
  media: MediaItem[];
}) {
  const router = useRouter();
  const isNew = !initial;
  const start0 = initial ?? EMPTY;
  const [fields, setFields] = useState<Fields>(toFields(start0));
  const [saved, setSaved] = useState<Fields>(toFields(start0));
  const [status, setStatus] = useState(start0.status);
  const [idTouched, setIdTouched] = useState(!isNew);
  const [message, setMessage] = useState<{ kind: 'ok' | 'error'; text: string; field?: string } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [media, setMedia] = useState(initialMedia);
  const [picking, setPicking] = useState(false);
  const [pending, startTransition] = useTransition();
  const featuredImage = start0.featured_image;

  const dirty = JSON.stringify(fields) !== JSON.stringify(saved);
  const set = <K extends keyof Fields>(key: K, value: Fields[K]) => {
    setFields((f) => ({ ...f, [key]: value }));
    setMessage(null);
  };

  const card = fields.featured_media_id ? media.find((m) => m.id === fields.featured_media_id) : undefined;

  // Live, client-side preview of what the sanitiser will keep
  const logo = useMemo(() => {
    if (!fields.logo_svg.trim()) return { svg: null as string | null, removed: [] as string[], error: null as string | null };
    try {
      const r = sanitizeSvg(fields.logo_svg);
      return { svg: r.svg, removed: r.removed, error: null };
    } catch (e) {
      return { svg: null, removed: [], error: e instanceof SvgError ? e.message : 'Invalid SVG' };
    }
  }, [fields.logo_svg]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const payload = () => ({ ...fields, technologies: normalizeTechnologies(fields.technologies), featured_layout: fields.featured_layout || null });

  const save = () =>
    startTransition(async () => {
      const result = await saveProjectAction(payload(), isNew);
      if (!result.ok) return setMessage({ kind: 'error', text: result.error, field: result.field });
      setSaved(fields);
      setMessage({ kind: 'ok', text: 'Saved.' });
      if (isNew) router.replace(`/admin/projects/${result.id}`);
      else router.refresh();
    });

  const setPublished = (published: boolean) =>
    startTransition(async () => {
      if (dirty) {
        const saveResult = await saveProjectAction(payload(), isNew);
        if (!saveResult.ok) return setMessage({ kind: 'error', text: saveResult.error, field: saveResult.field });
        setSaved(fields);
      }
      const result = await setProjectStatusAction(fields.id, published);
      if (!result.ok) return setMessage({ kind: 'error', text: result.error });
      setStatus(result.status);
      setMessage({ kind: 'ok', text: published ? 'Published. The site is updated.' : 'Hidden from the site.' });
      router.refresh();
    });

  const onDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      window.setTimeout(() => setConfirmDelete(false), 4000);
      return;
    }
    startTransition(async () => {
      const result = await deleteProjectAction(fields.id); // redirects on success
      if (result && !result.ok) setMessage({ kind: 'error', text: result.error });
    });
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link href="/admin/projects" className="text-sm text-white/50 transition hover:text-white">
            ← Projects
          </Link>
          <span className={`${badge} ${status === 'published' ? 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/30' : 'bg-white/10 text-white/80 ring-white/10'}`}>{status === 'published' ? 'Published' : 'Draft'}</span>
          {dirty && <span className="text-xs text-white/50">Unsaved changes</span>}
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={save} disabled={pending || (!dirty && !isNew)} className={secondary}>
            {pending ? 'Working…' : 'Save'}
          </button>
          {!isNew && (status === 'draft' ? (
            <button type="button" onClick={() => setPublished(true)} disabled={pending} className={primary}>
              Publish
            </button>
          ) : (
            <button type="button" onClick={() => setPublished(false)} disabled={pending} className={secondary}>
              Hide from site
            </button>
          ))}
          {!isNew && (
            <button type="button" onClick={onDelete} disabled={pending} className={confirmDelete ? `${button} bg-red-500 text-white` : danger}>
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
        <section className={`${panel} space-y-4 p-5`} aria-label="Details">
          <div>
            <label className={label} htmlFor="title">Title</label>
            <input id="title" value={fields.title} onChange={(e) => { set('title', e.target.value); if (!idTouched) setFields((f) => ({ ...f, title: e.target.value, id: slugify(e.target.value) })); }} className={`${input} ${err(message, 'title')}`} />
          </div>
          <div>
            <label className={label} htmlFor="id">Id <span className="text-white/40">{isNew ? '(becomes the project’s identity; cannot change later)' : '(cannot be changed: Ursa and links depend on it)'}</span></label>
            <input id="id" value={fields.id} readOnly={!isNew} onChange={(e) => { setIdTouched(true); set('id', e.target.value); }} className={`${input} ${err(message, 'id')} ${isNew ? '' : 'opacity-60'}`} />
          </div>
          <div>
            <label className={label} htmlFor="subtitle">Subtitle</label>
            <input id="subtitle" value={fields.subtitle} onChange={(e) => set('subtitle', e.target.value)} className={`${input} ${err(message, 'subtitle')}`} />
          </div>
          <div>
            <label className={label} htmlFor="desc">Short description (page metadata and the home card)</label>
            <textarea id="desc" rows={3} value={fields.short_description} onChange={(e) => set('short_description', e.target.value)} className={`${input} ${err(message, 'short_description')}`} />
          </div>
          <div>
            <label className={label} htmlFor="tech">Technologies (comma separated)</label>
            <input id="tech" value={fields.technologies} onChange={(e) => set('technologies', e.target.value)} className={input} />
          </div>
          <label className="flex items-center gap-2 text-sm text-white/80">
            <input type="checkbox" checked={fields.is_nda} onChange={(e) => set('is_nda', e.target.checked)} /> Under NDA (shows a lock)
          </label>
        </section>

        <section className={`${panel} space-y-4 p-5`} aria-label="Logo">
          <div>
            <label className={label} htmlFor="logo">Logo (paste SVG markup)</label>
            <textarea id="logo" rows={6} value={fields.logo_svg} onChange={(e) => set('logo_svg', e.target.value)} spellCheck={false} placeholder="<svg viewBox=…>…</svg>" className={`${input} font-mono text-xs ${err(message, 'logo_svg')}`} />
          </div>
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-white ring-1 ring-white/10">
              {logo.svg ? <span className="inline-flex h-6 w-6 [&>svg]:h-full [&>svg]:w-full" dangerouslySetInnerHTML={{ __html: logo.svg }} /> : <span className="text-xs text-white/30">None</span>}
            </span>
            <p className="text-xs text-white/50">
              {logo.error ? <span className="text-red-300">{logo.error}</span> : logo.svg ? 'This is the cleaned version that will be saved. Size is set by the site, not by the SVG.' : 'Without a logo a default mark is shown.'}
            </p>
          </div>
          {logo.removed.length > 0 && (
            <p className="rounded-xl bg-amber-500/10 px-4 py-3 text-xs text-amber-200 ring-1 ring-amber-400/30">
              Removed for safety: {[...new Set(logo.removed)].join(', ')}.
            </p>
          )}
        </section>

        <section className={`${panel} space-y-4 p-5 lg:col-span-2`} aria-label="Home page card">
          <label className="flex items-center gap-2 text-sm text-white/80">
            <input type="checkbox" checked={fields.featured} onChange={(e) => set('featured', e.target.checked)} /> Show as a card in the home page’s Projects section
          </label>
          {fields.featured && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={label} htmlFor="layout">Card size</label>
                <select id="layout" value={fields.featured_layout} onChange={(e) => set('featured_layout', e.target.value as Fields['featured_layout'])} className={`${input} ${err(message, 'featured')}`}>
                  <option value="">Choose…</option>
                  <option value="hero">Large (two columns, two rows)</option>
                  <option value="tall">Tall (two rows)</option>
                  <option value="standard">Standard</option>
                </select>
              </div>
              <div>
                <label className={label} htmlFor="ftitle">Card title (optional, defaults to the title)</label>
                <input id="ftitle" value={fields.featured_title} onChange={(e) => set('featured_title', e.target.value)} className={input} />
              </div>
              <div>
                <label className={label} htmlFor="fblurb">Card text (optional, defaults to the short description)</label>
                <input id="fblurb" value={fields.featured_blurb} onChange={(e) => set('featured_blurb', e.target.value)} className={input} />
              </div>
              <div>
                <label className={label} htmlFor="falt">Image alt text</label>
                <input id="falt" value={fields.featured_alt} onChange={(e) => set('featured_alt', e.target.value)} className={`${input} ${err(message, 'featured')}`} />
              </div>
              <div className="flex items-center gap-4 sm:col-span-2">
                {card ? (
                  <img src={card.thumbUrl} alt={card.alt} className="h-20 w-32 rounded-xl object-cover ring-1 ring-white/10" />
                ) : featuredImage ? (
                  <img src={featuredImage} alt="" className="h-20 w-32 rounded-xl object-cover ring-1 ring-white/10" />
                ) : (
                  <span className="flex h-20 w-32 items-center justify-center rounded-xl bg-white/5 text-xs text-white/30 ring-1 ring-white/10">No image</span>
                )}
                <button type="button" onClick={() => setPicking(true)} className={secondary}>
                  {card ? 'Change image' : 'Choose image'}
                </button>
                {card && (
                  <button type="button" onClick={() => set('featured_media_id', null)} className={secondary}>
                    Remove
                  </button>
                )}
                {!card && featuredImage && <span className="text-xs text-white/40">Using the original site image. Choosing one replaces it.</span>}
              </div>
            </div>
          )}
        </section>
      </div>

      {!isNew && (
        <Listings projectId={fields.id} placements={initialPlacements} sections={sections} hosts={hosts} />
      )}
      {isNew && <p className="mt-6 text-sm text-white/50">Save the project first, then add the pages that embed it.</p>}

      {picking && <MediaPicker title="Choose a card image" items={media} setItems={setMedia} onPick={(item) => { set('featured_media_id', item.id); setPicking(false); }} onClose={() => setPicking(false)} />}
    </div>
  );
}

function Listings({ projectId, placements, sections, hosts }: { projectId: string; placements: EditablePlacement[]; sections: { id: string; label: string }[]; hosts: string[] }) {
  return (
    <section className={`${panel} mt-6 space-y-4 p-5`} aria-label="Listings">
      <div>
        <h2 className="text-lg font-light tracking-tighter font-geist text-white">Listings</h2>
        <p className="mt-1 text-sm text-white/50">
          Each listing is a page at <code>/projects/&lt;page id&gt;</code> in a sidebar section, embedding its own URL. A project can be listed more than once (for example under two categories). Allowed hosts: {hosts.length ? hosts.join(', ') : 'none: add one on the Projects page'}.
        </p>
      </div>
      <ul className="space-y-3">
        {placements.map((p) => (
          <ListingRow key={p.id} projectId={projectId} initial={p} sections={sections} />
        ))}
      </ul>
      <h3 className="pt-2 text-sm font-medium text-white/70">Add a listing</h3>
      <ListingRow key={`new-${placements.length}`} projectId={projectId} initial={null} sections={sections} defaultId={placements.length ? `${projectId}-${placements.length + 1}` : projectId} />
    </section>
  );
}

function ListingRow({ projectId, initial, sections, defaultId }: { projectId: string; initial: EditablePlacement | null; sections: { id: string; label: string }[]; defaultId?: string }) {
  const router = useRouter();
  const [id, setId] = useState(initial?.id ?? defaultId ?? '');
  const [sectionId, setSectionId] = useState(initial?.section_id ?? sections[0]?.id ?? '');
  const [url, setUrl] = useState(initial?.url ?? '');
  const [message, setMessage] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const changed = !initial || sectionId !== initial.section_id || url !== initial.url;

  const save = () =>
    start(async () => {
      const result = await savePlacementAction({ id, project_id: projectId, section_id: sectionId, url }, !initial);
      if (!result.ok) return setMessage(result.error);
      setMessage(null);
      router.refresh();
    });
  const remove = () =>
    start(async () => {
      if (!initial) return;
      const result = await deletePlacementAction(initial.id);
      if (!result.ok) return setMessage(result.error);
      router.refresh();
    });

  return (
    <li className="rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
      <div className="grid gap-2 md:grid-cols-[1fr_1.2fr_2fr_auto]">
        <input value={id} readOnly={!!initial} onChange={(e) => setId(e.target.value)} aria-label="Page id" placeholder="page-id" className={`${input} py-2 text-sm ${initial ? 'opacity-60' : ''}`} />
        <select value={sectionId} onChange={(e) => setSectionId(e.target.value)} aria-label="Section" className={`${input} py-2 text-sm`}>
          {sections.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
        <input value={url} onChange={(e) => setUrl(e.target.value)} aria-label="Embed URL" placeholder="https://…" className={`${input} py-2 text-sm`} />
        <div className="flex gap-2">
          <button type="button" onClick={save} disabled={pending || !changed || !id || !url} className={initial ? secondary : primary}>
            {initial ? 'Save' : 'Add'}
          </button>
          {initial && (
            <button type="button" onClick={remove} disabled={pending} className={danger} aria-label={`Remove listing ${initial.id}`}>
              Remove
            </button>
          )}
        </div>
      </div>
      {message && (
        <p role="alert" className="mt-2 text-xs text-red-300">
          {message}
        </p>
      )}
    </li>
  );
}
