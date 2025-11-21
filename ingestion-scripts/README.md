# Ingestion Scripts

Standalone scripts for generating embeddings and populating the Supabase vector database using local HuggingFace Transformers models.

## Purpose

This directory contains **offline ingestion scripts** that are separate from the deployed backend. By using local models here, we:
- Avoid deploying large ML dependencies to Vercel (stays under 250MB limit)
- Don't rely on HuggingFace Inference API (which can have rate limits/issues)
- Can run ingestion on-demand locally without affecting production

## Setup

1. **Install dependencies:**
   ```bash
   cd ingestion-scripts
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env and add your Supabase credentials
   ```

3. **Run ingestion:**
   ```bash
   npm run ingest
   ```

## How It Works

1. **Loads content** from `../_content/personal` and `../_content/projects`
2. **Chunks** each markdown file into smaller pieces
3. **Generates embeddings** using local `Xenova/bge-small-en-v1.5` model (384 dimensions)
4. **Uploads** to Supabase `embeddings` table

## Model

Uses **Xenova/bge-small-en-v1.5** (ONNX-optimized version of BAAI/bge-small-en-v1.5):
- 384-dimensional embeddings
- Runs locally (no API calls)
- Quantized for smaller size
- First run downloads model (~50MB), then caches locally

## Notes

- Run this whenever content in `_content/` changes
- Does NOT need to be deployed anywhere
- Backend only queries vectors via `match_documents` RPC (no embedding generation in production)
