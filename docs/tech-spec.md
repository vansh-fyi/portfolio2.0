# portfolio2.0 - Technical Specification

**Author:** Vansh
**Date:** 2025-11-25
**Project Level:** Quick Flow (3 Stories)
**Change Type:** Bug Fixes & Improvements
**Development Context:** Brownfield - React portfolio at 90% completion

---

## Context

### Available Documents

**Documents Loaded:**
- ✅ **PRD** (docs/PRD.md) - Complete product requirements with epic breakdown
- ✅ **Architecture** (docs/architecture.md) - Full tech stack decisions and patterns
- ✅ **Brownfield Documentation** (docs/index.md + shards) - Comprehensive project analysis
- ✅ **Test Design** (docs/test-design-system.md) - Testing strategy and framework setup
- ✅ **Sprint Artifacts** - Epic/story tracking in sprint-status.yaml

**Project Status:** At ~90% completion with core features implemented. Now addressing critical bugs and polish issues before production deployment.

### Project Stack

**Frontend Stack:**
- **React:** 19.2.0 with React DOM 19.2.0 (latest stable)
- **TypeScript:** 5.9.3
- **Build Tool:** Vite 7.2.2 (ultra-fast HMR and bundling)
- **Styling:** Tailwind CSS 4.1.17 (utility-first CSS)
- **State Management:** Zustand 5.0.8 (lightweight, no boilerplate)
- **API Client:** tRPC Client 11.7.1 with @tanstack/react-query 5.90.10 (type-safe RPC)
- **Testing:** Jest 30.2.0 + @testing-library/react 16.3.0 + jest-environment-jsdom 30.2.0

**Backend Stack:**
- **Runtime:** Node.js with TypeScript 5.9.3
- **API Framework:** tRPC Server 11.7.2 (type-safe end-to-end APIs)
- **HTTP Server:** Hono 4.10.6 (lightweight, fast)
- **AI/ML:**
  - **LLM:** meta-llama/Llama-3.2-3B-Instruct (via @ai-sdk/huggingface 0.0.4)
  - **Embeddings:** sentence-transformers/all-MiniLM-L6-v2 (384 dimensions)
  - **AI SDK:** Vercel AI SDK 5.0.97
  - **Inference:** @huggingface/inference 4.13.3
- **Vector Database:** Supabase JS Client 2.84.0 with pgvector
- **Email Service:** Resend 6.5.2 (transactional emails)
- **Testing:** Jest 30.2.0 + ts-jest 29.4.5

**Development Tools:**
- **Linting:** ESLint 9.39.1 with typescript-eslint 8.46.3
- **Code Formatting:** Prettier 3.6.2
- **Version Control:** Git (clean working tree)

### Existing Codebase Structure

**Directory Organization:**

```
portfolio2.0/
├── vansh.fyi/                    # Frontend React application
│   ├── src/
│   │   ├── components/           # React components
│   │   │   ├── overlays/         # ProjectOverlay, ChatOverlay, OverlaySidebar
│   │   │   ├── LeadGenChat.tsx   # Lead generation chat interface
│   │   │   ├── Header.tsx, Hero.tsx, Projects.tsx, etc.
│   │   │   └── __tests__/        # Component tests (Jest + RTL)
│   │   ├── state/                # Zustand stores
│   │   │   ├── overlayStore.ts   # View routing (main/projects/chat) + chat context
│   │   │   ├── themeStore.ts     # Light/dark theme management
│   │   │   └── __tests__/        # Store unit tests
│   │   ├── hooks/                # Custom React hooks
│   │   │   ├── useRAGQuery.ts    # RAG query hook (tRPC wrapper)
│   │   │   └── __tests__/
│   │   ├── services/             # External service clients
│   │   │   ├── trpc.tsx          # tRPC client configuration
│   │   │   └── __mocks__/        # Mock implementations for testing
│   │   ├── config/               # Configuration files
│   │   │   └── projects.ts       # Project metadata and display info
│   │   ├── data/                 # Static data
│   │   │   └── projects.ts       # Project data
│   │   ├── types/                # TypeScript type definitions
│   │   │   └── trpc.ts           # tRPC type definitions
│   │   ├── App.tsx               # Main app component
│   │   └── main.tsx              # React entry point
│   ├── package.json              # Frontend dependencies
│   ├── tsconfig.json             # TS config (ES2022, bundler resolution)
│   └── vite.config.ts            # Vite build configuration
│
├── backend/                      # Backend service
│   ├── src/
│   │   ├── api/                  # tRPC API routes
│   │   │   ├── rag.ts            # RAG query endpoint (CRITICAL - buggy)
│   │   │   ├── email.ts          # Email/lead-gen endpoint
│   │   │   ├── index.ts          # Router aggregation
│   │   │   └── __tests__/        # API tests
│   │   ├── services/             # Business logic services
│   │   │   ├── embeddings.ts     # HuggingFace embedding generation
│   │   │   ├── rag.ts            # RAG orchestration logic
│   │   │   ├── rag-context.ts    # Context building for RAG
│   │   │   ├── supabase.ts       # Supabase client setup
│   │   │   ├── email.ts          # Resend email service
│   │   │   ├── config.ts         # Environment config
│   │   │   ├── ingestion/        # Data ingestion utilities
│   │   │   └── __tests__/        # Service tests
│   │   ├── scripts/              # Standalone scripts
│   │   │   ├── ingest-data.ts    # Local ingestion script (RUN THIS!)
│   │   │   ├── verify-db.ts      # DB verification utility
│   │   │   ├── test-embedding.ts # Embedding testing
│   │   │   └── test-rag-api.ts   # RAG API testing
│   │   ├── index.ts              # Serverless entry point (Vercel)
│   │   └── local-server.ts       # Local dev server
│   ├── package.json              # Backend dependencies
│   └── tsconfig.json             # TS config (ES2020, commonjs)
│
├── _content/                     # RAG source content (markdown)
│   ├── personal/                 # About Vansh (bio, skills, experience)
│   └── projects/                 # Project details (technical specs, features)
│
└── docs/                         # Documentation
    ├── sprint-artifacts/         # User stories and sprint tracking
    ├── PRD.md, architecture.md, etc.
    └── tech-spec.md              # THIS DOCUMENT
```

**Key Patterns Identified:**

**Frontend Patterns:**
- **Component Structure:** Functional components with TypeScript interfaces
- **Naming:** PascalCase for components, camelCase for functions/variables
- **State Management:** Zustand stores for global state, useState for local state
- **Styling:** Tailwind utility classes, no CSS modules
- **Testing:** Jest with React Testing Library, co-located __tests__ folders

**Backend Patterns:**
- **File Naming:** kebab-case (rag-service.ts, email.ts)
- **Module Structure:** Service layer pattern (api → services → external APIs)
- **Error Handling:** Try-catch with console logging, tRPC error responses
- **Testing:** Jest with ts-jest, __tests__ folders

**Code Style (from .eslintrc + observed patterns):**
- **Quotes:** Single quotes for strings
- **Semicolons:** Yes (enforced by ESLint)
- **Indentation:** 4 spaces (TypeScript files)
- **Trailing Commas:** Yes (ES2022)
- **Import Order:** External deps first, then internal modules

---

## The Change

### Problem Statement

**Critical Issue #1: RAG System Non-Functional (Blocker)**

The conversational RAG agent ("Ask Ursa") is completely non-functional despite having all code in place. Investigation revealed the root cause: **The `documents` table does not exist in Supabase**. Queries to the database return "relation 'documents' does not exist" errors. This means:
- No vector embeddings are stored in the database
- RAG queries cannot retrieve relevant context
- Chat returns "no knowledge" responses and asks users to provide information instead

