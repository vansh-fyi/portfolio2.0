# Backend Migrations

This directory contains SQL migrations for the Supabase vector database.

## Migrations

### 001_create_embeddings_table.sql (DEPRECATED)
**Status:** Superseded by 002_update_to_openai_embeddings.sql

Original migration using 384-dimension vectors for `bge-small-en-v1.5` model.

### 002_update_to_openai_embeddings.sql
**Status:** Current

Creates/updates the embeddings table for OpenAI's `text-embedding-3-small` model (1536 dimensions).

## Running Migrations

### Option 1: Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the migration SQL
4. Run the query

### Option 2: Supabase CLI
```bash
# If you have Supabase CLI installed
supabase migration new update_to_openai_embeddings
# Then run:
supabase db push
```

## Current Schema

```sql
Table: public.embeddings
- id: BIGSERIAL (Primary Key)
- content: TEXT (chunk of text)
- embedding: vector(1536) (OpenAI embedding)
- metadata: JSONB (source_type, source_file, etc.)
- created_at: TIMESTAMP

Function: match_documents(query_embedding, match_threshold, match_count, filter)
- Performs semantic similarity search
- Returns: id, content, metadata, similarity score
```
