# Epic 6: Backend Deployment & API Integration

**Status**: `backlog`  
**Priority**: High (Blocker for email/RAG functionality)  
**Owner**: Vansh  
**Created**: 2025-11-21

---

## Overview

Deploy backend to Vercel serverless and connect frontend to backend APIs. Frontend is deployed but email and RAG features are non-functional due to missing backend deployment.

## Problem Statement

**Current State**:
- ✅ Frontend deployed to Vercel (UI working)
- ❌ Backend not deployed
- ❌ Email API failing ("Oops! I couldn't send that message right now...")
- ❌ RAG chat API failing

**Root Cause**: Backend serverless functions not deployed, `VITE_API_URL` not configured.

## Goals

1. Deploy backend to Vercel as serverless functions
2. Configure all environment variables (Resend, Supabase, HuggingFace)
3. Connect frontend to backend via `VITE_API_URL`
4. Verify email and RAG functionality in production

## Success Criteria

- [ ] Backend deployed to Vercel serverless
- [ ] Email API responding (contact form sends emails)
- [ ] RAG API responding (chat answers questions)
- [ ] No console errors in production
- [ ] Smoke tests pass (from Story 5.4)

## Stories

### 6.1: Deploy Backend to Vercel Serverless

**Description**: Deploy `backend/` directory to Vercel as serverless functions with proper environment variables.

**Tasks**:
- [ ] Create new Vercel project for backend
- [ ] Set root directory: `backend/`
- [ ] Configure environment variables:
  - [ ] `RESEND_API_KEY` (from resend.com)
  - [ ] `SUPABASE_URL` (from Supabase dashboard)
  - [ ] `SUPABASE_ANON_KEY` (from Supabase dashboard)
  - [ ] `HUGGINGFACE_API_KEY` (from huggingface.co/settings/tokens)
- [ ] Deploy to production
- [ ] Verify deployment logs (no errors)
- [ ] Test backend endpoints directly (health check if exists)

**Acceptance Criteria**:
- Backend deployed successfully
- All env vars set
- Backend URL accessible (e.g., `https://portfolio-backend-xyz.vercel.app`)

---

### 6.2: Connect Frontend to Backend

**Description**: Configure frontend to use deployed backend API.

**Tasks**:
- [ ] Get backend URL from Vercel deployment
- [ ] Set `VITE_API_URL` in frontend Vercel project
  - Value: `https://[backend-url]/trpc`
- [ ] Redeploy frontend (triggers new build with env var)
- [ ] Verify frontend can reach backend (check network tab)

**Acceptance Criteria**:
- Frontend makes API calls to production backend
- No CORS errors
- Network requests show 200 responses (or proper error codes)

---

### 6.3: Verify Email & RAG Functionality

**Description**: Test that email and RAG APIs work in production.

**Tasks**:
- [ ] Test contact form submission
  - [ ] Fill name, email, project details
  - [ ] Submit form
  - [ ] Verify success message shown
  - [ ] Check email received at design@vansh.fyi
- [ ] Test RAG chat (personal context)
  - [ ] Ask question about Vansh
  - [ ] Verify AI response
- [ ] Test RAG chat (project context)
  - [ ] Select project (e.g., Aether)
  - [ ] Ask project-specific question
  - [ ] Verify project-specific response
- [ ] Check browser console (no errors)

**Acceptance Criteria**:
- Contact form sends emails successfully
- RAG chat responds with relevant answers
- No console errors
- Performance acceptable

---

## Technical Notes

### Backend Deployment Architecture

**Vercel Serverless**:
- Each API route becomes a serverless function
- Auto-scales, pay-per-invocation
- Supports Node.js, standard npm packages

**Environment Variables**:
- Encrypted at rest
- Available to all serverless functions
- Set via Vercel Dashboard → Project → Settings → Environment Variables

### Frontend-Backend Connection

**API URL Configuration**:
```bash
VITE_API_URL=https://portfolio-backend-xyz.vercel.app/trpc
```

**tRPC Client** (`vansh.fyi/src/services/trpc.tsx`):
```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/trpc';
```

### Potential Issues

1. **CORS**: Vercel may require CORS headers for cross-origin requests
   - Fix: Add CORS middleware in backend
2. **Cold Starts**: First request to serverless function may be slow (~1-3s)
   - Acceptable for current scale
3. **Supabase Connection**: May need to whitelist Vercel IPs
   - Usually auto-handled by Supabase

---

## Dependencies

- Story 5.4 (frontend deployment) - COMPLETE
- Resend account with API key
- Supabase project
- HuggingFace API token

## Estimated Effort

- 6.1: 30 min (deploy + config)
- 6.2: 15 min (set env var + redeploy)
- 6.3: 20 min (testing)
- **Total**: ~1 hour

## References

- [Vercel Serverless Functions](https://vercel.com/docs/functions)
- [Story 5.4 smoke tests](file:///Users/hp/Desktop/Work/Repositories/portfolio2.0/docs/sprint-artifacts/stories/5-4-lead-gen-integration-production-launch.md)
- [Architecture doc](file:///Users/hp/Desktop/Work/Repositories/portfolio2.0/docs/architecture.md)
