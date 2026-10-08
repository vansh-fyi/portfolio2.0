# Backend Service

Node.js + TypeScript + tRPC backend for the portfolio, deployed as Vercel serverless functions. It powers **Ursa**, the portfolio's RAG chat assistant, and the contact-form email endpoint.

## How Ursa works

```
BUILD / INGEST (run when content changes)
  ../_content/**/*.md
    → split by heading, each chunk prefixed with "Project > Section"
    → embed with gte-small (Supabase Edge Function)
    → upsert into Supabase `kb_chunks` (incremental, by content hash)
    → regenerate src/services/kb/portfolio-map.generated.json  (overview of every project)

REQUEST  (frontend → tRPC `rag.query`)
  rate limit (Postgres)  →  embed query  →  kb_hybrid_search()
        vector + full-text, merged with Reciprocal Rank Fusion, filters applied in SQL
  → prompt = rules + portfolio map + top 8 passages
  → free-tier LLM chain, first healthy one answers:
        Gemini 3.5 Flash-Lite → Gemini 3.1 Flash-Lite → Groq gpt-oss-120b → OpenRouter :free

DAILY  (Vercel Cron → /api/cron/health)
  probes providers, billing guard, embeddings, database, smoke questions → emails on problems
```

Only allow-listed model IDs are ever called, and OpenRouter models must end in `:free`, so a config mistake cannot start costing money.

## Project layout

| Path | Purpose |
|---|---|
| `api/trpc/[...path].ts` | Vercel entry point for tRPC |
| `api/cron/health.ts` | Daily health check (protected by `CRON_SECRET`) |
| `src/api/` | tRPC routers (`rag`, `email`), shared `trpc.ts` context |
| `src/services/rag.ts` | Prompt building and the answer pipeline |
| `src/services/kb/` | Chunker, search, embedding client, portfolio-map builder |
| `src/services/llm/chain.ts` | Provider chain, fallback, cooldowns, model allow-list |
| `src/services/rate-limit.ts` | Postgres-backed rate limits (fail-open) |
| `src/services/health/` | Health checks and shared answer evaluation |
| `supabase/functions/embed/` | Edge Function that creates embeddings |
| `migrations/` | SQL for Supabase (see `migrations/README.md`) |
| `evals/golden.json` | Real visitor questions with expected facts |
| `src/scripts/` | Ingest, eval, health and diagnostic scripts |

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment variables** — create `backend/.env` (it is gitignored):

   | Variable | Required | Purpose |
   |---|---|---|
   | `SUPABASE_URL`, `SUPABASE_ANON_KEY` | yes | Database access |
   | `SUPABASE_SERVICE_ROLE_KEY` | yes for ingest + rate limiting | Writes to `kb_chunks`; without it the rate limiter silently allows everything |
   | `EMBED_SECRET` | yes | Shared secret for the `embed` Edge Function |
   | `GEMINI_API_KEY`, `GROQ_API_KEY`, `OPENROUTER_API_KEY` | at least one | LLM providers (use free-tier keys with **no billing attached**) |
   | `RESEND_API_KEY`, `CONTACT_EMAIL` | yes | Lead emails and health alerts |
   | `CRON_SECRET` | production | Authorises Vercel Cron to call `/api/cron/health` |
   | `KEEPALIVE_TABLES` | optional | Comma-separated tables (e.g. `blogs`) the health check queries to keep Supabase active |
   | `PORT` | optional | Local server port (default `3000`) |

3. **Database** — in the Supabase SQL editor, run in order:
   - `migrations/004_kb_chunks_hybrid_search.sql` (knowledge-base table and search function)
   - `migrations/005_rate_limits.sql` (rate-limit counters)

4. **Embedding function** (needs the [Supabase CLI](https://supabase.com/docs/guides/cli))
   ```bash
   supabase secrets set EMBED_SECRET=<random string> --project-ref <ref>
   supabase functions deploy embed --project-ref <ref>
   ```
   Use the same `EMBED_SECRET` value in `.env` and in Vercel.

5. **Load the knowledge base**
   ```bash
   npm run ingest-kb               # sync ../_content into Supabase
   npm run ingest-kb -- --dry-run  # preview chunks only; needs no credentials
   ```
   Ingest is incremental and never wipes the table: it inserts new chunks, removes stale ones, and skips unchanged content.

## Development

```bash
npm run dev    # local tRPC server on http://localhost:3000 (set PORT to change it)
npm test       # unit tests
```

The frontend reads the API URL from `VITE_API_URL` (default `http://localhost:3000/api/trpc`).

## Quality checks and operations

| Command | What it does |
|---|---|
| `npx ts-node src/scripts/eval-ursa.ts` | Runs every question in `evals/golden.json` through the real pipeline and checks the answers. Run after changing content, prompts, models or retrieval |
| `npx ts-node src/scripts/run-health.ts` | Runs the same checks as the daily cron. Add `--email` to send an alert if anything is wrong, or `--force-email` to test the mail path |
| `npx ts-node src/scripts/probe-kb.ts` | Shows which chunks search returns for sample questions |
| `npx ts-node src/scripts/probe-models.ts` | Calls each candidate LLM once; use when choosing or replacing models |
| `npx ts-node src/scripts/list-models.ts` | Lists the models your provider keys can currently use |
| `npx ts-node src/scripts/test-rag-api.ts` | Calls the `rag.query` router directly |

### Health check

`vercel.json` schedules `/api/cron/health` daily. It emails you (Resend) when any check is degraded or critical, and repeats daily until fixed. Vercel Cron authenticates by sending `Authorization: Bearer $CRON_SECRET`, so set `CRON_SECRET` in the Vercel project (any long random string) and redeploy. Test it by hand:

```bash
curl -H "Authorization: Bearer $CRON_SECRET" https://<backend-domain>/api/cron/health
```

### Rate limits

Defined in `src/services/rate-limit.ts`: 8 questions/minute and 60/day per IP, 600/day overall; 3 contact messages/hour per IP. Counters live in Postgres, so they hold across serverless instances. If the limiter itself fails, requests are allowed and a warning is logged.

## Changing models

Free tiers change without notice. When the health check reports a failing or retired model:

1. `npx ts-node src/scripts/list-models.ts` — see what is available.
2. `npx ts-node src/scripts/probe-models.ts` — confirm candidates work on your keys.
3. Edit `PROVIDER_CHAIN` in `src/services/llm/chain.ts` (order = preference).
4. `npx ts-node src/scripts/eval-ursa.ts` — confirm answer quality.

## Deployment (Vercel)

Set every variable from the table above in the Vercel project (Production), then redeploy — env changes only apply to new deployments. Function time limits are in `vercel.json`.

## Troubleshooting

- **"EMBED_SECRET is not set"** — add it to `.env` / Vercel; it must match the secret set on the Edge Function.
- **Ursa answers "I don't have that information" for things in your content** — re-run `npm run ingest-kb`, then `probe-kb.ts` to see what search returns.
- **Rate limiting seems off** — confirm `SUPABASE_SERVICE_ROLE_KEY` is set and migration 005 was applied (the limiter fails open and logs `Rate limiter unavailable`).
- **Health check says "Supabase unreachable or paused"** — open the Supabase dashboard; free projects pause after inactivity.
- **Port 3000 already in use** — start with `PORT=8000 npm run dev` and point the frontend's `VITE_API_URL` at it.
