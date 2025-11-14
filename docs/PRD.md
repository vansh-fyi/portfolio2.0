# Portfolio Website - Product Requirements Document

**Author:** Vansh
**Date:** 2025-11-14
**Version:** 1.0

---

## Executive Summary

This project will migrate the existing static HTML/CSS/JS portfolio website into a dynamic, React-based Single-Page Application (SPA). The core vision is to enhance the user experience by integrating two conversational AI agents powered by a Retrieval-Augmented Generation (RAG) model:
1.  An interactive chat agent to provide in-depth information about Vansh and his projects.
2.  A lead-generation agent in the contact section to engage with potential clients and forward their inquiries.

The existing `project-chat` and `project-display` pages will be transformed into interactive overlays within the SPA, creating a seamless and modern user journey.

### What Makes This Special

The key differentiator of this portfolio is the **AI-powered conversational experience**. Instead of passively browsing, users can directly engage in a dialogue to learn about Vansh, his skills, and his work. This creates a more personal, memorable, and technically impressive showcase of his capabilities.

---

## Project Classification

**Technical Type:** Web App (React SPA)
**Domain:** Personal Portfolio with AI
**Complexity:** Medium

This project is classified as a modern web application due to its Single-Page Application (SPA) architecture using React. The integration of a Retrieval-Augmented Generation (RAG) model, a vector database, and a secure backend for API key management elevates the complexity from a simple static website to a medium-complexity project.

