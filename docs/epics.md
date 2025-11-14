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
*   **FR12**: The agent must be powered by a RAG model that retrieves information from a vector database, implemented using the Mastra.AI framework.
*   **FR13**: The agent in the contact section, also named "Ursa," must be able to collect contact information and project inquiries from potential clients.
*   **FR14**: The lead generation agent's responses must adhere to the defined "Ursa" personality.
*   **FR15**: After collecting the information, the agent must send an email containing the details to Vansh's specified email address.
*   **FR16**: This agent must not use the RAG system and should follow a more structured conversational flow for data collection, implemented using the Mastra.AI framework.
*   **FR17**: A vector database must be created and populated with embeddings from markdown documents containing information about Vansh and his projects.
*   **FR18**: A system must be in place to update the vector database when the source markdown documents are changed.
*   **FR19**: A secure backend service must be created to store and manage all API keys (for the AI model, vector database, and email service).
*   **FR20**: The backend service must implement the context-aware logic to direct the RAG agent to the correct set of documents (personal vs. project-specific) based on the request's origin.
*   **FR21**: The backend service must provide an endpoint for the lead generation agent to send email.

---

## FR Coverage Map

*   **Epic 1: Core Application & React Migration**: FR1, FR2, FR3, FR4, FR5, FR6, FR7
*   **Epic 2: Ursa - Conversational RAG Agent**: FR8, FR9, FR10, FR11, FR12
*   **Epic 3: Ursa - Lead Generation Agent**: FR13, FR14, FR15, FR16
*   **Epic 4: Backend & Data Infrastructure**: FR17, FR18, FR19, FR20, FR21

---

## Epic 1: Core Application & React Migration

**Goal**: Migrate the existing static site to a performant React SPA while preserving the current UI and UX.

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

### Story 1.5: Overlay Implementation

As a developer, I want to create the project display and chat overlays as conditionally rendered components, so that they can be triggered by user actions.

**Acceptance Criteria:**

*   **Given** the main application component
*   **When** I trigger the "See All Projects" button or a project tab
*   **Then** the project display overlay is rendered.
*   **And** the overlay components are rendered efficiently and do not impact the performance of the main page when not visible.

**Technical Notes:** Use React state to manage the visibility of the overlay components.

---

## Epic 2: Ursa - Conversational RAG Agent

**Goal**: Implement the context-aware, RAG-powered conversational agent.

### Story 2.1: Chat UI Component

As a developer, I want to build a reusable React component for the chat interface, so that it can be used in both the hero and project overlays.

**Acceptance Criteria:**

*   **Given** the chat component
*   **When** I view it in the browser
*   **Then** it displays a message history, a text input, and a send button.
*   **And** the styling matches the existing `project-chat.html`.
*   **And** when used for the personal chat (hero section), the sidebar is not displayed.

**Technical Notes:** This component will manage its own state for the input field and message history. The component should accept a prop to control the visibility of the sidebar.

### Story 2.2: Agent Personality & Conversational Flow

As a developer, I want to implement the "Ursa" personality and a dynamic conversational flow in the chat component, so that the agent feels authentic and engaging.

**Acceptance Criteria:**

*   **Given** the chat component
*   **When** I interact with the agent
*   **Then** its responses reflect the tone, voice, and vocabulary defined in the personality guide.
*   **And** when the chat overlay is opened, the agent sends a context-aware introductory message (e.g., "Hello! Ask anything about Aether: AI System generator here.").
*   **And** if the user switches to a new project while the chat is open, the chat history is cleared and a new introductory message for the new project is displayed.

**Technical Notes:** Use the provided personality guide as a reference for all agent responses. The introductory message should be dynamically generated based on the current context (personal or project).

### Story 2.3: RAG API Integration

As a developer, I want to connect the chat component to the backend RAG service, so that the agent can answer user questions.

**Acceptance Criteria:**

*   **Given** the chat component
*   **When** I send a message
*   **Then** the message is sent to the RAG API endpoint.
*   **And** the response from the API is displayed in the chat history.

**Technical Notes:** The component will make an asynchronous call to the backend API.

### Story 2.4: Context-Aware RAG

As a developer, I want to implement the context-aware functionality for the RAG agent, so that it provides relevant answers based on the user's location in the app.

**Acceptance Criteria:**

*   **Given** the chat overlay is triggered from the hero section
*   **When** I ask a question
*   **Then** the RAG API is called with the "personal" context.
*   **And** when the chat overlay is triggered from a project display
*   **Then** the RAG API is called with the context of that specific project.

**Technical Notes:** The component will need to be aware of its context (e.g., via props) and pass this information to the API.

### Story 2.5: Streaming & Loading Indicator

As a developer, I want to implement response streaming for the chat agent and display a loading indicator while the agent is generating a response, so that the user has real-time feedback.

**Acceptance Criteria:**

*   **Given** I have sent a query to the agent
*   **When** the agent is processing the request
*   **Then** the pre-built loading element is displayed.
*   **And** the streaming implementation is performant and does not block the main thread during rendering.

**Technical Notes:** The backend RAG service will need to support streaming responses. The frontend will need to handle the streamed response and update the UI accordingly.

---

## Epic 3: Ursa - Lead Generation Agent

**Goal**: Implement the lead-generation agent in the contact section.

### Story 3.1: Lead-Gen Chat UI

As a developer, I want to create an embedded chat component for the contact section, so that users can interact with the lead-gen agent.

**Acceptance Criteria:**

*   **Given** the contact section
*   **When** I view it in the browser
*   **Then** the chat interface is displayed within the section.
*   **And** the styling is consistent with the rest of the page.

