# Story 1.3: Styling Integration

Status: ready-for-dev

## Story

As a developer,
I want to integrate the existing Tailwind CSS and custom CSS into the React project,
so that the components are styled correctly.

## Acceptance Criteria

1. **Given** the React components created in the previous story, **when** I view the application in the browser, **then** the styling of all components on the main page matches the original `brownfield/index.html` pixel-for-pixel.
2. **Given** the styling is applied, **when** I run a performance analysis (e.g., Lighthouse), **then** the unified styling does not negatively impact page load speed or rendering performance compared to the original static site.

## Tasks / Subtasks

- [x] **Task 1: Setup Tailwind CSS** (AC: 1)
  - [x] Install and configure Tailwind CSS for the `portfolio-react-template` Vite project.
  - [x] Create a `tailwind.config.js` file.
  - [x] Configure the `postcss.config.js` file.
  - [x] Ensure the main CSS file (`src/index.css`) imports Tailwind's base, components, and utilities.
- [x] **Task 2: Consolidate Styles** (AC: 1)
  - [x] Analyze `brownfield/index.html` to identify all `<link>`ed stylesheets and inline `<style>` blocks.
  - [x] Consolidate all identified styles into `src/index.css`.
- [ ] **Task 3: Apply Styles to Components** (AC: 1)
  - [ ] Systematically go through each of the 8 components in `src/components/` and apply the necessary `className` attributes to match the original `index.html`.
  - [ ] Ensure the Unicorn Studio background script and its associated styles are correctly applied in `App.tsx`.
- [ ] **Task 4: Verification** (AC: 1, 2)
  - [ ] Visually inspect each component against `brownfield/index.html` to ensure pixel-perfect matching.
  - [ ] Run a Lighthouse performance report on the new React application and compare it to a baseline report of the original `brownfield/index.html`.

## Dev Notes

- **Styling Framework**: The project uses Tailwind CSS as the primary styling framework. All new styles should be implemented using Tailwind utility classes where possible. [Source: docs/architecture.md#Technology-Stack-Details]
- **Component Source**: The 8 components to be styled were created in the previous story (`1-2-component-migration`) and are located in `portfolio-react-template/src/components/`.
- **Testing**: The testing framework (Jest with `react-test-renderer`) is already configured. While this story is primarily visual, snapshot tests for each component should be updated if the DOM structure changes.

### Learnings from Previous Story

**From Story 1.2 (Status: done)**

- **Component Structure**: A full set of 8 components (`Header`, `Hero`, `Skills`, `Projects`, `About`, `Testimonials`, `Contact`, `Footer`) has been created and assembled in `portfolio-react-template/src/App.tsx`.
- **Testing Framework**: A working snapshot test suite exists for all 8 components. These tests can be used to validate that styling changes do not unintentionally alter the component structure.
- **Background Script**: The "Unicorn Studio" background effect was identified as a critical UI element and its script was added to `App.tsx`. The styling for this effect must be preserved.

[Source: docs/sprint-artifacts/stories/1-2-component-migration.context.xml]

## Dev Agent Record

### Context Reference

<!-- Path(s) to story context XML will be added here by context workflow -->

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
