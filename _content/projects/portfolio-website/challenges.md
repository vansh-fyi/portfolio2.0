---
type: project
category: challenges
projectId: portfolio-website
lastUpdated: 2025-11-19
tags: [technical-challenges, rag, context-switching, architecture, type-safety]
---

# Technical Challenges: Building Intelligence Into a Portfolio

Every ambitious project comes with its challenges. Here's what I encountered building an AI-powered portfolio and how I solved each problem.

## Challenge 1: Dual-Context Chat System

The core architectural challenge was making the chat system understand context. Ursa needed to know whether someone was asking about me personally or about a specific project, and switch her knowledge base accordingly without any awkward manual mode selection.

**The Problem:** How do you build a single chat interface that's intelligent enough to know *what* the user is asking about based on *where* they are in the portfolio?

**The Solution:** I designed a unified chat overlay with dynamic context switching using Zustand for state management. I track both `currentView` (main/projects/chat) and `chatContext` (personal/project). When someone opens chat from the hero section, `chatContext` is automatically set to 'personal'. From a project view, it's set to 'project' with a specific `projectId`.

On the backend, the RAG system filters embeddings based on this context metadata. Personal queries only retrieve from `_content/personal/` files, while project queries filter by `projectId`. This architecture gives Ursa the right knowledge for every conversation without requiring users to explicitly tell her what they're asking about.

## Challenge 2: Content Organization for RAG

Organizing content for effective RAG retrieval required thinking differently about information architecture. How do you structure content so that AI can find and use it effectively while also being readable by humans?

**The Problem:** RAG systems work best with well-structured, semantically rich content. But content that's too fragmented becomes hard to maintain, and content that's too dense becomes hard to retrieve from accurately.

**The Solution:** I developed a content strategy that balances both needs. Each markdown file focuses on a specific topic (bio, skills, specific project aspects) with comprehensive coverage but clear scope. The YAML frontmatter metadata enables smart filtering before semantic search even happens.

Each file includes:
- `type` (personal/project) for high-level categorization
- `category` (bio/skills/overview/tech-stack) for specific topics
- `projectId` for project-specific filtering
- `tags` for additional retrieval hints

This structure makes content easy for me to update, easy for the AI to retrieve, and results in responses that feel authentic and informative.

## Challenge 3: Type Safety Across the Full Stack

With TypeScript on both frontend and backend, I wanted end-to-end type safety. But traditional REST APIs lose type information at the network boundary—you define types on both sides and hope they match.

**The Problem:** How do you ensure your frontend and backend are always in sync without manually maintaining API contracts in multiple places?

**The Solution:** tRPC solves this elegantly. I define procedures once on the backend with input and output types, and the frontend automatically knows the exact shape. If I change an API response structure, TypeScript errors appear immediately in the frontend code that uses it—no runtime surprises, no outdated documentation.

Setting up tRPC required understanding its patterns (routers, procedures, context), but once configured, it's been invaluable for maintaining confidence that my frontend and backend are always communicating correctly.

## Challenge 4: Maintaining Theme Across View Transitions

Users can toggle between light and dark modes, and that preference needs to persist across all views—main page, project overlays, chat interfaces. The challenge was that different views had different DOM structures, and some elements (like WebGL backgrounds from the original brownfield site) needed complete re-initialization.

**The Solution:** I implemented a centralized `themeStore` using Zustand that manages theme state globally. Every component subscribes to this store, and theme changes propagate instantly. For elements that need lifecycle management, I added proper cleanup and re-initialization hooks to ensure smooth transitions without memory leaks or visual glitches.

## Challenge 5: RAG Response Quality

Early iterations revealed that sometimes Ursa's responses were too generic or missed important details from my content. The embeddings were being created, but retrieval wasn't always finding the most relevant information.

**The Problem:** How do you improve the accuracy and relevance of RAG-generated responses?

**The Solution:** Two-pronged approach. First, I refined the content structure with detailed YAML frontmatter that allows for better filtering before similarity search. This means we search within the right category first (personal vs. project, bio vs. experience), then find semantically similar content within that category.

Second, I'm working on prompt engineering for the LLM. The prompt needs to emphasize the retrieved context and guide the model to respond in Ursa's personality style (first-person, conversational, authentic) rather than falling back to generic AI assistant patterns.

## Challenge 6: View-State Routing Architecture

I chose not to use traditional React Router, instead implementing a custom view-state routing system. This decision was driven by the need for fine-grained control over state persistence and chat context maintenance.

**The Problem:** Traditional routing can cause state loss during navigation. For a chat application where context matters, losing that context when users navigate is unacceptable.

**The Solution:** Custom view-state management with Zustand. Instead of URL-based routes, I manage views as application state (`currentView: 'main' | 'projects' | 'chat'`). This approach lets me control exactly what state persists, what gets reset, and how transitions happen. Chat context stays intact when users explore different projects, and the entire experience feels more app-like than website-like.

## Lessons Learned

These challenges taught me that good architecture isn't about using every fancy pattern—it's about choosing solutions that solve specific problems while keeping the system maintainable.

The dual-context chat system, the content organization strategy, the type-safe API layer—each solves a real problem while making the overall system more flexible and extensible. The architecture I built for this portfolio could easily scale to support more projects, additional chat contexts, or new AI features. That's the kind of code I strive to write: solutions that work today and enable tomorrow. 🚀
