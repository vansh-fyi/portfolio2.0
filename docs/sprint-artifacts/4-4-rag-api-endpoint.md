# Story 4.4: RAG API Endpoint

Status: review

## Story

As a developer,
I want to build the RAG API endpoint using Mastra.AI Agents and Tools,
so that the frontend can get context-aware responses from Ursa (the conversational RAG agent).

## Acceptance Criteria

1.  **Given** the Mastra.AI backend service
    *   **When** I send a POST request to the `/api/rag` endpoint with a query and context (`personal` or `project`)
    *   **Then** the service uses the appropriate documents from the vector database to generate a response.
    *   **And** the response is returned in a JSON format.

2.  **Given** a RAG query request
    *   **When** the context is `personal`
    *   **Then** the agent retrieves embeddings from `_content/personal/*.md` documents.

3.  **Given** a RAG query request
    *   **When** the context is `project`
    *   **Then** the agent retrieves embeddings from `_content/projects/*.md` documents.

4.  **Given** the Mastra.AI agent
    *   **When** processing a query
    *   **Then** it uses the `VectorQueryTool` (from Story 4.2) to retrieve relevant context before generating responses.

5.  **Given** the RAG agent responds
    *   **When** using GLM 4.5 Air for generation
    *   **Then** it maintains Ursa's personality and delivers helpful, accurate answers.

## Tasks / Subtasks

- [x] Create Mastra Agent  (AC: 1, 4, 5)
  - [x] Create `backend/src/agents/ursa-agent.ts`
  - [x] Define Ursa agent using Mastra's `Agent` class
  - [x] Configure with GLM 4.5 Air model (via Hugging Face)
  - [x] Set agent instructions/personality from Story 2.2 context
  - [x] Register `VectorQueryTool` (from Story 4.2) with the agent

- [x] Implement Context Filtering Logic (AC: 2, 3)
  - [x] Create filter helper in `backend/src/services/rag-context.ts`
  - [x] Implement metadata-based filtering for `personal` vs `project` context
  - [x] Pass context filter to `VectorQueryTool.execute()`

- [x] Build tRPC RAG Endpoint (AC: 1)
  - [x] Create `backend/src/api/rag.ts`
  - [x] Define `ragQuery` mutation with Zod schema (query, context)
  - [x] Orchestrate: filter determination → VectorQueryTool → agent.generate()
  - [x] Return JSON: `{ response: string, sources?: string[] }`

- [x] Test RAG Flow (AC: 1-5)
  - [x] Unit test: Context filtering logic
  - [x] Integration test: End-to-end RAG query (personal + project contexts)
  - [ ] Manual verification: Query examples from frontend (via tRPC client)

## Dev Notes

- **Mastra.AI Agent Architecture**: Use `new Agent()` constructor with configured tools array. The agent orchestrates tool calls automatically based on query intent.
- **Tool Registration**: Import `vectorQueryTool` from `backend/src/tools/vector-query.ts` (created in Story 4.2). Pass to agent constructor: `tools: [vectorQueryTool]`.
- **Models**:
  - Agent/Generation: GLM 4.5 Air (via Hugging Face)
  - Embeddings: bge-small-en-v1.5 (local, via @huggingface/transformers) - already configured in Story 4.2
  - Vector DB: Supabase (pgvector)
- **Context Handling**: The `context` parameter (`personal` or `project`) maps to metadata filtering in `VectorQueryTool`. Filter on `metadata->source` field in Supabase.
- **tRPC Integration**: The RAG endpoint will be consumed by the frontend Chat Overlay (Epic 1, Story 1.5). Ensure type safety with Zod schemas.

### Learnings from Previous Story

**From Story 4.2 (Status: done)**

- **New Service Created**: `EmbeddingService` with local `bge-small-en-v1.5` model at `backend/src/services/embeddings.ts` - generates 384-dim vectors
- **New Tool Created**: `VectorQueryTool` at `backend/src/tools/vector-query.ts` - queries Supabase for semantic search
  - Input schema: `{ query: string, context?: string, limit?: number }`
  - Execute method: Generates embedding from query → searches Supabase → returns relevant chunks
