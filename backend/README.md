# Backend Service

This directory contains the backend service for the portfolio application, built with Node.js, TypeScript, tRPC, and Vercel AI SDK.

## Setup

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Copy `.env.example` to `.env` and fill in the required values:
   ```
   SUPABASE_URL=...
   SUPABASE_ANON_KEY=...
   HUGGINGFACE_API_KEY=...
   RESEND_API_KEY=...
   ```

## Database Setup

The project uses Supabase with `pgvector` for RAG functionality.

1. **Create Schema:**
   Copy the content of `sql/create-documents-table.sql` and execute it in your Supabase project's SQL Editor. This will:
   - Enable the `vector` extension
   - Create the `documents` table
   - Create the `match_documents` RPC function
   - Create necessary indexes

2. **Ingest Data:**
   To populate the database with content from `_content/`:
   ```bash
   npm run ingest
   ```
   This script runs locally to generate embeddings and insert them into Supabase.

## Development

- **Start Local Server:**
  ```bash
  npm run dev
  ```

- **Run Tests:**
  ```bash
  npm test
  ```
