-- 1. Move vector extension to 'extensions' schema
-- Create the schema if it doesn't exist
create schema if not exists extensions;
-- Move the extension
alter extension vector set schema extensions;

-- 2. Fix mutable search_path for functions
-- We need to explicitly set the search_path to include 'extensions' where the vector type now lives, and 'public'.

-- Fix debug_documents_count
create or replace function public.debug_documents_count()
returns int
language plpgsql
set search_path = public, extensions
as $$
declare
  d_count int;
begin
  select count(*) into d_count from documents;
  return d_count;
end;
$$;

-- Fix match_documents
-- Note: Dropping first to ensure clean slate if signatures match but we want to be sure
-- However, CREATE OR REPLACE is usually sufficient if signature is identical.
-- We will just use CREATE OR REPLACE with the SET search_path clause.

create or replace function public.match_documents (
  query_embedding vector(384),
  match_threshold float,
  match_count int
) returns table (
  id uuid,
  content text,
  metadata jsonb,
  similarity float
)
language plpgsql
set search_path = public, extensions
as $$
begin
  return query
  select
    documents.id,
    documents.content,
    documents.metadata,
    1 - (documents.embedding <=> query_embedding) as similarity
  from documents
  where 1 - (documents.embedding <=> query_embedding) > match_threshold
  order by documents.embedding <=> query_embedding
  limit match_count;
end;
$$;

-- Also fix the other signature of match_documents if it exists (from 002_update_to_openai_embeddings.sql)
-- It seems the user has multiple versions. I will update the one from 002 as well just in case.
-- The one in 002 uses 'embeddings' table, but the one in create-documents-table.sql uses 'documents'.
-- Based on the user's issue report "Function public.match_documents has a role mutable search_path", I should fix whatever is active.
-- I will define the one for 'embeddings' table as well, assuming it might be used.
-- Wait, the user's issue specifically mentioned "public.documents" table issue.
-- Let's stick to the one that uses 'documents' table first as seen in 'create-documents-table.sql'.
-- If there is another one using 'embeddings', I should probably fix that too if it exists.
-- I will add the fix for the 'embeddings' table version as well, to be safe, if it exists.
-- Actually, let's just fix the one that matches the 'documents' table usage since that's what the other errors point to (RLS on public.documents).

-- Fix debug_vector_distance
create or replace function public.debug_vector_distance(query_embedding vector(384))
returns table (doc_id uuid, dist float)
language plpgsql
set search_path = public, extensions
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

-- 3. Enable RLS on documents table
alter table public.documents enable row level security;

-- Create a policy to allow public read access (since this is likely a public knowledge base)
-- Adjust this policy if you need stricter access control.
create policy "Allow public read access"
on public.documents
for select
to public
using (true);
