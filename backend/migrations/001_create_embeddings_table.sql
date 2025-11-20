-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create embeddings table for storing document chunks and their embeddings
CREATE TABLE IF NOT EXISTS public.embeddings (
    id BIGSERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    embedding vector(384),  -- bge-small-en-v1.5 produces 384-dimensional vectors
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for similarity search (using cosine distance)
CREATE INDEX IF NOT EXISTS embeddings_embedding_idx 
ON public.embeddings 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Create index on metadata for filtering
CREATE INDEX IF NOT EXISTS embeddings_metadata_idx 
ON public.embeddings 
USING gin (metadata);

-- Add comment explaining the table
COMMENT ON TABLE public.embeddings IS 'Stores document chunks with their vector embeddings for RAG/semantic search';
COMMENT ON COLUMN public.embeddings.embedding IS '384-dimensional vector from bge-small-en-v1.5 model';
COMMENT ON COLUMN public.embeddings.metadata IS 'Document metadata (source file, type, etc.)';

-- Create RPC function for similarity search with metadata filtering
CREATE OR REPLACE FUNCTION match_documents(
    query_embedding vector(384),
    match_threshold float DEFAULT 0.7,
    match_count int DEFAULT 5,
    filter jsonb DEFAULT'{}'::jsonb
)
RETURNS TABLE (
    id bigint,
    content text,
    metadata jsonb,
    similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        embeddings.id,
        embeddings.content,
        embeddings.metadata,
        1 - (embeddings.embedding <=> query_embedding) AS similarity
    FROM embeddings
    WHERE
        (filter = '{}'::jsonb OR embeddings.metadata @> filter)
        AND 1 - (embeddings.embedding <=> query_embedding) > match_threshold
    ORDER BY embeddings.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;

-- Add comment on the function
COMMENT ON FUNCTION match_documents IS 'Performs similarity search on embeddings table with optional metadata filtering. Returns documents sorted by cosine similarity above threshold.';