This is a **production blocker** - the core AI feature is unusable.

**Issue #2: Project Context Lost When Opening Chat**

When a user views a project (e.g., "DriQ Health") in the ProjectOverlay and clicks "Ask Ursa", the chat opens but:
- The selected project highlight disappears from the sidebar
- Clicking other projects in the sidebar does nothing (unresponsive)
- The projectId is not properly passed to the chat context
- Expected behavior: Chat should maintain project selection and allow switching projects via sidebar clicks, with each switch resetting the chat to query only that project's context

**Issue #3: Mobile Responsive Freezing (Severe UX Issue)**

On mobile devices (tested on multiple devices), the application becomes completely unresponsive and requires force restart after:
- Opening the chat or lead-gen agent
- Navigating back and forth between main view and overlays
- Performing 2-3 navigation cycles

Likely causes: Memory leaks, uncleared tRPC queries, excessive re-renders, or React state thrashing during overlay transitions.

### Proposed Solution

**Solution #1: Create Supabase Schema & Ingest Data**

1. **Create Database Schema:**
   - Create `documents` table with proper structure:
     - `id` (uuid primary key)
     - `content` (text) - the chunk content
     - `embedding` (vector(384)) - 384-dimensional vector from all-MiniLM-L6-v2
     - `metadata` (jsonb) - source_type, source_file, projectId, etc.
   - Enable pgvector extension
   - Create RPC function `match_documents` for vector similarity search
   - Add indexes for performance (GIN on metadata, IVFFlat on embedding)

2. **Run Ingestion Scripts:**
   - Execute existing `backend/src/scripts/ingest-data.ts` locally
   - Load all markdown files from `/_content/personal/` and `/_content/projects/`
   - Generate embeddings using sentence-transformers/all-MiniLM-L6-v2
   - Insert documents with proper metadata into Supabase

3. **Verify & Test:**
   - Query documents table to confirm data exists
   - Test RAG queries with various contexts (personal, project-specific)
   - Validate embeddings are correctly retrieved and used by LLM

**Solution #2: Fix Project Selection State Management**

1. **Preserve projectId in Chat Transition:**
   - Ensure `goToProjectChat()` properly sets and persists projectId in overlayStore
   - ChatOverlay must read projectId on mount and maintain it
   - Fix sidebar to remain interactive and highlight selected project

2. **Implement Project Switching in Chat:**
   - Clicking a project in sidebar while in chat should:
     - Call `goToProjectChat(newProjectId)`
     - Reset chat history completely (no persistence)
     - Update RAG context to query only the new project
   - Visual feedback: Update sidebar highlight immediately

3. **Fix Close Button Behavior:**
   - "Close Ursa" should navigate back to ProjectOverlay
   - Ensure the correct project remains selected after closing chat
   - On mobile, "Close" should return to project iframe view

**Solution #3: Fix Mobile Memory Leak & Freezing**

1. **Audit Component Lifecycle:**
   - Review useEffect cleanup in ChatOverlay, ProjectOverlay, LeadGenChat
   - Ensure tRPC queries are properly cancelled on unmount
   - Check for uncleared intervals/timeouts

2. **Optimize Re-renders:**
   - Use React.memo for expensive components
   - Audit Zustand subscriptions to prevent unnecessary re-renders
   - Check if tRPC queries are being called excessively

3. **Fix Memory Leaks:**
   - Abort pending tRPC requests on navigation
   - Clear large state objects (chat history) on overlay close
   - Verify event listeners are removed on unmount

### Scope

**In Scope:**

✅ **Issue #1: RAG System Setup**
- Create complete Supabase schema with pgvector support
- Write SQL migration script for reproducibility
- Document the schema structure and RPC function
- Run local ingestion scripts to populate database
- Verify RAG queries work end-to-end with test queries
- Document ingestion process for future content updates

✅ **Issue #2: Project Context Management**
- Fix overlayStore state transitions (project → chat)
- Ensure projectId persists through navigation
- Make sidebar interactive in chat view
- Implement project switching with chat reset
- Fix close button to return to correct project view
- Add visual feedback for selected project

✅ **Issue #3: Mobile Performance**
- Diagnose and fix memory leak causing freezes
- Implement proper cleanup in overlay components
- Optimize re-render performance
- Test on multiple mobile devices/browsers
- Ensure smooth navigation between views

✅ **Testing & Validation**
- Unit tests for state management fixes
- Integration tests for RAG query flow
- Manual testing on mobile devices
- Performance profiling to verify memory leak fix

**Out of Scope:**

❌ Migration to llama-embed-nemotron-8b (4096d) - This is a future enhancement requiring a separate tech-spec, migration plan, and complete re-ingestion
❌ Chat history persistence - Chats are ephemeral by design, no backend storage
❌ Streaming responses - Future enhancement (Epic 4 scope)
❌ New features or UI redesigns - This is bug fixes only
❌ Backend deployment changes - Using existing Vercel serverless setup
❌ Authentication/authorization - Site remains fully public

**🚨 CRITICAL CONSTRAINT:**

**NO UI/VISUAL CHANGES WHATSOEVER** - The existing UI design, layout, styling, colors, fonts, spacing, animations, and visual appearance MUST remain 100% identical. This is exclusively backend logic, state management, and performance fixes. DO NOT modify:
- Tailwind classes for styling/layout purposes
- Component visual structure or DOM hierarchy
- CSS animations or transitions
- Color schemes or theme variables
- Font sizes, weights, or families
- Spacing, padding, or margins
- Any visual design elements

The ONLY acceptable UI changes are:
- Adding `onClick` handlers (functionality, not appearance)
- Adding conditional CSS classes for state highlighting (using existing styles)
- Adding `data-testid` attributes for testing

If a fix requires changing how something LOOKS, it's out of scope.

---

## Implementation Details

### Source Tree Changes

**Story 1: RAG Database Setup & Data Ingestion**

- `backend/sql/create-documents-table.sql` - **CREATE** - SQL migration script for Supabase schema
- `backend/src/services/supabase.ts` - **MODIFY** - Add type definitions for documents table
- `backend/src/scripts/ingest-data.ts` - **VERIFY/MODIFY** - Ensure script works with new schema, add error handling
- `backend/README.md` - **MODIFY** - Document database setup and ingestion process
- `docs/supabase-schema.md` - **CREATE** - Document table structure and RPC functions

**Story 2: Project Selection State Management**

- `vansh.fyi/src/state/overlayStore.ts` - **MODIFY** - Fix goToProjectChat() to properly persist projectId
- `vansh.fyi/src/components/overlays/ChatOverlay.tsx` - **MODIFY** - Read projectId on mount, handle project switching
- `vansh.fyi/src/components/overlays/OverlaySidebar.tsx` - **MODIFY** - Make sidebar interactive in chat mode, add click handlers
- `vansh.fyi/src/components/overlays/ProjectOverlay.tsx` - **MODIFY** - Fix close button navigation logic
- `vansh.fyi/src/state/__tests__/overlayStore.test.ts` - **MODIFY** - Add tests for project context persistence
- `vansh.fyi/src/components/overlays/__tests__/ChatOverlay.test.tsx` - **MODIFY** - Add tests for project switching

**Story 3: Mobile Memory Leak & Performance Fix**

