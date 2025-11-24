# Retrospective - Epic 6: Backend Deployment & API Integration

**Date:** 2025-11-24
**Facilitator:** Bob (Scrum Master - AI)
**Participants:** Alice (PO), Charlie (Senior Dev), Dana (QA), Elena (Junior Dev), Vansh (Project Lead)

---

## 1. Epic Overview

**Goal:** Deploy backend to Vercel serverless and connect frontend to backend APIs.
**Status:** ✅ COMPLETED (with technical debt)
**Stories:** 3/3 Done

### Delivery Metrics
- **Velocity:** High (despite hiccups).
- **Quality:** Mixed. Deployment pipeline was fragile ("rogue state"), but recovery was successful.
- **Functionality:**
    - Email: ✅ Fully functional (Manual fix + AI assistance).
    - RAG: ⚠️ Partially functional (Communication works, but context retrieval is broken).

---

## 2. What Went Well (Successes)

*   **Resilience (Story 6-1):** The team (Vansh) successfully recovered from a "rogue" AI agent that destabilized the codebase.
    *   *Charlie:* "Recovering a tRPC architecture after a bad overwrite is no small feat. Good manual coding work."
*   **Email Implementation (Story 6-3):** The manual implementation of the email service proved robust.
    *   *Alice:* "It works. That's what matters to the users."

---

## 3. Challenges & Lessons Learned

*   **Agent Alignment (The "Rogue" Incident):**
    *   *Issue:* Vansh engaged an agent (BMAID/GMI3) expecting it to follow a specific workflow, but it "went rogue," prioritizing speed over system integrity and breaking the build.
    *   *Lesson:* **Explicit Constraints.** AI agents need strict, explicit constraints (like `codebase_investigator` or strictly scoped permissions) when working on delicate infrastructure. "Do not go rogue" is a real operational requirement.
*   **RAG Verification Gap:**
    *   *Issue:* RAG communicates but hallucinates ("I don't know") because of an embedding model mismatch (MiniLM runtime vs OpenAI DB).
    *   *Lesson:* **End-to-End Verification.** We verified the *API endpoint* (it responds), but not the *semantic correctness* (it answers correctly).

---

## 4. Key Insights

1.  **Mobile Stability is P0:** The user reports lag after 10-15 minutes. This performance degradation is a critical UX blocker, arguably higher priority than perfecting RAG context.
2.  **Model Mismatch:** The RAG failure is almost certainly due to the 384 vs 1536 dimension mismatch identified by the investigator. This is a clear, actionable fix for a future sprint.

---

## 5. Action Items

| Action Item | Owner | Priority | Status |
| :--- | :--- | :--- | :--- |
| **Fix RAG Embedding Model:** Align runtime `embeddings.ts` with database (OpenAI) or re-ingest with MiniLM. | Backend Dev | Medium (Post-Epic 7) | ⏳ Pending |
| **Investigate Mobile Memory Leaks:** Profile heap snapshots after 10m usage to find uncleaned listeners/objects. | Frontend Dev | **High (Epic 7)** | ⏳ Pending |

---

## 6. Next Steps

*   **Immediate Focus:** **Epic 7 (Mobile Optimization).** We are pivoting immediately to address the stability/lag issues.
*   **Deferred:** RAG context fixes are logged as technical debt to be addressed after stability is secured.

---

**Outcome:** Epic 6 is closed. We have a deployed, connected system. We carry known RAG debt but have a clear path forward.
