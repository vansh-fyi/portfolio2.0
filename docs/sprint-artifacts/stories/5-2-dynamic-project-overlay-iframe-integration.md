# Story 5.2: Dynamic Project Overlay & Iframe Integration

**Status:** `review`  
**Sprint:** Epic 5 - System Integration

## Story

As a user,
I want to see the full list of projects in the overlay and view them in an iframe,
so that I can explore Vansh's work without leaving the site and have the AI context switch accordingly.

## Acceptance Criteria

1.  **Given** the project overlay sidebar
    *   **When** I open it
    *   **Then** I see all projects categorized correctly (Product Design, Branding, etc.) as defined in the configuration.

2.  **Given** the project list
    *   **When** I click on a project
    *   **Then** the main view updates to show the correct iframe URL for that project.
    *   **And** the "Ask Ursa" button is associated with the selected project's ID.

3.  **Given** the project configuration
    *   **When** I inspect the code
    *   **Then** there is a central `projects.ts` config file containing all project metadata (id, title, category, url).

## Tasks / Subtasks

- [x] **Create Project Config** (AC: 3)
  - [x] Create `src/config/projects.ts`
  - [x] Populate with data extracted from `brownfield/project-display.html` and `_content/projects`
  - [x] Define type interface `Project`
- [x] **Update Sidebar Component** (AC: 1)
  - [x] Refactor `OverlaySidebar.tsx` to map over the config data
  - [x] Implement category grouping
- [x] **Update Overlay Component** (AC: 2)
  - [x] Refactor `ProjectOverlay.tsx` to use `useViewStore` or local state for the *selected* project (distinct from the *view* mode)
  - [x] Ensure iframe `src` updates dynamically
  - [x] Pass `projectId` to the chat trigger (preparation for Story 5.3)

## Dev Notes

- **Config Structure**:
  ```typescript
  export const projects = [
    {
      id: 'aether',
      title: 'Aether',
      category: 'Product Design',
      url: 'https://vansh.fyi/projects/aether', // or local path if needed
      description: 'AI Design System Generator'
    },
    // ...
  ]
  ```
- **State Management**: Currently `useViewStore` handles the main view. We might need a `selectedProject` in the store or just local state in `ProjectOverlay` if it's ephemeral. Given the chat needs to know the project, putting it in the store (or passing it to the chat component) is better.

## Dev Agent Record

### Context Reference

- `docs/sprint-artifacts/stories/5-2-dynamic-project-overlay-iframe-integration.context.xml`

### Agent Model Used

- Gemini 2.0 Flash
