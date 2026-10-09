'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState, useTransition, type CSSProperties } from 'react';
import {
  closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors,
  type CollisionDetection, type DragEndEvent, type DragOverEvent,
} from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy, arrayMove as dndArrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  deleteCategoryAction, deleteSectionAction, saveCategoryAction, saveOrderAction, saveSectionAction,
} from '../../project-actions';
import {
  categoryOfSection, moveCategory, movePlacement, moveSection, sectionOfPlacement, sectionOptions, toOrderPayload,
  type Board, type BoardCategory, type BoardPlacement, type BoardSection,
} from '@/server/projects/board';
import type { BoardData } from '@/server/projects/admin-queries';
import { slugify } from '@/server/blog/markdown';
import { badge, button, danger, input, panel, primary, secondary } from './ui';

type Kind = 'category' | 'section' | 'placement';
const PREFIX: Record<Kind, string> = { category: 'c:', section: 's:', placement: 'p:' };
const dndId = (kind: Kind, id: string) => `${PREFIX[kind]}${id}`;
const rawId = (id: string | number) => String(id).slice(2);

/** Placements may land on a section (empty ones, or to append); sections and categories only reorder among their own kind. */
const collisionDetection: CollisionDetection = (args) => {
  const type = args.active.data.current?.type as Kind | undefined;
  const containers = args.droppableContainers.filter((c) => {
    const t = c.data.current?.type as Kind | undefined;
    return t === type || (type === 'placement' && t === 'section');
  });
  return closestCenter({ ...args, droppableContainers: containers });
};

function Handle({ label, attributes, listeners, setActivatorNodeRef }: { label: string; attributes: object; listeners?: object; setActivatorNodeRef: (el: HTMLElement | null) => void }) {
  return (
    <button
      type="button"
      ref={setActivatorNodeRef}
      aria-label={label}
      title="Drag to reorder (or focus and press Space, then the arrow keys)"
      className="flex-shrink-0 cursor-grab touch-none rounded-lg px-1.5 py-1 text-white/40 transition hover:bg-white/10 hover:text-white active:cursor-grabbing"
      {...attributes}
      {...listeners}
    >
      ⠿
    </button>
  );
}

function useSortableItem(kind: Kind, id: string) {
  const sortable = useSortable({ id: dndId(kind, id), data: { type: kind } });
  const style: CSSProperties = { transform: CSS.Transform.toString(sortable.transform), transition: sortable.transition, opacity: sortable.isDragging ? 0.5 : 1 };
  return { ...sortable, style };
}

function PlacementRow({ placement, options, onMove }: { placement: BoardPlacement; options: { id: string; label: string }[]; onMove: (sectionId: string) => void }) {
  const { setNodeRef, setActivatorNodeRef, attributes, listeners, style } = useSortableItem('placement', placement.id);
  return (
    <li ref={setNodeRef} style={style} className="flex flex-wrap items-center gap-2 rounded-xl bg-white/5 px-2 py-2 ring-1 ring-white/10">
      <Handle label={`Drag ${placement.title}`} attributes={attributes} listeners={listeners} setActivatorNodeRef={setActivatorNodeRef} />
      <Link href={`/admin/projects/${placement.projectId}`} className="min-w-0 flex-1 truncate text-sm text-white hover:underline">
        {placement.title}
        <span className="ml-2 text-xs text-white/40">/projects/{placement.id}</span>
      </Link>
      {placement.hidden && <span className={`${badge} bg-white/10 text-white/70 ring-white/10`}>Draft</span>}
      <select
        aria-label={`Move ${placement.title} to`}
        value=""
        onChange={(e) => e.target.value && onMove(e.target.value)}
        className="max-w-[10rem] rounded-lg bg-black/40 px-2 py-1 text-xs text-white/70 ring-1 ring-white/10"
      >
        <option value="">Move to…</option>
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.label}
          </option>
        ))}
      </select>
    </li>
  );
}

