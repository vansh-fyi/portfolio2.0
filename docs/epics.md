# Portfolio Website - Epic Breakdown

**Author:** Vansh
**Date:** 2025-11-14
**Project Level:** Medium
**Target Scale:** Personal Portfolio

---

## Overview

This document provides the complete epic and story breakdown for {{project_name}}, decomposing the requirements from the [PRD](./PRD.md) into implementable stories.

**Living Document Notice:** This is the initial version. It will be updated after UX Design and Architecture workflows add interaction and technical details to stories.

## Overview

This document provides the complete epic and story breakdown for portfolio2.0, decomposing the requirements from the [PRD](./PRD.md) into implementable stories.

**Living Document Notice:** This is the initial version. It will be updated after UX Design and Architecture workflows add interaction and technical details to stories.

### Epics Summary

*   **Epic 1: Core Application & React Migration**: This epic covers the foundational work of migrating the static site to a React SPA, preserving the UI/UX, and implementing the core navigation and overlay triggers.
*   **Epic 2: Ursa - Conversational RAG Agent**: This epic focuses on building the main conversational AI, including its context-aware RAG functionality and personality.
*   **Epic 3: Ursa - Lead Generation Agent**: This epic covers the implementation of the contact form agent, including its conversational flow and email-sending capability.
*   **Epic 4: Backend & Data Infrastructure**: This epic deals with all server-side components, including the Mastra.AI backend, vector database, API key management, and the context-aware logic.

---

## Functional Requirements Inventory

*   **FR1**: The application must be migrated from static HTML/CSS/JS to a React-based Single-Page Application (SPA).
*   **FR2**: All existing UI, layout, and user interactions from the original static pages must be preserved in the React application.
*   **FR3**: The existing CSS and Tailwind styling must be unified and preserved within the React application, using `index.html` as the source of truth for the unified style.
*   **FR4**: The application must implement a client-side routing system to manage the display of the main page content and the project-related overlays.
*   **FR5**: The main navigation bar links must scroll the user to the corresponding sections on the single page.
*   **FR6**: The "See All Projects" button and each of the five project tabs must trigger the display of the project gallery overlay.
*   **FR7**: The "Ask Ursa" input in the hero section must trigger the display of the conversational chat overlay.
*   **FR8**: The agent, named "Ursa," must be able to answer user questions about Vansh and his projects in a conversational manner.
*   **FR9**: Ursa's responses must adhere to the defined personality and writing style.
*   **FR10**: When triggered from the hero section, Ursa must only use information from documents about Vansh to answer questions.
*   **FR11**: When triggered from a specific project overlay, Ursa must only use information from documents about that specific project to answer questions.
*   **FR12**: The agent must be powered by a RAG model that retrieves information from a vector database, implemented using the Vercel AI SDK with HuggingFace provider.
*   **FR13**: The agent in the contact section, also named "Ursa," must be able to collect contact information and project inquiries from potential clients.
*   **FR14**: The lead generation agent's responses must adhere to the defined "Ursa" personality.
*   **FR15**: After collecting the information, the agent must send an email containing the details to Vansh's specified email address.
*   **FR16**: This agent must not use the RAG system and should follow a more structured conversational flow for data collection. Email functionality uses Resend SDK directly.
*   **FR17**: A vector database must be created and populated with embeddings from markdown documents containing information about Vansh and his projects.
*   **FR18**: A system must be in place to update the vector database when the source markdown documents are changed.
*   **FR19**: A secure backend service must be created to store and manage all API keys (for the AI model, vector database, and email service).
*   **FR20**: The backend service must implement the context-aware logic to direct the RAG agent to the correct set of documents (personal vs. project-specific) based on the request's origin.
*   **FR21**: The backend service must provide an endpoint for the lead generation agent to send email.

---

## FR Coverage Map

*   **Epic 1: Core Application & React Migration**: FR1, FR2, FR3, FR4, FR5, FR6, FR7, FR7a, FR7b
*   **Epic 2: Ursa - Conversational RAG Agent**: FR8, FR9, FR10, FR11, FR12
*   **Epic 3: Ursa - Lead Generation Agent**: FR13, FR14, FR15, FR16
*   **Epic 4: Backend & Data Infrastructure**: FR17, FR18, FR19, FR20, FR21

