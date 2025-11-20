# Architecture

## Executive Summary

This document outlines the architectural decisions for the Portfolio Website project. The system will be built as a React Single-Page Application (SPA) with a TypeScript backend leveraging Mastra.AI for AI workflows. It will utilize GLM 4.5 Air for text generation and Qwen3 Embedding 8B for vector embeddings, with Supabase serving as the vector database. Communication between the frontend and backend will be handled via tRPC, and Resend will be used for email services. The entire application will be deployed on Vercel.

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
| LLM (Text Generation) | GLM 4.5 Air | N/A (API) | 2025-11-14 | Epic 2, Epic 3, Epic 4 | Specific user choice, supported by Mastra.AI. |
| Embedding Model | Qwen3 Embedding 8B | N/A (API) | 2025-11-14 | Epic 2, Epic 4 | Specific user choice, supported by Mastra.AI. |
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
├── backend/              # Mastra.AI backend service
│   ├── src/              # Backend source code
│   │   ├── agents/       # Ursa agent definitions
│   │   ├── tools/        # Mastra.AI Tools (RAG, etc.)
│   │   ├── api/          # tRPC API routes
│   │   ├── services/     # Email, Supabase integration
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
| Epic 2: Ursa - Conversational RAG Agent | `backend/` (Mastra.AI for RAG, tRPC API), Supabase (Vector DB), `portfolio-react-template/` (Chat Views) | Hugging Face (GLM 4.5 Air, Qwen3 Embedding 8B), Vercel (Deployment) |
| Epic 3: Ursa - Lead Generation Agent | `backend/` (tRPC API, Resend SDK), `portfolio-react-template/` (Contact UI) | Resend (Email Service - direct API, not Mastra.AI), Vercel (Deployment) |
| Epic 4: Backend & Data Infrastructure | `backend/` (Mastra.AI for RAG, tRPC API, Resend SDK), Supabase (Vector DB) | Hugging Face (GLM 4.5 Air, Qwen3 Embedding 8B), Resend (Email Service), Vercel (Deployment) |

## Technology Stack Details

### Core Technologies

*   **Frontend Framework**: React (via Vite)
*   **Frontend Language**: TypeScript
*   **Styling**: Tailwind CSS
*   **AI Backend Framework**: Mastra.AI (TypeScript)
*   **LLM (Text Generation)**: GLM 4.5 Air (via Hugging Face)
*   **Embedding Model**: Qwen3 Embedding 8B (via Hugging Face)
*   **Vector Database**: Supabase
*   **API Communication**: tRPC
*   **Email Service**: Resend
*   **Deployment**: Vercel

### Integration Points

*   **Frontend to Backend**: Communication will be handled via tRPC, ensuring type-safe API calls between the React frontend and the Mastra.AI backend.
*   **Backend to Supabase**: The Mastra.AI backend will interact with Supabase for vector database operations (storing and retrieving embeddings) using the Supabase client library.
*   **Backend to Hugging Face**: The Mastra.AI framework will manage the integration with Hugging Face APIs for utilizing GLM 4.5 Air (LLM) and Qwen3 Embedding 8B (embedding model).
*   **Backend to Resend**: The Mastra.AI backend will use the Resend API client to send transactional emails for the lead generation agent.
*   **Deployment Integration**: Vercel will deploy the React frontend and the Mastra.AI backend (likely as serverless functions), handling the routing and serving of both components.

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

## Deployment Architecture

The entire application will be deployed on **Vercel**, leveraging its capabilities for both frontend and backend services.

*   **Frontend Deployment**: The React SPA will be deployed as a static site on Vercel, benefiting from its global CDN for fast content delivery.
*   **Backend Deployment**: The Mastra.AI backend will be deployed as serverless functions on Vercel. These functions will handle API requests for the RAG agent, email sending, and data ingestion.
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
*   **Hugging Face API Key**: Required for accessing GLM 4.5 Air and Qwen3 Embedding 8B models.
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
*   **AI Backend Framework**: Mastra.AI (TypeScript).
    *   **Rationale**: User's specific choice, offering direct support for the selected AI models and seamless integration within our TypeScript-centric stack.
*   **LLM (Text Generation)**: GLM 4.5 Air (via Hugging Face).
    *   **Rationale**: User's specific choice, providing a powerful open-source model for text generation accessible via API, balancing performance with cost-effectiveness.
*   **Embedding Model**: Qwen3 Embedding 8B (via Hugging Face).
    *   **Rationale**: User's specific choice, offering a powerful open-source model for creating vector embeddings, accessible via API.
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
*   **Data Ingestion**: Integrated TypeScript script using Mastra.AI.
    *   **Rationale**: Provides an organized, maintainable, and reliable method for updating vector embeddings in Supabase when content changes, sharing the project's dependencies.
*   **Content Storage**: Markdown files stored in `_content/personal` and `_content/projects` within the repository.
    *   **Rationale**: Simple and direct access for the ingestion script, keeping all content self-contained within the project.

---

_Generated by BMAD Decision Architecture Workflow v1.0_
_Date: {{date}}_
_For: {{user_name}}_