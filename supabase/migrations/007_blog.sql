-- 007: blog + image CMS
-- Run once (Supabase SQL editor or `supabase db push`). Idempotent where practical.
--
-- Security model: everything is written through the service role (the admin's server actions).
-- The public (anon) role can only READ published posts and media metadata. There are no write
-- policies, so a leaked anon key cannot change anything.

-- 1. Ursa can index blog posts ---------------------------------------------------------------
alter table public.kb_chunks drop constraint if exists kb_chunks_source_type_check;
alter table public.kb_chunks
  add constraint kb_chunks_source_type_check check (source_type in ('personal', 'project', 'blog'));

-- 2. Media (uploaded images) -----------------------------------------------------------------
create table if not exists public.media (
  id            uuid primary key default gen_random_uuid(),
  storage_path  text not null unique,                 -- original, in the `media` bucket
  variants      jsonb not null default '[]'::jsonb,   -- [{ "w": 640, "path": "..." }, ...]
  alt           text not null check (length(btrim(alt)) > 0),
  width         int  not null check (width > 0),
  height        int  not null check (height > 0),
  blur_data_url text,                                 -- tiny placeholder shown while loading
  mime          text not null,
  bytes         int  not null check (bytes > 0),
  created_at    timestamptz not null default now()
);

-- 3. Posts -----------------------------------------------------------------------------------
create table if not exists public.posts (
  id               uuid primary key default gen_random_uuid(),
  slug             text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title            text not null check (length(btrim(title)) > 0),
  excerpt          text,
  body_md          text not null default '',
  cover_media_id   uuid references public.media(id) on delete set null,
  tags             text[] not null default '{}',
  status           text not null default 'draft' check (status in ('draft', 'published')),
  published_at     timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  seo_title        text,
  seo_description  text,
  reading_minutes  int,
  fts tsvector generated always as (
    to_tsvector('english', coalesce(title, '') || ' ' || coalesce(excerpt, '') || ' ' || coalesce(body_md, ''))
  ) stored,
  -- a published post must say when
  constraint posts_published_has_date check (status <> 'published' or published_at is not null)
);

create index if not exists posts_published_idx on public.posts (published_at desc) where status = 'published';
create index if not exists posts_tags_idx on public.posts using gin (tags);
create index if not exists posts_fts_idx on public.posts using gin (fts);

create or replace function public.posts_touch_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists posts_touch_updated_at on public.posts;
create trigger posts_touch_updated_at before update on public.posts
  for each row execute function public.posts_touch_updated_at();

-- 4. Which posts use which image (blocks deleting an image that is still in use) -------------
create table if not exists public.post_media (
  post_id  uuid not null references public.posts(id) on delete cascade,
  media_id uuid not null references public.media(id) on delete restrict,
  primary key (post_id, media_id)
);
create index if not exists post_media_media_idx on public.post_media (media_id);

-- 5. Row level security ----------------------------------------------------------------------
alter table public.posts enable row level security;
alter table public.media enable row level security;
alter table public.post_media enable row level security;

drop policy if exists "posts public read published" on public.posts;
create policy "posts public read published" on public.posts for select
  using (status = 'published' and published_at <= now());

drop policy if exists "media public read" on public.media;
create policy "media public read" on public.media for select using (true);
-- post_media: no policies => only the service role can read or write it.

-- 6. Storage bucket for images ---------------------------------------------------------------
-- Public bucket: image URLs are plain, cacheable links. Uploads go through signed upload URLs
-- created by the admin (service role), so no storage write policies are needed.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;