- `vansh.fyi/src/components/overlays/ChatOverlay.tsx` - **MODIFY** - Add proper cleanup in useEffect hooks
- `vansh.fyi/src/components/LeadGenChat.tsx` - **MODIFY** - Add cleanup for tRPC queries and event listeners
- `vansh.fyi/src/components/overlays/ProjectOverlay.tsx` - **MODIFY** - Optimize re-renders with React.memo
- `vansh.fyi/src/hooks/useRAGQuery.ts` - **MODIFY** - Add query cancellation on unmount
- `vansh.fyi/src/services/trpc.tsx` - **VERIFY** - Ensure proper query cleanup configuration
- `vansh.fyi/src/App.tsx` - **VERIFY** - Check for memory leaks in root component

### Technical Approach

**Story 1: Database Schema & Ingestion**

Use **Supabase SQL Editor** to execute migration script that creates:
1. **pgvector extension** - Enable vector similarity search
2. **documents table** - Store text chunks with 384-dimensional embeddings
3. **match_documents RPC function** - PostgreSQL function for vector similarity using cosine distance
4. **Indexes** - GIN index on metadata JSONB, IVFFlat index on embedding vector

Run **existing ingestion script** (`backend/src/scripts/ingest-data.ts`) locally using ts-node:
- Script already uses @huggingface/inference with sentence-transformers/all-MiniLM-L6-v2
- Reads markdown files from `/_content/personal/` and `/_content/projects/`
- Chunks text, generates embeddings, inserts into Supabase
- Uses existing dependencies - no new packages needed

**Story 2: State Management Fix**

Use **Zustand's get/set pattern** to ensure atomic state updates:
- `goToProjectChat()` must set all three: `currentView='chat'`, `chatContext='project'`, `projectId=<id>`
- ChatOverlay reads initial state from `useViewStore.getState()` on mount
- Sidebar uses `onClick` handlers that call `goToProjectChat(newId)` instead of passive rendering
- Add visual feedback using conditional CSS classes based on `projectId` match

**Story 3: Memory Leak Fix**

Implement **proper React cleanup patterns**:
- Every `useEffect` that creates subscriptions/listeners must return cleanup function
- Use tRPC's `enabled` option and manual `refetch()` to control query lifecycle
- Add `AbortController` for tRPC queries and abort on unmount
- Use `React.memo` on expensive components (ChatOverlay, ProjectOverlay)
- Clear chat history on overlay close by resetting component state

**Performance Testing:**
- Use Chrome DevTools Performance profiler to identify memory leaks
- Monitor heap snapshots before/after navigation cycles
- Test on real mobile devices (iOS Safari, Android Chrome)

### Existing Patterns to Follow

**Backend Patterns (from architecture.md):**

- **File Naming:** kebab-case for all TypeScript files (e.g., `create-documents-table.sql`)
- **Error Handling:** Try-catch with descriptive console.error messages, throw errors up to tRPC handler
- **Logging:** Use console.log with emoji prefixes for visibility (🔍, ✅, ❌, 📤)
- **Database Queries:** Use Supabase JS client methods, handle errors explicitly
- **Scripts:** Standalone scripts in `backend/src/scripts/` run via ts-node

**Frontend Patterns (from existing code):**

- **State Management:** Zustand stores with TypeScript interfaces, use `create<Interface>()` pattern
- **Components:** Functional components with explicit return types
- **Hooks:** Custom hooks prefixed with `use`, return objects (not arrays)
- **Styling:** Tailwind utility classes, use `className` prop
- **Event Handlers:** Named functions (not inline lambdas) for clarity: `handleProjectClick`, `handleClose`
- **Testing:** Jest + RTL, co-located `__tests__` folders, use `describe/it/expect` pattern

**Code Style (enforced by ESLint):**

- **Quotes:** Single quotes for strings
- **Semicolons:** Required at end of statements
- **Indentation:** 4 spaces (TypeScript), 2 spaces (JSON/config)
- **Trailing Commas:** Yes (multi-line objects/arrays)
- **Import Order:** External deps first, blank line, then internal modules
- **TypeScript:** Explicit types on function parameters/returns, use interfaces over types

### Integration Points

**Story 1: RAG Database Integration**

- **Backend ↔ Supabase:**
  - `backend/src/services/supabase.ts` connects using `@supabase/supabase-js` client
  - Environment variables: `SUPABASE_URL`, `SUPABASE_ANON_KEY` (from .env)
  - RPC call: `supabase.rpc('match_documents', {...})` returns similarity-scored documents
  - Filtering: Uses JSONB operators (`metadata->>'source_type'`, `metadata->>'projectId'`)

- **Backend ↔ HuggingFace:**
  - `backend/src/services/embeddings.ts` uses `@huggingface/inference` SDK
  - Model: `sentence-transformers/all-MiniLM-L6-v2` via `hf.featureExtraction()`
  - Environment: `HUGGINGFACE_API_KEY` required
  - Output: 384-dimensional number array

**Story 2: State Management Integration**

- **overlayStore ↔ ChatOverlay:**
  - ChatOverlay subscribes to store via `useViewStore()` hook
  - Reads: `currentView`, `chatContext`, `projectId`
  - Triggers: Re-render when store updates

- **ChatOverlay ↔ tRPC:**
  - Calls `trpc.rag.query.useQuery({ query, context, projectId })`
  - Uses `enabled: false` with manual `refetch()` for control
  - Passes projectId from store to backend

**Story 3: Component Lifecycle Integration**

- **React ↔ tRPC Queries:**
  - @tanstack/react-query manages query lifecycle
  - Component unmount should cancel in-flight queries
  - Use query invalidation on navigation

- **Mobile Browser ↔ React:**
  - Mobile browsers have stricter memory limits
  - Must be aggressive about cleanup
  - Avoid keeping large objects in memory between navigations

---

## Development Context

### Relevant Existing Code

**Story 1: RAG Database - Key References**

- `backend/src/api/rag.ts:85-130` - Current `generateRagResponse()` function that queries Supabase
- `backend/src/services/embeddings.ts:12-36` - HuggingFace embedding generation (already correct)
- `backend/src/scripts/ingest-data.ts` - Complete ingestion script (needs verification)
- Architecture doc specifies: "sentence-transformers/all-MiniLM-L6-v2, 384-dimensional"

**Story 2: State Management - Key References**

- `vansh.fyi/src/state/overlayStore.ts:35-37` - Current `goToProjectChat()` implementation (buggy)
- `vansh.fyi/src/components/overlays/ChatOverlay.tsx` - Where chat context is consumed
- `vansh.fyi/src/components/overlays/OverlaySidebar.tsx` - Sidebar rendering logic (passive, needs onClick)
- `vansh.fyi/src/components/overlays/ProjectOverlay.tsx` - "Ask Ursa" button that triggers chat

**Story 3: Memory Leak - Key References**

- `vansh.fyi/src/hooks/useRAGQuery.ts:15-32` - tRPC query hook without cleanup
- `vansh.fyi/src/components/overlays/ChatOverlay.tsx` - Main culprit (check useEffect hooks)
- `vansh.fyi/src/components/LeadGenChat.tsx` - Secondary culprit (lead-gen chat)
- React Query docs: Query cancellation and cleanup patterns

### Dependencies

**Framework/Libraries (Already Installed):**

**Frontend:**
- React 19.2.0 + React DOM 19.2.0 - Core UI framework
- TypeScript 5.9.3 - Type safety
- Zustand 5.0.8 - State management
- @tanstack/react-query 5.90.10 - Async state management for tRPC
- @trpc/client 11.7.1 + @trpc/react-query 11.7.1 - Type-safe API calls
- Jest 30.2.0 + @testing-library/react 16.3.0 - Testing

