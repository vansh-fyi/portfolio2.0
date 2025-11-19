---
type: project
category: links
projectId: portfolio-website
lastUpdated: 2025-11-19
tags: [demo, github, deployment, source-code]
---

# Project Links and Resources

Here's where you can explore the live application and dive into the technical implementation.

## Live Demo

The portfolio is deployed and accessible at **[portfolio.vansh.fyi]** (deployment pending - currently in development on Vercel). You're likely already experiencing it right now! Feel free to explore all the features:
- Chat with Ursa from the hero section to ask about my background and experience
- Navigate to project views and start project-specific conversations
- Toggle between light and dark modes to see the theme persistence
- Experience the smooth view-state transitions and context-aware AI responses

The live site showcases the full functionality: responsive design that adapts to your device, smooth animations and transitions, and the intelligent RAG-powered chat system that provides real, contextual conversations about my work.

## Source Code

The complete source code will be available on **GitHub** (repository link pending). I believe in transparency and learning from each other's code, so once the project reaches a stable state, I plan to make the repository public.

**What you'll find in the repository:**
- Complete frontend implementation with React, TypeScript, and Zustand
- Backend services with Mastra.AI integration and tRPC procedures
- Content files (what you're reading now) that power the RAG system
- Configuration files for deployment and development
- Documentation on architecture decisions and setup instructions

## Technical Implementation Highlights

**Frontend Architecture:**
- Clean, well-organized React components with strict TypeScript typing
- Custom view-state routing instead of traditional URL-based routing
- Zustand stores for overlay routing, theme management, and chat context
- Tailwind CSS for utility-first styling with responsive design patterns
- Optimized rendering and performance considerations

**Backend & AI:**
- tRPC procedures providing type-safe API endpoints
- Mastra.AI agent configuration orchestrating RAG workflows
- Vector database integration with Supabase for semantic search
- RAG pipeline implementation: embedding → retrieval → generation
- Prompt engineering for consistent Ursa personality responses

**Content Organization:**
- `_content/` directory with personal and project-specific markdown files
- YAML frontmatter metadata enabling context-aware filtering
- Conversational writing style optimized for both human reading and AI retrieval
- Documentation on content structure and guidelines for adding new projects

**Development Workflow:**
- Git version control with meaningful commit messages
- Feature-based development approach
- Type-driven development with TypeScript across the stack
- Build optimization with Vite for fast development iteration

## Explore and Learn

If you're interested in RAG systems, AI integration in web applications, or modern TypeScript development patterns, this project offers practical examples of each. I've tried to write code that's not just functional but also readable, maintainable, and well-documented.

The architecture demonstrates real-world solutions to common challenges:
- How to implement context-aware AI chat systems
- How to structure content for effective semantic retrieval
- How to maintain type safety across frontend and backend
- How to build flexible, extensible state management
- How to create smooth, app-like experiences with React

Feel free to explore, learn from the implementation, or reach out with questions. Sharing knowledge and helping others grow is an important part of being a developer and designer. 🔗
