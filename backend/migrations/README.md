# Backend Migrations

SQL for the Supabase database. Run them in the Supabase SQL Editor, in numeric order.

## Current

### 004_kb_chunks_hybrid_search.sql
Ursa's knowledge base:
- `kb_chunks` table: heading-aware chunks with a 384-dimension `gte-small` embedding (HNSW index), a generated full-text column, and a `content_hash` used for incremental ingest. Public read via RLS; writes need the service role key.
- `kb_hybrid_search(query_text, query_embedding, match_count, filter_source_type, filter_project_id)`: vector and full-text ranking merged with Reciprocal Rank Fusion. Filters are applied inside SQL.

### 005_rate_limits.sql
- `rate_limits` table and `rate_limit_hit(key, window_seconds, max)`: fixed-window counters shared by all serverless instances. Executable only by the service role.

## Legacy (superseded)

These belong to the first Ursa pipeline (HuggingFace MiniLM embeddings). They are kept for history only.

| File | What it did |
|---|---|
| `001_create_embeddings_table.sql` | First `embeddings` table (384-dim) |
| `002_update_to_openai_embeddings.sql` | Reworked `embeddings` table and `match_documents` |
| `003_fix_supabase_security_issues.sql` | RLS and search_path fixes for the legacy `documents` table |

### 006_drop_legacy_rag.sql
Drops the legacy tables and functions (`documents`, `embeddings`, `match_documents`, debug helpers).

**Irreversible. Run it last**, only after the current backend is deployed to production and verified, because older deployed code reads `documents`.

## Running migrations

Open the Supabase Dashboard → SQL Editor, paste the file, and run it. Do them one at a time, in numeric order.

(`supabase db push` is not set up for this folder: the CLI reads `supabase/migrations/`, which this project does not use.)

## Current schema

```
kb_chunks      id uuid, source_file, source_type ('personal'|'project'), project_id, heading_path,
               content, content_hash, chunk_index, metadata jsonb, embedding vector(384), fts tsvector
               unique (source_file, content_hash)
rate_limits    key, window_start, hits   (primary key: key, window_start)
```
