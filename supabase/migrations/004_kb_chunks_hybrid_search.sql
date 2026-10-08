-- Ursa knowledge base v2: heading-aware chunks, gte-small (384-dim) embeddings,
-- hybrid (vector + full-text) search with filters applied inside SQL.
--
-- Runs alongside the legacy `documents` table so the live site keeps working
-- until rag.ts is switched over. Drop `documents` / old match_documents afterwards.

create extension if not exists vector with schema extensions;

create table if not exists public.kb_chunks (
  id            uuid primary key default gen_random_uuid(),
  source_file   text not null,                 -- e.g. projects/ai/project_ursa_ai.md
  source_type   text not null check (source_type in ('personal', 'project')),
  project_id    text,                          -- null for personal content
  heading_path  text not null default '',      -- "Ursa AI > Architecture > Retrieval"
  content       text not null,
  content_hash  text not null,                 -- sha256(heading_path + content); drives incremental ingest
  chunk_index   int  not null default 0,
  metadata      jsonb not null default '{}'::jsonb,
  embedding     extensions.vector(384) not null,  -- gte-small
  fts           tsvector generated always as (
                  to_tsvector('english', heading_path || ' ' || content)
                ) stored,
  created_at    timestamptz not null default now(),
  unique (source_file, content_hash)
);

create index if not exists kb_chunks_embedding_idx
  on public.kb_chunks using hnsw (embedding extensions.vector_cosine_ops);
create index if not exists kb_chunks_fts_idx      on public.kb_chunks using gin (fts);
create index if not exists kb_chunks_project_idx  on public.kb_chunks (project_id);
create index if not exists kb_chunks_type_idx     on public.kb_chunks (source_type);
create index if not exists kb_chunks_file_idx     on public.kb_chunks (source_file);

-- Reads are public (portfolio content); writes need the service role key,
-- which bypasses RLS.
alter table public.kb_chunks enable row level security;

drop policy if exists "kb_chunks public read" on public.kb_chunks;
create policy "kb_chunks public read"
  on public.kb_chunks for select to public using (true);

-- Hybrid search: pgvector cosine ranking + full-text ranking, merged with
-- Reciprocal Rank Fusion. Natural-language questions are turned into an OR query
-- (plainto_tsquery ANDs every word, which almost never matches a full question).
create or replace function public.kb_hybrid_search(
  query_text         text,
  query_embedding    extensions.vector(384),
  match_count        int  default 8,
  filter_source_type text default null,
  filter_project_id  text default null
) returns table (
  id           uuid,
  content      text,
  heading_path text,
  source_file  text,
  project_id   text,
  metadata     jsonb,
  similarity   float,
  score        float
)
language sql
stable
set search_path = public, extensions
as $$
  with params as (
    select replace(plainto_tsquery('english', query_text)::text, ' & ', ' | ')::tsquery as q
  ),
  semantic as (
    select c.id,
           row_number() over (order by c.embedding <=> query_embedding) as rnk
    from kb_chunks c
    where (filter_project_id  is null or c.project_id  = filter_project_id)
      and (filter_source_type is null or c.source_type = filter_source_type)
    order by c.embedding <=> query_embedding
    limit 30
  ),
  lexical as (
    select c.id,
           row_number() over (order by ts_rank_cd(c.fts, p.q) desc) as rnk
    from kb_chunks c, params p
    where c.fts @@ p.q
      and (filter_project_id  is null or c.project_id  = filter_project_id)
      and (filter_source_type is null or c.source_type = filter_source_type)
    order by ts_rank_cd(c.fts, p.q) desc
    limit 30
  )
  select c.id,
         c.content,
         c.heading_path,
         c.source_file,
         c.project_id,
         c.metadata,
         (1 - (c.embedding <=> query_embedding))::float as similarity,
         (coalesce(1.0 / (60 + s.rnk), 0) + coalesce(1.0 / (60 + l.rnk), 0))::float as score
  from semantic s
  full outer join lexical l on l.id = s.id
  join kb_chunks c on c.id = coalesce(s.id, l.id)
  order by score desc
  limit match_count;
$$;
