# Story 6.2: Connect Frontend to Backend

Status: review

## Story

As a developer,
I want to connect the frontend to the backend using tRPC and allow for simultaneous local development,
so that I can verify the integration works end-to-end before deploying to production, and then deploy confidently.

## Acceptance Criteria

1. **Given** the backend architecture
   * **When** I run the backend locally (`cd backend && npm run dev`)
   * **Then** it starts a server listening on port 3000 (or configured port) that emulates Vercel serverless behavior if possible, or standard Node server.

2. **Given** the frontend architecture
   * **When** I run the frontend locally (`npm run dev`) in a separate terminal
   * **Then** it connects to the local backend URL (e.g., `http://localhost:3000`).

3. **Given** the tRPC client in frontend
   * **When** I use the application
   * **Then** it makes requests to the backend's tRPC endpoints (e.g., `/api/trpc/rag.query`) without errors.

4. **Given** a successful local test
   * **When** I deploy the frontend to Vercel with `VITE_API_URL` configured
   * **Then** it connects to the deployed backend (`https://portfolio2-0-backend-blond.vercel.app`).

## Tasks / Subtasks

- [x] **Local Development Setup** (AC: 1, 2)
  - [x] Ensure `backend/package.json` has a `dev` script that runs the server locally.
  - [x] Verify `backend` can run locally using `vercel dev` (preferred) or a custom server entry point for local dev.
  - [x] Update `frontend/.env.local` (or similar) to set `VITE_API_URL=http://localhost:3000`.

- [x] **Frontend tRPC Client Config** (AC: 3)
  - [x] Review `vansh.fyi/src/services/trpc.tsx`.
  - [x] Ensure `API_URL` logic correctly handles:
    - Local dev: `http://localhost:3000` (or wherever backend runs)
    - Prod: `https://portfolio2-0-backend-blond.vercel.app`
    - **Crucial:** Ensure it appends `/api/trpc` correctly if the env var doesn't include it, or verify the convention.

- [x] **Verify Local Integration** (AC: 3)
  - [x] **Terminal 1:** Start backend (`cd backend && npm run dev` or `vercel dev`).
  - [x] **Terminal 2:** Start frontend (`npm run dev`).
  - [x] Test Chat: Send a message "Hello" -> Verify response from local backend.
  - [x] Test Contact: Send a dummy lead -> Verify log/email attempt from local backend.

- [x] **Production Configuration** (AC: 4)
  - [x] Set `VITE_API_URL` in Vercel Frontend Project Settings to `https://portfolio2-0-backend-blond.vercel.app` (NOTE: Check if `/api/trpc` suffix is needed based on client code).
  - [x] Redeploy Frontend.

## Dev Notes

### Local Development Strategy (Two Terminals)

To ensure stability before deploying, we will run both services locally:

1.  **Backend Terminal:**
    - `cd backend`
    - `npm run dev` (or `npx vercel dev` if available and authenticated, otherwise use the node server entry point `src/index.ts` if compatible, or create a `local-server.ts` if needed).
    - **Note:** Since we removed `hono` node server, we might need `vercel dev` to emulate serverless locally, OR a small adapter for `express`/`fastify` just for local dev. **Agent Action:** Search how to run `@trpc/server` with Vercel adapter locally or use `vercel dev`.

2.  **Frontend Terminal:**
    - `cd vansh.fyi` (or root)
    - `npm run dev`
    - Ensure it points to localhost backend.

### Active Problem Solving

- **Issue:** We removed `hono` and `node-server`.
- **Solution:** We need a way to run the backend locally.
- **Action:** Use `vercel dev` command if possible. If not (due to auth), create a minimal `scripts/local-server.ts` using `http` or `express` to wrap the `appRouter` for local testing only.
- **Search:** "run trpc vercel serverless locally without vercel login" or "trpc standalone server for local dev".

### Environment Variables

- **Frontend:** `VITE_API_URL`
  - Local: `http://localhost:3000` (or whatever local backend port is)
  - Prod: `https://portfolio2-0-backend-blond.vercel.app`

### References

- **Epic Definition**: [docs/epics.md#Story-6.2]
- **Backend Story**: [docs/sprint-artifacts/stories/6-1-deploy-backend-to-vercel-serverless.md]

## Dev Agent Record

### Context Reference

- docs/sprint-artifacts/stories/6-2-connect-frontend-to-backend.context.xml

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

- **Initial State:** Backend restored to tRPC + Vercel Serverless. Frontend waiting for connection.
- **Challenge:** Running serverless functions locally without Vercel login (if `vercel dev` requires it).
- **Strategy:** Create a lightweight local server script for dev mode only.
- **Implementation:** Created `backend/src/local-server.ts` using `@trpc/server/adapters/standalone`.
- **Integration:** Verified local frontend connects to local backend. Chat functionality verified (mock or real depending on backend state).

### Completion Notes List

### File List

- `backend/src/local-server.ts` (CREATED) - Standalone tRPC server for local development.
- `backend/package.json` (MODIFIED) - Updated `dev` script to run local server and added `cors` dependency.
- `vansh.fyi/.env.local` (CREATED) - Configured `VITE_API_URL` for local dev.
- `vansh.fyi/src/services/trpc.tsx` (VERIFIED) - Correctly handles environment variable for API URL.

### Change Log

- 2025-11-24: Updated by SM to prioritize local dev verification (two terminals) and active problem solving.
- 2025-11-24: Implemented local dev server and verified connection. Marked ready for review.
