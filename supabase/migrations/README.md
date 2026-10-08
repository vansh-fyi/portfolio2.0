# Supabase Migrations

SQL for the Supabase database, applied in numeric order (see "Running migrations" below).

## Current

### 004_kb_chunks_hybrid_search.sql
Ursa's knowledge base:
- `kb_chunks` table: heading-aware chunks with a 384-dimension `gte-small` embedding (HNSW index), a generated full-text column, and a `content_hash` used for incremental ingest. Public read via RLS; writes need the service role key.
- `kb_hybrid_search(query_text, query_embedding, match_count, filter_source_type, filter_project_id)`: vector and full-text ranking merged with Reciprocal Rank Fusion. Filters are applied inside SQL.

### 005_rate_limits.sql
- `rate_limits` table and `rate_limit_hit(key, window_seconds, max)`: fixed-window counters shared by all serverless instances. Executable only by the service role.

### 007_blog.sql
Blog and image CMS: `posts`, `media` and `post_media` tables, row level security (public reads published posts and image metadata only; all writes go through the service role), the `blog` source type for `kb_chunks`, and the public `media` storage bucket.

### 008_media_originals.sql
Private `media-originals` bucket for the untouched uploads (they can contain EXIF/GPS). The public `media` bucket only holds processed, metadata-free WebP variants. Adds `media.original_name`.

## Legacy (superseded)

These belong to the first Ursa pipeline (HuggingFace MiniLM embeddings). They are kept for history only.

| File | What it did |
|---|---|
| `001_create_embeddings_table.sql` | First `embeddings` table (384-dim) |
| `002_update_to_openai_embeddings.sql` | Reworked `embeddings` table and `match_documents` |
| `003_fix_supabase_security_issues.sql` | RLS and search_path fixes for the legacy `documents` table |

### 006_drop_legacy_rag.sql
Drops the legacy tables and functions (`documents`, `embeddings`, `match_documents`, debug helpers).

**Irreversible. Run it last**, only after the current site is deployed to production and verified, because older deployed code reads `documents`.

## Running migrations

Migrations are applied with the Supabase CLI from the **repo root** (not `vansh.fyi/`). Link the project once, and put the database password in your shell:

```bash
supabase link --project-ref dhwhdzlfekvlcydagsbj          # once; "vansh-fyi's Project"
export SUPABASE_DB_PASSWORD='...'                         # Dashboard > Project Settings > Database
```

### Adding a migration

1. Create the next numbered file, e.g. `008_short_description.sql`. Keep numbers increasing and **never edit a migration that has been applied**; write a new one instead.
2. Preview, then apply:
   ```bash
   supabase db push --dry-run     # lists exactly which files would run
   supabase db push
   ```
3. `supabase migration list` shows local and remote side by side; they should match.

### One-time setup: tell the CLI that 001-007 are already applied

001-007 were originally run by hand in the SQL editor, so Supabase's history table (`supabase_migrations.schema_migrations`) does not list them. Without this step `db push` would try to run **all** of them again, including `006_drop_legacy_rag.sql`. Run once:

```bash
supabase migration repair --status applied 001 002 003 004 005 006 007
supabase db push --dry-run     # must say the remote database is up to date
```

Then `supabase db push` only ever applies files newer than 007.

### Fallbacks

- If `db push` fails with *"permission denied to alter role cli_login_postgres"*, the passwordless login role is broken for this project. Set `SUPABASE_DB_PASSWORD` as above (the CLI then connects with the password).
- You can always paste a single file into Dashboard > SQL Editor. Run it, then mark it applied with `supabase migration repair --status applied <number>` so the CLI stays in sync.

## Current schema

```
kb_chunks      id uuid, source_file, source_type ('personal'|'project'), project_id, heading_path,
               content, content_hash, chunk_index, metadata jsonb, embedding vector(384), fts tsvector
               unique (source_file, content_hash)
rate_limits    key, window_start, hits   (primary key: key, window_start)
posts          id, slug (unique), title, excerpt, body_md, cover_media_id, tags text[], status ('draft'|'published'),
               published_at, seo_title, seo_description, reading_minutes, fts
media          id, storage_path, variants jsonb, alt, width, height, blur_data_url, mime, bytes
post_media     post_id, media_id   (which posts use which images)
```
