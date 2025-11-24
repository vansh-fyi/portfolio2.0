# Story 6.2: Connect Frontend to Backend

Status: ready-for-dev

## Story

As a developer,
I want to configure the frontend to communicate with the deployed backend,
so that the application's AI chat and email features work for users in production.

## Acceptance Criteria

1. **Given** the deployed backend URL (`https://portfolio2-0-backend-blond.vercel.app`)
   * **When** I configure `VITE_API_URL` in the frontend Vercel project
   * **Then** the frontend successfully makes tRPC calls to the backend.

2. **Given** the configured frontend
   * **When** I open the chat overlay and send a message
   * **Then** the request reaches the backend `/api/trpc/rag.query` endpoint.
   * **And** the response is displayed in the chat UI.

3. **Given** the configured frontend
   * **When** I submit the contact form
   * **Then** the request reaches the backend `/api/trpc/email.sendLead` endpoint.
   * **And** an email is sent (verified in Story 6.3).

## Tasks / Subtasks

- [ ] **Configure Frontend Environment Variable** (AC: 1)
  - [ ] Add `VITE_API_URL=https://portfolio2-0-backend-blond.vercel.app` to frontend Vercel project settings.
  - [ ] Verify the env var is accessible in the build (check `import.meta.env.VITE_API_URL`).

- [ ] **Verify tRPC Client Configuration** (AC: 1, 2)
  - [ ] Check `src/lib/trpc.ts` (or similar) uses `VITE_API_URL` for the tRPC client endpoint.
  - [ ] Ensure the tRPC client is configured with the correct path: `${VITE_API_URL}/api/trpc`.
  - [ ] Verify CORS is handled (backend already has `cors()` middleware with `origin: '*'`).

- [ ] **Redeploy Frontend** (AC: 1, 2, 3)
  - [ ] Trigger a new production deployment of the frontend.
  - [ ] Monitor build logs for any environment variable issues.

- [ ] **Test Connection** (AC: 2, 3)
  - [ ] Open browser DevTools Network tab on production site.
  - [ ] Trigger chat overlay and send a test message.
  - [ ] Verify request goes to `https://portfolio2-0-backend-blond.vercel.app/api/trpc/rag.query`.
  - [ ] Trigger contact form submission.
  - [ ] Verify request goes to `https://portfolio2-0-backend-blond.vercel.app/api/trpc/email.sendLead`.

## Dev Notes

### Learnings from Previous Story

**From Story 6.1-deploy-backend-to-vercel-serverless (Status: review)**

- **Backend URL**: `https://portfolio2-0-backend-blond.vercel.app`
- **Health Endpoint**: `/api/health` returns `{"status":"OK"}`
- **tRPC Endpoint**: `/api/trpc/*` (catch-all handler at `backend/api/trpc/[...path].ts`)
- **CORS**: Already configured with `origin: '*'` in backend
- **File-Based Routing**: Backend uses Vercel's native file-based routing (no rewrites needed)
- **Environment Variables**: All backend env vars are configured (SUPABASE, RESEND, HUGGINGFACE, CONTACT_EMAIL)

[Source: docs/sprint-artifacts/stories/6-1-deploy-backend-to-vercel-serverless.md]

### Frontend tRPC Configuration

The frontend tRPC client should be configured like:

```typescript
// src/lib/trpc.ts
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../../backend/src/api';

const getBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return `${import.meta.env.VITE_API_URL}/api/trpc`;
  }
  // Fallback for local development
  return 'http://localhost:8000/trpc';
};

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: getBaseUrl(),
    }),
  ],
});
```

### Manual Steps Required

Since environment variables must be set in Vercel Dashboard:

1. Go to Vercel Dashboard → Frontend Project → Settings → Environment Variables
2. Add: `VITE_API_URL` = `https://portfolio2-0-backend-blond.vercel.app`
3. Select environments: Production, Preview, Development
4. Save and trigger redeploy

### References

- **Epic Definition**: [docs/epics.md#Story-6.2]
- **Backend Story**: [docs/sprint-artifacts/stories/6-1-deploy-backend-to-vercel-serverless.md]
- **Architecture**: [docs/architecture.md#API-Integration]

## Dev Agent Record

### Context Reference

- docs/sprint-artifacts/stories/6-2-connect-frontend-to-backend.context.xml

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List

### Change Log

- 2025-11-24: Story drafted by SM agent.
