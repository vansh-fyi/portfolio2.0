# Story 1.5: Overlay Implementation

Status: review

## Story

As a developer,
I want to create the project display and chat overlays as conditionally rendered components,
so that they can be triggered by user actions.

## Acceptance Criteria

1. **Given** the main application component, **when** the "See All Projects" button or a project tab is triggered, **then** the project display overlay is rendered.
2. **Given** the main application component, **when** the "Ask Ursa" input in the hero section is triggered, **then** the conversational chat overlay is rendered.
3. **And** the overlay components are rendered efficiently and do not impact the performance of the main page when not visible.

## Tasks / Subtasks

- [x] **Task 1: Create Overlay Components** (AC: #1, #2)
  - [x] Create a `ProjectOverlay.tsx` component.
  - [x] Create a `ChatOverlay.tsx` component.
  - [x] Style the components to match the existing `project-display.html` and `project-chat.html`.
- [x] **Task 2: Implement State Management for Overlays** (AC: #1, #2, #3)
  - [x] Set up a global state management store (e.g., Zustand) as recommended by the architecture.
  - [x] Create state variables to manage the visibility of `ProjectOverlay` and `ChatOverlay`.
  - [x] Create actions to open and close the overlays.
- [x] **Task 3: Trigger Overlays from UI** (AC: #1, #2)
  - [x] In the `Projects` component, add `onClick` handlers to the "See All Projects" button and project tabs to call the state management action that opens the `ProjectOverlay`.
  - [x] In the `Hero` component, add an `onClick` handler to the "Ask Ursa" input to call the state management action that opens the `ChatOverlay`.
- [x] **Task 4: Verify Performance** (AC: #3)
  - [x] Use React DevTools to profile the application and ensure that the overlays do not cause unnecessary re-renders of the main page when they are not visible.

## Dev Notes

- This story will introduce global state management to the application. The architecture document recommends using **Zustand** for this purpose.
- The new overlay components should be placed in `portfolio-react-template/src/components/overlays/`.

### Learnings from Previous Story

**From Story 1.4-spa-navigation-routing (Status: done)**

- **New Files Created**: `portfolio-react-template/src/components/__tests__/Header.test.tsx`, `portfolio-react-template/jest-setup.ts`. The testing infrastructure is now in place.
- **Modified Files**: `portfolio-react-template/package.json`, `portfolio-react-template/src/App.tsx`, `portfolio-react-template/src/components/Header.tsx`, `portfolio-react-template/jest.config.js`.
- **Testing Setup**: The Jest test suite is configured and running. New tests for components should follow the pattern in `Header.test.tsx`.
- **Advisory Note**: An advisory note from the previous review mentioned ensuring scroll offsets are correct. While not directly related to this story, it's a good reminder for maintaining UI consistency.

[Source: docs/sprint-artifacts/stories/1-4-spa-navigation-routing.md#Senior-Developer-Review-(AI)]

### References

- [Source: docs/epics.md#Story-1.5-Overlay-Implementation]
- [Source: docs/PRD.md#Functional-Requirements] (FR6, FR7)
- [Source: docs/architecture.md#Communication-Patterns] (recommends Zustand for global state)

## Dev Agent Record

### Context Reference

- docs/sprint-artifacts/stories/1-5-overlay-implementation.context.xml

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List
- Implemented `ProjectOverlay.tsx` and `ChatOverlay.tsx` components, converting HTML to JSX and preserving styling.
- Integrated Zustand for global state management, creating `overlayStore.ts` to control overlay visibility.
- Added `onClick` handlers to the "Ask Ursa" input in `Hero.tsx` to open `ChatOverlay`.
- Added `onClick` handlers to the "See All Projects" button and individual project cards in `Projects.tsx` to open `ProjectOverlay`.
- Integrated `ProjectOverlay` and `ChatOverlay` into `App.tsx` with conditional rendering based on Zustand state.

### File List
- CREATED: `portfolio-react-template/src/components/overlays/ProjectOverlay.tsx`
- CREATED: `portfolio-react-template/src/components/overlays/ChatOverlay.tsx`
- CREATED: `portfolio-react-template/src/state/overlayStore.ts`
- MODIFIED: `portfolio-react-template/src/components/Hero.tsx`
- MODIFIED: `portfolio-react-template/src/components/Projects.tsx`
- MODIFIED: `portfolio-react-template/src/App.tsx`
- MODIFIED: `portfolio-react-template/package.json`
- MODIFIED: `portfolio-react-template/package-lock.json`
- MODIFIED: `docs/sprint-artifacts/stories/1-5-overlay-implementation.md`
- MODIFIED: `docs/sprint-artifacts/sprint-status.yaml`