{{#if domain_context_summary}}

### Domain Context

{{domain_context_summary}}
{{/if}}

---

## Success Criteria

The primary success of this project will be measured by its ability to attract and convert both full-time job opportunities and freelance clients. The portfolio should effectively showcase Vansh's technical skills and creative vision, leading to tangible career opportunities.

### Business Metrics

*   **Increase in Inquiries**: A notable increase in qualified inquiries from recruiters and potential clients through the AI contact agent.
*   **Positive Feedback**: Receiving positive feedback during interviews and client discussions specifically mentioning the portfolio's unique AI-driven conversational experience.
*   **Conversion Rate**: Successfully converting a target number of inquiries into interviews or signed freelance projects.

---

## Product Scope

**CRITICAL NOTE**: The existing UI, layout, structure, and interactions from the static HTML pages are considered final and must be preserved. The scope of this project is to migrate the frontend to React and implement the new AI-driven functionality without altering the established visual design and user experience.

### MVP - Minimum Viable Product

The Minimum Viable Product (MVP) encompasses the complete migration of the existing static portfolio to a React-based Single-Page Application (SPA). This includes preserving the existing UI/UX, unifying the styling across all components, and implementing the core navigation and overlay triggering mechanisms. Crucially, the MVP will deliver both "Ursa" AI agents: the context-aware conversational RAG agent (for personal and project inquiries) and the lead-generation agent (for the contact section), along with all necessary secure backend and data infrastructure (vector database, API management).

### Growth Features (Post-MVP)

Potential growth features could include:
*   More advanced AI capabilities for Ursa, such as proactive engagement with visitors, personalized content recommendations, or deeper integration with Vansh's professional calendar for booking appointments.
*   Integration with third-party services for enhanced functionality (e.g., CRM for lead management, analytics for user behavior).
*   Expansion of content types beyond markdown for RAG (e.g., video transcripts, audio).

### Vision (Future)

The long-term vision for this portfolio is to evolve Ursa into a highly sophisticated, semi-autonomous AI assistant. This future Ursa could not only answer questions but also proactively manage aspects of Vansh's professional outreach, learn and adapt from user interactions, and provide a truly unique and interactive digital representation of Vansh's professional persona.

---

{{#if domain_considerations}}

## Domain-Specific Requirements

{{domain_considerations}}

This section shapes all functional and non-functional requirements below.
{{/if}}

---

{{#if innovation_patterns}}

## Innovation & Novel Patterns

{{innovation_patterns}}

### Validation Approach

{{validation_approach}}
{{/if}}

---

{{#if project_type_requirements}}

## Web App (React SPA) Specific Requirements

This project's complexity comes from its AI integration within a React SPA. The core requirements revolve around the implementation of "Ursa," the personal AI agent.

### Ursa: The Personal AI Agent

All AI functionality will be unified under the brand "Ursa." While presented to the user as a single entity, the backend will consist of two distinct agent instances sharing the same core personality.

**1. Ursa (Conversational RAG Agent)**

*   **Function**: To provide information about Vansh and his projects through a conversational interface.
*   **Technology**: This agent will be powered by a Retrieval-Augmented Generation (RAG) model connected to a vector database, implemented using the Mastra.AI framework.
*   **Context-Awareness (Critical Requirement)**:
    *   **Hero Section Context**: When triggered from the hero section ("Ask Ursa"), the agent will exclusively use vector embeddings from documents containing Vansh's personal and professional information.
    *   **Project Context**: When triggered from a specific project's display overlay, the agent will exclusively use vector embeddings from documents related to that specific project.
*   **Triggers**:
    *   Entering a query in the hero section's "Ask Ursa" input.
    *   Interacting with the chat feature within a project's display overlay.

**2. Ursa (Lead Generation Agent)**

*   **Function**: To engage with potential clients or recruiters via the contact form, collect their information and project inquiries, and email the details to Vansh.
*   **Technology**: This agent does **not** use the RAG system. It will be a simpler, form-handling agent whose conversational flow and email-sending action will be implemented using the Mastra.AI framework.
*   **Personality**: It will share the same "Ursa" personality as the conversational agent to maintain a consistent user experience.
*   **Trigger**: Interacting with the chat interface in the main page's "Contact" section.

### Backend & Security

*   A secure backend service is required to handle API keys for the AI models and the vector database. API keys must not be exposed on the client-side.
*   The backend will also manage the logic for the context-aware RAG system, selecting the appropriate document sources based on the trigger location.
*   The lead generation agent will require a backend service to process and send emails.

{{#if endpoint_specification}}

### API Specification

{{endpoint_specification}}
{{/if}}

{{#if authentication_model}}

### Authentication & Authorization

{{authentication_model}}
{{/if}}

{{#if platform_requirements}}

### Platform Support

{{platform_requirements}}
{{/if}}

{{#if device_features}}

### Device Capabilities

{{device_features}}
{{/if}}

{{#if tenant_model}}

### Multi-Tenancy Architecture

{{tenant_model}}
{{/if}}

{{#if permission_matrix}}

### Permissions & Roles

{{permission_matrix}}
{{/if}}
{{/if}}

---

{{#if ux_principles}}

## User Experience Principles

The user experience will be guided by the personality of "Ursa," the site's personal AI agent. The goal is to create a conversational and engaging experience that feels personal and authentic.

### Ursa's Personality

Ursa's personality should mirror Vansh's own writing style, making interactions feel like a direct conversation with him. The key characteristics are:

*   **Tone**: Conversational, authentic, and passionate. It should feel like a personal story, not a formal report.
*   **Voice**: Strongly first-person ("I"), telling stories from a personal perspective.
*   **Vocabulary**: Clear, direct language with informal touches (e.g., "coz," "blast") and parenthetical asides.
*   **Narrative Flow**: Sentences should create a narrative, often starting with personal context or a hook.
*   **Visuals**: Strategic use of any emoji that fits the situation to convey emotion (avoiding overuse; use only as much as it looks nice).

*(A full personality guide has been provided and should be used as the primary reference for all of Ursa's conversational design.)*

### Key Interactions

The primary user interactions with Ursa are:

1.  **Conversational Q&A**: Users can ask questions about Vansh or his projects in the hero section or within project overlays. Ursa will provide context-aware answers based on the RAG system.
2.  **Lead Generation**: In the contact section, users will interact with Ursa to provide their contact information and project details. This interaction should be conversational and guide the user through the process of leaving a message for Vansh.
{{/if}}

---

## Technology Stack

*   **Frontend**: React
*   **AI Backend**: Mastra.AI (TypeScript)
*   **Styling**: Tailwind CSS

---

## Functional Requirements

### Core Application

*   **FR1**: The application must be migrated from static HTML/CSS/JS to a React-based Single-Page Application (SPA).
*   **FR2**: All existing UI, layout, and user interactions from the original static pages must be preserved in the React application.
*   **FR3**: The existing CSS and Tailwind styling must be unified and preserved within the React application, using `index.html` as the source of truth for the unified style.
*   **FR4**: The application must implement a client-side routing system to manage the display of the main page content and the project-related overlays.
*   **FR5**: The main navigation bar links must scroll the user to the corresponding sections on the single page.
*   **FR6**: The "See All Projects" button and each of the five project tabs must trigger the display of the project gallery overlay.
*   **FR7**: The "Ask Ursa" input in the hero section must trigger the display of the conversational chat overlay.

### Ursa - Conversational Agent (RAG)

*   **FR8**: The agent, named "Ursa," must be able to answer user questions about Vansh and his projects in a conversational manner.
*   **FR9**: Ursa's responses must adhere to the defined personality and writing style.
*   **FR10**: When triggered from the hero section, Ursa must only use information from documents about Vansh to answer questions.
*   **FR11**: When triggered from a specific project overlay, Ursa must only use information from documents about that specific project to answer questions.
*   **FR12**: The agent must be powered by a RAG model that retrieves information from a vector database, implemented using the Mastra.AI framework.

### Ursa - Lead Generation Agent

*   **FR13**: The agent in the contact section, also named "Ursa," must be able to collect contact information and project inquiries from potential clients.
*   **FR14**: The lead generation agent's responses must adhere to the defined "Ursa" personality.
*   **FR15**: After collecting the information, the agent must send an email containing the details to Vansh's specified email address.
*   **FR16**: This agent must not use the RAG system and should follow a more structured conversational flow for data collection, implemented using the Mastra.AI framework.

### Backend & Data

*   **FR17**: A vector database must be created and populated with embeddings from markdown documents containing information about Vansh and his projects.
*   **FR18**: A system must be in place to update the vector database when the source markdown documents are changed.
*   **FR19**: A secure backend service must be created to store and manage all API keys (for the AI model, vector database, and email service).
*   **FR20**: The backend service must implement the context-aware logic to direct the RAG agent to the correct set of documents (personal vs. project-specific) based on the request's origin.
*   **FR21**: The backend service must provide an endpoint for the lead generation agent to send email.

---

## Non-Functional Requirements

{{#if performance_requirements}}

### Performance

{{performance_requirements}}
{{/if}}

{{#if security_requirements}}

### Security

{{security_requirements}}
{{/if}}

{{#if scalability_requirements}}

### Scalability

{{scalability_requirements}}
{{/if}}

{{#if accessibility_requirements}}

### Accessibility

{{accessibility_requirements}}
{{/if}}

{{#if integration_requirements}}

### Integration

{{integration_requirements}}
{{/if}}

{{#if no_nfrs}}
_No specific non-functional requirements identified for this project type._
{{/if}}

---

## Implementation Planning

### Epic Breakdown Summary

The project is broken down into the following four epics. For a detailed breakdown of stories, see the [epics.md](./epics.md) file.

*   **Epic 1: Core Application & React Migration**: This epic covers the foundational work of migrating the static site to a React SPA, preserving the UI/UX, and implementing the core navigation and overlay triggers.
*   **Epic 2: Ursa - Conversational RAG Agent**: This epic focuses on building the main conversational AI, including its context-aware RAG functionality and personality.
*   **Epic 3: Ursa - Lead Generation Agent**: This epic covers the implementation of the contact form agent, including its conversational flow and email-sending capability.
*   **Epic 4: Backend & Data Infrastructure**: This epic deals with all server-side components, including the Mastra.AI backend, vector database, API key management, and the context-aware logic.

### Epic Breakdown Required

Requirements must be decomposed into epics and bite-sized stories (200k context limit).

**Next Step:** Run `workflow epics-stories` to create the implementation breakdown.

---

## References

{{#if product_brief_path}}

- Product Brief: {{product_brief_path}}
  {{/if}}
  {{#if domain_brief_path}}
- Domain Brief: {{domain_brief_path}}
  {{/if}}
  {{#if research_documents}}
- Research: {{research_documents}}
  {{/if}}

---

## Next Steps

1. **Epic & Story Breakdown** - Run: `workflow epics-stories`
2. **UX Design** (if UI) - Run: `workflow ux-design`
3. **Architecture** - Run: `workflow create-architecture`

---

_This PRD captures the essence of Portfolio Website - AI-powered conversational experience_

_Created through collaborative discovery between {{user_name}} and AI facilitator._
