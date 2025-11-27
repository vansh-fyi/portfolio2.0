---
projectId: ursa-ai
project_name: Ursa AI
role: AI Engineer & Designer
timeline: 2024 - Present
platform: Conversational AI Agent
key_features: ["RAG Pipeline", "Context Awareness", "Natural Language Processing", "Personality System"]
tech_stack: ["Typescript", "Hugging Face", "Llama API", "Supabase", "Resend", "Vercel AI SDK", "Node.js", "Hono", "React 19", "TypeScript", "tRPC"]
technologies: ["Vercel AI SDK", "Llama-3.1-8B-Instruct", "RAG", "Generative AI", "Vector Database", "HuggingFace", "Supabase", "Resend", "Node.js", "Hono", "React 19", "TypeScript", "tRPC", "PostgreSQL", "pgvector", "TypeScript", "pgvector"]
---

# Ursa AI: My Personal Chat Assistant

## Project Overview

Ursa is my personal AI assistant - a conversational agent that represents me in a warm, authentic, and engaging way. Built using RAG (Retrieval-Augmented Generation) technology, Ursa can answer questions about my background, skills, and projects in real-time, making my portfolio interactive rather than static.

## The Concept

Traditional portfolios require visitors to manually search for information. I wanted to create an **interactive, conversational experience** where visitors can simply ask questions and get instant, accurate answers - like having a direct conversation with me, even when I'm not available.

## Core Features

### 1. RAG-Powered Intelligence
Ursa uses Retrieval-Augmented Generation to provide accurate, context-aware responses:
- **Knowledge Base**: Built from markdown documents about me, my skills, and my projects
- **Semantic Search**: Uses vector embeddings to find the most relevant information for each query
- **Grounded Responses**: Answers are based on actual content, reducing hallucinations
- **Dynamic Updates**: Easy to update by editing markdown files and re-ingesting

### 2. Context Awareness
Ursa understands different contexts and adapts accordingly:
- **Personal Context**: When asked about me generally, focuses on skills, experience, and background
- **Project Context**: When viewing a specific project, provides detailed technical information about that project
- **Lead Gen Context**: Powers the Resend lead generation chat, guiding visitors through a contact flow while maintaining the Ursa persona
- **Dynamic Switching**: Automatically adjusts context based on where the user is in the portfolio

### 3. Natural Personality
Unlike robotic chatbots, Ursa has a carefully crafted personality:
- **First Person Voice**: Speaks AS me, using "I" statements to create a personal connection
- **Conversational Tone**: Warm, authentic, and passionate - like talking to a friend
- **Strategic Emoji Use**: Adds warmth and emphasis without overdoing it
- **Narrative Flow**: Responses tell stories rather than listing bullet points

## Technical Architecture

### RAG Pipeline
1. **Content Ingestion**:
   - Source: Markdown files in `_content/` directory
   - Chunking: Paragraph-based splitting (max 1000 chars)
   - Embeddings: `sentence-transformers/all-MiniLM-L6-v2` (384d) via HuggingFace Inference API
   - Storage: Supabase `documents` table with `pgvector`

2. **Query Processing**:
   - Vector Search: `match_documents` RPC using cosine similarity (threshold: 0.10)
   - Filtering: In-memory JavaScript filtering for `projectId` or `source_type`
   - Context Window: Top 5 most relevant chunks

3. **Response Generation**:
   - Model: `meta-llama/Llama-3.1-8B-Instruct` via Vercel AI SDK
   - System Prompt: Enforces third-person voice ("Vansh is...") and strict context adherence
   - Reliability: 20s timeout protection for serverless execution

### Technology Stack
- **Framework**: Vercel AI SDK (`ai`)
- **Inference**: HuggingFace Inference API (`@huggingface/inference`)
- **Database**: Supabase (PostgreSQL + pgvector)
- **Backend**: Node.js + Hono (tRPC Adapter) on Vercel Serverless
- **Frontend**: React 19 + TypeScript + tRPC Clients

### 4. Multi-Context Intelligence
Ursa handles various types of questions intelligently:
- Technical questions about specific technologies or implementations
- General questions about my experience and skills
- Project-specific questions about challenges, solutions, and outcomes
- Open-ended questions about my work philosophy and approach



