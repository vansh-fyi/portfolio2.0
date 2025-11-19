---
type: project
category: overview
projectId: portfolio-website
lastUpdated: 2025-11-19
tags: [portfolio, ai-integration, rag, conversational-ai, product-design, react]
---

# AI-Powered Portfolio: Project Overview

## The Vision

I wanted to build a portfolio that breaks the mold. Most portfolios are static—you scroll, you read, maybe you click a few links. They're one-way conversations where I talk *at* you. I wanted to create something where you could actually *talk to me*, or at least to an AI that truly represents me and my work.

This portfolio is my experiment in blending Product Design with Artificial Intelligence. It's not just about showcasing my projects; it's about creating an interactive experience where visitors can have real, meaningful conversations about my work, my process, and my thinking.

## Why Build This?

As someone who operates at the intersection of Product Design and AI Engineering, I need a portfolio that demonstrates both skill sets. But more than that, as someone who's naturally reserved in person but comes alive when discussing work, an AI-powered chat interface is actually the perfect medium for me to communicate.

I wanted to prove a concept: that you can create an AI assistant that doesn't just spit out generic responses, but actually understands context, retrieves accurate information from a knowledge base, and responds in a consistent, authentic voice. This portfolio *is* that proof.

## What Makes It Different

**Context-Aware Intelligence:** The AI chat system (I call her Ursa) understands where you are in the portfolio. Ask about me from the hero section, and she draws from my personal background. Click into a specific project and ask questions, and she switches to that project's context. It's seamless context switching without you having to explicitly tell the AI what you're asking about.

**Grounded in Reality:** This isn't an AI that makes things up. Every response is grounded in actual markdown documents I've written—my real resume, project case studies, and technical documentation. Using RAG (Retrieval-Augmented Generation), Ursa retrieves relevant information first, then generates responses based on that retrieved context.

**Personality-Driven:** I didn't want Ursa to sound like a generic chatbot. I created a comprehensive personality guide that defines her tone (conversational, authentic, passionate), voice (strongly first-person as me), and even emoji usage (strategic, never overdone). She speaks *as* me, not *about* me.

## The Technical Challenge

Building this required bringing together multiple technologies:
- **React 19** and **TypeScript** for the frontend architecture
- **Zustand** for state management (handling view routing and chat context)
- **Mastra.AI** for orchestrating the AI workflows
- **tRPC** for type-safe communication between frontend and backend
- **RAG implementation** with vector databases (Supabase) for knowledge retrieval
- **LLM integration** (GLM 4.5 Air) for response generation
- **Embedding models** (Qwen3) for semantic search

The hardest part wasn't implementing any single technology—it was making them all work together seamlessly while maintaining type safety, good performance, and an intuitive user experience.

## Where I Am Now

As I write this, the project is in active development. The core chat system is implemented with dual-context switching. The content organization is complete (that's what you're reading right now). The frontend architecture is solid with view-state routing and theme management.

What's next: Backend integration is upcoming (Epic 4), connecting the RAG system to actually power Ursa's responses. Then lead generation features for the contact section. Then deployment to production.

## What It Demonstrates

This project showcases my ability to:
- Design and implement complex state management for context-aware experiences
- Work with cutting-edge AI technologies (RAG, embeddings, LLMs)
- Build type-safe, maintainable architecture across the full stack
- Create cohesive user experiences that blend familiar patterns with innovative features
- Write clear, structured content optimized for AI retrieval
- Think systematically about information architecture and semantic search

More than any case study I could write, this portfolio *is* the case study. It's a living demonstration of how I think about problems, how I architect solutions, and how I bridge design and engineering to create something genuinely useful and delightful. 💬
