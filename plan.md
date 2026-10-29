# Implementation Plan: Kanban MVP

**Date**: 2026-10-29 | **Spec**: [AGENTS.md](./AGENTS.md)

## Summary

Build a polished, single-board Kanban app in `frontend/`. The board starts with sample cards in five renameable columns; users can add, delete, and drag cards between columns. State remains in memory and resets on reload. Keep the feature set deliberately limited to the requirements in `AGENTS.md`.

## Technical Context

**Language/Version**: TypeScript; use a Node.js release supported by the selected Next.js version  
**Primary Dependencies**: Latest compatible stable Next.js and React; a maintained drag-and-drop library (prefer dnd-kit if compatible)  
**Storage**: None; React state only  
**Testing**: Vitest, React Testing Library, and Playwright  
**Target Platform**: Client-rendered web app  
**Performance Goals**: Smooth board interaction with the small in-memory sample dataset  
**Constraints**: All app code under `frontend/`; one board with exactly five columns; cards contain only a title and details; no persistence, user management, archive, search, or filtering

## Constitution Check

No separate constitution is present. The plan follows the project constraints in `AGENTS.md`:

- Keep the feature set and implementation simple: **Pass**
- Use the specified color palette and prioritize polished UX: **Pass**
- Include project scaffolding, `.gitignore`, unit tests, and browser integration testing: **Pass**
- Finish by starting the app and confirming it is ready: **Pass**

## Applied Guidelines

No migration or framework-conversion guidelines apply. Use the project requirements in `AGENTS.md`; select current compatible stable dependency versions during setup.

## Implementation Steps

### Phase 1: Setup

#### Step 1: Scaffold the frontend

- **Requirements**: REQ-001
- **Description**: Create a Next.js App Router application with TypeScript in `frontend/`. Add the package scripts and dependency lockfile, configure linting and type checking, and add or update the root `.gitignore` for Node.js, Next.js, test output, and local environment files. Keep generated application code inside `frontend/`.
- **Success criteria**:
  - [x] `frontend/` contains a runnable Next.js app and reproducible dependency lockfile.
  - [x] `.gitignore` excludes generated build output, installed dependencies, and local secrets.
  - [x] Install, lint, type-check, and production build commands are available and pass.

**Tasks**

- [x] T001 [Plan:1.1] Scaffold the TypeScript Next.js app, package scripts, and lockfile in `frontend/`.
- [x] T002 [Plan:1.1] Add Node.js and Next.js build/test exclusions to the repository-root `.gitignore`.

### Phase 2: Foundational board state

#### Step 2: Define the fixed board and in-memory sample state

- **Requirements**: REQ-002, REQ-003, REQ-007, REQ-008
- **Description**: Define a simple typed model for exactly five columns and cards with only `title` and `details`. Add useful initial sample data and initialize board state in the client. Keep all edits in component state; do not add storage, APIs, or server persistence.
- **Success criteria**:
  - [x] The initial board always has exactly five columns and includes sample cards.
  - [x] A card has only title and details as user-editable content.
  - [x] Reloading resets the board to its sample state; no data is written to browser or server storage.

**Tasks**

- [x] T003 [Plan:2.1] Define the board and card types and initial five-column sample data in `frontend/src/features/board/board-data.ts`.
- [x] T004 [Plan:2.1] Implement in-memory board state and state updates in `frontend/src/features/board/use-board.ts`.

### Phase 3: User story — manage and move cards on one board

#### Step 3: Render and rename the five columns

- **Requirements**: REQ-002, REQ-009
- **Description**: Render the single board with exactly five columns and editable column names. Rename actions update the in-memory state and preserve the fixed column count.
- **Success criteria**:
  - [x] The board visibly contains exactly five columns.
  - [x] Each column name can be changed and the change is reflected immediately.
  - [x] Renaming does not add, remove, or reorder columns.

**Tasks**

- [x] T005 [US1] [Plan:3.1] Implement the five-column board view and accessible column-name editing in `frontend/src/features/board/board.tsx`.

#### Step 4: Add and delete cards

