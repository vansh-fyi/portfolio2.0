# Architecture

## Executive Summary

This document outlines the architectural decisions for the Portfolio Website project. The system will be built as a React Single-Page Application (SPA) with a TypeScript backend leveraging Vercel AI SDK with HuggingFace provider for AI workflows. It will utilize meta-llama/Llama-3.2-3B-Instruct for text generation and sentence-transformers/all-MiniLM-L6-v2 (384-dimensional) for vector embeddings, with Supabase serving as the vector database. Communication between the frontend and backend will be handled via tRPC, and Resend will be used for email services. The entire application will be deployed on Vercel.

## Project Initialization

First implementation story should execute:
```bash
npm create vite@latest portfolio-react -- --template react-ts
```
*   **Verification**: See the [create-vite npm page](https://www.npmjs.com/package/create-vite) for the latest information on this template.

This establishes the base architecture with these decisions:
*   **Framework**: React (PROVIDED BY STARTER)
*   **Language**: TypeScript (PROVIDED BY STARTER)
*   **Build Tool**: Vite (PROVIDED BY STARTER)

## Decision Summary

**Note on Versions**: All versions were verified via web search on 2025-11-14. Using "latest" or `~` (tilde version range) is acceptable for initial setup, but it is **highly recommended** to pin to specific versions in `package.json` before the first deployment to ensure long-term stability and prevent unexpected breaking changes. The choice of "latest" over LTS is for leveraging modern features, with the understanding that minor version updates should be managed carefully.

| Category | Decision | Version | Last Verified | Affects Epics | Rationale |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Project Foundation | Vite (React, TypeScript) | ~5.2.0 | 2025-11-14 | Epic 1 | (PROVIDED BY STARTER) Fast development, performant builds, modern tooling. |
| LLM (Text Generation) | meta-llama/Llama-3.2-3B-Instruct | N/A (API) | 2025-11-21 | Epic 2, Epic 3, Epic 4 | HuggingFace model via Vercel AI SDK, reliable and cost-effective. |
| Embedding Model | sentence-transformers/all-MiniLM-L6-v2 (384d) | N/A (API) | 2025-11-21 | Epic 2, Epic 4 | HuggingFace model via Vercel AI SDK, produces 384-dimensional vectors compatible with Supabase pgvector. |
| Vector Database | Supabase (JS SDK) | ~2.42.0 | 2025-11-14 | Epic 2, Epic 4 | Specific user choice, integrated platform. |
| API Pattern | tRPC | ~11.0.0-rc | 2025-11-14 | Epic 1, Epic 2, Epic 3, Epic 4 | Type-safe, excellent developer experience with TypeScript. |
| Authentication | None (Public Site) | N/A | N/A | N/A | Entire site is public, no user login required. |
| Email Service | Resend (Node.js SDK) | ~3.2.0 | 2025-11-14 | Epic 3, Epic 4 | Developer-friendly, generous free tier, suitable for transactional emails. |
| Deployment Target | Vercel | N/A (Platform) | 2025-11-14 | All Epics | Easy deployment for React apps, serverless functions, custom domain support on free tier. |


## Project Structure

```
/Users/hp/Desktop/Work/Repositories/portfolio2.0/
├── portfolio-react-template/ # React project (created by Vite)
│   ├── public/               # Static assets (images, fonts)
│   │   └── assets/
│   ├── src/                  # React source code
│   │   ├── components/       # Reusable UI components
│   │   │   ├── overlays/     # View components (ProjectOverlay, ChatOverlay)
│   │   │   └── __tests__/    # Component tests
│   │   ├── state/            # Zustand stores
│   │   │   ├── overlayStore.ts    # View-state routing (main/projects/chat)
│   │   │   ├── themeStore.ts      # Theme management (light/dark mode)
│   │   │   └── __tests__/         # Store tests
│   │   ├── services/         # API interaction logic (tRPC client - Epic 2+)
│   │   ├── App.tsx           # Main application component
│   │   ├── main.tsx          # Entry point
│   │   └── index.css         # Global styles + Tailwind
│   ├── package.json          # Frontend dependencies
│   ├── tsconfig.json         # Frontend TypeScript config
│   └── vite.config.ts        # Vite configuration
├── backend/              # Vercel AI SDK backend service
│   ├── src/              # Backend source code
│   │   ├── api/          # tRPC API routes
│   │   ├── services/     # RAG, Email, Supabase, Embeddings
│   │   └── index.ts      # Backend entry point
│   ├── package.json      # Backend dependencies
│   └── tsconfig.json     # Backend TypeScript config
├── _content/             # Markdown files for RAG
│   ├── personal/         # About Vansh
│   └── projects/         # Project details
└── docs/                 # Documentation (PRD, Epics, Architecture)
```

## Epic to Architecture Mapping

| Epic Name | Architectural Components | Interacting Services |
| :-------------------------------- | :--------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Epic 1: Core Application & React Migration | `portfolio-react-template/` (Frontend UI, View Routing, Theme System) | Vercel (Deployment) |
| Epic 2: Ursa - Conversational RAG Agent | `backend/` (Vercel AI SDK with HuggingFace for RAG, tRPC API), Supabase (Vector DB), `portfolio-react-template/` (Chat Views) | HuggingFace (Llama-3.2-3B-Instruct, all-MiniLM-L6-v2 via Vercel AI SDK), Vercel (Deployment) |
| Epic 3: Ursa - Lead Generation Agent | `backend/` (tRPC API, Resend SDK), `portfolio-react-template/` (Contact UI) | Resend (Email Service - direct SDK), Vercel (Deployment) |
| Epic 4: Backend & Data Infrastructure | `backend/` (Vercel AI SDK with HuggingFace for RAG, tRPC API, Resend SDK), Supabase (Vector DB) | HuggingFace (Llama-3.2-3B-Instruct, all-MiniLM-L6-v2 via Vercel AI SDK), Resend (Email Service), Vercel (Deployment) |

## Technology Stack Details

### Core Technologies

*   **Frontend Framework**: React (via Vite)
*   **Frontend Language**: TypeScript
*   **Styling**: Tailwind CSS
*   **AI Backend Framework**: Vercel AI SDK (TypeScript) with HuggingFace provider
*   **LLM (Text Generation)**: meta-llama/Llama-3.2-3B-Instruct (via Vercel AI SDK)
*   **Embedding Model**: sentence-transformers/all-MiniLM-L6-v2, 384-dimensional (via Vercel AI SDK)
*   **Vector Database**: Supabase
*   **API Communication**: tRPC
*   **Email Service**: Resend
*   **Deployment**: Vercel

### Integration Points

*   **Frontend to Backend**: Communication will be handled via tRPC, ensuring type-safe API calls between the React frontend and the Mastra.AI backend.
*   **Backend to Supabase**: The Mastra.AI backend will interact with Supabase for vector database operations (storing and retrieving embeddings) using the Supabase client library.
*   **Backend to HuggingFace**: The Vercel AI SDK manages integration with HuggingFace APIs for utilizing meta-llama/Llama-3.2-3B-Instruct (LLM) and sentence-transformers/all-MiniLM-L6-v2 (embedding model).
*   **Backend to Resend**: The backend uses the Resend SDK directly to send transactional emails for the lead generation agent.
*   **Deployment Integration**: Vercel will deploy the React frontend and the backend (as serverless functions), handling the routing and serving of both components.

## Novel Pattern Designs

This project primarily leverages established architectural patterns. No truly novel patterns requiring custom design were identified.

## Implementation Patterns

These patterns ensure consistent implementation across all AI agents and the broader application:

### Naming Conventions

*   **API Endpoints**: Use kebab-case for resource names (e.g., `/api/leads`, `/api/projects`).
*   **Frontend Components**: Use PascalCase for React component names (e.g., `ChatOverlay`, `ProjectCard`).
*   **Backend Modules/Files**: Use kebab-case for file names (e.g., `lead-agent.ts`, `rag-service.ts`).

### Structure Patterns

*   **Frontend**: Organize components by feature or domain (e.g., `src/features/chat`, `src/components/common`).
*   **Backend**: Organize by domain/feature (e.g., `backend/src/agents`, `backend/src/api`, `backend/src/services`).
*   **Tests**: Co-locate tests with the code they test (e.g., `Component.test.tsx`, `service.test.ts`).

### Format Patterns

*   **API Responses**: Standard JSON format with `data` and `error` properties (e.g., `{ data: {...}, error: null }` for success or `{ data: null, error: { message: "...", code: "..." } }` for errors).
*   **Date/Time**: Use ISO 8601 strings for all date/time exchanges.

### Communication Patterns

*   **Frontend-Backend**: Exclusively tRPC procedures for all API communication.
*   **Frontend State Management**: **Zustand** stores implemented for:
  - **View Routing** (`overlayStore.ts`): View-state architecture with `currentView: 'main' | 'projects' | 'chat'`
  - **Theme Management** (`themeStore.ts`): Light/dark mode toggle with `isLightMode` boolean
  - **Chat Context** (`overlayStore.ts`): Dual-context chat system (`chatContext: 'personal' | 'project'`)
  - For local component state, use React's built-in `useState` and `useReducer` hooks.

### Lifecycle Patterns

*   **Loading States**: Use a consistent pattern for displaying loading indicators (e.g., a `isLoading` state and a shared spinner component).
*   **Error Handling**: Implement centralized error handling for API calls, displaying user-friendly messages in the UI.
*   **Retry Logic**: For critical external API calls (e.g., fetching RAG responses), implement a simple exponential backoff retry mechanism (e.g., 3 attempts with 1s, 2s, 4s delays) using a helper function.

### Location Patterns

*   **RAG Content**: Markdown files for RAG will be stored in `_content/personal` and `_content/projects` within the project repository.
*   **Asset Organization**: Static assets like images and fonts will be placed in the `portfolio-react/public/assets/` directory.
*   **Configuration Placement**: Environment-specific configurations will be managed via `.env` files in the `backend/` and `portfolio-react/` directories, following Vite's standard environment variable handling.

### CRUD Patterns
While this project is not CRUD-heavy, any future administrative features should follow these patterns for consistency:
*   **Create**: `trpc.resource.create({ data: {...} })`
*   **Read**: `trpc.resource.get({ id: '...' })` or `trpc.resource.list({ limit: 10, offset: 0 })`
*   **Update**: `trpc.resource.update({ id: '...', data: {...} })`
*   **Delete**: `trpc.resource.delete({ id: '...' })`

## Consistency Rules

### Naming Conventions

{{naming_conventions}}

### Code Organization

{{code_organization_patterns}}

### Error Handling

{{error_handling_approach}}

### Logging Strategy

*   **Backend Logging**: Implement structured logging in the backend service (e.g., using a library like Winston or Pino) to capture request details, errors, and key events. Logs should be easily parsable for debugging and monitoring.

## Data Architecture

### Vector Database (Supabase)

The primary data persistence for the AI agents will be a vector database hosted on Supabase.

*   **Table**: `embeddings`
*   **Columns**:
    *   `id`: UUID (Primary Key)
    *   `content`: TEXT (Original markdown content snippet from which the embedding was generated)
    *   `embedding`: `vector` (The actual vector embedding, a list of numbers representing the content's meaning)
    *   `metadata`: JSONB (Stores additional context like `source_file`, `project_id`, `type: 'personal' | 'project'`, which is crucial for context-aware RAG)
    *   `created_at`: TIMESTAMP (Timestamp of when the embedding was created/updated)

### Lead Generation Data

Information collected by the lead generation agent (name, email, message) will be sent directly via email using Resend and will **not** be persisted in a database within the application's scope.

## API Contracts

All API communication between the React frontend and the Mastra.AI backend will be handled via tRPC procedures, ensuring end-to-end type safety.

### RAG API

*   **Procedure**: `trpc.rag.query`
*   **Description**: Handles conversational queries for the Ursa RAG agent.
*   **Input**:
    ```typescript
    interface RagQueryInput {
      query: string;
      context: 'personal' | 'project'; // 'personal' for hero section, 'project' for project overlays
      projectId?: string; // Required if context is 'project'
    }
    ```
*   **Output**:
    ```typescript
    // For streaming responses
    type RagQueryOutput = AsyncIterable<{ token: string }>;

    // For non-streaming (fallback or initial setup)
    interface RagQueryOutput {
      response: string;
      sources?: { content: string; url?: string }[]; // Optional sources for transparency
    }
    ```

### Email API

*   **Procedure**: `trpc.email.sendLead`
*   **Description**: Sends collected lead information from the contact agent to Vansh via email using Resend API directly.
*   **Implementation Note**: **Email is handled directly via Resend API** (not through Mastra.AI). The backend tRPC endpoint calls Resend's Node.js SDK to send transactional emails. Mastra.AI is reserved for RAG functionality only.
*   **Input**:
    ```typescript
    interface SendLeadInput {
      name: string;
      email: string;
      message: string;
    }
    ```
*   **Output**:
    ```typescript
    interface SendLeadOutput {
      success: boolean;
      message?: string; // Optional success or error message
    }
    ```

## Security Architecture

Given the public nature of the site and the absence of user authentication, the primary security focus is on protecting API keys and ensuring the integrity of the backend services.

*   **API Key Management**: All sensitive API keys (for Hugging Face models, Supabase, and Resend) will be stored exclusively on the backend service (e.g., as environment variables) and will **never** be exposed to the client-side.
*   **Backend Service Security**: The backend service will implement best practices for web security, including robust input validation for all API endpoints and rate limiting to prevent abuse.
*   **Supabase Security**: Supabase's Row Level Security (RLS) will be configured for the `embeddings` table to ensure that only the authorized backend service can perform read and write operations, preventing unauthorized access or modification from the client.
*   **No User Authentication**: As the entire site is public, there is no user authentication or authorization system to manage within the application's scope.

## Performance Considerations

Given the existing WebGL elements on the homepage and the interactive nature of the AI agents, performance is a critical non-functional requirement. Strategies to ensure optimal performance include:

### Frontend Optimization

*   **React Best Practices**: Leverage React's reconciliation process, memoization (`React.memo`, `useMemo`, `useCallback`), and efficient state management to minimize unnecessary re-renders.
*   **Code Splitting & Lazy Loading**: Implement code splitting at the component and route level to reduce the initial bundle size and load resources only when needed.
*   **Image Optimization**: Optimize all images (e.g., responsive images, modern formats like WebP) to reduce load times.
*   **WebGL Element Handling**: Carefully manage the existing WebGL elements to ensure they do not block the main thread or cause jank, especially during AI interactions or overlay transitions.

### Backend Optimization

*   **Efficient RAG Implementation**: Optimize the RAG pipeline within Mastra.AI to minimize latency in retrieving and generating responses. This includes efficient vector search and prompt engineering.
*   **Caching**: Implement caching mechanisms for frequently accessed embeddings or RAG responses to reduce redundant computations and API calls.
*   **Streamed Responses**: Utilize streamed responses for the conversational chat interface to improve perceived performance and provide real-time feedback to the user.

## Background Job Processing
For the current scope, long-running asynchronous tasks (like data ingestion) will be handled by standalone TypeScript scripts run manually from the command line. If future needs require more robust background job processing (e.g., for scheduled tasks or webhook handling), Vercel's Cron Jobs or a service like Inngest can be integrated.

## Data Ingestion Strategy

To avoid bloating Vercel serverless functions with large ML dependencies, we've separated **data ingestion** from **runtime queries**:

### Offline Ingestion (Local Execution)

**Purpose:** Generate and populate vector embeddings in Supabase when content changes.

**Location:** `ingestion-scripts/` directory (standalone TypeScript project)

**Technology:**
- `@huggingface/transformers` (Transformers.js) - Local ONNX runtime
- Model: `Xenova/bge-small-en-v1.5` (384-dimensional embeddings)
- No API calls - runs entirely offline

**Why Separate?**
- **Deployment Size:** HuggingFace Transformers.js adds ~365 packages and significant ONNX model files, pushing close to Vercel's 250MB serverless function limit
- **API Costs:** Local execution eliminates per-embedding API costs during content updates
- **Rate Limits:** Avoids HuggingFace API rate limiting during bulk ingestion
- **Flexibility:** Run on-demand when content changes, not deployed to production

**Execution:**
```bash
cd ingestion-scripts
npm install
cp .env.example .env  # Add Supabase credentials
npm run ingest        # Processes _content/** and populates Supabase
```

### Runtime Queries (Vercel Deployment)

**Purpose:** Generate query embeddings and LLM responses at request time.

**Location:** `backend/src/services/` (deployed to Vercel)

**Technology:**
- Vercel AI SDK with HuggingFace provider
- Models: `meta-llama/Llama-3.2-3B-Instruct` (LLM), `sentence-transformers/all-MiniLM-L6-v2` (embeddings)
- API-based, no heavy dependencies deployed

**Why Vercel AI SDK?**
- **Lightweight:** No large model files, just API client (~2MB)
- **Type-Safe:** Full TypeScript support with streaming
- **Multi-Provider:** Can switch providers without code changes
- **Reliable:** Vercel AI SDK handles HuggingFace API quirks better than raw calls

**Vector Dimension Alignment:**
Both ingestion (Xenova/bge-small-en-v1.5) and runtime (sentence-transformers/all-MiniLM-L6-v2) produce **384-dimensional vectors**, ensuring compatibility with Supabase pgvector schema.

### Architecture Benefits

| Concern | Solution |
|---------|----------|
| Vercel size limits | Heavy ML deps stay local, lightweight SDK deployed |
| API costs | Bulk ingestion runs offline, only query embeddings use API |
| Cold start time | Smaller deployment = faster serverless cold starts |
| Development flexibility | Ingestion can use different models/approaches without affecting runtime |

This dual-architecture approach optimizes for both **development efficiency** (local ingestion with free compute) and **production performance** (lightweight runtime with fast cold starts).


## Deployment Architecture

The entire application will be deployed on **Vercel**, leveraging its capabilities for both frontend and backend services.

*   **Frontend Deployment**: The React SPA will be deployed as a static site on Vercel, benefiting from its global CDN for fast content delivery.
*   **Backend Deployment**: The backend (using Vercel AI SDK) will be deployed as serverless functions on Vercel. These functions will handle API requests for the RAG agent and email sending.
*   **Custom Domain**: The application will be accessible via the custom subdomain `portfolio.vansh.fyi`.
*   **Supabase Integration**: Supabase will be integrated as an external database service, with secure connections managed by the Vercel-deployed backend serverless functions.
*   **CI/CD**: Vercel's built-in Git integration will provide continuous deployment (CI/CD). Pushing changes to the main branch of the repository will automatically trigger a new build and deployment.

## Development Environment

### Prerequisites

To set up the development environment, you will need:

*   **Node.js**: Latest LTS version recommended.
*   **npm or Yarn**: A package manager for installing dependencies.
*   **Git**: For version control and cloning the repository.
*   **Text Editor**: Such as VS Code, with TypeScript support.
*   **HuggingFace API Key**: Required for accessing meta-llama/Llama-3.2-3B-Instruct and sentence-transformers/all-MiniLM-L6-v2 models via Vercel AI SDK.
*   **Supabase Project**: A Supabase project with the Vector database extension enabled.
*   **Resend API Key**: For sending emails via the lead generation agent.
*   **Vercel Account**: For deployment.

### Setup Commands

```bash
# 1. Clone the repository
git clone <repository-url>
cd portfolio-react-template # Navigate to the frontend project directory

# 2. Install frontend dependencies
npm install # or yarn install

# 3. Navigate to the backend project directory
cd ../backend

# 4. Install backend dependencies
npm install # or yarn install
cd .. # Return to the project root

# 5. Set up environment variables
# Create a .env file in the 'backend' directory with your API keys:
# HUGGINGFACE_API_KEY=your_huggingface_api_key
# SUPABASE_URL=your_supabase_url
# SUPABASE_ANON_KEY=your_supabase_anon_key
# RESEND_API_KEY=your_resend_api_key

# 6. Run data ingestion script (after creating markdown files in _content/personal and _content/projects)
# This command will be defined in the backend's package.json
# cd backend && npm run ingest-data && cd ..

# 7. Start development servers
# From the 'portfolio-react-template' directory:
# npm run dev
# From the 'backend' directory (Epic 2+):
# npm run dev
```

## Architecture Decision Records (ADRs)

This section summarizes the key architectural decisions made for the project, along with their rationale.

*   **Project Foundation**: Vite with React and TypeScript.
    *   **Rationale**: Chosen for its fast development experience, performant builds, modern tooling, and beginner-friendly setup, providing a solid foundation for the SPA.
*   **AI Backend Framework**: Vercel AI SDK (TypeScript) with HuggingFace provider.
    *   **Rationale**: Provides unified, type-safe API for multiple LLM providers including HuggingFace. Better reliability than direct API calls, smaller footprint (removed 365 Mastra packages), and excellent TypeScript integration. Chosen after encountering persistent API issues with previous framework.
*   **LLM (Text Generation)**: meta-llama/Llama-3.2-3B-Instruct (via Vercel AI SDK).
    *   **Rationale**: Reliable open-source instruction-tuned model accessible via HuggingFace through Vercel AI SDK. Small (3B parameters) but capable, balancing performance, cost, and Vercel serverless compatibility.
*   **Embedding Model**: sentence-transformers/all-MiniLM-L6-v2 (384-dimensional, via Vercel AI SDK).
    *   **Rationale**: Fast, reliable sentence transformer producing 384-dimensional embeddings. Well-tested model with excellent semantic search performance, compatible with Supabase pgvector, and accessible via Vercel AI SDK for consistent API patterns.
*   **Vector Database**: Supabase.
    *   **Rationale**: User's specific choice, providing an integrated platform for vector storage and other potential database needs, simplifying the data infrastructure.
*   **API Pattern**: tRPC.
    *   **Rationale**: Selected for its end-to-end type safety, which significantly enhances the developer experience and prevents many common bugs in a TypeScript monorepo setup.
*   **Authentication**: None (Public Site).
    *   **Rationale**: The entire site is public-facing and does not require user login functionality. API keys are securely handled on the backend.
*   **Email Service**: Resend.
    *   **Rationale**: A developer-friendly service with a generous free tier, ideal for sending transactional emails for the lead generation agent.
*   **Deployment Target**: Vercel.
    *   **Rationale**: Offers easy deployment for React applications and serverless functions, supports custom domains on its free tier, and provides built-in CI/CD capabilities.
*   **Data Ingestion**: Standalone TypeScript scripts using local HuggingFace Transformers (via `@huggingface/transformers`).
    *   **Rationale**: Offline ingestion avoids API costs and rate limits. Uses local ONNX-optimized models (Xenova/bge-small-en-v1.5, 384d) for generating embeddings without external dependencies. Runs once when content changes, separate from deployment to avoid Vercel 250MB serverless limit. This dual approach (local ingestion + cloud runtime queries) optimizes both development cost and deployment footprint.
*   **Content Storage**: Markdown files stored in `_content/personal` and `_content/projects` within the repository.
    *   **Rationale**: Simple and direct access for the ingestion script, keeping all content self-contained within the project.

---

_Generated by BMAD Decision Architecture Workflow v1.0_
_Date: {{date}}_
_For: {{user_name}}_