---

## Epic 1: Core Application & React Migration

**Goal**: Migrate the existing static site to a performant React SPA while preserving the current UI and UX. Implement view-state routing, dual-context chat system, and theme management.

**Status**: ✅ COMPLETED (All 5 stories done)

### Story 1.1: Project Setup & Foundation

As a developer, I want to set up a new React project using a modern build tool (e.g., Vite), so that I have a foundation for building the SPA.

**Acceptance Criteria:**

*   **Given** a new project is created
*   **When** I run the development server
*   **Then** I see a blank React application running without errors.
*   **And** the project includes basic linting, formatting, and performance monitoring (e.g., Lighthouse, Web Vitals) configurations.

**Technical Notes:** Use Vite for project scaffolding. Set up ESLint and Prettier for code quality.

### Story 1.2: Component Migration

As a developer, I want to break down the existing `index.html` into reusable React components (e.g., Header, Hero, Skills, Projects, About, Testimonials, Contact, Footer), so that the application is modular and maintainable.

**Acceptance Criteria:**

*   **Given** the `index.html` file
*   **When** I view the component structure in the React project
*   **Then** I see a logical breakdown of the page into smaller components.

**Technical Notes:** Create a `components` directory to house the new React components.

### Story 1.3: Styling Integration

As a developer, I want to integrate the existing Tailwind CSS and custom CSS into the React project, so that the components are styled correctly.

**Acceptance Criteria:**

*   **Given** the React components
*   **When** I view the application in the browser
*   **Then** the styling of all components on the main page matches the original `index.html` pixel-for-pixel.
*   **And** the unified styling does not negatively impact page load speed or rendering performance compared to the original static site.

**Technical Notes:** Set up Tailwind CSS in the React project. Ensure custom CSS is correctly imported and applied.

### Story 1.4: SPA Navigation & Routing

As a developer, I want to implement client-side routing and the main page's scroll-to-section navigation, so that the application behaves like a single-page app.

**Acceptance Criteria:**

*   **Given** the main navigation bar
*   **When** I click on a navigation link (e.g., "Skills", "Projects")
*   **Then** the page smoothly scrolls to the corresponding section.

**Technical Notes:** Use a library like `react-scroll` for smooth scrolling.

### Story 1.5: View-State Routing & Dual-Context Chat Implementation

As a developer, I want to create a view-state routing system with project display and chat views (supporting dual-context chat modes), so that navigation is performant and chat context is preserved.

**Acceptance Criteria:**

*   **Given** the main application component
*   **When** I trigger the "See All Projects" button or a project tab
*   **Then** the application navigates to the project view (view-state: 'projects').
*   **When** the "Ask Ursa" input in the hero section is triggered
*   **Then** the application navigates to chat view with personal context (no sidebar).
*   **When** the "Ask Ursa" button in project view is triggered
*   **Then** the application navigates to chat view with project context (with sidebar).
*   **And** theme toggle persists across all view transitions.
*   **And** Unicorn Studio backgrounds re-initialize correctly when returning to main view.

**Technical Notes:** Implemented view-state architecture with Zustand (`currentView: 'main' | 'projects' | 'chat'`). Created `themeStore.ts` for theme management. Dual-context chat system with conditional sidebar rendering.

---

## Epic 2: Ursa - Conversational RAG Agent

**Goal**: Integrate RAG backend with existing chat UI to enable AI-powered conversations about Vansh and his projects.

**Note**: Chat UI infrastructure and context-aware routing were implemented in Epic 1 Story 1.5.

**Status**: 🚧 IN PROGRESS

### Story 2.1: RAG Backend Integration & Chat Functionality (Refined)

As a developer, I want to verify and finalize the RAG integration so that the chat works in production.

**Acceptance Criteria:**
*   **Given** the deployed application
*   **When** I ask a question in the chat
*   **Then** I receive a relevant response based on the context (personal/project).
*   **And** the response sources are correctly cited (if applicable).

**Technical Tasks:**
*   [ ] **Verify DB Migration**: Ensure `001_create_embeddings_table.sql` is run on the production Supabase instance.
*   [ ] **Verify Embeddings**: Ensure the `embeddings` table is populated with data.
*   [ ] **Test tRPC Endpoint**: Verify `trpc.rag.query` works in the deployed environment.