**Backend:**
- @supabase/supabase-js 2.84.0 - Supabase client
- @huggingface/inference 4.13.3 - Embedding generation
- @ai-sdk/huggingface 0.0.4 + ai 5.0.97 - LLM integration
- @trpc/server 11.7.2 - tRPC server
- TypeScript 5.9.3 - Type safety
- ts-node 10.9.2 - Run scripts locally

**NO NEW DEPENDENCIES REQUIRED** - All necessary packages already installed.

### Internal Modules

**Story 1 Dependencies:**
- `backend/src/services/supabase.ts` - Supabase client export
- `backend/src/services/embeddings.ts` - Embedding generation function
- `backend/src/services/config.ts` - Environment variable configuration

**Story 2 Dependencies:**
- `vansh.fyi/src/state/overlayStore.ts` - Global view state
- `vansh.fyi/src/config/projects.ts` - Project metadata (IDs, names, URLs)
- `vansh.fyi/src/services/trpc.tsx` - tRPC client instance

**Story 3 Dependencies:**
- `vansh.fyi/src/hooks/useRAGQuery.ts` - RAG query hook
- `vansh.fyi/src/services/trpc.tsx` - tRPC client configuration
- React's useEffect, useRef, useCallback hooks

### Configuration Changes

**Story 1: Supabase Configuration**

**Environment Variables (backend/.env):**
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
HUGGINGFACE_API_KEY=your-hf-api-key
```

**Supabase SQL (execute in Supabase SQL Editor):**
- Run `backend/sql/create-documents-table.sql` (to be created)
- Enables pgvector extension
- Creates documents table with vector(384) column
- Creates match_documents RPC function

**Story 2: No Configuration Changes**
- Uses existing overlayStore structure
- No new environment variables
- No build configuration changes

**Story 3: No Configuration Changes**
- React Query default config already adequate
- No new environment variables
- May adjust staleTime/cacheTime if needed (tuning, not new config)

### Existing Conventions (Brownfield)

**Code Conventions (Strictly Follow These):**

**TypeScript:**
- Explicit types on function parameters and return values
- Use `interface` for object shapes, `type` for unions/intersections
- No `any` types - use `unknown` and type guards if needed
- Enable strict mode (already in tsconfig.json)

**React Components:**
- Functional components only (no class components)
- Props interface defined above component
- Return type annotation on component function
- Example: `export const ChatOverlay = (): JSX.Element => { ... }`

**State Management:**
- Zustand stores in `src/state/` directory
- Interface defined before store creation
- Use `create<Interface>()` pattern
- Expose minimal API (only necessary actions)

**Event Handlers:**
- Named functions, not inline lambdas: `const handleClick = () => { ... }`
- Prefix with `handle`: `handleProjectClick`, `handleClose`, `handleSubmit`
- Define inside component for access to props/state

**Testing:**
- Co-located `__tests__` folders next to source files
- File naming: `ComponentName.test.tsx` or `functionName.test.ts`
- Use `describe/it/expect` BDD-style assertions
- Mock external dependencies (tRPC, Supabase) in `__mocks__` folders

**Error Handling:**
- Backend: Try-catch with console.error, throw to tRPC handler
- Frontend: Use error boundaries for component errors, display user-friendly messages
- Log errors to console (no external error tracking yet)

### Test Framework & Standards

**Frontend Testing:**
- **Framework:** Jest 30.2.0
- **Environment:** jest-environment-jsdom 30.2.0 (simulate browser)
- **Testing Library:** @testing-library/react 16.3.0
- **Assertion Style:** `expect(value).toBe(expected)`
- **File Location:** Co-located `__tests__` folders
- **File Naming:** `*.test.tsx` or `*.test.ts`
- **Coverage Target:** No specific target, focus on critical paths

**Backend Testing:**
- **Framework:** Jest 30.2.0
- **TypeScript:** ts-jest 29.4.5
- **File Location:** Co-located `__tests__` folders
- **File Naming:** `*.test.ts`
- **Mocking:** Mock Supabase and HuggingFace API calls

**Test Execution:**
- Frontend: `cd vansh.fyi && npm test`
- Backend: `cd backend && npm test`
- Both use same Jest config patterns

---

## Implementation Stack

**Frontend Stack (vansh.fyi/):**
- Runtime: Browser (ES2022 target)
- Framework: React 19.2.0
- Language: TypeScript 5.9.3
- Build: Vite 7.2.2
- Styling: Tailwind CSS 4.1.17
- State: Zustand 5.0.8
- API: tRPC Client 11.7.1 + React Query 5.90.10
- Testing: Jest 30.2.0 + React Testing Library 16.3.0

**Backend Stack (backend/):**
- Runtime: Node.js 20+ (Vercel default)
- Language: TypeScript 5.9.3 (compiled to CommonJS)
- HTTP: Hono 4.10.6
- API: tRPC Server 11.7.2
- AI/ML:
  - LLM: meta-llama/Llama-3.2-3B-Instruct (HuggingFace)
  - Embeddings: sentence-transformers/all-MiniLM-L6-v2 (384d)
  - SDK: @ai-sdk/huggingface 0.0.4 + ai 5.0.97
  - Inference: @huggingface/inference 4.13.3
- Database: Supabase 2.84.0 (PostgreSQL + pgvector)
- Email: Resend 6.5.2
- Testing: Jest 30.2.0 + ts-jest 29.4.5

**Deployment:**
- Platform: Vercel (serverless functions + static hosting)
- Frontend: Static build served via Vercel CDN
- Backend: Serverless functions in `api/` directory

---

## Technical Details

### Story 1: Supabase Schema & Vector Search

**PostgreSQL + pgvector Setup:**

The `documents` table stores text chunks with vector embeddings:

```sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content TEXT NOT NULL,
    embedding vector(384) NOT NULL,  -- 384 dimensions for all-MiniLM-L6-v2
    metadata JSONB NOT NULL,          -- source_type, source_file, projectId, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Metadata Structure:**
```json
{
    "source_type": "personal" | "project",
    "source_file": "/_content/personal/bio.md",
    "projectId": "aether" | "driq-health" | null,
    "chunk_index": 0
}
```

**Vector Similarity Function:**

The `match_documents` RPC function uses cosine similarity (1 - cosine distance):

```sql
CREATE OR REPLACE FUNCTION match_documents(
    query_embedding vector(384),
    match_threshold float,
    match_count int
)
RETURNS TABLE (
    id uuid,
    content text,
    metadata jsonb,
    similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        documents.id,
        documents.content,
        documents.metadata,
        1 - (documents.embedding <=> query_embedding) AS similarity
    FROM documents
    WHERE 1 - (documents.embedding <=> query_embedding) > match_threshold
    ORDER BY documents.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;
```

**Performance Considerations:**
- Use IVFFlat index for faster vector search (acceptable for <1M vectors)
- GIN index on metadata JSONB for efficient filtering
- Cosine distance operator `<=>` is faster than L2 distance for this use case

### Story 2: State Management Flow

**Current Bug (overlayStore.ts:35-37):**

```typescript
goToProjectChat: (projectId: string, query = '') => {
    set({ currentView: 'chat', initialChatQuery: query, chatContext: 'project', projectId });
}
```

This LOOKS correct, but the issue is in ChatOverlay - it doesn't properly read projectId on mount or handle updates.

**Fix Required:**

1. ChatOverlay must use `useViewStore()` to subscribe to projectId changes
2. Sidebar must be interactive - add onClick handlers that call `goToProjectChat(newProjectId)`
3. Close button must call `goToProjects()` to return to projects view with correct selection

