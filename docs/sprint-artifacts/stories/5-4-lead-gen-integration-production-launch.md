# Story 5.4: Lead Gen Integration & Production Launch

Status: review

## Story

As a user,
I want the contact form to actually send emails and the site to be live,
so that I can use the fully functional portfolio website.

## Acceptance Criteria

1. **Given** the contact form in `ContactOverlay`
   * **When** I submit a message with valid data (name, email, message)
   * **Then** Vansh receives an email via Resend
   * **And** I see a success confirmation message
   * **And** The form resets after successful submission

2. **Given** the production URL
   * **When** I visit the deployed site
   * **Then** All features work as expected:
     * Main landing page loads
     * Project overlay displays projects correctly
     * Chat overlay (personal + project-specific) functions
1.  **Given** the contact form in `ContactOverlay`
    *   **When** I submit a message with valid data (name, email, message)
    *   **Then** Vansh receives an email via Resend
    *   **And** I see a success confirmation message
    *   **And** The form resets after successful submission

2.  **Given** the production URL
    *   **When** I visit the deployed site
    *   **Then** All features work as expected:
        *   Main landing page loads
        *   Project overlay displays projects correctly
        *   Chat overlay (personal + project-specific) functions
        *   Contact form sends emails successfully
    *   **And** No console errors are present
    *   **And** Performance is acceptable (< 3s initial load)

## Tasks / Subtasks

- [x] **Wire Contact Overlay to Email API** (AC: 1) ✅ COMPLETE
  - [x] Import `trpc` client in `ContactOverlay.tsx` → Implemented in `LeadGenChat.tsx:3`
  - [x] Use `trpc.email.sendLead.useMutation()` hook → Line 45
  - [x] Handle form submission: validate data, call mutation → Lines 179-296 (processConversationStep)
  - [x] Display success/error messages to user → Lines 136-146 (sendEmail function)
  - [x] Reset form on successful send → Conversation state transitions to COMPLETE (line 272)
  - [x] Add loading state during email send → Lines 55, 314-332 (isLoading state)

- [x] **Production Deployment Prerequisites** (AC: 2) ✅ BUILD READY
  - [x] Verify all environment variables documented:
    * `SUPABASE_URL`, `SUPABASE_ANON_KEY` → Documented in `.env.example`
    * `RESEND_API_KEY` → For backend email service
    * `HUGGINGFACE_API_KEY` → For AI chat features
    * `VITE_API_URL` → Frontend API endpoint (`.env.example:8`)
  - [ ] Deploy frontend (`vansh.fyi/`) to Vercel → Pending user action
  - [ ] Deploy backend (`backend/`) as Vercel serverless function → Pending user action
  - [ ] Configure custom domain (if applicable) → Pending user action
  - [x] Verify build succeeds with no errors → ✅ Build: 410.73 kB in 959ms (2025-11-21)

- [ ] **End-to-End Smoke Testing** (AC: 2) → Pending deployment
  - [ ] Visit production URL and verify landing page loads
  - [ ] Test project overlay displays projects correctly
  - [ ] Test chat overlay (personal + project-specific)
  - [ ] Test contact form: submit valid data
  - [ ] Verify email received by Vansh
  - [ ] Verify success confirmation shown to user
  - [ ] Check console for errors (should be none)
  - [ ] Test dark/light theme switching
  - [ ] Check mobile responsiveness
## Dev Implementation Notes (2025-11-21)

### Implementation Validation

**Story Status Discovery**: All AC#1 tasks were already implemented but not documented. The `*develop-story` workflow was executed to validate existing implementation.

**AC#1: Contact Form Email Integration** ✅ **COMPLETE**

