## Phase 1 Complete: Scroll reset fix

Scroll reset now targets the app container, guards the initial welcome load from overwriting user input, and guarantees top-of-document rendering for every load path. HTML/BODY scrolling is locked to prevent double scrollbars.

**Files created/changed:**
- src/renderer/App.tsx
- tests/scroll-reset.spec.ts

**Functions created/changed:**
- resetScrollPosition
- applyLoadedContent
- loadDefaultFile (useEffect logic)
- handleFileLoad

**Tests created/changed:**
- scroll-reset.spec.ts (verifies scroll-to-top for initial load, open file, reload, drag-and-drop, plus scroll-lock enable/restore)

**Review Status:** APPROVED

**Git Commit Message:**
fix: prevent double scrollbars and reset properly

- lock document/body scroll during app lifecycle
- reset scroll on app container via token for all load paths
- guard welcome load from overwriting user files
- add scroll reset and scroll-lock tests
