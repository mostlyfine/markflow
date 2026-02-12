## Plan: Markdown Viewer for macOS

This plan describes how to build a GitHub Flavored Markdown (GFM) viewer for macOS using Electron and Vite. Users can open any Markdown file, view it in a polished GitHub-like UI, and edit custom CSS that updates instantly in the preview. The project follows TDD, exposes only secure preload bridges, and ships with a safe Markdown parser plus a complete test strategy.

### Goals
1. Electron app tailored for macOS conventions
2. High-quality rendering for GitHub Flavored Markdown
3. DOMPurify + CSS sandboxing for XSS defense
4. Custom CSS editor with instant preview updates
5. File loader that validates extensions and sizes up to 10 MB
6. Comprehensive unit and integration tests for all critical logic
7. Strict adherence to Electron security best practices (contextIsolation, sandbox, nodeIntegration disabled)

### System Layout
- Electron main: window lifecycle, IPC handlers, persistent config
- Preload: exposes minimal APIs via contextBridge
- Renderer: React + Vite for Markdown rendering and UI flows
- Tests: Vitest + Testing Library for unit and rendering coverage

### Tech Stack
- Electron 26.x
- Vite 5.x + React 18.x
- TypeScript 5.x
- DOMPurify for sanitization
- remark/rehype plugins for GFM
- electron-store for config persistence
- CSS Modules for style isolation
- Vitest + @testing-library/react

### Security Posture
- nodeIntegration: false
- contextIsolation: true
- sandbox: true
- IPC only exposed from preload
- DOMPurify sanitizes Markdown → HTML output
- Enforce file size/extension validation
- Apply custom CSS through text nodes to keep style tags constrained

### Phases
1. Phase 1: Foundation setup
2. Phase 2: Markdown rendering
3. Phase 3: Settings screen and CSS editor
4. Phase 4: Polish and stabilization

### Detailed Tasks
#### Phase 1: Foundation setup
- Bootstrap Electron + Vite project
- Create main window with contextIsolation + preload wiring
- Implement IPC handlers for file loading
- Configure Vitest
- Draft README

#### Phase 2: Markdown rendering
- Wire remark + rehype + rehype-raw + rehype-highlight
- Sanitize with DOMPurify
- Build the file → Markdown → HTML rendering flow
- Enable GFM extensions (tables, task lists, fenced code blocks)
- Add error handling plus tests

#### Phase 3: Settings screen and CSS editor
- Manage config with electron-store
- Persist and load custom CSS
- Build settings modal with real-time preview updates
- Cover CSS application with tests

#### Phase 4: Polish and stabilization
- Show error dialogs and enforce file size limits
- Persist window bounds
- Finalize menus (Open File, Reload, etc.)
- Update README and release notes
- Run full regression tests

### Test Plan
- Phase 1: Foundation tests (startup, preload, IPC wiring)
- Phase 2: Markdown rendering tests plus XSS hardening
- Phase 3: Config persistence tests and CSS application tests
- Phase 4: Error-handling tests and near-E2E coverage

### Success Criteria
- Reliably open Markdown files up to 10 MB
- Render all common GFM elements (tables, lists, checkboxes)
- Persist custom CSS that reapplies immediately and after restart
- All tests pass in CI
- Satisfy Electron’s security checklist
- README and documentation available in English
