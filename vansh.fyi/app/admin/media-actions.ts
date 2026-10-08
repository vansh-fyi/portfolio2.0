'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requireAdmin } from '@/server/auth/admin';
import { createUpload, deleteMedia, finalizeUpload, MediaError, updateAlt, type MediaItem } from '@/server/media/admin';
import { UploadError } from '@/server/media/upload';
import type { ActionResult } from './actions';

const alt = z.string().trim().min(1, 'Describe the image in a few words (alt text is required)').max(300, 'Alt text is too long (300 max)');

function fail(error: unknown): { ok: false; error: string } {
  if (error instanceof MediaError || error instanceof UploadError) return { ok: false, error: error.message };
  console.error('[admin/media] action failed:', error);
  return { ok: false, error: 'Something went wrong. Try again.' };
}

/** Alt text appears on public pages, so a change refreshes them. */
function revalidateBlog() {
  revalidatePath('/blog');
  revalidatePath('/blog/[slug]', 'page');
  revalidatePath('/blog/tag/[tag]', 'page');
}

export async function createUploadAction(raw: unknown): Promise<ActionResult<{ path: string; signedUrl: string }>> {
  const admin = await requireAdmin();
  const parsed = z.object({ mime: z.string().max(100), bytes: z.number().int() }).safeParse(raw);
  if (!parsed.success) return { ok: false, error: 'Invalid upload.' };
  try {
    return { ok: true, ...(await createUpload(admin, parsed.data)) };
  } catch (error) {
    return fail(error);
  }
}

export async function finalizeUploadAction(raw: unknown): Promise<ActionResult<{ item: MediaItem }>> {
  const admin = await requireAdmin();
  const parsed = z.object({ path: z.string().max(200), alt, originalName: z.string().max(300).nullable().optional() }).safeParse(raw);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  try {
    return { ok: true, item: await finalizeUpload(admin, parsed.data) };
  } catch (error) {
    return fail(error);
  }
}

export async function updateMediaAltAction(raw: unknown): Promise<ActionResult> {
  const admin = await requireAdmin();
  const parsed = z.object({ id: z.string().uuid(), alt }).safeParse(raw);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  try {
    await updateAlt(admin, parsed.data.id, parsed.data.alt);
    revalidateBlog();
    return { ok: true };
  } catch (error) {
    return fail(error);
  }
}

export async function deleteMediaAction(id: string): Promise<ActionResult> {
  const admin = await requireAdmin();
  if (!z.string().uuid().safeParse(id).success) return { ok: false, error: 'Invalid image.' };
  try {
    await deleteMedia(admin, id);
    return { ok: true };
  } catch (error) {
    return fail(error);
  }
}
