# Migration to React + react-markdown

The renderer now uses React, react-markdown (remark), and react-syntax-highlighter.

## Summary

### 1. Package changes

**Removed:**
- marked
- highlight.js
- dompurify

**Added:**
- react & react-dom
- react-markdown
- remark-gfm (GitHub Flavored Markdown)
- react-syntax-highlighter
- rehype-raw & rehype-sanitize

### 2. Component layout

```
src/renderer/
├── main.tsx         # React entry point
├── App.tsx          # Root component
└── components/
    ├── MarkdownViewer.tsx  # Markdown rendering
    ├── Settings.tsx        # Settings panel
    └── FileLoader.tsx      # File picker helper
```

### 3. Key capabilities

- **react-markdown**: Markdown parser with GFM support
- **remark-gfm**: Tables, task lists, strikethrough, etc.
- **react-syntax-highlighter**: Code block highlighting (VS Code Dark Plus theme)
- **rehype-sanitize**: XSS protection
- **External links**: Automatically open in the default browser

### 4. Build settings

- **vite.config.ts**: added `@vitejs/plugin-react`
- **tsconfig.json**: set `"jsx": "react-jsx"`

## Verification

```bash
npm run build
npx electron dist-electron/main.js
```

## Tests

Existing tests should be updated with React Testing Library.

```bash
npm install -D @testing-library/react @testing-library/jest-dom
```