### Story 2.2: Ursa Personality Implementation & Context-Aware Greetings

**Status**: ✅ COMPLETED (Implemented in ChatOverlay.tsx)

### Story 2.3: Content Preparation for RAG

**Status**: 📝 TODO

**Technical Tasks:**
*   [ ] Create markdown content in `_content/personal/` and `_content/projects/`.
*   [ ] Run ingestion script (to be created) to populate vector DB.

---

## Epic 3: Ursa - Lead Generation Agent

**Goal**: Implement the lead-generation agent in the contact section.

**Status**: 🚧 IN PROGRESS

### Story 3.1: Lead-Gen Chat UI

**Status**: ✅ COMPLETED (Implemented in Contact section)

### Story 3.2: Lead-Gen Conversational Flow

**Status**: ✅ COMPLETED (Implemented in frontend)

### Story 3.3: Email API Integration (Fixes Required)

As a developer, I want to fix the email sending logic so that it works securely in production.

**Acceptance Criteria:**
*   **Given** the contact form
*   **When** I submit a lead
*   **Then** an email is sent to the configured address.

**Technical Tasks:**
*   [ ] **Fix Hardcoded Email**: Move recipient email from `services/email.ts` to environment variable `CONTACT_EMAIL`.
*   [ ] **Verify Resend Key**: Ensure `RESEND_API_KEY` is set in Vercel.
*   [ ] **Test Email Sending**: Verify `trpc.email.sendLead` successfully sends emails in production.

---

## Epic 4: Backend & Data Infrastructure

**Goal**: Build the necessary backend services to support the AI functionality and data management.

**Status**: 🚧 IN PROGRESS

### Story 4.1: Backend Service Setup

**Status**: ✅ COMPLETED (Hono + tRPC setup)

### Story 4.2: Vector Database & Ingestion

**Status**: 🚧 IN PROGRESS

**Technical Tasks:**
*   [ ] **Run Migration**: Execute `001_create_embeddings_table.sql` on Supabase.
*   [ ] **Create Ingestion Script**: Build a script to read `_content/*.md` and insert embeddings into Supabase.

### Story 4.3: Secure API Key Management

**Status**: 📝 TODO

**Technical Tasks:**
*   [ ] **Audit Env Vars**: Ensure all keys (`OPENAI_API_KEY`, `SUPABASE_URL`, `SUPABASE_KEY`, `RESEND_API_KEY`) are in `.env` (local) and Vercel Project Settings (prod).

### Story 4.4: RAG API Endpoint

**Status**: ✅ COMPLETED (Implemented in `api/rag.ts`)

### Story 4.5: Email API Endpoint

**Status**: ✅ COMPLETED (Implemented in `api/email.ts`)

---

## FR Coverage Matrix

*   **FR1**: Epic 1, Story 1.1, 1.2 ✅
*   **FR2**: Epic 1, Story 1.2, 1.3 ✅
*   **FR3**: Epic 1, Story 1.3 ✅
*   **FR4**: Epic 1, Story 1.5 ✅
*   **FR5**: Epic 1, Story 1.4 ✅
*   **FR6**: Epic 1, Story 1.5 ✅
*   **FR7**: Epic 1, Story 1.5 ✅
*   **FR7a**: Epic 1, Story 1.5 ✅
*   **FR7b**: Epic 1, Story 1.5 ✅
*   **FR8**: Epic 2, Story 2.1 (In Progress)
*   **FR9**: Epic 2, Story 2.2 ✅
*   **FR10**: Epic 2, Story 2.1 (In Progress)
*   **FR11**: Epic 2, Story 2.1 (In Progress)
*   **FR12**: Epic 2, Story 2.1; Epic 4, Story 4.4 ✅
*   **FR13**: Epic 3, Story 3.1 ✅
*   **FR14**: Epic 3, Story 3.2 ✅
*   **FR15**: Epic 3, Story 3.3 (Fixes Needed)
*   **FR16**: Epic 3, Story 3.2 ✅
*   **FR17**: Epic 4, Story 4.2 (In Progress)
*   **FR18**: Epic 4, Story 4.2 (Todo)
*   **FR19**: Epic 4, Story 4.3 (Todo)
*   **FR20**: Epic 4, Story 4.4 ✅
*   **FR21**: Epic 4, Story 4.5 ✅

