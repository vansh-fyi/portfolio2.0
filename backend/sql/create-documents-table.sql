-- Enable pgvector extension to work with embedding vectors
create extension if not exists vector;

-- Create a table to store your documents
create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  embedding vector(384) not null, -- 384 dimensions for all-MiniLM-L6-v2
  metadata jsonb not null default '{}'::jsonb, -- source_type, source_file, projectId, etc.
  created_at timestamp with time zone default now()
);

-- Drop existing functions to avoid overloading ambiguity
drop function if exists match_documents(vector(384), float, int);
drop function if exists match_documents(vector(384), float, int, jsonb);

-- Create a function to search for documents
create or replace function match_documents (
  query_embedding vector(384),
  match_threshold float,
  match_count int
) returns table (
  id uuid,
  content text,
  metadata jsonb,
  similarity float
) language plpgsql as $$
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

-- Create a GIN index for faster metadata filtering
create index if not exists documents_metadata_idx on documents using gin (metadata);

-- DROP the IVFFlat index if it exists.
-- For small datasets (< 2000 rows), IVFFlat reduces recall significantly if not tuned perfectly.
-- Exact nearest neighbor search (sequential scan) is fast enough and more accurate for this scale.
drop index if exists documents_embedding_idx;