## Design Decisions

### Why RAG over Fine-Tuning?
- **Dynamic Content**: Easy to update by editing markdown files
- **Accuracy**: Grounded in actual content, reduces hallucinations
- **Cost-Effective**: No expensive fine-tuning or hosting of custom models
- **Explainable**: Can trace responses back to source documents
- **Flexible**: Can switch contexts without retraining

### Why Llama-3.1-8B?
- **Open Source**: No API costs, full control
- **Quality**: Strong instruction-following for RAG tasks
- **Speed**: Fast inference via HuggingFace's optimized endpoints
- **Size**: 8B parameters balances quality and performance

### Personality System
I created a comprehensive personality guide that defines:
- **Tone**: Conversational, authentic, and passionate
- **Voice**: Always first person (as me)
- **Vocabulary**: Clear, direct language with informal touches
- **Narrative Flow**: Responses create stories, not bullet points
- **Emoji Strategy**: Sparingly used for warmth and emphasis

## Implementation Highlights

### Context Switching
Ursa automatically adjusts based on where the user is:
```
Personal View: "Ask anything about Vansh" → Retrieves from personal knowledge base
Project View: "Ask anything about [Project Name]" → Filters by projectId
```

### Response Quality
- Concise responses (2-4 sentences typically)
- Balances technical depth with accessibility
- Ends with invitations to continue the conversation
- Honest when information isn't available

### Performance Optimization
- Query response time: 2-5 seconds average
- Caching of embeddings for fast retrieval
- Optimized chunk sizes for relevant context
- Efficient vector search with pgvector

## Challenges & Solutions

### Challenge 1: Maintaining Personality Consistency
**Problem**: Generic LLMs can sound robotic or inconsistent
**Solution**: Created detailed personality guide with specific examples, incorporated into system prompts

### Challenge 2: Context Awareness
**Problem**: Users might ask about different topics without specifying context
**Solution**: Implemented automatic context detection based on current view, with metadata filtering

### Challenge 3: Response Accuracy
**Problem**: LLMs can hallucinate information not in the knowledge base
**Solution**: RAG pipeline ensures responses are grounded in actual content, explicit prompts to cite only known information

### Challenge 4: Handling Unknown Questions
**Problem**: Users might ask questions outside the knowledge base
**Solution**: Taught Ursa to admit when information isn't available, offer related information, and invite clarification

## Use Cases

### For Portfolio Visitors
- Quick answers about my skills and experience
- Deep dives into specific projects
- Technical implementation details
- Understanding my work approach and philosophy

### For Potential Clients
- Learn about my capabilities without reading everything
- Ask specific questions about relevant experience
- Understand my technical expertise
- Get a sense of my communication style

### For Recruiters
- Quickly assess technical skills
- Learn about specific technologies and frameworks
- Understand project complexity and scope
- Evaluate communication and personality fit

## Future Enhancements

- **Streaming Responses**: Real-time token streaming for faster perceived performance
- **Conversation Memory**: Remember previous questions in the session for context
- **Multi-Modal Understanding**: Process questions about images and diagrams
- **Voice Interface**: Ask questions via voice input
- **Advanced Analytics**: Track common questions to improve content
- **Proactive Suggestions**: Suggest related questions or topics

## Lessons Learned

1. **Personality Matters**: A well-defined personality makes AI interactions feel human
2. **Content is King**: RAG quality depends entirely on well-structured source content
3. **Context is Critical**: Context-aware responses are far more useful than generic ones
4. **Balance Depth**: Technical detail is good, but accessibility is essential
5. **Be Honest**: Admitting limitations builds more trust than fake confidence

## Impact

Ursa transforms my portfolio from a static showcase into an interactive experience. Visitors can:
- Get instant answers to their questions
- Explore my work through natural conversation
- Experience my AI engineering capabilities firsthand
- See my technical skills in action, not just read about them

This project demonstrates my ability to design and build production-ready AI applications that combine technical sophistication with human-centered design.

## Try It Yourself

Ursa is live on vansh.fyi! Click the chat icon to start a conversation and experience the AI assistant in action. Ask about my projects, technical skills, or anything else you're curious about.
