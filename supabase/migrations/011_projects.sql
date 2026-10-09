-- 011: projects CMS
--
-- Replaces the hand-kept project lists (src/data/projects.ts, src/config/projects.tsx and the
-- featured cards in Projects.tsx).
--
--   projects            the work itself: title, logo, NDA flag. Its id is also Ursa's project scope.
--   project_placements  where a project is listed. One project can appear under several sections,
--                       each listing with its own route id (/projects/<id>) and embed URL.
--   embed_hosts         hosts an iframe URL may point at (https is always required)
--
-- Security model is the same as the blog: the public (anon) role can only READ published
-- content, there are no write policies, and all writes go through the service role (admin).

-- 1. Categories and sections -----------------------------------------------------------------
create table if not exists public.project_categories (
  id        text primary key check (id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name      text not null check (length(btrim(name)) > 0),
  icon_svg  text check (icon_svg is null or length(icon_svg) <= 65536),   -- sanitised on write
  position  int  not null default 0
);

create table if not exists public.project_sections (
  id           uuid primary key default gen_random_uuid(),
  category_id  text not null references public.project_categories(id) on delete cascade,
  title        text not null check (length(btrim(title)) > 0),
  position     int  not null default 0
);
create index if not exists project_sections_category_idx on public.project_sections (category_id, position);

-- 2. Projects --------------------------------------------------------------------------------
create table if not exists public.projects (
  id                 text primary key check (id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title              text not null check (length(btrim(title)) > 0),
  subtitle           text not null default '',
  short_description  text not null default '',
  is_nda             boolean not null default false,
  technologies       text[] not null default '{}',
  logo_svg           text check (logo_svg is null or length(logo_svg) <= 65536),   -- sanitised on write
  featured           boolean not null default false,
  featured_layout    text check (featured_layout in ('hero', 'tall', 'standard')),
  featured_media_id  uuid references public.media(id) on delete set null,
  featured_image     text,          -- static fallback path (e.g. /images/aether.webp) until a media image is chosen
  featured_alt       text,
  featured_title     text,          -- headline on the home card, when different from the title
  featured_blurb     text,
  status             text not null default 'draft' check (status in ('draft', 'published')),
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);
create index if not exists projects_featured_idx on public.projects (featured) where status = 'published';

-- 3. Placements ------------------------------------------------------------------------------
create table if not exists public.project_placements (
  id          text primary key check (id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),   -- the route: /projects/<id>
  project_id  text not null references public.projects(id) on delete cascade,
  section_id  uuid not null references public.project_sections(id) on delete cascade,
  position    int  not null default 0,
  url         text not null check (url ~ '^https://')
);
create index if not exists project_placements_section_idx on public.project_placements (section_id, position);
create index if not exists project_placements_project_idx on public.project_placements (project_id);

-- 4. Allowed embed hosts ---------------------------------------------------------------------
create table if not exists public.embed_hosts (
  host  text primary key check (host = lower(host) and host ~ '^[a-z0-9.-]+$'),
  note  text
);

-- 5. Ids are the URL and Ursa's scope, so they never change -----------------------------------
create or replace function public.forbid_id_change() returns trigger
language plpgsql set search_path = '' as $$
begin
  if new.id is distinct from old.id then
    raise exception 'the id of % cannot be changed (it is part of the URL); create a new one instead', tg_table_name;
  end if;
  return new;
end $$;

drop trigger if exists projects_forbid_id_change on public.projects;
create trigger projects_forbid_id_change before update on public.projects
  for each row execute function public.forbid_id_change();

drop trigger if exists project_placements_forbid_id_change on public.project_placements;
create trigger project_placements_forbid_id_change before update on public.project_placements
  for each row execute function public.forbid_id_change();

create or replace function public.projects_touch_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists projects_touch_updated_at on public.projects;
create trigger projects_touch_updated_at before update on public.projects
  for each row execute function public.projects_touch_updated_at();

-- 6. Row level security ----------------------------------------------------------------------
alter table public.project_categories enable row level security;
alter table public.project_sections   enable row level security;
alter table public.projects           enable row level security;
alter table public.project_placements enable row level security;
alter table public.embed_hosts        enable row level security;

drop policy if exists "categories public read" on public.project_categories;
create policy "categories public read" on public.project_categories for select using (true);

drop policy if exists "sections public read" on public.project_sections;
create policy "sections public read" on public.project_sections for select using (true);

drop policy if exists "projects public read published" on public.projects;
create policy "projects public read published" on public.projects for select using (status = 'published');

drop policy if exists "placements public read published" on public.project_placements;
create policy "placements public read published" on public.project_placements for select
  using (exists (select 1 from public.projects p where p.id = project_id and p.status = 'published'));

-- embed_hosts: no policy => only the service role can read or write it.
