-- Fixed-window rate limiting shared across all serverless instances.
-- Used by the tRPC layer (per-IP and global daily caps) to protect free-tier LLM / email quota.

create table if not exists public.rate_limits (
  key          text        not null,
  window_start timestamptz not null,
  hits         int         not null default 0,
  primary key (key, window_start)
);

-- RLS on with no policies: anon/authenticated can't touch the table directly.
alter table public.rate_limits enable row level security;

-- Counts one hit for `p_key` in the current window; returns true while within `p_max`.
create or replace function public.rate_limit_hit(
  p_key            text,
  p_window_seconds int,
  p_max            int
) returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  w timestamptz := to_timestamp(floor(extract(epoch from now()) / p_window_seconds) * p_window_seconds);
  h int;
begin
  insert into rate_limits (key, window_start, hits)
  values (p_key, w, 1)
  on conflict (key, window_start) do update set hits = rate_limits.hits + 1
  returning hits into h;

  -- Opportunistic cleanup so the table stays tiny
  if random() < 0.01 then
    delete from rate_limits where window_start < now() - interval '2 days';
  end if;

  return h <= p_max;
end;
$$;

-- Only the backend (service role) may call it. If anon could, anyone holding the anon key
-- could exhaust the global cap and lock everyone out.
revoke all on function public.rate_limit_hit(text, int, int) from public, anon, authenticated;
grant execute on function public.rate_limit_hit(text, int, int) to service_role;
