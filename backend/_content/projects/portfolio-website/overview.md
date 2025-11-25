# AI-Powered Portfolio Website

**Status**: In Development  
**Type**: Personal Portfolio + AI Integration  
**Role**: Designer, Developer, AI Engineer  
**Timeline**: 2024 - Present  
**Live**: vansh.fyi

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
- **Natural Conversations**: Powered by Llama-3.1-8B-Instruct for human-like responses
- **Real-Time Inference**: Fast responses using optimized vector search

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

## Technical Architecture

### Frontend
**Stack**: React + TypeScript + Vite  
**Styling**: TailwindCSS with custom design tokens  
**State Management**: Zustand for global state  
**API Client**: tRPC for type-safe API calls  
**Performance**: Virtual scrolling for long chat histories, lazy loading, code splitting

**Key Components**:
- `ChatOverlay`: Main conversational interface with Ursa
- `LeadGenChat`: Lead generation conversation flow
- `ProjectOverlay`: Project detail views with embedded chat
- `OverlayStore`: Global state management for views and context switching

### Backend
**Stack**: Node.js + tRPC + TypeScript  
**Deployment**: Vercel Serverless Functions  
**Database**: Supabase (PostgreSQL + pgvector extension)  
**AI/ML**: HuggingFace Inference API (Llama-3.1-8B-Instruct)  
**Email**: Resend API for transactional emails

**Key Services**:
- **RAG Pipeline**: Embedding generation → Vector search → LLM response generation
- **Ingestion Service**: Processes markdown content into chunked embeddings
- **Email Service**: Handles lead generation submissions

### AI/ML Pipeline
1. **Content Ingestion**:
   - Markdown files in `_content/` directory
   - Text chunking (500 tokens with 50-token overlap)
   - Embedding generation (Xenova/all-MiniLM-L6-v2, 384 dimensions)
   - Storage in Supabase with metadata (source_type, projectId, etc.)

2. **Query Processing**:
   - User query → embedding generation
   - Cosine similarity search in pgvector (threshold: 0.10)
   - Filter by context (personal vs project-specific)
   - Return top 5 most relevant chunks

3. **Response Generation**:
   - Retrieved context + user query → Llama-3.1-8B-Instruct
   - Structured prompt for consistent, factual responses
   - 20-second timeout for reliability

### Data Flow
```
User Question
    ↓
Frontend (React)
    ↓
tRPC Client
    ↓
Backend API (Vercel Serverless)
    ↓
Generate Embedding (HuggingFace)
    ↓
Vector Search (Supabase pgvector)
    ↓
LLM Generation (Llama-3.1-8B)
    ↓
Response → Frontend → User
```

## Design Decisions

### Why RAG over Fine-Tuning?
- **Dynamic Content**: Easy to update by editing markdown files
- **Accuracy**: Grounded in actual portfolio content, reduces hallucinations
- **Cost-Effective**: No expensive fine-tuning or hosting of custom models
- **Explainable**: Can trace responses back to source documents

### Why Llama-3.1-8B?
- **Open Source**: No API costs, full control
- **Quality**: Strong instruction-following for RAG tasks
- **Speed**: Fast inference via HuggingFace's optimized endpoints
- **Size**: 8B parameters balances quality and performance

### Why Supabase + pgvector?
- **Integrated Solution**: PostgreSQL database + vector search in one
- **Scalable**: Handles millions of vectors efficiently
- **Familiar**: Standard SQL + vector extensions
- **Cost**: Generous free tier for portfolios

## Challenges & Solutions

### Challenge 1: Embedding Quality
**Problem**: Generic embeddings didn't capture domain-specific nuances  
**Solution**: Used all-MiniLM-L6-v2 (optimized for semantic similarity) + careful chunking strategy

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
**Backend**: Node.js, tRPC Server, Vercel Serverless, Supabase (PostgreSQL + pgvector), HuggingFace Transformers.js  
**AI/ML**: Llama-3.1-8B-Instruct, all-MiniLM-L6-v2 (embeddings), RAG Pipeline  
**Email**: Resend API  
**Deployment**: Vercel (Frontend + Backend), Supabase (Database)

## Open Source

This portfolio demonstrates my commitment to transparency and knowledge sharing. Key architectural decisions and implementation patterns are documented for others building similar AI-powered experiences.

## Lessons Learned

1. **Design for AI**: Conversational UX requires different patterns than traditional web design
2. **Content is King**: RAG quality depends entirely on well-structured, comprehensive source content
3. **Performance Matters**: AI features can't compromise core web vitals
4. **User Trust**: Clear messaging about AI limitations builds confidence
5. **Iteration**: Started with simple Q&A, evolved into multi-context system

This project showcases my ability to design, build, and deploy production-ready AI applications from scratch.
