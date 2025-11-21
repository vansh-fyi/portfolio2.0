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
     * Contact form sends emails successfully
   * **And** No console errors are present
   * **And** Performance is acceptable (< 3s initial load)

## Tasks / Subtasks

- [ ] **Wire Contact Overlay to Email API** (AC: 1)
  - [ ] Import `trpc` client in `ContactOverlay.tsx`
  - [ ] Use `trpc.email.sendLead.useMutation()` hook
  - [ ] Handle form submission: validate data, call mutation
  - [ ] Display success/error messages to user
  - [ ] Reset form on successful send
  - [ ] Add loading state during email send

- [ ] **Production Deployment** (AC: 2)
  - [ ] Verify all environment variables set in Vercel dashboard:
    * `SUPABASE_URL`, `SUPABASE_ANON_KEY`
    * `RESEND_API_KEY`
    * `HUGGINGFACE_API_KEY`
  - [ ] Deploy frontend (`vansh.fyi/`) to Vercel
  - [ ] Deploy backend (`backend/`) as Vercel serverless function
  - [ ] Configure custom domain (if applicable)
  - [ ] Verify build succeeds with no errors

- [ ] **End-to-End Smoke Testing** (AC: 2)
  - [ ] Test main page navigation
  - [ ] Test project overlay: select projects, view iframes
  - [ ] Test personal chat: ask Ursa about Vansh
  - [ ] Test project chat: ask about specific project (e.g., "Aether")
  - [ ] Test contact form: submit message, verify email received
  - [ ] Test dark/light theme switching
  - [ ] Check mobile responsiveness
  - [ ] Verify no console errors in production

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