**State Flow:**
```
User clicks project → ProjectOverlay opens with projectId
User clicks "Ask Ursa" → goToProjectChat(projectId) → ChatOverlay opens
User clicks different project in sidebar → goToProjectChat(newProjectId) → Chat resets
User clicks "Close" → goToProjects() → Returns to ProjectOverlay with projectId
```

### Story 3: Memory Leak Diagnosis

**Common React Memory Leaks:**

1. **Uncleared tRPC queries** - React Query keeps queries in cache
2. **Event listeners not removed** - addEventListener without removeEventListener
3. **Timers not cleared** - setTimeout/setInterval without cleanup
4. **Large state objects** - Chat history accumulating in memory

**Fix Strategy:**

```typescript
useEffect(() => {
    // Setup
    const subscription = something.subscribe();

    // Cleanup function
    return () => {
        subscription.unsubscribe();
    };
}, [dependencies]);
```

**React Query Cleanup:**
```typescript
const query = trpc.rag.query.useQuery(params, {
    enabled: false,
    gcTime: 0,  // Don't cache results
    staleTime: 0,  // Mark stale immediately
});

// On unmount, React Query auto-cancels, but we can force it:
useEffect(() => {
    return () => {
        queryClient.cancelQueries({ queryKey: [...] });
    };
}, []);
```

**Performance Impact:**
- Mobile browsers: ~100-300MB memory limit before throttling
- Desktop browsers: ~500MB-1GB before issues, but app becomes laggy after 10-15 minutes of continuous use
- **Performance Target:** Keep memory under 150MB on mobile, under 300MB on desktop for sustained smooth performance
- **Test Duration:** App must remain responsive after 15+ minutes of continuous use with multiple overlay transitions

---

## Development Setup

**Prerequisites:**
- Node.js 20+ installed
- npm or yarn package manager
- Supabase account with project created
- HuggingFace API key (free tier sufficient)
- Git repository cloned locally

**Initial Setup (Already Done):**

```bash
# Frontend setup
cd vansh.fyi
npm install  # All dependencies already in package.json

# Backend setup
cd ../backend
npm install  # All dependencies already in package.json
```

**Environment Configuration:**

Create `backend/.env` (if not exists):
```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
HUGGINGFACE_API_KEY=hf_your-key-here
```

**Development Servers:**

```bash
# Terminal 1: Frontend dev server
cd vansh.fyi
npm run dev
# Opens at http://localhost:5173

# Terminal 2: Backend dev server
cd backend
npm run dev
# Runs at http://localhost:3000
```

**Running Tests:**

```bash
# Frontend tests
cd vansh.fyi
npm test

# Backend tests
cd backend
npm test

# Run tests in watch mode during development
npm test -- --watch
```

**Database Setup (Story 1):**

```bash
# 1. Execute SQL migration in Supabase SQL Editor
#    (Copy from backend/sql/create-documents-table.sql)

# 2. Run ingestion script locally
cd backend
npm run ingest
# This runs: ts-node src/scripts/ingest-data.ts

# 3. Verify data ingestion
npm run verify-db
# This runs: ts-node src/scripts/verify-db.ts
```

---

## Implementation Guide

### Setup Steps

**Before Starting Implementation:**

1. ✅ **Verify Environment**
   - Check Node.js version: `node --version` (should be 20+)
   - Verify npm packages installed: `ls node_modules` in both vansh.fyi/ and backend/
   - Confirm .env file exists in backend/ with all required keys

2. ✅ **Create Feature Branch**
   ```bash
   git checkout -b fix/rag-state-performance
   ```

3. ✅ **Run Existing Tests (Baseline)**
   ```bash
   cd vansh.fyi && npm test
   cd ../backend && npm test
   ```
   - Document any existing failures (should be none based on clean repo)

4. ✅ **Review Existing Code**
   - Read overlayStore.ts to understand current state management
   - Review ChatOverlay.tsx to understand current implementation
   - Check useRAGQuery.ts to understand tRPC query patterns

### Implementation Steps

**Story 1: RAG Database Setup & Data Ingestion** (Implement First - Blocker)

1. **Create SQL Migration Script**
   - File: `backend/sql/create-documents-table.sql`
   - Include: pgvector extension, documents table, match_documents function, indexes
   - Test SQL locally in Supabase SQL Editor before saving to file

2. **Execute Migration in Supabase**
   - Open Supabase Dashboard → SQL Editor
   - Copy entire migration script
   - Execute and verify success (no errors)
   - Verify table exists: `SELECT * FROM documents LIMIT 1;`

3. **Add TypeScript Type Definitions**
   - File: `backend/src/services/supabase.ts`
   - Add Document interface matching table schema
   - Export types for use in other files

4. **Verify Ingestion Script**
   - File: `backend/src/scripts/ingest-data.ts`
   - Review script to ensure it matches new schema
   - Check embedding model is correct (all-MiniLM-L6-v2)
   - Add error handling for failed embeddings

5. **Run Ingestion Locally**
   ```bash
   cd backend
   npm run ingest
   ```
   - Monitor console output for errors
   - Verify chunks processed and inserted
   - Check Supabase table for inserted documents

6. **Verify RAG Queries Work**
   ```bash
   cd backend
   npm run test-rag-api
   ```
   - Test with sample queries: "What is Vansh's experience?"
   - Test project-specific queries with projectId
   - Verify similarity scores are reasonable (>0.3)

7. **Document the Process**
   - Create `docs/supabase-schema.md` with schema documentation
   - Update `backend/README.md` with ingestion instructions
   - Include troubleshooting section for common issues

**Story 2: Project Selection State Management** (After Story 1)

1. **Fix ChatOverlay to Read projectId on Mount**
   - File: `vansh.fyi/src/components/overlays/ChatOverlay.tsx`
   - Add `const { projectId } = useViewStore();` at component top
   - Use projectId in RAG query params
   - Add useEffect to reset chat when projectId changes

2. **Make Sidebar Interactive**
   - File: `vansh.fyi/src/components/overlays/OverlaySidebar.tsx`
   - Add onClick handler to each project item
   - Call `goToProjectChat(projectId)` on click
   - Ensure visual highlight updates (use conditional className)

3. **Fix Close Button Navigation**
   - File: `vansh.fyi/src/components/overlays/ProjectOverlay.tsx`
   - Update close button onClick to call appropriate navigation function
   - Ensure projectId is preserved when returning from chat
   - Test on both desktop and mobile views

4. **Write Tests for State Management**
   - File: `vansh.fyi/src/state/__tests__/overlayStore.test.ts`
   - Test goToProjectChat() sets all required state
   - Test projectId persists through transitions
   - Test state resets properly on goToMain()

5. **Write Tests for ChatOverlay**
   - File: `vansh.fyi/src/components/overlays/__tests__/ChatOverlay.test.tsx`
   - Test component reads projectId from store
   - Test chat resets when projectId changes
   - Mock tRPC calls to verify correct params passed

**Story 3: Mobile Memory Leak & Performance Fix** (After Story 2)

1. **Add Cleanup to ChatOverlay**
   - File: `vansh.fyi/src/components/overlays/ChatOverlay.tsx`
   - Review all useEffect hooks
   - Add cleanup functions (return statements)
   - Clear chat history on unmount

2. **Add Cleanup to LeadGenChat**
   - File: `vansh.fyi/src/components/LeadGenChat.tsx`
   - Same cleanup pattern as ChatOverlay
   - Ensure tRPC queries cancelled on unmount

3. **Fix useRAGQuery Hook**
   - File: `vansh.fyi/src/hooks/useRAGQuery.ts`
   - Add query cancellation on unmount
   - Configure gcTime and staleTime appropriately
   - Use enabled flag to prevent automatic refetching