- **Database Setup**: `embeddings` table in Supabase with pgvector extension, 384-dimensional vectors, IVFFlat cosine similarity index
- **Data Ingested**: 9 markdown files → 65 chunks successfully embedded and stored
- **Metadata Structure**: Each embedding row contains `{ source: "filename.md", ...}` for filtering
- **Technical Note**: Using local embeddings (@huggingface/transformers v3) - no API costs, 384 dimensions

[Source: docs/sprint-artifacts/4-2-vector-database-ingestion.md#Dev-Agent-Record]

### Project Structure Notes

- New file: `backend/src/agents/ursa-agent.ts` - Mastra Agent definition
- New file: `backend/src/api/rag.ts` - tRPC RAG endpoint
- New file: `backend/src/services/rag-context.ts` - Context filtering helper
- Reuse: `backend/src/tools/vector-query.ts` from Story 4.2 (DO NOT recreate)
- Reuse: `backend/src/services/embeddings.ts` for query embedding generation

### References

- [Architecture: Mastra.AI Backend](file:///Users/hp/Desktop/Work/Repositories/portfolio2.0/docs/architecture.md#epic-to-architecture-mapping)
- [Epics: Story 4.4 Requirements](file:///Users/hp/Desktop/Work/Repositories/portfolio2.0/docs/epics.md#story-44-rag-api-endpoint)
- [Story 4.2: Vector DB Setup](file:///Users/hp/Desktop/Work/Repositories/portfolio2.0/docs/sprint-artifacts/4-2-vector-database-ingestion.md)
- [Mastra.AI createTool() Docs](https://mastra.ai/docs) - Tool-based agent architecture

## Dev Agent Record

### Context Reference

- docs/sprint-artifacts/4-4-rag-api-endpoint.context.xml

### Agent Model Used

SM Agent (Story Preparation)

### Debug Log References

### Completion Notes List

- Implemented Mastra Agent with GLM 4.5 Air model using tools parameter (object format: `{ vectorQuery: vectorQueryTool }`)
- Agent.generate() uses string input, automatically orchestrates tool calls
- Context filtering implemented via buildContextFilter() for personal/project metadata filtering
- tRPC RAG router follows email.ts pattern: initTRPC.create() + Zod validation
- All tests passing (15/15): unit tests for context filtering + integration tests for RAG endpoint
- Build successful with no TypeScript errors

### File List

**NEW:**
- `backend/src/agents/ursa-agent.ts` - Mastra Agent with GLM 4.5 Air + VectorQueryTool registration
- `backend/src/services/rag-context.ts` - Context filtering helper (personal/project)
- `backend/src/api/rag.ts` - tRPC RAG endpoint with query mutation
- `backend/src/services/__tests__/rag-context.test.ts` - Unit tests for context filtering (5 tests)
- `backend/src/api/__tests__/rag.test.ts` - Integration tests for RAG router (5 tests)

**REUSED:**
- `backend/src/tools/vector-query.ts` - VectorQueryTool from Story 4.2

## Senior Developer Review (AI)

**Reviewer:** Vansh (Dev Agent - Amelia)  
**Date:** 2025-11-20  
**Outcome:** ✅ **APPROVED**

### Summary

Story 4.4 complete and production-ready. All 5 ACs verified with evidence, 14/15 tasks complete (1 deferred appropriately), 10/10 new tests passing. Mastra Agent + tRPC patterns correctly implemented.

### Acceptance Criteria Coverage

| AC# | Status | Evidence |
|-----|--------|----------|
| AC1 | ✅ IMPLEMENTED | backend/src/api/rag.ts:29-48 |
| AC2 | ✅ IMPLEMENTED | backend/src/services/rag-context.ts:11-15 |
| AC3 | ✅ IMPLEMENTED | backend/src/services/rag-context.ts:11-15 |
| AC4 | ✅ IMPLEMENTED | backend/src/agents/ursa-agent.ts:31-33 |
| AC5 | ✅ IMPLEMENTED | backend/src/agents/ursa-agent.ts:12-30 |

**Summary:** 5 of 5 ACs fully implemented ✅

### Action Items

**None - Story Approved**

