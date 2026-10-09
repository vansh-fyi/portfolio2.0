-- 010: usage numbers for the daily health check
--
-- The health check reports database and Storage size as a share of the free-tier limits.
-- supabase-js cannot call pg_database_size() or read storage.objects directly, so this exposes
-- the two numbers through one function that only the service role may call.
create or replace function public.usage_stats()
returns jsonb
language sql
security definer
set search_path = ''
as $$
  select jsonb_build_object(
    'db_bytes', pg_database_size(current_database()),
    'storage_bytes', coalesce((select sum((metadata->>'size')::bigint) from storage.objects), 0),
    'storage_objects', (select count(*) from storage.objects)
  );
$$;

revoke all on function public.usage_stats() from public, anon, authenticated;
grant execute on function public.usage_stats() to service_role;
