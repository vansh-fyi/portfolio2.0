# System-Level Test Design

## Testability Assessment

- Controllability: PASS - System state can be controlled via API seeding and data ingestion scripts. External dependencies (Hugging Face, Supabase, Resend) are mockable at the backend layer. Error conditions can be triggered through mocks.
- Observability: PASS - Structured logging is planned for the backend, providing a foundation for inspecting system state and validating NFRs.
- Reliability: PASS - Architecture promotes isolated testing of components and services. Failures should be reproducible with controlled environments and data. Loose coupling between frontend and backend via tRPC aids reliability.

## Architecturally Significant Requirements (ASRs)

| Risk ID | Category | Description | Probability | Impact | Score | Mitigation |
| ------- | -------- | ----------- | ----------- | ------ | ----- | --------------- |
| ASR-001 | PERF, BUS | Real-time conversational AI experience (RAG Agent) | 2 | 3 | 6 | Optimize RAG pipeline, implement caching, use streaming responses. Performance testing with k6. |
| ASR-002 | BUS, DATA | Context-aware RAG responses | 2 | 3 | 6 | Extensive integration testing with various contexts and data sets. |
| ASR-003 | SEC | Secure API Key Management | 1 | 3 | 3 | Security testing (penetration testing, static analysis) to ensure no leaks. |
| ASR-004 | BUS, OPS | Reliable Lead Generation (Email Sending) | 2 | 3 | 6 | Integration testing with email service, error handling, and retry mechanisms. |
| ASR-005 | BUS, TECH | Preservation of existing UI/UX during React migration | 3 | 2 | 6 | Visual regression testing and extensive UI testing. |
| ASR-006 | OPS, DATA | Efficient data ingestion for vector database updates | 2 | 2 | 4 | Integration testing of the ingestion script, data validation. |

## Test Levels Strategy

- Unit: 40% - Pure functions, utility logic, isolated React components, backend business logic.
- Integration: 35% - API endpoints, tRPC procedures, backend service logic, Supabase/Resend integration, RAG context switching logic.
- E2E: 25% - Critical user journeys, conversational flows, lead generation, visual regression for UI migration.

## NFR Testing Approach

- Security: Playwright E2E tests to verify API key non-exposure, input validation (XSS, SQLi attempts), and Supabase RLS. Manual security review/penetration testing.
- Performance: k6 for load/stress testing RAG and Email APIs (latency, throughput). Lighthouse for frontend Core Web Vitals.
- Reliability: Playwright E2E tests for graceful degradation on API failures (mocked 500s), retry mechanisms for external services (mocked 503s). Backend unit/integration tests for error handling logic. Health check endpoint monitoring.
- Maintainability: Code coverage (Jest/Vitest reports), linting (ESLint), formatting (Prettier) in CI. Playwright E2E tests to validate structured logging and telemetry headers.

## Test Environment Requirements

- Local: For unit, component, and initial integration testing.
- Staging/Ephemeral: For full integration and E2E testing, mirroring production environment (Supabase test instance, mocked Hugging Face/Resend or dedicated test accounts).

## Testability Concerns (if any)

- External API Dependencies: Heavy reliance on Hugging Face and Resend. Ensuring realistic test data and behavior for these external services can be complex, even with mocking.
- WebGL Element Handling: The existing WebGL elements on the homepage might introduce flakiness or performance issues in E2E tests if not carefully managed. Visual regression testing might be challenging here.
- Mastra.AI Framework: The testability of the Mastra.AI framework itself (e.g., mocking its internal components for unit testing RAG logic) needs to be understood.

## Recommendations for Sprint 0

- Prioritize setting up a robust test data management strategy (factories, fixtures) for both frontend and backend.
- Investigate Playwright's capabilities for visual regression testing, especially for the WebGL elements.
- Define clear mocking strategies for external APIs (Hugging Face, Resend) within the Mastra.AI framework.
- Establish CI/CD pipelines for automated linting, formatting, unit, and integration tests early.
