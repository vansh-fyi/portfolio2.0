# Story 1.1: Project Setup & Foundation

Status: ready-for-dev

## Story

As a developer,
I want to set up the foundational React project using Vite with TypeScript,
so that I have a clean, performant, and well-configured environment for building the Single-Page Application.

## Acceptance Criteria

1.  **Given** a new project is created
2.  **When** I run the development server
3.  **Then** I see a blank React application running without errors.
4.  **And** the project includes basic linting, formatting, and performance monitoring (e.g., Lighthouse, Web Vitals) configurations.

## Tasks / Subtasks

- [ ] Set up a new React project using `npm create vite@latest portfolio-react -- --template react-ts` (AC: 1, 2, 3)
- [ ] Configure ESLint for TypeScript and React (AC: 4)
- [ ] Configure Prettier for code formatting (AC: 4)
- [ ] Integrate basic performance monitoring tools/configurations (e.g., Lighthouse CI, Web Vitals reporting) (AC: 4)

## Dev Notes

### Requirements Context Summary

This story is derived from Epic 1: Core Application & React Migration, specifically focusing on the initial setup. The PRD mandates migration to a React SPA while preserving existing UI/UX. The Architecture document specifies Vite with React and TypeScript as the project foundation.

### Project Structure Notes

- This story establishes the foundational project structure. Future stories will build upon this.
- No previous story learnings to apply for structural alignment.

### References

- [Source: docs/epics.md#Story-1.1-Project-Setup-Foundation]
- [Source: docs/PRD.md#FR1]
- [Source: docs/architecture.md#Project-Initialization]

## Dev Agent Record

### Context Reference

- /Users/hp/Desktop/Work/Repositories/portfolio2.0/docs/sprint-artifacts/stories/1-1-project-setup-foundation.context.xml

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List

### Change Log

- **2025-11-14**: Story created.
- **2025-11-14**: Context generated.
