-- Removes the legacy Ursa pipeline (HuggingFace MiniLM embeddings in `documents` / `embeddings`).
-- Superseded by kb_chunks + kb_hybrid_search (migration 004).
--
-- !! IRREVERSIBLE. Run ONLY after the new backend is deployed to production and verified:
-- !! the previously deployed code reads `documents` through match_documents, and would break the moment this runs.
-- To rebuild the old data later you would have to re-embed with the old model; there is no reason to.

drop function if exists public.match_documents(extensions.vector, double precision, integer);
drop function if exists public.match_documents(extensions.vector, double precision, integer, jsonb);
drop function if exists public.debug_vector_distance(extensions.vector);
drop function if exists public.debug_documents_count();

drop table if exists public.documents;
drop table if exists public.embeddings;
