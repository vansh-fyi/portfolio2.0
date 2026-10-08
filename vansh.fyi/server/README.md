# Server code (Ursa)

tRPC routers and services that run inside the Next.js app (`vansh.fyi/`), served from the same origin as the site under `/api/*`. They power **Ursa**, the portfolio's RAG chat assistant, and the contact-form email endpoint. There is no separate backend deployment.

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

| Path (relative to `vansh.fyi/`) | Purpose |
|---|---|
| `app/api/trpc/[trpc]/route.ts` | Next route handler that serves the tRPC routers |
| `app/api/cron/health/route.ts` | Daily health check (protected by `CRON_SECRET`) |
| `app/api/health/route.ts` | Liveness probe |
| `server/api/` | tRPC routers (`rag`, `email`), shared `trpc.ts` context |
| `server/services/rag.ts` | Prompt building and the answer pipeline |
| `server/services/kb/` | Chunker, search, embedding client, portfolio-map builder |
| `server/services/llm/chain.ts` | Provider chain, fallback, cooldowns, model allow-list |
| `server/services/rate-limit.ts` | Postgres-backed rate limits (fail-open) |
| `server/services/health/` | Health checks and shared answer evaluation |
| `server/services/config.ts` | Environment variables, read lazily so `next build` never needs secrets |
| `evals/golden.json` | Real visitor questions with expected facts |
| `scripts/` | Ingest, eval, health and diagnostic scripts (run with `tsx`) |
| `../supabase/functions/embed/` | Edge Function that creates embeddings |
| `../supabase/migrations/` | SQL for Supabase (see its `README.md`) |

## Setup

1. **Install dependencies** (from `vansh.fyi/`)
   ```bash
   npm install
   ```

2. **Environment variables** — copy `.env.example` to `.env.local` (gitignored; Next loads it, and the scripts below load it too):

   | Variable | Required | Purpose |
   |---|---|---|
   | `SUPABASE_URL`, `SUPABASE_ANON_KEY` | yes | Database access |
   | `SUPABASE_SERVICE_ROLE_KEY` | yes for ingest + rate limiting | Writes to `kb_chunks`; without it the rate limiter silently allows everything |
   | `EMBED_SECRET` | yes | Shared secret for the `embed` Edge Function |
   | `GEMINI_API_KEY`, `GROQ_API_KEY`, `OPENROUTER_API_KEY` | at least one | LLM providers (use free-tier keys with **no billing attached**) |
   | `RESEND_API_KEY`, `CONTACT_EMAIL` | yes | Lead emails and health alerts |
   | `CRON_SECRET` | production | Authorises Vercel Cron to call `/api/cron/health` |
   | `KEEPALIVE_TABLES` | optional | Comma-separated tables (e.g. `blogs`) the health check queries to keep Supabase active |
   | `NEXT_PUBLIC_SITE_URL` | optional | Canonical origin for metadata and the sitemap (default `https://portfolio.vansh.fyi`) |

3. **Database** — in the Supabase SQL editor, run in order:
   - `supabase/migrations/004_kb_chunks_hybrid_search.sql` (knowledge-base table and search function)
   - `supabase/migrations/005_rate_limits.sql` (rate-limit counters)

