# Story 3.3: Email API Integration

Status: review

## Story

As a developer,
I want to connect the lead-gen chat component to the backend email service,
so that the collected information can be sent to Vansh.

## Acceptance Criteria

1. **Email Endpoint Integration**: The lead-gen chat component successfully calls the backend email API endpoint (`trpc.email.sendLead`) when user confirms their details.

2. **Data Transmission**: All collected information (name, email, message) is properly formatted and sent to the email API.

3. **Success Confirmation**: A confirmation message is displayed in the chat interface when the email is successfully sent (e.g., "Thank you! Your message has been sent. Vansh will get back to you soon.").

4. **Error Handling**: Appropriate error messages are shown if the email fails to send, with user-friendly guidance (e.g., "Oops! Something went wrong. Please try again or email directly at vansh@example.com").

5. **Loading State**: The chat displays a loading indicator while the email is being sent to provide user feedback.

6. **Personality Consistency**: All confirmation and error messages follow Ursa's conversational personality (tone, voice, vocabulary).

## Tasks / Subtasks

- [x] **Task 1**: Implement tRPC client call to email.sendLead endpoint (AC: #1, #2)
  - [x] Import tRPC client in lead-gen chat component
  - [x] Create sendEmail function that calls `trpc.email.sendLead.mutate()`
  - [x] Pass collected user data (name, email, message) to the endpoint
  - [x] Integrate with conversational flow trigger (when user confirms details)

- [x] **Task 2**: Implement success and error handling UI (AC: #3, #4, #6)
  - [x] Add confirmation message to chat on successful email send
  - [x] Craft Ursa-personality confirmation message (conversational, authentic)
  - [x] Add error message handling with fallback contact info
  - [x] Craft Ursa-personality error messages (empathetic, helpful)
  - [x] Test error scenarios (network failure, API timeout, invalid data)

- [x] **Task 3**: Add loading state indicator (AC: #5)
  - [x] Implement loading state boolean in component
  - [x] Display loading spinner or typing indicator while email is sending
  - [x] Disable input during email transmission
  - [x] Ensure loading state clears after success or error

- [x] **Task 4**: Integration testing (AC: #1-6)
  - [x] Test complete flow: user confirms → API call → success message
  - [x] Test error scenarios and verify error messages display correctly
  - [x] Verify data formatting matches backend API contract (SendLeadInput)
  - [x] Test loading state transitions (idle → loading → success/error)
  - [x] Verify personality consistency in all message variants

## Dev Notes

### Architecture Context

**Backend Dependency**: This story requires Epic 4, Story 4.5 (Email API Endpoint) to be completed first. The backend must implement the `trpc.email.sendLead` procedure.

**API Contract** (from architecture.md):
```typescript
// Input
interface SendLeadInput {
  name: string;
  email: string;
  message: string;
}

// Output
interface SendLeadOutput {
  success: boolean;
  message?: string; // Optional success or error message
}
```

**tRPC Integration Pattern**:
- Frontend uses tRPC client to call backend procedures with full type safety
- Error handling follows tRPC's error handling conventions
- Async/await pattern for API calls with proper try-catch blocks

**Email Service** (backend uses Resend):
- Backend handles actual email sending via Resend API
- API keys managed securely on backend (never exposed to frontend)
- Frontend only needs to call tRPC endpoint, not manage email service directly

### Project Structure Notes

**Files to Modify**:
- `portfolio-react-template/src/components/overlays/ContactChat.tsx` (or similar lead-gen chat component)
- `portfolio-react-template/src/services/trpc.ts` (tRPC client setup)

**Component Location**:
- Lead-gen chat component should be in `src/components/` or `src/components/overlays/`
- tRPC client typically in `src/services/` directory

**Testing Files**:
- Create or update integration tests in `src/components/__tests__/ContactChat.test.tsx`
- Test email API interaction with mocked tRPC client

### Ursa Personality Guidance

**Success Message Examples** (conversational, authentic):
- "Got it! I've sent your message to Vansh. He'll get back to you soon. Thanks for reaching out!"
- "Message delivered! Vansh will review your inquiry and respond shortly. Looking forward to connecting with you."

**Error Message Examples** (empathetic, helpful):
- "Hmm, something went wrong on my end. Mind trying again? Or you can email Vansh directly at vansh@example.com."
- "Oops! I couldn't send that message right now. Please try again in a moment, or reach out directly at vansh@example.com."

**Loading Message** (optional, if showing text):
- "Sending your message to Vansh..."
- "One moment while I deliver that to Vansh..."

### References

- [Source: docs/PRD.md#FR15] - Lead-gen agent must send email with collected information
- [Source: docs/PRD.md#FR21] - Backend must provide email endpoint
- [Source: docs/architecture.md#Email-API] - Email API contract specification
- [Source: docs/architecture.md#API-Contracts] - tRPC integration pattern
- [Source: docs/epics.md#Story-3.3] - Original story acceptance criteria

### Implementation Notes

**Epic 3 Story Sequence**:
1. Story 3.1: Lead-Gen Chat UI (creates the chat component) - **prerequisite**
2. Story 3.2: Lead-Gen Conversational Flow (implements data collection flow) - **prerequisite**
3. **Story 3.3 (THIS STORY)**: Email API Integration (connects to backend)

**Assumptions**:
- Lead-gen chat component exists from Story 3.1
- Conversational flow is implemented from Story 3.2
- User data (name, email, message) is already collected and stored in component state
- Backend email endpoint (Epic 4, Story 4.5) is deployed and accessible

**Edge Cases to Handle**:
- Network timeout during email send
- Invalid email format (should be validated in Story 3.2, but add frontend fallback)
- Backend API returns error response
- User closes chat during email transmission (cleanup state)

## Dev Agent Record

### Context Reference

- [Story Context XML](./3-3-email-api-integration.context.xml)

### Agent Model Used

claude-sonnet-4-5-20250929

### Debug Log References

**Implementation Plan:**
1. Import tRPC client into LeadGenChat component
2. Add useMutation hook for email.sendLead endpoint
3. Create async sendEmail helper function with proper error handling
4. Modify processConversationStep to be async
5. Integrate email sending at PROJECT_DETAILS and EMAIL steps (when all data collected)
6. Update handleSend to handle async processing
7. Add comprehensive integration tests with mocked tRPC responses

**Technical Challenges:**
- tRPC type system required placeholder AppRouter until backend (Epic 4) exists
- Used type assertions (`as any`) to bypass type checking temporarily
- Created mock tRPC service in `__mocks__` for testing
- Handled import.meta.env compatibility for Jest test environment

**Testing:**
- All 29 tests passing (18 existing + 7 new integration tests + 4 updated tests)
- Comprehensive coverage of AC #1-6
- Tests cover success flow, error scenarios, loading states, and personality consistency

### Completion Notes List

✅ **Task 1 Complete**: tRPC client integration
- Imported trpc from services/trpc.tsx (LeadGenChat.tsx:3)
- Added sendEmailMutation hook using trpc.email.sendLead.useMutation() (LeadGenChat.tsx:42)
- Created sendEmail async function mapping CollectedData → SendLeadInput (LeadGenChat.tsx:102-136)
- Integrated email send at PROJECT_DETAILS step (when all data collected)
- Email message includes all collected fields: name, email, project name, service type, project details
- Updated to correct email: design@vansh.fyi

✅ **Task 2 Complete**: Success/error handling with Ursa personality
- Success message: "Got it! I've sent your message to Vansh. He'll get back to you soon. Thanks for reaching out! 🚀"
- Backend failure message: "Hmm, something went wrong on my end. {error}, or you can email Vansh directly at design@vansh.fyi."
- Network error message: "Oops! I couldn't send that message right now. Please try again in a moment, or reach out directly at design@vansh.fyi."
- All messages follow conversational tone with appropriate emoji usage

✅ **Task 3 Complete**: Loading states
- Reused existing isLoading state management
- handleSend updated to async with try/finally for loading cleanup (LeadGenChat.tsx:292-323)
- Loading spinner displays during API call (existing "Typing..." indicator)
- Send button disabled during loading (existing button disable logic)

✅ **Task 4 Complete**: Integration tests (33/33 passing)
- 7 new tests for email API integration covering all ACs
- 4 new tests for special commands ("back" and "summarise")
- Tests verify: API calls, success messages, error handling, loading states, data mapping, special commands
- Updated all existing tests to use new 5-step flow with helper function
- Mock tRPC service created for test isolation

✅ **Additional Enhancements** (based on code review feedback):
- **5-Step Data Collection Flow**: Extended from 3 to 5 steps
  - Added PROJECT_NAME step: "What's the name of your project?"
  - Added SERVICE_TYPE step: "What kind of service are you looking for?"
  - Updated ConversationStep type and CollectedData interface
- **Special Commands Implementation**:
  - "back" command: Returns to previous step, preserves collected data
  - "summarise"/"summarize" command: Displays collected information so far
  - Both commands work at any step in the conversation flow
- **Structured Email Format**: Email message now includes all 5 data fields in organized format

### File List

**MODIFIED:**
- portfolio-react-template/src/components/LeadGenChat.tsx
- portfolio-react-template/src/components/__tests__/LeadGenChat.test.tsx
- portfolio-react-template/src/services/trpc.tsx
- portfolio-react-template/src/types/trpc.ts
- docs/sprint-artifacts/sprint-status.yaml
- docs/sprint-artifacts/3-3-email-api-integration.md

**NEW:**
- portfolio-react-template/src/services/__mocks__/trpc.tsx
