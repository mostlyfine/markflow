## Phase 2 Complete: GFM Rendering

Implemented Markdown rendering with marked + DOMPurify, delivering a full GFM preview experience. Tables, task lists, code blocks, and automatic URL linking now work, and XSS protection is in place. A GitHub-style default CSS theme ships with this phase.

**Files created/changed:**
- src/renderer/main.ts
- src/renderer/markdown.ts
- src/renderer/components/MarkdownViewer.ts
- src/renderer/styles/default.css
- tests/markdown.spec.ts
- package.json
- tsconfig.json

**Functions created/changed:**
- renderMarkdown() - converts Markdown to HTML with GFM support and DOMPurify sanitization
- configureMarked() - configures marked for GFM behavior
- getSanitizeConfig() - prepares the DOMPurify whitelist
- MarkdownViewer.render() - renders the Markdown preview
- MarkdownViewer.clear() - clears the current content

**Tests created/changed:**
- should render headings correctly
- should render paragraphs and line breaks
- should render code blocks
- should render code blocks with language class
- should render inline code
- should render tables
- should render tables with alignment
- should render task lists (unchecked)
- should render task lists (checked)
- should render strikethrough text
- should auto-link URLs
- should auto-link email addresses
- should sanitize script tags (XSS protection)
- should sanitize onerror attributes (XSS protection)

**Review Status:** APPROVED ✅

**Git Commit Message:**
feat: implement GFM rendering and preview

- Added marked-based Markdown → HTML conversion with GFM support
- Completed DOMPurify-based XSS protection
- Enabled tables, task lists, code blocks, and auto-linking
- Created the MarkdownViewer component
- Added a GitHub-inspired default CSS theme
- Wrote 14 comprehensive GFM test cases
- Resolved typing errors and lint warnings