**Technical Notes:** This component will be a variation of the main chat component, but embedded directly in the page.

### Story 3.2: Lead-Gen Conversational Flow

As a developer, I want to implement a structured conversational flow for the lead-gen agent, so that it can collect the necessary information from users.

**Acceptance Criteria:**

*   **Given** the lead-gen chat component is loaded
*   **When** the user first sees the chat
*   **Then** the agent sends an introductory message: "Hi! I am Ursa. Please mention your requirements."
*   **And** the agent guides the user through a series of questions to collect their name, email, and project details.
*   **And** the agent's responses adhere to the "Ursa" personality.

**Technical Notes:** The conversational flow will be more structured than the RAG agent, with a clear sequence of questions and responses.

### Story 3.3: Email API Integration

As a developer, I want to connect the lead-gen chat component to the backend email service, so that the collected information can be sent to Vansh.

**Acceptance Criteria:**

*   **Given** the lead-gen chat component has collected all the necessary information
*   **When** I confirm the details
*   **Then** the information is sent to the email API endpoint.
*   **And** I see a confirmation message in the chat.

**Technical Notes:** The component will make an asynchronous call to the backend email API.

---

## Epic 4: Backend & Data Infrastructure

**Goal**: Build the necessary backend services to support the AI functionality and data management.

### Story 4.1: Backend Service Setup

As a developer, I want to set up a secure backend service using a TypeScript framework (e.g., Express, Hono), so that I have a platform for building the AI and email APIs.

**Acceptance Criteria:**

*   **Given** a new backend project is created
*   **When** I run the service
*   **Then** it starts without errors and can respond to a basic health check request.

**Technical Notes:** Use a lightweight TypeScript framework. The service should be set up with API key management in mind.

### Story 4.2: Vector Database & Ingestion

As a developer, I want to set up a vector database and create a script to process markdown documents into embeddings, so that the RAG agent has a source of knowledge.

**Acceptance Criteria:**

*   **Given** a set of markdown documents
*   **When** I run the ingestion script
*   **Then** the documents are converted into vector embeddings and stored in the vector database.

**Technical Notes:** Use Supabase for the vector database. The ingestion script should be runnable from the command line.

### Story 4.3: Secure API Key Management

As a developer, I want to implement a secure method for managing API keys on the backend, so that they are not exposed to the client-side.

**Acceptance Criteria:**

*   **Given** the backend service
*   **When** it makes calls to external AI or email services
*   **Then** it uses API keys stored securely on the server (e.g., as environment variables).

**Technical Notes:** Use environment variables (`.env` file) to store API keys. Never commit API keys to version control.

### Story 4.4: RAG API Endpoint

As a developer, I want to build the RAG API endpoint using Mastra.AI, so that the frontend can get responses from the conversational agent.

**Acceptance Criteria:**

*   **Given** the backend service
*   **When** I send a POST request to the `/api/rag` endpoint with a query and a context (personal vs. project)
*   **Then** the service uses the appropriate documents from the vector database to generate a response.
*   **And** the response is returned in a JSON format.

**Technical Notes:** This endpoint will contain the core Mastra.AI logic for the RAG agent.

### Story 4.5: Email API Endpoint

As a developer, I want to build the email API endpoint using Mastra.AI, so that the lead-gen agent can send emails.

**Acceptance Criteria:**

*   **Given** the backend service
*   **When** I send a POST request to the `/api/email` endpoint with the collected user information
*   **Then** the service sends an email to Vansh's specified address.
*   **And** the service returns a success or failure response.

**Technical Notes:** Use a transactional email service (e.g., SendGrid, Resend) for reliable email delivery. The Mastra.AI workflow will handle the conversational data collection and trigger the email sending.

---

## FR Coverage Matrix

*   **FR1**: Epic 1, Story 1.1, 1.2
*   **FR2**: Epic 1, Story 1.2, 1.3
*   **FR3**: Epic 1, Story 1.3
*   **FR4**: Epic 1, Story 1.4
*   **FR5**: Epic 1, Story 1.4
*   **FR6**: Epic 1, Story 1.5
*   **FR7**: Epic 1, Story 1.5
*   **FR8**: Epic 2, Story 2.1, 2.2
*   **FR9**: Epic 2, Story 2.2
*   **FR10**: Epic 2, Story 2.4
*   **FR11**: Epic 2, Story 2.4
*   **FR12**: Epic 2, Story 2.3; Epic 4, Story 4.4
*   **FR13**: Epic 3, Story 3.1, 3.2
*   **FR14**: Epic 3, Story 3.2
*   **FR15**: Epic 3, Story 3.3; Epic 4, Story 4.5
*   **FR16**: Epic 3, Story 3.2
*   **FR17**: Epic 4, Story 4.2
*   **FR18**: Epic 4, Story 4.2
*   **FR19**: Epic 4, Story 4.3
*   **FR20**: Epic 4, Story 4.4
*   **FR21**: Epic 4, Story 4.5

---

## Summary

The project has been broken down into four epics: Core Application & React Migration, Ursa - Conversational RAG Agent, Ursa - Lead Generation Agent, and Backend & Data Infrastructure. All 21 functional requirements from the PRD have been mapped to these epics and decomposed into a total of 17 user stories. This provides a clear and actionable backlog for development.

---

_For implementation: Use the `create-story` workflow to generate individual story implementation plans from this epic breakdown._

_This document will be updated after UX Design and Architecture workflows to incorporate interaction details and technical decisions._