4. **Optimize Re-renders**
   - File: `vansh.fyi/src/components/overlays/ProjectOverlay.tsx`
   - Wrap with React.memo if expensive
   - Same for ChatOverlay if needed
   - Use useCallback for event handlers

5. **Test Memory Performance**
   - Use Chrome DevTools → Performance → Memory
   - Record heap snapshots before/after navigation cycles
   - Perform 10+ transitions between main → projects → chat → back
   - Verify memory returns to baseline after navigation
   - Test on real mobile device (iOS/Android)

6. **Load Test for Desktop**
   - Keep app open for 15+ minutes
   - Navigate between views repeatedly
   - Monitor performance and responsiveness
   - Verify no degradation after extended use

### Testing Strategy

**Unit Tests (Write as You Go):**

- **State Management:** Test all overlayStore actions
- **Hooks:** Test useRAGQuery with mocked tRPC
- **Components:** Test ChatOverlay, ProjectOverlay, OverlaySidebar with RTL

**Integration Tests (After Implementation):**

- **RAG Flow:** Backend test that queries Supabase and returns results
- **State Persistence:** Frontend test that verifies projectId flows through components
- **Cleanup:** Test that components properly clean up on unmount

**Manual Testing (Critical):**

Story 1:
- [ ] SQL migration executes without errors
- [ ] Ingestion script processes all markdown files
- [ ] Documents appear in Supabase table
- [ ] RAG queries return relevant results
- [ ] Project-specific queries filter correctly

Story 2:
- [ ] Clicking "Ask Ursa" from project preserves projectId
- [ ] Sidebar shows correct project highlighted
- [ ] Clicking sidebar project switches context and resets chat
- [ ] Close button returns to correct project view
- [ ] Works on both desktop and mobile

Story 3:
- [ ] No console errors on navigation
- [ ] Memory returns to baseline after 10 navigation cycles
- [ ] Mobile doesn't freeze after chat interactions
- [ ] Desktop remains responsive after 15+ minutes
- [ ] Heap snapshots show no memory leaks

**Performance Testing (Story 3):**

```bash
# Chrome DevTools steps:
1. Open DevTools → Performance → Memory
2. Take heap snapshot (baseline)
3. Navigate: main → projects → chat → back (repeat 10x)
4. Take heap snapshot (after navigation)
5. Compare: Should not grow by >50MB
6. Check for detached DOM nodes (indicates memory leak)
```

### Acceptance Criteria

**Story 1: RAG Database Setup**

**AC #1:** Database schema created successfully
- GIVEN Supabase SQL Editor
- WHEN migration script is executed
- THEN documents table exists with vector(384) column
- AND match_documents function exists
- AND indexes are created (GIN on metadata, IVFFlat on embedding)
- AND no SQL errors occur

**AC #2:** Data ingestion completes successfully
- GIVEN markdown files in /_content/
- WHEN ingestion script runs locally
- THEN all files are processed and chunked
- AND embeddings generated for each chunk (384 dimensions)
- AND documents inserted into Supabase with correct metadata
- AND at least 50 documents exist in table (verify with SELECT COUNT(*))

**AC #3:** RAG queries return relevant results
- GIVEN documents in Supabase
- WHEN user asks "What is Vansh's experience?"
- THEN system returns relevant chunks with similarity >0.3
- AND LLM generates coherent response based on context
- AND response is not "I don't have knowledge about this"

**AC #4:** Project-specific queries work
- GIVEN projectId filter in query
- WHEN user asks about specific project (e.g., "Tell me about Aether")
- THEN only documents with matching projectId are returned
- AND response is specific to that project only

**Story 2: Project Selection State**

**AC #1:** Project context persists when opening chat
- GIVEN user viewing "DriQ Health" project
- WHEN user clicks "Ask Ursa"
- THEN ChatOverlay opens
- AND sidebar shows "DriQ Health" highlighted
- AND projectId is "driq-health" in overlayStore

**AC #2:** Sidebar is interactive in chat view
- GIVEN ChatOverlay is open
- WHEN user clicks different project in sidebar (e.g., "Aether")
- THEN chat history clears completely
- AND new chat starts with projectId="aether"
- AND sidebar highlight updates to "Aether"
- AND subsequent queries only use Aether context

**AC #3:** Close button returns to correct view
- GIVEN ChatOverlay open from ProjectOverlay
- WHEN user clicks "Close Ursa" (desktop) or "Close" (mobile)
- THEN ProjectOverlay opens
- AND correct project is still selected/displayed
- AND project iframe shows correct project website

**AC #4:** No chat history persistence
- GIVEN user has chat history with Project A
- WHEN user switches to Project B
- THEN all previous chat messages disappear
- AND chat starts fresh with "Ask me anything about [Project B]"

**Story 3: Memory Leak & Performance**

**AC #1:** No memory leaks on navigation
- GIVEN user on main view
- WHEN user navigates main → projects → chat → back (10 cycles)
- THEN heap memory increases by less than 50MB
- AND no detached DOM nodes accumulate
- AND Chrome DevTools shows clean memory profile

**AC #2:** Mobile remains responsive
- GIVEN user on mobile device (iOS or Android)
- WHEN user opens chat, sends 3 messages, closes chat, repeats 5 times
- THEN device remains responsive (no lag or freeze)
- AND scrolling is smooth
- AND no force restart required

**AC #3:** Desktop sustained performance
- GIVEN user on desktop browser
- WHEN user uses app continuously for 15+ minutes with frequent navigation
- THEN app remains responsive
- AND no noticeable lag or slowdown
- AND all interactions feel snappy

**AC #4:** tRPC queries properly cleaned up
- GIVEN ChatOverlay component mounted
- WHEN component unmounts
- THEN all tRPC queries are cancelled
- AND React Query cache is cleared for that component
- AND no pending requests remain

---

## Developer Resources

### File Paths Reference

**Complete File List by Story:**

**Story 1: RAG Database Setup**
- `backend/sql/create-documents-table.sql` - **CREATE** - SQL migration script
- `backend/src/services/supabase.ts` - **MODIFY** - Add Document type definitions
- `backend/src/scripts/ingest-data.ts` - **VERIFY/MODIFY** - Ingestion script
- `backend/src/scripts/verify-db.ts` - **CREATE** - Database verification utility
- `backend/README.md` - **MODIFY** - Add ingestion documentation
- `docs/supabase-schema.md` - **CREATE** - Schema documentation
- `backend/.env` - **VERIFY** - Environment variables configured
- `_content/personal/*.md` - **READ** - Source content for ingestion
- `_content/projects/*.md` - **READ** - Project-specific content

**Story 2: Project Selection State**
- `vansh.fyi/src/state/overlayStore.ts` - **MODIFY** - Fix state management (minimal changes)
- `vansh.fyi/src/components/overlays/ChatOverlay.tsx` - **MODIFY** - Subscribe to projectId changes
- `vansh.fyi/src/components/overlays/OverlaySidebar.tsx` - **MODIFY** - Add onClick handlers
- `vansh.fyi/src/components/overlays/ProjectOverlay.tsx` - **MODIFY** - Fix close button logic
- `vansh.fyi/src/state/__tests__/overlayStore.test.ts` - **MODIFY** - Add new test cases
- `vansh.fyi/src/components/overlays/__tests__/ChatOverlay.test.tsx` - **MODIFY** - Add project switching tests

