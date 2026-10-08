'use client';

import { useEffect } from 'react';
import type { MediaItem } from '@/server/media/admin';
import MediaPanel from './media-panel';

/** Modal for choosing (or uploading) an image from the editor. */
export default function MediaPicker({
  title,
  items,
  setItems,
  onPick,
  onClose,
}: {
  title: string;
  items: MediaItem[];
  setItems: React.Dispatch<React.SetStateAction<MediaItem[]>>;
  onPick: (item: MediaItem) => void;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm sm:p-8" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" aria-label={title} className="w-full max-w-5xl rounded-2xl bg-black p-6 ring-1 ring-white/15">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-light tracking-tighter font-geist text-white">{title}</h2>
          <button type="button" onClick={onClose} className="rounded-full bg-white/10 px-3.5 py-1.5 text-sm text-white ring-1 ring-white/10 transition hover:bg-white/15">
            Close
          </button>
        </div>
        <MediaPanel items={items} setItems={setItems} onPick={onPick} />
      </div>
    </div>
  );
}
