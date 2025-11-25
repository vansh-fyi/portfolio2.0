create or replace function debug_documents_count()
returns int
language plpgsql
as $$
declare
  d_count int;
begin
  select count(*) into d_count from documents;
  return d_count;
end;
$$;