**Story 3: Memory Leak Fix**
- `vansh.fyi/src/components/overlays/ChatOverlay.tsx` - **MODIFY** - Add cleanup hooks
- `vansh.fyi/src/components/LeadGenChat.tsx` - **MODIFY** - Add cleanup hooks
- `vansh.fyi/src/components/overlays/ProjectOverlay.tsx` - **MODIFY** - Optimize with React.memo
- `vansh.fyi/src/hooks/useRAGQuery.ts` - **MODIFY** - Add query cancellation
- `vansh.fyi/src/services/trpc.tsx` - **VERIFY** - Check React Query config
- `vansh.fyi/src/App.tsx` - **VERIFY** - Root component memory audit

### Key Code Locations

**Story 1: RAG Database - Critical Code**

- `backend/src/api/rag.ts:85-130` - `generateRagResponse()` function
  - Current implementation that queries Supabase
  - Uses `supabase.rpc('match_documents', ...)`
  - Will fail until documents table exists

- `backend/src/services/embeddings.ts:12-36` - `generateEmbedding()` function
  - HuggingFace API call for embeddings
  - Returns 384-dimensional vectors
  - Already correctly configured

- `backend/src/services/supabase.ts:8` - Supabase client initialization
  - Uses `@supabase/supabase-js` client
  - Configured with environment variables

- `backend/src/scripts/ingest-data.ts` - Complete ingestion logic
  - Reads markdown files from `_content/`
  - Chunks text using paragraph breaks
  - Generates embeddings and inserts to Supabase

**Story 2: State Management - Critical Code**

- `vansh.fyi/src/state/overlayStore.ts:35-37` - `goToProjectChat()` action
  - Current implementation looks correct
  - Issue is in components not properly consuming state

- `vansh.fyi/src/state/overlayStore.ts:18-24` - Store state definition
  ```typescript
  currentView: ViewState;
  initialChatQuery: string;
  chatContext: ChatContext;
  projectId?: string;
  ```

- `vansh.fyi/src/components/overlays/ChatOverlay.tsx` - Chat component
  - Must subscribe to `useViewStore()` for projectId
  - Currently may not be reading projectId properly

- `vansh.fyi/src/components/overlays/OverlaySidebar.tsx` - Sidebar rendering
  - Currently passive (just displays projects)
  - Needs onClick handlers to make interactive

**Story 3: Memory Leak - Critical Code**

- `vansh.fyi/src/hooks/useRAGQuery.ts:15-32` - RAG query hook
  - Uses tRPC `useQuery` without cleanup
  - Needs `useEffect` cleanup and query cancellation

- `vansh.fyi/src/components/overlays/ChatOverlay.tsx` - Main leak source
  - Check all `useEffect` hooks for cleanup functions
  - Verify chat history state is cleared on unmount

- `vansh.fyi/src/services/trpc.tsx` - tRPC client config
  - React Query configuration for all queries
  - May need to adjust `gcTime` and `staleTime`

### Testing Locations

**Frontend Tests:**
- `vansh.fyi/src/state/__tests__/` - State management tests
- `vansh.fyi/src/components/overlays/__tests__/` - Overlay component tests
- `vansh.fyi/src/hooks/__tests__/` - Custom hook tests
- `vansh.fyi/src/services/__mocks__/` - Mock implementations

**Backend Tests:**
- `backend/src/api/__tests__/` - API endpoint tests
- `backend/src/services/__tests__/` - Service layer tests
- `backend/src/services/ingestion/__tests__/` - Ingestion utility tests

**Test Execution:**
```bash
# Run all frontend tests
cd vansh.fyi && npm test

# Run specific test file
npm test overlayStore.test.ts

# Run tests in watch mode
npm test -- --watch

# Run all backend tests
cd backend && npm test

# Run with coverage
npm test -- --coverage
```

### Documentation to Update

**Story 1: Database Documentation**

- `docs/supabase-schema.md` - **CREATE NEW**
  - Document documents table schema
  - Explain match_documents RPC function
  - Include metadata structure and examples
  - Provide troubleshooting section

- `backend/README.md` - **UPDATE**
  - Add "Database Setup" section
  - Document how to run migration script
  - Explain ingestion process
  - Include example commands

**Story 2: No Documentation Changes**
- These are internal bug fixes
- No user-facing changes to document

**Story 3: No Documentation Changes**
- Performance fixes are transparent to users
- No API or behavior changes

**General Updates:**
- This tech-spec serves as the comprehensive documentation
- Update README.md with link to tech-spec once complete

---

## UX/UI Considerations

**🚨 CRITICAL: NO VISUAL CHANGES ALLOWED**

This tech-spec addresses **backend logic, state management, and performance issues only**. The UI must remain 100% visually identical.

**What's NOT Changing:**

- ❌ Layout, spacing, padding, margins
- ❌ Colors, fonts, font sizes, font weights
- ❌ Animations, transitions, hover effects
- ❌ Component visual structure or DOM hierarchy
- ❌ Tailwind classes for styling purposes
- ❌ SVG icons, images, or visual elements
- ❌ Button appearances, input styles
- ❌ Mobile vs desktop responsive breakpoints

**What IS Changing (Functionality Only):**

- ✅ **Story 1:** RAG backend starts returning actual data (no UI change)
- ✅ **Story 2:** Sidebar becomes clickable (add onClick, no visual change)
- ✅ **Story 2:** Project highlight persists (may use existing CSS classes)
- ✅ **Story 3:** Performance improvements (invisible to user)

**Acceptable Minimal UI Changes:**

1. **Adding onClick Handlers (Story 2):**
   - Sidebar project items become clickable
   - No change to visual appearance
   - May add `cursor-pointer` class if not already present
   - No new hover states or visual feedback beyond existing

2. **Conditional CSS Classes (Story 2):**
   - Use EXISTING classes to highlight selected project
   - Example: `className={projectId === 'aether' ? 'border-blue-500' : 'border-transparent'}`
   - Only if these classes already exist in codebase
   - Do not create new styles

3. **Test Attributes:**
   - Add `data-testid` attributes for testing
   - Not visible to users
   - Helps with automated testing

**User Experience Improvements (Invisible):**

- **Story 1:** Chat will actually answer questions instead of saying "no knowledge"
- **Story 2:** Selecting projects in sidebar will work correctly
- **Story 3:** App won't freeze or become laggy after extended use

**Accessibility (No Changes):**
- Existing keyboard navigation remains unchanged
- Existing ARIA labels remain unchanged
- No new accessibility requirements

**Mobile Considerations:**
- Fix mobile freezing (Story 3) without changing mobile UI
- Touch interactions remain identical
- Responsive behavior stays the same

---

## Testing Approach

### Comprehensive Testing Strategy

**Test Pyramid Approach:**

```
         /\
        /  \  E2E (Manual - 5% of effort)
       /____\
      /      \  Integration Tests (15% of effort)
     /________\
    /          \  Unit Tests (80% of effort)
   /____________\
```

**Story 1: RAG Database Testing**

**Unit Tests:**
- Test `generateEmbedding()` returns 384-dimensional arrays
- Mock Supabase calls in `generateRagResponse()`
- Verify metadata structure in ingestion script

**Integration Tests:**
- Full RAG pipeline: query → embedding → Supabase → LLM → response
- Test with real Supabase (test database)
- Verify projectId filtering works correctly

**Manual Tests:**
- Execute SQL migration in Supabase
- Run ingestion script and verify data in table
- Test RAG queries via frontend chat interface
- Verify "no knowledge" responses are gone

**Story 2: State Management Testing**

**Unit Tests:**
- `overlayStore.test.ts`:
  - Test `goToProjectChat()` sets all required state
  - Test `goToProjects()` clears chat state
  - Test `goToMain()` resets everything
