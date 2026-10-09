-- 012: order of the featured cards on the home page (independent of the sidebar order)
alter table public.projects add column if not exists featured_position int not null default 0;