Implementation found in `vansh.fyi/src/components/LeadGenChat.tsx`:
- **tRPC Integration** (Line 3): Imports `trpc` client from `../services/trpc`
- **Mutation Hook** (Line 45): `const sendEmailMutation = trpc.email.sendLead.useMutation()`
- **Form Submission** (Lines 179-296): `processConversationStep()` handles conversational form flow with validation
- **Email Sending** (Lines 115-148): `sendEmail()` function:
  - Compiles message from collected data (lines 122-126)
  - Calls `sendEmailMutation.mutateAsync()` (lines 129-133)
  - Returns success message or fallback email on error (lines 136-146)
- **State Management**:
  - Loading state: `isLoading` (line 55), set during async operations (lines 314-332)
  - State reset: Conversation transitions to `COMPLETE` after email sent (line 272)
- **User Feedback**:
  - Success: "Got it! I've sent your message to Vansh..." (line 138)
  - Error: "Hmm, something went wrong..." with fallback email (line 141)
  - Network error: "Oops! I couldn't send that message..." (line 146)

**AC#2: Production Deployment Prerequisites** ✅ **BUILD READY** (4/8 complete)

Completed:
- ✅ Environment variables documented in `.env.example`
- ✅ Build verified: `npm run build` succeeds (410.73 kB in 959ms)
- ✅ TypeScript configuration fixed (removed project references, added Vite types)
- ✅ Package duplicate removed (`@huggingface/transformers`)

Pending (requires user action):
- ⏸️ Deploy frontend to Vercel
- ⏸️ Deploy backend as Vercel serverless function
- ⏸️ Configure custom domain (optional)
- ⏸️ End-to-end smoke testing (post-deployment)

### Build Configuration Fixes

**Critical Fix (Blocker Resolution)**:
- **Issue**: TS6305 errors preventing Vercel build
- **Root Cause**: Project references in `tsconfig.json` conflicting with Vite bundler mode
- **Solution**:
  1. Removed `references` array from `vansh.fyi/tsconfig.json`
  2. Removed conflicting `composite`, `emitDeclarationOnly`, `files` from `tsconfig.app.json`
  3. Added `types: ["vite/client"]` for `import.meta.env` support
  4. Removed duplicate `@huggingface/transformers` from `package.json`

**Verification**: Build now succeeds locally and will deploy to Vercel without TypeScript errors.

### Backend API Configuration

**Email Router** (`backend/src/api/email.ts`):
- Input schema (lines 14-18): Validates `name`, `email`, `message`
- Procedure `sendLead` (lines 29-49): Calls `sendLeadEmail()` service, returns structured response
- Type export (line 53): `EmailRouter` type available to frontend

**tRPC Setup** (`vansh.fyi/src/services/trpc.tsx`):
- Creates tRPC client with `httpBatchLink` (lines 16-22)
- API URL from `VITE_API_URL` env var (line 12), defaults to `http://localhost:8000/trpc`
- Provides `TRPCProvider` wrapper for React app (lines 26-36)

### Next Steps for Deployment

1. **Vercel Frontend Deployment**:
   - ✅ DEPLOYED - Frontend live on Vercel
   - ⚠️ Backend not connected - email/RAG failing

2. **Vercel Backend Deployment** (PENDING):
   - Deploy `backend/` as serverless function
   - Set environment variables:
     - `RESEND_API_KEY` (email service)
     - `SUPABASE_URL`, `SUPABASE_ANON_KEY` (vector DB)
     - `HUGGINGFACE_API_KEY` (AI models)
   - Configure function routes per `vercel.json` (if exists)

3. **Connect Frontend to Backend** (PENDING):
   - Set `VITE_API_URL` in Vercel frontend project → deployed backend URL
   - Redeploy frontend to pick up new env var

4. **Smoke Testing** (after backend connected):
   - Test contact form submission → verify email received
   - Test RAG chat queries
   - Test all ACs per task list (lines 62-71)

### Current Deployment Status (2025-11-21)

**Frontend**: ✅ Deployed to Vercel
- URL: [Add production URL here]
- Build: 410.73 kB
- Status: Live, UI functional

