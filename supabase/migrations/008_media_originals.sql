-- 008: keep original uploads private
--
-- Phone photos carry EXIF (often GPS coordinates). The public `media` bucket now only ever holds
-- processed WebP variants with all metadata stripped; the untouched originals live in this PRIVATE
-- bucket (no storage policies, so only the service role can read or write it) and are used only to
-- regenerate variants later.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media-originals', 'media-originals', false, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- File name the image was uploaded with, shown in the media library
alter table public.media add column if not exists original_name text;

comment on column public.media.storage_path is 'Path of the untouched original in the private media-originals bucket';
comment on column public.media.variants is 'Processed WebP files in the public media bucket: [{ "w": 640, "path": "v/<id>/640.webp" }, ...]';
