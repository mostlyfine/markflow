# MarkFlow

Electron-based Markdown viewer with first-class GitHub Flavored Markdown (GFM) support.

## Features

- ✅ Full GitHub Flavored Markdown (GFM) support
- ❌ Syntax highlighting (disabled for faster startup)
- ❌ LaTeX math rendering with KaTeX (disabled for faster startup)
- ✅ Mermaid diagram rendering
- ✅ External links open in the default browser
- ✅ Launch with files specified via the CLI
- ✅ Custom CSS overrides
- ✅ File reload shortcut (Cmd+R / Ctrl+R)
- ✅ Drag-and-drop file loading

## Development

### Requirements

- Node.js 20+
- npm

## Setup

```bash
# Install dependencies
npm install

# Start in development mode
npm run dev

# Type-check and bundle
npm run build

# Produce installers for every platform
npm run dist

# Platform-specific bundles
npm run dist:mac
npm run dist:win
npm run dist:linux

# Run tests
npm test

# Lint sources
npm run lint

# Format sources
npm run format

# Clean build artifacts
npm run clean
```

## Release

### Automated release via GitHub Actions

1. Push a version tag:

```bash
git tag v1.0.0
git push origin v1.0.0
```

2. GitHub Actions builds installers automatically:
   - macOS (x64, arm64): DMG, ZIP
   - Windows (x64): NSIS installer, portable ZIP
   - Linux (x64): AppImage, DEB

3. Artifacts are uploaded to the GitHub Releases page.

### Manual release

You can also trigger the "Build and Release" workflow manually from GitHub Actions.

## Project Structure

```
markflow/
├── .github/
│   └── workflows/
│       └── release.yml     # GitHub Actions workflow
├── build/                  # Icons and other build assets
├── public/                 # Static assets (welcome copy, sample markdown)
│   └── gfm.md
├── src/
│   ├── main/               # Electron main process
│   │   ├── main.ts
│   │   └── config.ts
│   ├── preload/            # Preload bridge
│   │   └── preload.ts
│   └── renderer/           # React renderer process
│       ├── index.html
│       ├── main.tsx
│       ├── App.tsx
│       ├── components/
│       │   ├── MarkdownViewer.tsx
│       │   ├── MermaidDiagram.tsx
│       │   ├── Settings.tsx
│       │   └── FileLoader.tsx
│       └── styles/
│           └── default.css
├── tests/                  # Vitest suites
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Technology Stack

- **Framework**: Electron 28
- **UI**: React 19
- **Build tool**: Vite 5 + vite-plugin-electron
- **Packager**: electron-builder 24
- **Markdown**: react-markdown + remark-gfm
- **Syntax highlighting**: disabled
- **Math**: disabled
- **Diagrams**: Mermaid.js
- **Language**: TypeScript 5
- **Tests**: Vitest

## Security

- `contextIsolation: true` to isolate the renderer process
- `nodeIntegration: false` to disable Node.js in the renderer
- `sandbox: true` for additional hardening
- All renderer APIs exposed via contextBridge
- HTML sanitized with rehype plugins

## License

MIT
