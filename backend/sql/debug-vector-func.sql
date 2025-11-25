drop function if exists debug_vector_distance(vector(384));

create or replace function debug_vector_distance(query_embedding vector(384))
returns table (doc_id uuid, dist float)
language plpgsql
as $$
begin
  return query
  select
    documents.id as doc_id,
    (documents.embedding <=> query_embedding) as dist
  from documents
  limit 5;
end;
$$;
