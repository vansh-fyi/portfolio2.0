# Story 5.1: Content Migration & Metadata

Status: drafted

## Story

As a developer,
I want to migrate the project content from the `rag` directory to the application structure and ensure it has the necessary metadata,
so that the RAG system can index it correctly and support granular project-specific queries.

## Acceptance Criteria

1.  **Given** the `rag/case_studies` directory
    *   **When** I migrate the files to `_content/projects`
    *   **Then** all files are correctly placed and accessible.

2.  **Given** the markdown files
    *   **When** I inspect the content
    *   **Then** all files have YAML frontmatter with `projectId`, `title`, and `category`.

3.  **Given** the ingestion script
    *   **When** I run it
    *   **Then** it successfully parses the new frontmatter.
    *   **And** populates the Supabase `embeddings` table with `metadata` containing `projectId`.

## Tasks / Subtasks

- [ ] **Migrate Content** (AC: 1)
  - [ ] Copy files from `rag/case_studies` to `_content/projects`
  - [ ] Organize by category if needed (or flat structure with category metadata)
- [ ] **Add Metadata** (AC: 2)
  - [ ] Add YAML frontmatter to all markdown files
  - [ ] Fields: `projectId` (kebab-case), `title` (Display Name), `category` (e.g., "Product Design")
- [ ] **Update Ingestion Script** (AC: 3)
  - [ ] Modify `ingestion-scripts/src/ingest.ts` to parse frontmatter
  - [ ] Update `generateEmbedding` or upsert logic to include `projectId` in metadata
- [ ] **Verify Data** (AC: 3)
  - [ ] Run ingestion script
  - [ ] Check Supabase table for correct metadata

## Dev Notes

- **Source Directory**: `rag/case_studies`
- **Target Directory**: `_content/projects`
- **Metadata Schema**:
  ```yaml
  ---
  projectId: "aether"
  title: "Aether"
  category: "Product Design"
  ---
  ```
- **Supabase Schema**: Ensure `metadata` column (JSONB) is used to store these fields. No schema change needed, just data population.

## Dev Agent Record

### Context Reference

- `docs/sprint-artifacts/stories/5-1-content-migration-metadata.context.xml`

### Agent Model Used

- Gemini 2.0 Flash

### Debug Log References

- None yet.
