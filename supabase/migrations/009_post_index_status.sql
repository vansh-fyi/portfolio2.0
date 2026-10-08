-- 009: show whether Ursa has indexed each post
--
-- Posts are indexed into kb_chunks in the background after publish/edit. These columns record the
-- outcome so a failed run is visible in the admin instead of silently leaving Ursa out of date.
alter table public.posts add column if not exists ursa_indexed_at timestamptz;
alter table public.posts add column if not exists ursa_error text;

comment on column public.posts.ursa_indexed_at is 'When Ursa last finished indexing this post (null: never, or removed from the index)';
comment on column public.posts.ursa_error is 'Message from the last failed indexing attempt; null when the last attempt succeeded';
