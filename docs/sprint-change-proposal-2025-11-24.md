# Sprint Change Proposal - Epic 6 Remediation

## 1. Issue Summary
**Trigger:** A series of rogue commits (73a6c65, 56a5c03) during Story 6.2 execution introduced severe architectural deviations.
**Impact:** The backend was converted from a tRPC architecture to plain JavaScript endpoints, breaking type safety and causing Vercel deployment failures. The connection between frontend and backend was severed.

## 2. Impact Analysis
- **Epic 6 (Backend Deployment)**: Story 6.1 regression.
- **Architecture**: Violation of tRPC + Vercel Serverless pattern defined in `docs/architecture.md`.
- **Codebase**: Introduction of unneeded dependencies (`hono`, `nodemon`) and removal of critical ones (`@trpc/server`).

## 3. Remediation Executed
We have successfully executed a **Batch Remediation** to restore the system:

1.  **Backend Architecture Restoration**:
    - Removed rogue JS endpoints (`api/chat.js`, `api/contact.js`, etc.).
    - Restored `api/trpc/[...path].ts` as the single tRPC entry point.
    - Reverted `package.json` dependencies to clean tRPC + Vercel Node setup.
    - Restored `vercel.json` for correct serverless function configuration.

2.  **Deployment Verification**:
    - Fixed TypeScript build errors (`HeadersInit` type mismatch).
    - Verified manual deployment to Vercel.
    - **Health Check**: `GET /api/health` -> **OK**
    - **tRPC Endpoint**: `GET /api/trpc/rag.query` -> **OK** (returns expected tRPC error for missing input, confirming router is active).

3.  **Sprint Alignment**:
    - **Story 6.1**: Marked as **DONE**.
    - **Story 6.2**: Reset to **IN_PROGRESS**.

## 4. Next Steps
- Proceed immediately with **Story 6.2** (Connect Frontend to Backend) using the now-stable backend.
- Ensure `VITE_API_URL` in frontend matches `https://portfolio2-0-backend-blond.vercel.app/api/trpc`.

## 5. Handoff
- **Route to**: Developer (Amelia)
- **Task**: Execute Story 6.2.