- Mock Zustand store in component tests

**Integration Tests:**
- Test full flow: Projects → Chat with projectId → Switch project → Close
- Verify tRPC receives correct projectId in backend
- Test state persistence across component mounts/unmounts

**Manual Tests:**
- Click through entire user flow on desktop
- Repeat on mobile device
- Verify sidebar highlighting works
- Test close button returns to correct view

**Story 3: Memory Leak Testing**

**Unit Tests:**
- Test useEffect cleanup functions are present
- Mock tRPC queries and verify cancellation called
- Test React.memo prevents unnecessary re-renders

**Integration Tests:**
- Automated memory leak detection (if possible with Jest)
- Component mount/unmount cycles in tests
- Verify no memory accumulation in test environment

**Manual Tests (CRITICAL):**
- Chrome DevTools Performance profiling
- Heap snapshots before/after navigation
- Real device testing (iOS/Android)
- 15+ minute sustained usage test on desktop

### Test Coverage Requirements

**Minimum Coverage (No Strict Requirement, Focus on Critical Paths):**

- **State Management:** 90%+ coverage (core business logic)
- **Components:** 70%+ coverage (focus on logic, not markup)
- **Hooks:** 90%+ coverage (reusable logic must be solid)
- **Services:** 80%+ coverage (backend integration points)

**Critical Path Coverage (Must be 100%):**

- RAG query flow from frontend to backend
- Project selection state transitions
- Component cleanup on unmount

### Testing Tools & Frameworks

**Frontend Testing:**
- **Jest 30.2.0** - Test runner
- **@testing-library/react 16.3.0** - Component testing
- **jest-environment-jsdom 30.2.0** - Browser simulation
- **React Test Renderer 19.2.0** - Snapshot testing

**Backend Testing:**
- **Jest 30.2.0** - Test runner
- **ts-jest 29.4.5** - TypeScript support
- **Mock Supabase** - In-memory Supabase for tests

**Performance Testing:**
- **Chrome DevTools** - Memory profiling
- **React DevTools Profiler** - Component re-render analysis
- **Manual testing on real devices** - iOS/Android

### Test Execution Plan

**During Development (Continuous):**
1. Run tests in watch mode: `npm test -- --watch`
2. Write tests alongside implementation
3. Fix any failing tests immediately

**Before Committing Code:**
1. Run full test suite: `npm test`
2. Verify all tests pass
3. Check for console warnings/errors
4. Run linter: `npm run lint`

**Before Creating Pull Request:**
1. Run tests in both frontend and backend
2. Perform manual testing checklist
3. Take heap snapshots for Story 3
4. Test on real mobile device
5. Document any known issues

**Acceptance Testing (Final Validation):**
1. Complete manual testing checklist for all 3 stories
2. Verify all acceptance criteria met
3. Performance profiling shows no memory leaks
4. 15+ minute desktop sustained usage test passes
5. Mobile device test shows no freezing

---

## Deployment Strategy

### Deployment Steps

**Pre-Deployment Checklist:**

1. ✅ **All Tests Pass**
   - Frontend: `cd vansh.fyi && npm test`
   - Backend: `cd backend && npm test`
   - No failing tests allowed

2. ✅ **Supabase Database Ready**
   - Migration script executed successfully
   - Documents table populated with data
   - Verify: `SELECT COUNT(*) FROM documents;` returns >50

3. ✅ **Environment Variables Set**
   - Vercel environment variables configured:
     - `SUPABASE_URL`
     - `SUPABASE_ANON_KEY`
     - `HUGGINGFACE_API_KEY`

4. ✅ **Code Review Complete**
   - All changes reviewed
   - No merge conflicts
   - Clean git history

**Deployment Process (Vercel):**

This project uses **Vercel** for deployment. Deployment is automatic on push to main branch.

```bash
# 1. Ensure you're on the feature branch
git checkout fix/rag-state-performance

# 2. Commit all changes
git add .
git commit -m "fix: RAG database setup, project state persistence, and memory leak fixes

- Story 1: Create Supabase schema and ingest RAG data
- Story 2: Fix project selection state management in chat
- Story 3: Fix memory leaks causing mobile freezing and desktop lag

Fixes #1 #2 #3"

# 3. Push to remote
git push origin fix/rag-state-performance

# 4. Create Pull Request on GitHub
# 5. After approval, merge to main
# 6. Vercel auto-deploys main branch
```

**Vercel Deployment Details:**

- **Frontend:** Static build from `vansh.fyi/` directory
  - Build command: `npm run build` (Vite build)
  - Output: `vansh.fyi/dist/`
  - Served via Vercel CDN

- **Backend:** Serverless functions from `backend/api/` directory
  - API routes automatically detected
  - Node.js runtime (20.x)
  - Cold start time: ~200-500ms (acceptable)

**Post-Deployment Verification:**

1. **Verify RAG Queries Work (Story 1)**
   - Visit production URL
   - Open chat interface
   - Ask: "What is Vansh's experience?"
   - Verify: Response is not "no knowledge"

2. **Verify Project Selection (Story 2)**
   - Navigate to Projects view
   - Click on a project
   - Click "Ask Ursa"
   - Verify: Project remains selected in sidebar
   - Click different project in sidebar
   - Verify: Chat resets and new project context used

3. **Verify Performance (Story 3)**
   - Use app for 5 minutes with multiple navigations
   - Check browser console for errors
   - Verify: No freezing or lag

4. **Smoke Test Existing Features**
   - Test lead generation form
   - Test theme toggle (light/dark)
   - Test email contact form
   - Verify: All existing features still work

### Rollback Plan

**If Issues Discovered in Production:**

**Option 1: Instant Rollback (Vercel Dashboard)**
1. Go to Vercel Dashboard
2. Select deployment
3. Click "Redeploy" on previous working deployment
4. Production reverts in ~30 seconds

**Option 2: Git Revert**
```bash
# If deployment was merged to main
git checkout main
git revert HEAD
git push origin main
# Vercel auto-deploys reverted state
```

**Option 3: Fix Forward**
```bash
# If issue is small and fixable quickly
git checkout -b hotfix/issue-name
# Make fix
git commit -m "hotfix: description"
git push origin hotfix/issue-name
# Create and merge PR immediately
```

**Rollback Decision Criteria:**

- **Instant Rollback if:** RAG completely broken, site crashes, data loss
- **Fix Forward if:** Minor UI issue, specific edge case, non-critical bug
- **Wait and Monitor if:** Unclear if issue is real or affects few users

### Monitoring

**Post-Deployment Monitoring (First 24 Hours):**

1. **Error Monitoring:**
   - Check Vercel logs for errors
   - Monitor console errors in browser DevTools
   - Watch for Supabase error notifications

2. **Performance Monitoring:**
   - Check Vercel Analytics for response times
   - Monitor API route performance
   - Check for increased error rates

3. **User Feedback:**
   - Monitor for user reports of issues
   - Check if chat is responding correctly
   - Verify mobile users aren't reporting freezes

**Long-Term Monitoring:**

- Weekly: Check Supabase database size (ensure not growing unexpectedly)
- Monthly: Review Vercel usage/bandwidth (ensure within limits)
- Ongoing: Monitor for any user-reported issues

**Success Metrics:**

- ✅ RAG queries return relevant responses (not "no knowledge")
- ✅ Zero reports of mobile freezing
- ✅ Zero reports of desktop lag after extended use
- ✅ Project selection works correctly for all users
- ✅ No increase in error rates
- ✅ API response times remain under 2 seconds

---