- **Requirements**: REQ-003, REQ-005, REQ-006
- **Description**: Provide a focused add-card flow for the selected column and a delete action for each card. Limit card content to title and details; validate required title input in the UI.
- **Success criteria**:
  - [x] A user can add a titled card with details to the chosen column.
  - [x] A user can delete an existing card.
  - [x] No extra card fields or unrelated card-management actions are introduced.

**Tasks**

- [x] T006 [US1] [Plan:3.2] Implement adding a title-and-details card to a selected column in `frontend/src/features/board/add-card-form.tsx`.
- [x] T007 [US1] [Plan:3.2] Implement card rendering and the delete action in `frontend/src/features/board/card.tsx`.
- [x] T008 [US1] [Plan:3.2] Connect add and delete actions to the in-memory board state in `frontend/src/features/board/board.tsx`.

#### Step 5: Move cards with drag and drop

- **Requirements**: REQ-004
- **Description**: Add drag-and-drop between the five columns using a maintained library. Keep the move behavior limited to changing a card's column; ensure controls remain usable by keyboard where the library supports it.
- **Success criteria**:
  - [x] Dragging a card to another column moves it there without duplicating or losing it.
  - [x] A card remains in the same column when dropped back in place.
  - [x] Drag-and-drop does not introduce additional board or card features.

**Tasks**

- [x] T009 [US1] [Plan:3.3] Integrate the selected drag-and-drop library and move cards between columns in `frontend/src/features/board/board.tsx`.

### Phase 4: Polish, verification, and handoff

#### Step 6: Apply the visual system and accessible responsive layout

- **Requirements**: REQ-009
- **Description**: Create a cohesive, professional interface using the specified palette: yellow `#ecad0a`, blue `#209dd7`, purple `#753991`, navy `#032147`, and gray `#888888`. Add responsive board layout, clear focus states, and accessible names/labels without expanding the feature scope.
- **Success criteria**:
  - [x] The specified colors are represented by reusable CSS custom properties.
  - [x] The board and its controls remain usable at narrow and wide viewport sizes.
  - [x] Interactive controls have visible focus states and accessible labels.

**Tasks**

- [x] T010 [Plan:4.1] Implement the app shell, responsive board styling, and palette tokens in `frontend/src/app/globals.css` and `frontend/src/app/layout.tsx`.
- [x] T011 [Plan:4.1] Add concise app title and board-level structure in `frontend/src/app/page.tsx`.

#### Step 7: Add rigorous unit and browser integration tests

- **Requirements**: REQ-002, REQ-003, REQ-004, REQ-005, REQ-006, REQ-007, REQ-008, REQ-011
- **Description**: Add focused unit tests for initial data and board state actions, component tests for user-facing board flows, and Playwright coverage for the critical browser journeys. Test the absence of persistence by reloading after an edit.
- **Success criteria**:
  - [x] Unit tests cover the five-column invariant, sample data, rename, add, delete, and card moves.
  - [x] Component tests cover accessible user interactions and validation of an empty or whitespace-only title.
  - [x] Playwright tests cover initial rendering, rename, add, delete, pointer and keyboard drag-and-drop, responsive layout, and reset-on-reload.
  - [x] All tests pass along with lint, type-check, and production build.

**Tasks**

- [x] T012 [Plan:4.2] Configure Vitest and React Testing Library in `frontend/vitest.config.mts` and `frontend/package.json`.
- [x] T013 [Plan:4.2] Test board initialization and state actions in `frontend/src/features/board/use-board.test.ts`.
- [x] T014 [Plan:4.2] Test accessible board, rename, add, delete, and form validation behavior in the adjacent feature test files.
- [x] T015 [Plan:4.3] Configure Playwright and add critical pointer, keyboard, reset, and responsive user-flow tests in `frontend/e2e/board.spec.ts`.

#### Step 8: Final acceptance and ready-to-use handoff