export default function ProjectsBoard({ data }: { data: BoardData }) {
  const router = useRouter();
  const [board, setBoard] = useState<Board>(data.board);
  const [featured, setFeatured] = useState(data.featured);
  const [saved, setSaved] = useState(() => JSON.stringify(toOrderPayload(data.board, data.featured.map((f) => f.projectId))));
  const [message, setMessage] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);
  const [pending, start] = useTransition();

  // Pick up the server's version after a structural change (add/rename/delete) or a save
  useEffect(() => {
    setBoard(data.board);
    setFeatured(data.featured);
    setSaved(JSON.stringify(toOrderPayload(data.board, data.featured.map((f) => f.projectId))));
  }, [data]);

  const payload = useMemo(() => toOrderPayload(board, featured.map((f) => f.projectId)), [board, featured]);
  const dirty = JSON.stringify(payload) !== saved;
  const options = useMemo(() => sectionOptions(board), [board]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const onDragOver = ({ active, over }: DragOverEvent) => {
    if (!over || active.data.current?.type !== 'placement') return;
    const id = rawId(active.id);
    const current = sectionOfPlacement(board, id);
    if (!current) return;
    const overType = over.data.current?.type as Kind | undefined;
    if (overType === 'section') {
      const target = board.categories.flatMap((c) => c.sections).find((s) => s.id === rawId(over.id));
      if (target && target.id !== current.id) setBoard((b) => movePlacement(b, id, target.id, target.placements.length));
    } else if (overType === 'placement') {
      const target = sectionOfPlacement(board, rawId(over.id));
      if (target && target.id !== current.id) setBoard((b) => movePlacement(b, id, target.id, target.placements.findIndex((p) => p.id === rawId(over.id))));
    }
  };

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    const type = active.data.current?.type as Kind | undefined;
    const id = rawId(active.id);
    const overId = rawId(over.id);
    setMessage(null);
    if (type === 'placement' && over.data.current?.type === 'placement') {
      const section = sectionOfPlacement(board, overId);
      if (section && section.placements.some((p) => p.id === id)) setBoard((b) => movePlacement(b, id, section.id, section.placements.findIndex((p) => p.id === overId)));
    } else if (type === 'section' && over.data.current?.type === 'section') {
      const category = categoryOfSection(board, overId);
      if (category) setBoard((b) => moveSection(b, id, category.id, category.sections.findIndex((s) => s.id === overId)));
    } else if (type === 'category' && over.data.current?.type === 'category') {
      setBoard((b) => moveCategory(b, id, b.categories.findIndex((c) => c.id === overId)));
    }
  };

  const moveTo = (placementId: string, sectionId: string) => {
    const target = board.categories.flatMap((c) => c.sections).find((s) => s.id === sectionId);
    if (target) setBoard((b) => movePlacement(b, placementId, sectionId, target.placements.length));
    setMessage(null);
  };

  const save = () =>
    start(async () => {
      const result = await saveOrderAction(payload);
      if (!result.ok) return setMessage({ kind: 'error', text: result.error });
      setSaved(JSON.stringify(payload));
      setMessage({ kind: 'ok', text: 'Order saved. The site is updated.' });
      router.refresh();
    });

  // Structural changes reload the board from the server, so they would discard unsaved ordering
  const structural = (run: () => Promise<{ ok: boolean; error?: string }>) =>
    start(async () => {
      const result = await run();
      if (!result.ok) return setMessage({ kind: 'error', text: result.error ?? 'Failed.' });
      setMessage(null);
      router.refresh();
    });

  return (
    <div>
      <div className="sticky top-0 z-10 -mx-4 mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-black/80 px-4 py-3 backdrop-blur-lg sm:-mx-6 sm:px-6">
        <p className="text-sm text-white/60">{dirty ? 'Unsaved changes' : 'Drag the handles to reorder. Save to update the site.'}</p>
        <div className="flex gap-2">
          <button type="button" onClick={() => { setBoard(data.board); setFeatured(data.featured); setMessage(null); }} disabled={!dirty || pending} className={secondary}>
            Discard
          </button>
          <button type="button" onClick={save} disabled={!dirty || pending} className={primary}>
            {pending ? 'Saving…' : 'Save order'}
          </button>
        </div>
      </div>

      {message && (
        <p role={message.kind === 'error' ? 'alert' : 'status'} className={`mb-6 rounded-xl px-4 py-3 text-sm ring-1 ${message.kind === 'error' ? 'bg-red-500/10 text-red-300 ring-red-400/30' : 'bg-emerald-500/10 text-emerald-300 ring-emerald-500/30'}`}>
          {message.text}
        </p>
      )}

      <DndContext sensors={sensors} collisionDetection={collisionDetection} onDragOver={onDragOver} onDragEnd={onDragEnd}>
        <SortableContext items={board.categories.map((c) => dndId('category', c.id))} strategy={verticalListSortingStrategy}>
          <div className="space-y-6">
            {board.categories.map((category) => (
              <CategoryCard key={category.id} category={category} options={options} dirty={dirty} pending={pending} onMove={moveTo} structural={structural} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <AddCategory dirty={dirty} pending={pending} structural={structural} />

      <FeaturedOrder featured={featured} setFeatured={(next) => { setFeatured(next); setMessage(null); }} />

      {data.unlisted.length > 0 && (
        <section className={`${panel} mt-8 p-5`} aria-label="Projects without a listing">
          <h2 className="text-lg font-light tracking-tighter font-geist text-white">Not listed anywhere</h2>
          <p className="mt-1 text-sm text-white/50">These projects have no listing, so visitors cannot reach them. Open one to add a listing.</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {data.unlisted.map((p) => (
              <li key={p.id}>
                <Link href={`/admin/projects/${p.id}`} className={secondary}>
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

type Structural = (run: () => Promise<{ ok: boolean; error?: string }>) => void;

function CategoryCard({ category, options, dirty, pending, onMove, structural }: { category: BoardCategory; options: { id: string; label: string }[]; dirty: boolean; pending: boolean; onMove: (placementId: string, sectionId: string) => void; structural: Structural }) {
  const { setNodeRef, setActivatorNodeRef, attributes, listeners, style } = useSortableItem('category', category.id);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(category.name);
  const [icon, setIcon] = useState(category.iconSvg ?? '');
  const [newSection, setNewSection] = useState('');
  const lock = dirty ? 'Save or discard the new order first' : undefined;

  return (
    <section ref={setNodeRef} style={style} className={`${panel} p-4`} aria-label={category.name}>
      <header className="mb-4 flex flex-wrap items-center gap-2">
        <Handle label={`Drag category ${category.name}`} attributes={attributes} listeners={listeners} setActivatorNodeRef={setActivatorNodeRef} />
        <h2 className="flex-1 text-xl font-light tracking-tighter font-geist text-white">{category.name}</h2>
        <button type="button" onClick={() => setEditing(!editing)} className={secondary}>
          {editing ? 'Close' : 'Edit'}
        </button>
        <button type="button" disabled={dirty || pending} title={lock} onClick={() => structural(() => deleteCategoryAction(category.id))} className={danger}>
          Delete
        </button>
      </header>

      {editing && (
        <div className="mb-4 space-y-3 rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
          <input value={name} onChange={(e) => setName(e.target.value)} aria-label="Category name" className={input} />
          <textarea value={icon} onChange={(e) => setIcon(e.target.value)} aria-label="Category icon (SVG)" placeholder="<svg viewBox=…> (optional; cleaned automatically)" rows={3} className={`${input} font-mono text-xs`} />
          <button type="button" disabled={dirty || pending || !name.trim()} title={lock} onClick={() => structural(async () => { const r = await saveCategoryAction({ id: category.id, name, icon_svg: icon }, false); if (r.ok) setEditing(false); return r; })} className={primary}>
            Save category
          </button>
        </div>
      )}

      <SortableContext items={category.sections.map((s) => dndId('section', s.id))} strategy={verticalListSortingStrategy}>
        <div className="space-y-4">
          {category.sections.map((section) => (
            <SectionCard key={section.id} section={section} options={options} dirty={dirty} pending={pending} onMove={onMove} structural={structural} />
          ))}
        </div>
      </SortableContext>

      <div className="mt-4 flex flex-wrap gap-2">
        <input value={newSection} onChange={(e) => setNewSection(e.target.value)} placeholder="New section title" aria-label={`New section in ${category.name}`} className={`${input} max-w-xs`} />
        <button type="button" disabled={dirty || pending || !newSection.trim()} title={lock} onClick={() => structural(async () => { const r = await saveSectionAction({ category_id: category.id, title: newSection }); if (r.ok) setNewSection(''); return r; })} className={secondary}>
          Add section
        </button>
      </div>
    </section>
  );
}

function SectionCard({ section, options, dirty, pending, onMove, structural }: { section: BoardSection; options: { id: string; label: string }[]; dirty: boolean; pending: boolean; onMove: (placementId: string, sectionId: string) => void; structural: Structural }) {
  const { setNodeRef, setActivatorNodeRef, attributes, listeners, style } = useSortableItem('section', section.id);
  const [renaming, setRenaming] = useState(false);
  const [title, setTitle] = useState(section.title);
  const lock = dirty ? 'Save or discard the new order first' : undefined;

  return (
    <div ref={setNodeRef} style={style} className="rounded-xl bg-black/20 p-3 ring-1 ring-white/10">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Handle label={`Drag section ${section.title}`} attributes={attributes} listeners={listeners} setActivatorNodeRef={setActivatorNodeRef} />
        {renaming ? (
          <>
            <input value={title} onChange={(e) => setTitle(e.target.value)} aria-label="Section title" className={`${input} max-w-xs py-1.5`} />
            <button type="button" disabled={dirty || pending || !title.trim()} title={lock} onClick={() => structural(async () => { const r = await saveSectionAction({ id: section.id, category_id: 'x', title }); if (r.ok) setRenaming(false); return r; })} className={primary}>
              Save
            </button>
          </>
        ) : (
          <h3 className="flex-1 text-xs font-medium uppercase tracking-wider text-white/60">{section.title}</h3>
        )}
        <button type="button" onClick={() => setRenaming(!renaming)} className={secondary}>
          {renaming ? 'Cancel' : 'Rename'}
        </button>
        <button type="button" disabled={dirty || pending || section.placements.length > 0} title={section.placements.length > 0 ? 'Move its listings out first' : lock} onClick={() => structural(() => deleteSectionAction(section.id))} className={danger}>
          Delete
        </button>
      </div>
      <SortableContext items={section.placements.map((p) => dndId('placement', p.id))} strategy={verticalListSortingStrategy}>
        <ul className="min-h-10 space-y-2">
          {section.placements.map((placement) => (
            <PlacementRow key={placement.id} placement={placement} options={options.filter((o) => o.id !== section.id)} onMove={(sectionId) => onMove(placement.id, sectionId)} />
          ))}
          {section.placements.length === 0 && <li className="rounded-xl border border-dashed border-white/15 px-3 py-3 text-center text-xs text-white/40">Empty. Drag a listing here.</li>}
        </ul>
      </SortableContext>
    </div>
  );
}

function AddCategory({ dirty, pending, structural }: { dirty: boolean; pending: boolean; structural: Structural }) {
  const [name, setName] = useState('');
  return (
    <div className="mt-6 flex flex-wrap gap-2">
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="New category name" aria-label="New category name" className={`${input} max-w-xs`} />
      <button type="button" disabled={dirty || pending || !slugify(name)} title={dirty ? 'Save or discard the new order first' : undefined} onClick={() => structural(async () => { const r = await saveCategoryAction({ id: slugify(name), name, icon_svg: '' }, true); if (r.ok) setName(''); return r; })} className={secondary}>
        Add category
      </button>
    </div>
  );
}

function FeaturedOrder({ featured, setFeatured }: { featured: BoardData['featured']; setFeatured: (next: BoardData['featured']) => void }) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));
  const ids = featured.map((f) => `f:${f.projectId}`);
  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    setFeatured(dndArrayMove(featured, ids.indexOf(String(active.id)), ids.indexOf(String(over.id))));
  };
  return (
    <section className={`${panel} mt-8 p-5`} aria-label="Home page cards">
      <h2 className="text-lg font-light tracking-tighter font-geist text-white">Home page cards</h2>
      <p className="mt-1 text-sm text-white/50">The cards in the Projects section of the home page, in this order. The first is the large one on desktop. Choose which projects appear, and their images, in each project.</p>
      {featured.length === 0 ? (
        <p className="mt-4 text-sm text-white/50">No featured projects.</p>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={ids} strategy={verticalListSortingStrategy}>
            <ol className="mt-4 space-y-2">
              {featured.map((card, i) => (
                <FeaturedRow key={card.projectId} card={card} index={i} />
              ))}
            </ol>
          </SortableContext>
        </DndContext>
      )}
    </section>
  );
}

function FeaturedRow({ card, index }: { card: BoardData['featured'][number]; index: number }) {
  const { setNodeRef, setActivatorNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({ id: `f:${card.projectId}` });
  const style: CSSProperties = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };
  return (
    <li ref={setNodeRef} style={style} className="flex items-center gap-2 rounded-xl bg-white/5 px-2 py-2 ring-1 ring-white/10">
      <Handle label={`Drag card ${card.title}`} attributes={attributes} listeners={listeners} setActivatorNodeRef={setActivatorNodeRef} />
      <span className="w-5 text-xs text-white/40">{index + 1}</span>
      <Link href={`/admin/projects/${card.projectId}`} className="min-w-0 flex-1 truncate text-sm text-white hover:underline">
        {card.title}
      </Link>
      {card.hidden && <span className={`${badge} bg-white/10 text-white/70 ring-white/10`}>Draft</span>}
    </li>
  );
}
