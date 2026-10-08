---
projectId: portfolio-website
---

**Status**: In Development  
**Type**: Personal Portfolio + AI Integration  
**Role**: Designer, Developer, AI Engineer  
**Timeline**: 2024 - Present  
**Live**: vansh.fyi
tech_stack: ["React", "TypeScript", "Vite", "TailwindCSS"]

## Project Overview

This portfolio website isn't just a showcase of my work—it's a demonstration of my capabilities in design, development, and AI engineering. It features **Ursa**, an AI assistant powered by RAG (Retrieval-Augmented Generation) that can answer questions about my background, skills, and projects in real-time.

## The Vision

Traditional portfolios are static and require visitors to search for information manually. I wanted to create an **interactive, conversational experience** where visitors can:
- Ask questions about my work and get instant, accurate answers
- Explore projects through natural conversation
- Experience AI-powered features firsthand
- See my technical skills in action, not just read about them

## Key Features

### 1. Ursa: AI Personal Assistant
- **RAG-Powered Responses**: Uses Retrieval-Augmented Generation to answer questions accurately from my portfolio content
- **Context-Aware**: Understands whether you're asking about me personally or a specific project
- **Natural Conversations**: Powered by free-tier language models (Gemini, Groq and OpenRouter), with automatic fallback if one is unavailable
- **Fast, Relevant Answers**: Hybrid search that combines meaning-based vector search with keyword search

### 2. Modern, Performant UI
- **React + TypeScript**: Type-safe, maintainable codebase
- **TailwindCSS**: Custom design system with smooth animations
- **Responsive Design**: Flawless experience across desktop, tablet, and mobile
- **Accessibility**: WCAG 2.1 AA compliant, keyboard navigation, screen reader support

### 3. Lead Generation Chat
- **Conversational Forms**: Natural dialogue instead of boring contact forms
- **Email Integration**: Secure lead capture with Resend API
- **Smart Validation**: Real-time input validation and helpful error messages

### 4. Project-Specific Context
- **Dynamic RAG**: Switch context when viewing different projects
- **Personalized Greetings**: "Ask anything about Aether" vs "Ask anything about Vansh"
- **Isolated Knowledge**: Each project has its own knowledge base



## Design Decisions

### Why RAG over Fine-Tuning?
- **Dynamic Content**: Easy to update by editing markdown files
- **Accuracy**: Grounded in actual portfolio content, reduces hallucinations
- **Cost-Effective**: No expensive fine-tuning or hosting of custom models
- **Explainable**: Can trace responses back to source documents

### Why a fallback chain of free models?
- **Free to run**: Uses the free tiers of Gemini, Groq and OpenRouter, so there are no API bills
- **Resilient**: Free tiers change without notice, so if one model is slow, rate-limited or retired, Ursa moves to the next
- **Quality**: Current models follow instructions well enough to stay grounded in the retrieved content
- **Monitored**: A daily health check emails me if anything starts failing

### Why Supabase + pgvector?
- **Integrated Solution**: PostgreSQL database + vector search in one
- **Scalable**: Handles millions of vectors efficiently
- **Familiar**: Standard SQL + vector extensions
- **Cost**: Generous free tier for portfolios

## Challenges & Solutions

### Challenge 1: Embedding Quality
**Problem**: Generic embeddings didn't capture domain-specific nuances  
**Solution**: Moved to the gte-small embedding model and split content by heading, so every chunk carries its project and section name

### Challenge 2: Response Consistency
**Problem**: LLM sometimes ignored context or hallucinated  
**Solution**: Explicit prompt instructions, lower temperature, structured system prompts

### Challenge 3: Mobile Performance
**Problem**: Long chat histories caused memory issues on mobile  
**Solution**: Virtual scrolling, query caching, aggressive garbage collection

### Challenge 4: Cold Starts (Serverless)
**Problem**: First request after idle took 5-10 seconds  
**Solution**: Optimized imports, lazy loading of ML models, kept functions warm with health checks

## Performance Metrics

- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices, SEO)
- **First Contentful Paint**: <1s
- **Time to Interactive**: <2s
- **Bundle Size**: <300KB (gzipped)
- **RAG Query Time**: 2-5s average (embedding + search + generation)

## Future Enhancements

- **Streaming Responses**: Real-time token streaming for faster perceived performance
- **Multi-Modal RAG**: Include images and diagrams in context
- **Conversation Memory**: Remember previous questions in the session
- **Voice Interface**: Ask questions via voice input
- **Advanced Analytics**: Track which questions are most common, optimize content
- **A/B Testing**: Experiment with different LLMs and prompts

## Technologies Used

**Frontend**: React, TypeScript, Vite, TailwindCSS, Zustand, tRPC Client, @tanstack/react-query, @tanstack/react-virtual  
**Backend**: Node.js, tRPC Server, Vercel Serverless, Supabase (PostgreSQL + pgvector + Edge Functions)  
**AI/ML**: Gemini, Groq and OpenRouter (free-tier language models), gte-small (embeddings), hybrid-search RAG pipeline  
**Email**: Resend API  
**Deployment**: Vercel (Frontend + Backend), Supabase (Database)

## Technical Architecture

### Frontend
**Stack**: React 19 + TypeScript + Vite 7  
**Styling**: TailwindCSS 4  
**State Management**: Zustand  
**API Client**: tRPC Client + React Query  
**Performance**: `@tanstack/react-virtual` for chat history

### Backend
**Runtime**: Node.js (Vercel Serverless Functions)  
**Framework**: Hono (tRPC Server Adapter)  
**Database**: Supabase (PostgreSQL + pgvector)  
**AI/ML**: Gemini, Groq and OpenRouter free-tier models through one OpenAI-compatible client  
**Email**: Resend API

### AI/ML Pipeline
1. **Ingestion**: A script splits the `_content/` markdown files by heading and syncs only the changed chunks
2. **Embeddings**: Generated by `gte-small` (384d) in a Supabase Edge Function
3. **Retrieval**: One SQL query that combines `pgvector` similarity with keyword ranking
4. **Generation**: A chain of free-tier models (Gemini, Groq, OpenRouter) writes the answer from the retrieved context

### Data Flow
```
User Query
    ↓
Frontend (tRPC Client)
    ↓
Backend (Hono/tRPC on Vercel)
    ↓
Embedding Generation (Supabase Edge Function)
    ↓
Hybrid Search (Supabase RPC)
    ↓
LLM Generation (Gemini → Groq → OpenRouter fallback)
    ↓
Response → Frontend
```
## Open Source

This portfolio demonstrates my commitment to transparency and knowledge sharing. Key architectural decisions and implementation patterns are documented for others building similar AI-powered experiences.

## Lessons Learned

1. **Design for AI**: Conversational UX requires different patterns than traditional web design
2. **Content is King**: RAG quality depends entirely on well-structured, comprehensive source content
3. **Performance Matters**: AI features can't compromise core web vitals
4. **User Trust**: Clear messaging about AI limitations builds confidence
5. **Iteration**: Started with simple Q&A, evolved into multi-context system

This project showcases my ability to design, build, and deploy production-ready AI applications from scratch.
