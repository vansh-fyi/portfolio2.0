---
type: project
category: tech-stack
projectId: portfolio-website
lastUpdated: 2025-11-19
tags: [react, typescript, mastra-ai, rag, trpc, supabase, vite, zustand]
---

# Technology Stack: Building an Intelligent Portfolio

Let me walk you through the technologies powering this AI-driven portfolio and, more importantly, why I chose each one.

## Frontend Foundation

**React 19** is the backbone of the user interface. I chose React for its component-based architecture, excellent ecosystem, and the fact that I'm deeply familiar with its patterns. The latest version brings performance improvements and new features that make building complex UIs more intuitive.

**TypeScript** isn't optional for me—it's essential. With a project this complex (state management, API communication, AI integration), having compile-time type checking saves countless hours of debugging. Every component prop, every state variable, every API response is typed. This means I catch errors during development, not in production.

**Vite** as the build tool was a no-brainer. It's incredibly fast during development with hot module replacement that feels instant. Build times are minimal, and the development server starts up in milliseconds. After working with Vite, other build tools feel sluggish.

**Tailwind CSS** handles all the styling. I appreciate Tailwind's utility-first approach—it keeps my components clean and makes responsive design straightforward. No more hunting through separate CSS files; everything is right there in the component.

## State Management & Architecture

**Zustand** manages the application state, and it's perfect for this project. It's lightweight, doesn't require complex boilerplate, and works beautifully with TypeScript. I have separate stores for:
- **Overlay routing**: Managing views between main page, projects, and chat
- **Theme preferences**: Light/dark mode toggle that persists across sessions
- **Chat context**: Tracking whether we're in personal or project-specific mode

The view-state routing system I built is custom, not using traditional React Router. This gives me fine-grained control over state persistence and view transitions, which is crucial for maintaining chat context when users navigate between different parts of the portfolio.

## Backend & AI Infrastructure

**Mastra.AI** orchestrates the entire AI workflow. It's a TypeScript-based AI framework that makes building intelligent agents straightforward. I use it to manage the RAG pipeline, handle context switching, and generate responses.

**tRPC** provides end-to-end type safety between frontend and backend. When I define an API endpoint on the backend with input and output types, the frontend automatically knows the exact shape of that API. No more API documentation going out of sync or runtime errors from mismatched types. It's like having a strongly-typed conversation between client and server.

**Supabase** serves as the vector database, storing embeddings of all my content. When someone asks Ursa a question, we query Supabase to find relevant information using vector similarity search, then use that retrieved context to generate an accurate response.

## AI Models & Processing

**GLM 4.5 Air** is the Large Language Model powering text generation. Accessed through Hugging Face, it provides the intelligence behind Ursa's conversational abilities while being cost-effective and performant.

**Qwen3 Embedding 8B** creates vector embeddings of my content. These embeddings capture semantic meaning, allowing the system to find relevant information even when someone asks a question using different words than my original content.

**RAG (Retrieval-Augmented Generation)** is the architecture pattern tying everything together. Instead of relying solely on the LLM's training data (which can hallucinate), RAG retrieves actual documented information first, then generates responses grounded in that retrieved context. This ensures Ursa's answers are accurate and specific to my real experience.

## Development & Deployment

The entire codebase is version controlled with **Git**, and I use modern development practices: feature branches, meaningful commits, and code that's written with maintainability in mind.

**Vercel** will handle deployment, providing seamless CI/CD. Push to main, and the site updates automatically. Vercel's CDN ensures fast load times globally, and their serverless functions will host the backend API.

## Why This Stack Works

Every technology here serves a purpose:
- React and TypeScript give me a robust, maintainable frontend
- Vite and Tailwind make development fast and enjoyable
- Zustand provides elegant state management without over-engineering
- tRPC ensures type safety across the entire stack
- Mastra.AI makes AI integration practical and organized
- Supabase provides performant vector search for RAG
- Vercel makes deployment effortless

Together, they create a development experience that's productive and a user experience that's smooth, fast, and genuinely intelligent. The stack reflects my philosophy: use modern tools thoughtfully, prioritize type safety and maintainability, and always keep the end user in mind. ⚛️