- **Requirements**: REQ-001, REQ-009, REQ-010, REQ-011, REQ-012
- **Description**: Run all quality checks and browser tests, confirm the absence of excluded functionality, keep the README minimal, and start the development server so the completed app is ready to use.
- **Success criteria**:
  - [x] Install, lint, type-check, unit tests, Playwright tests, and production build pass.
  - [x] The app has no persistence, user management, archive, search, or filter functionality.
  - [x] `frontend/README.md` documents only the commands needed to install, test, and run the app.
  - [x] The production server starts and the board responds in a browser.

**Tasks**

- [x] T016 [Plan:4.4] Document install, test, and run commands in `frontend/README.md`.
- [x] T017 [Plan:4.4] Verify excluded features are absent and run lint, type-check, unit tests, Playwright tests, and production build for `frontend/`.
- [x] T018 [Plan:4.4] Start the production server from `frontend/` and verify the board loads in a browser.

## Project Structure

```text
.gitignore
plan.md
frontend/
  e2e/
    board.spec.ts
  src/
    app/
      globals.css
      layout.tsx
      page.tsx
    features/
      board/
        add-card-form.tsx
        add-card-form.test.tsx
        board-data.ts
        board.test.tsx
        board.tsx
        card.tsx
        card.test.tsx
        use-board.test.ts
        use-board.ts
    test/
      setup.ts
  package.json
  playwright.config.ts
  vitest.config.mts
```

## Testing Strategy

- **appType**: Client-rendered web app
- **Critical user journeys**:
  1. Open the app and see one populated board with five columns.
  2. Rename a column.
  3. Add a card to a chosen column and delete a card.
  4. Drag a card to another column.
  5. Reload and confirm changes were not persisted.
- **primaryValidationStack**: Vitest, React Testing Library, Playwright, ESLint, TypeScript, and Next.js production build
- **Environment requirements**: Node.js version supported by the selected Next.js release; browser binaries required by Playwright
- **Test data strategy**: Deterministic in-memory sample data; reset state on each page load and test
- **Acceptance criteria**: Every listed journey passes in Playwright; unit/component tests and all static/build checks pass
- **Validation review expectations**: Confirm exactly five renameable columns, title/details-only cards, no persistence, excluded features absent, and the development server responds

## Requirement Mapping

| REQ ID | Description | Plan Items | Implementation Evidence |
|--------|-------------|------------|------------------------|
| REQ-001 | Next.js app scaffolded in `frontend/` with standard project setup | 1.1, 4.4 | `frontend/package.json`, `.gitignore` |
| REQ-002 | One board with five renameable columns | 2.1, 3.1, 4.2 | `frontend/src/features/board/board.tsx`, `use-board.ts`, board tests |
| REQ-003 | Each card has a title and details only | 2.1, 3.2, 4.2 | `frontend/src/features/board/board-data.ts`, `add-card-form.tsx`, `card.tsx` |
| REQ-004 | Drag cards between columns | 3.3, 4.2, 4.3 | `frontend/src/features/board/board.tsx`, component and Playwright tests |
| REQ-005 | Add a card to a column | 3.2, 4.2, 4.3 | `frontend/src/features/board/add-card-form.tsx`, board tests |
| REQ-006 | Delete an existing card | 3.2, 4.2, 4.3 | `frontend/src/features/board/card.tsx`, board tests |
| REQ-007 | Start with populated dummy data | 2.1, 4.2, 4.3 | `frontend/src/features/board/board-data.ts`, initialization tests |
| REQ-008 | No persistence | 2.1, 4.2, 4.3 | `frontend/src/features/board/use-board.ts`, reload test |
| REQ-009 | Polished UI using the specified palette | 3.1, 4.1, 4.4 | `frontend/src/app/globals.css`, `layout.tsx`, `page.tsx` |
| REQ-010 | Exclude archive, search/filter, and other features | 4.4 | Scope review of `frontend/src/` and acceptance checks |
| REQ-011 | Rigorous unit and integration tests | 4.2, 4.3, 4.4 | `frontend/src/features/board/*.test.tsx`, `frontend/e2e/board.spec.ts` |
| REQ-012 | Finish with a running, browser-verified app | 4.4 | Development server and browser verification |