4. **Embedding function** (needs the [Supabase CLI](https://supabase.com/docs/guides/cli))
   ```bash
   supabase secrets set EMBED_SECRET=<random string> --project-ref <ref>
   supabase functions deploy embed --project-ref <ref>   # run from the repo root (it reads supabase/functions)
   ```
   Use the same `EMBED_SECRET` value in `.env.local` and in Vercel.

5. **Load the knowledge base**
   ```bash
   npm run ingest-kb               # sync ../_content into Supabase
   npm run ingest-kb -- --dry-run  # preview chunks only; needs no credentials
   ```
   Ingest is incremental and never wipes the table: it inserts new chunks, removes stale ones, and skips unchanged content.

## Development

```bash
npm run dev    # the whole site and /api/* on http://localhost:3000
npm test       # unit tests (web + server)
npm run typecheck
```

The frontend calls `/api/trpc` on its own origin. `NEXT_PUBLIC_API_URL` only exists to point a local frontend at a different server.

## Quality checks and operations

| Command | What it does |
|---|---|
| `npm run eval-ursa` | Runs every question in `evals/golden.json` through the real pipeline and checks the answers. Run after changing content, prompts, models or retrieval |
| `npm run run-health` | Runs the same checks as the daily cron. Add `--email` to send an alert if anything is wrong, or `--force-email` to test the mail path |
| `npx tsx --env-file-if-exists=.env.local scripts/probe-kb.ts` | Shows which chunks search returns for sample questions |
| `npx tsx --env-file-if-exists=.env.local scripts/probe-models.ts` | Calls each candidate LLM once; use when choosing or replacing models |
| `npx tsx --env-file-if-exists=.env.local scripts/list-models.ts` | Lists the models your provider keys can currently use |
| `npm run test-rag-api` | Calls the `rag.query` router directly |

### Health check

`vansh.fyi/vercel.json` schedules `/api/cron/health` daily. It emails you (Resend) when any check is degraded or critical, and repeats daily until fixed. Vercel Cron authenticates by sending `Authorization: Bearer $CRON_SECRET`, so set `CRON_SECRET` in the Vercel project (any long random string) and redeploy. Test it by hand:

```bash
curl -H "Authorization: Bearer $CRON_SECRET" https://<site-domain>/api/cron/health
```

### Rate limits

Defined in `server/services/rate-limit.ts`: 8 questions/minute and 60/day per IP, 600/day overall; 3 contact messages/hour per IP. Counters live in Postgres, so they hold across serverless instances. If the limiter itself fails, requests are allowed and a warning is logged.

## Changing models

Free tiers change without notice. When the health check reports a failing or retired model:

1. `npx tsx --env-file-if-exists=.env.local scripts/list-models.ts` — see what is available.
2. `npx tsx --env-file-if-exists=.env.local scripts/probe-models.ts` — confirm candidates work on your keys.
3. Edit `PROVIDER_CHAIN` in `server/services/llm/chain.ts` (order = preference).
4. `npm run eval-ursa` — confirm answer quality.

## Deployment (Vercel)

The site and the API are one Vercel project (root directory `vansh.fyi`). Set every variable from the table above in it (Production), then redeploy — env changes only apply to new deployments. Function time limits are `maxDuration` exports in the route files.

## Troubleshooting

- **"EMBED_SECRET is not set"** — add it to `.env.local` / Vercel; it must match the secret set on the Edge Function.
- **Ursa answers "I don't have that information" for things in your content** — re-run `npm run ingest-kb`, then `scripts/probe-kb.ts` to see what search returns.
- **Rate limiting seems off** — confirm `SUPABASE_SERVICE_ROLE_KEY` is set and migration 005 was applied (the limiter fails open and logs `Rate limiter unavailable`).
- **Health check says "Supabase unreachable or paused"** — open the Supabase dashboard; free projects pause after inactivity.
- **Port 3000 already in use** — start with `npm run dev -- -p 3001`.

## Blog posts and Ursa

Published blog posts are part of Ursa's knowledge. The admin keeps the index in step with the blog:

| Event in `/admin` | What happens to Ursa's index |
|---|---|
| Publish | The post is chunked and stored in `kb_chunks` as `source_file = blog/<slug>`, `source_type = blog` (in the background, usually within a few seconds) |
| Save & update live | The chunks are replaced; unchanged paragraphs are not re-embedded |
| Rename the slug | Chunks under the old slug are removed |
| Unpublish / Delete | The chunks are removed |
| Save a draft | Nothing: drafts are never indexed |

- Each post shows "Ursa knows this", "indexing…" or "failed" in the admin, with a **Re-index** button.
- The prompt also gets a short list of the newest posts (cached for 15 s) so broad questions like "has he written anything about X?" work, and blog passages carry the post URL so Ursa can link to them.
- `npm run reindex-blog` makes the index match the blog exactly (add `-- --dry-run` to preview). Use it after restoring a backup, changing the chunking, or when the health check's **blog-index** line complains.
- The daily health check's **blog-index** line is critical if the index holds text from a post that is not published, and degraded if a published post is missing from the index.
- `npm run ingest-kb` (for `_content/`) never touches `blog/*` chunks.

### Adding an eval question for a post

Add an entry to `evals/golden.json` after publishing, for example:

```json
{ "q": "What does Vansh say about <topic of the post>?", "all": ["<a fact from the post>"] }
```

Evals run against the live knowledge base, so a question about a post only passes while that post is published.
