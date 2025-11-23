# Story 6.1: Deploy Backend to Vercel Serverless

Status: ready-for-dev

## Story

As a developer,
I want to deploy the backend to Vercel as serverless functions,
so that the API endpoints (RAG and Email) are accessible to the production frontend.

## Acceptance Criteria

1. **Given** the backend code in `backend/`
   * **When** I deploy the project to Vercel
   * **Then** the build succeeds without errors.
   * **And** serverless functions are created for the API routes.

2. **Given** the deployed backend project
   * **When** I configure the environment variables
   * **Then** the application has access to:
     * `SUPABASE_URL` and `SUPABASE_ANON_KEY` (for vector DB)
     * `RESEND_API_KEY` (for email service)
     * `HUGGINGFACE_API_KEY` (for AI models)
     * `OPENAI_API_KEY` (if applicable, check implementation)

3. **Given** the deployed backend URL
   * **When** I hit the health check or a simple endpoint
   * **Then** I receive a 200 OK response.

## Tasks / Subtasks

- [x] **Prepare Backend for Deployment** (AC: 1)
  - [x] Verify `backend/package.json` has correct build/start scripts for Vercel.
  - [x] Create or verify `backend/vercel.json` configuration (rewrites/headers).
  - [x] Fix known TypeScript errors (e.g., `embeddings.ts:11` noted in Story 5.4) to ensure clean build.
  - [x] Ensure `tsconfig.json` is compatible with Vercel's build environment.

- [ ] **Vercel Project Setup** (AC: 1, 2)
  - [ ] Initialize Vercel project for `backend/` directory (using Vercel CLI or Dashboard).
  - [ ] Configure "Root Directory" to `backend`.
  - [ ] Set environment variables in Vercel Project Settings:
    - `SUPABASE_URL`
    - `SUPABASE_ANON_KEY` (or `SUPABASE_KEY`)
    - `RESEND_API_KEY`
    - `HUGGINGFACE_API_KEY`

- [ ] **Deployment & Verification** (AC: 3)
  - [ ] Trigger deployment to Production.
  - [ ] Monitor build logs for errors.
  - [ ] Verify deployment URL is active (e.g., `https://portfolio-backend.vercel.app`).
  - [ ] Test a simple tRPC query (if possible via curl or browser) or verify 404/200 on root.

## Dev Notes

### Manual Deployment Instructions (Required)

Since I cannot interactively authenticate with Vercel, please execute the following steps:

1.  **Navigate to backend:** `cd backend`
2.  **Login/Link:** Run `vercel link` (or `vercel login` if needed).
    *   Select your Vercel scope.
    *   Link to existing project or create "No" (new).
    *   **Important:** If creating new, ensure "Root Directory" is set to `backend` if asked, or configure it in Vercel dashboard > Settings > General.
3.  **Set Environment Variables:**
    *   Go to Vercel Dashboard > Project > Settings > Environment Variables.
    *   Copy values from `backend/.env` (I have verified they are present locally).
    *   Add: `HUGGINGFACE_API_KEY`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `RESEND_API_KEY`, `CONTACT_EMAIL`.
4.  **Deploy:** Run `vercel deploy --prod`.
5.  **Verify:**
    *   Visit `https://<your-project>.vercel.app/api/health`.
    *   It should return `{"status":"OK"}`.

### Learnings from Previous Story

**From Story 5.4-lead-gen-integration-production-launch (Status: review)**

- **Deployment Status**: Backend was NOT deployed in Story 5.4.
- **Known Issues**:
  - **TS Error**: `backend/src/services/embeddings.ts:11` reported as a pre-existing TS error. This MUST be fixed or suppressed to pass Vercel's strict build checks.
  - **Frontend Fixes**: Story 5.4 fixed `tsconfig.json` for the frontend. Backend might need similar cleanup (removing project references if present).
- **Env Vars**: Confirmed list of required keys: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `RESEND_API_KEY`, `HUGGINGFACE_API_KEY`.
- **Architecture**: Backend is designed to run as Vercel Serverless Functions.
- **Frontend Connection**: Frontend is waiting for `VITE_API_URL` to be set to the backend's deployed URL.

[Source: docs/sprint-artifacts/stories/5-4-lead-gen-integration-production-launch.md]

### Project Structure Notes

- **Root**: `backend/`
- **Build Command**: Typically `npm run build` (compiles TS to JS).
- **Output Directory**: `dist` or `api` depending on Vercel config.
- **Vercel Config**: Needs `vercel.json` to handle tRPC routing (rewrite all `/trpc/*` to `api/index.ts` or similar).

**Suggested `vercel.json` for tRPC:**
```json
{
  "rewrites": [
    { "source": "/trpc/(.*)", "destination": "/api/index.ts" }
  ]
}
```
*Check if `backend/api` structure matches Vercel's conventions.*

### References

- **Epic Definition**: [docs/epics.md#Story-6.1]
- **Architecture**: [docs/architecture.md#Deployment-Architecture]

## Dev Agent Record

### Context Reference

- docs/sprint-artifacts/stories/6-1-deploy-backend-to-vercel-serverless.context.xml

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

- **Task 1**: Verified `package.json`, `vercel.json`. Fixed `tsconfig.json` to include `api` directory. Verified local build (`npm run build`) succeeds. Verified local server (`npm run dev`) responds to health check.

### Completion Notes List

### File List

- `backend/tsconfig.json` (MODIFIED) - Added `api` to include list and changed `rootDir`.

### Change Log

- 2025-11-23: Updated backend configuration for Vercel deployment (Task 1).