**Backend**: ❌ Not deployed
- Email API: Failing (no backend connection)
- RAG API: Failing (no backend connection)
- Error shown: "Oops! I couldn't send that message right now..."

**Next**: Deploy backend + connect APIs (see Epic 6 or new deployment story)

---
## Dev Notes

### Learnings from Previous Story

**From Story 5.3-granular-rag-context-project-specific (Status: done)**

- **Modified Files**:
  - `backend/src/api/rag.ts` - Added `projectId` to schema (line 18), passed to service (lines 34, 37)
  - `backend/src/services/rag.ts` - Implemented metadata filtering (lines 32-38), updated generateRagResponse signature (line 70)

- **Frontend Already Configured**:
  - `vansh.fyi/src/hooks/useRAGQuery.ts` (line 24) - Passes `projectId` from store when `chatContext === 'project'`
  - `vansh.fyi/src/components/overlays/ChatOverlay.tsx` (line 14) - Reads `projectId` from `useViewStore()`

- **Known Issues**:
  - TypeScript lint in `backend/src/services/rag.ts:19` - Vercel AI SDK type inference limitation (non-blocking)
  - Pre-existing TS error in `backend/src/services/embeddings.ts:11` (unrelated to Story 5.3)

- **Testing Blockers from 5.3**:
  - Manual testing plan requires deployment (documented in completion notes)
  - Story 5.4 deployment will enable testing of Story 5.3 project-specific RAG functionality

[Source: docs/sprint-artifacts/stories/5-3-granular-rag-context-project-specific.md]

### Architecture Patterns

**Email Service Pattern** [Source: docs/architecture.md]:
- Backend uses Resend SDK (v~3.2.0) for transactional emails
- tRPC endpoint `trpc.email.sendLead` already implemented in Epic 4
- Located in `backend/src/api/email.ts` (assumed from architecture)

**Deployment Architecture** [Source: docs/architecture.md]:
- **Platform**: Vercel
- **Frontend**: Static React SPA from `vansh.fyi/` build output
- **Backend**: Serverless functions from `backend/` directory
- **Environment Variables**: Managed via Vercel dashboard
  * Supabase: `SUPABASE_URL`, `SUPABASE_ANON_KEY`
  * Resend: `RESEND_API_KEY`
  * HuggingFace: `HUGGINGFACE_API_KEY`

**tRPC Client Pattern** [Used in other overlays]:
```typescript
import { trpc } from '../services/trpc';

const { mutate, isLoading, error } = trpc.email.sendLead.useMutation({
  onSuccess: () => {
    // Show success message, reset form
  },
  onError: (err) => {
    // Show error message
  }
});

const handleSubmit = (data) => {
  mutate({ name: data.name, email: data.email, message: data.message });
};
```

### Project Structure Notes

**Files to Modify**:
- `vansh.fyi/src/components/overlays/ContactOverlay.tsx` - Wire to email API
- Vercel configuration files (if not already configured)

**Deployment Order**:
1. Backend first (verify API endpoints work)
2. Frontend second (connect to deployed backend)
3. Smoke test all features

### Testing Standards

[Source: docs/architecture.md]:
- **Unit Tests**: Vitest (if time permits for critical paths)
- **Integration Tests**: tRPC procedure end-to-end
- **E2E Tests**: Manual smoke testing checklist (documented in tasks)
- **Performance**: Lighthouse audit after deployment (optional but recommended)

### References

- **Epic Definition**: [docs/epics.md#Story-5.4 (lines 328-344)]
- **Architecture**: [docs/architecture.md#Epic-3 (Email Service), #Epic-4 (Deployment)]
- **Previous Story**: [docs/sprint-artifacts/stories/5-3-granular-rag-context-project-specific.md]
- **Email API**: `backend/src/api/email.ts` (from Epic 4)

## Dev Agent Record

### Context Reference

*(Will be added when story-context workflow is run)*

### Agent Model Used

Gemini 2.0 Flash (Experimental)

### Debug Log References

### Completion Notes List

### File List
