'use client';

import { useState } from 'react';
import type { MediaItem } from '@/server/media/admin';
import MediaPanel from './media-panel';

export default function MediaLibrary({ initial }: { initial: MediaItem[] }) {
  const [items, setItems] = useState(initial);
  return <MediaPanel items={items} setItems={setItems} />;
}