---

---

## Epic 5: System Integration & Production Launch

**Goal**: Connect the frontend to the backend, implement dynamic project content, ensure granular RAG context, and ship to production.

**Status**: 📝 TODO

### Story 5.1: Content Migration & Metadata

As a developer, I want to migrate the project content from the `rag` directory to the application structure and ensure it has the necessary metadata, so that the RAG system can index it correctly.

**Acceptance Criteria:**
*   **Given** the `rag/case_studies` directory
*   **When** I migrate the files to `_content/projects`
*   **Then** all files have frontmatter with `projectId`, `title`, and `category`.
*   **And** the ingestion script successfully populates Supabase with this metadata.

**Technical Tasks:**
*   [ ] **Migrate Content**: Copy files from `rag/` to `_content/projects`.
*   **Add Metadata**: Script or manual update to add YAML frontmatter to all markdown files.
*   **Update Ingestion**: Modify `ingest.ts` to parse frontmatter and store it in Supabase metadata.

### Story 5.2: Dynamic Project Overlay & Iframe Integration

As a user, I want to see the full list of projects in the overlay and view them in an iframe, so that I can explore Vansh's work without leaving the site.

**Acceptance Criteria:**
*   **Given** the project overlay
*   **When** I open the sidebar
*   **Then** I see the full list of projects categorized correctly (Product Design, Healthcare, etc.).
*   **When** I select a project
*   **Then** the iframe updates to show the correct project URL.
*   **And** the "Ask Ursa" button context updates to the selected project.

**Technical Tasks:**
*   [ ] **Create Config**: Create `src/config/projects.ts` with the full project list (IDs, titles, categories, URLs).
*   **Update Sidebar**: Refactor `OverlaySidebar` to render from the config.
*   **Update Overlay**: Refactor `ProjectOverlay` to use the selected project from the store and update the iframe.

### Story 5.3: Granular RAG Context (Project-Specific)

As a user, I want "Ask Ursa" to answer questions specifically about the currently viewed project, so that I get relevant answers.

**Acceptance Criteria:**
*   **Given** I am viewing a specific project (e.g., "Aether")
*   **When** I ask Ursa a question
*   **Then** the answer is based ONLY on the content for that project.
*   **When** I switch to another project
*   **Then** the chat history clears (or switches context) and answers are based on the new project.

**Technical Tasks:**
*   [ ] **Update API**: Modify `trpc.rag.query` to accept `projectId`.
*   **Update RAG Service**: Modify `backend/src/services/rag.ts` to filter embeddings by `projectId`.
*   **Update Frontend**: Pass the current `projectId` from `ProjectOverlay` to `ChatOverlay`.

### Story 5.4: Lead Gen Integration & Production Launch

As a user, I want the contact form to actually send emails and the site to be live, so that I can use it.

**Acceptance Criteria:**
*   **Given** the contact form
*   **When** I submit a message
*   **Then** Vansh receives an email via Resend.
*   **Given** the production URL
*   **When** I visit the site
*   **Then** everything works as expected.

**Technical Tasks:**
*   [ ] **Connect Email**: Wire up `ContactOverlay` to `trpc.email.sendLead`.
*   **Deploy**: Final push to Vercel.
*   **Verify**: Run end-to-end smoke tests on production.

---

## Summary

The project has been broken down into four epics: Core Application & React Migration (COMPLETED ✅), Ursa - Conversational RAG Agent, Ursa - Lead Generation Agent, and Backend & Data Infrastructure. All 23 functional requirements from the PRD (including FR7a, FR7b added after Epic 1) have been mapped to these epics and decomposed into a total of 15 user stories (reduced from 17 after Epic 1 learnings consolidated Epic 2 stories). This provides a clear and actionable backlog for development.

**Epic 1 Retrospective Findings:**
- View-state architecture implemented instead of overlay visibility flags
- Dual-context chat system (personal vs project) delivered ahead of schedule
- Theme management system added (not originally planned)
- Epic 2 stories revised to leverage Epic 1 infrastructure

---

_For implementation: Use the `create-story` workflow to generate individual story implementation plans from this epic breakdown._

_This document will be updated after UX Design and Architecture workflows to incorporate interaction details and technical decisions._
