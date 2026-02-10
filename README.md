# Markdown Viewer

GitHub Flavored Markdown対応のElectronベースのMarkdownビューア

## 機能

- ✅ GitHub Flavored Markdown (GFM)完全対応
- ✅ シンタックスハイライト (react-syntax-highlighter + Prism)
- ✅ LaTeX数式表示 (KaTeX)
- ✅ Mermaidダイアグラム対応
- ✅ 外部リンクをデフォルトブラウザで開く
- ✅ CLIからのファイル指定起動
- ✅ カスタムCSS設定
- ✅ ファイル再読み込み (Cmd+R / Ctrl+R)
- ✅ ドラッグ&ドロップでファイル読み込み

## 開発

### 必要なもの

- Node.js 20以上
- npm

## セットアップ

```bash
# 依存関係のインストール
npm install

# 開発モードで起動
npm run dev

# ビルド
npm run build

# アプリケーションパッケージ作成（すべてのプラットフォーム）
npm run dist

# macOS用
npm run dist:mac

# Windows用
npm run dist:win

# Linux用
npm run dist:linux

# テスト実行
npm test

# Lint実行
npm run lint

# フォーマット実行
npm run format

# クリーン
npm run clean
```

## リリース

### GitHub Actionsによる自動ビルド

1. バージョンタグをプッシュ:
```bash
git tag v1.0.0
git push origin v1.0.0
```

2. GitHub Actionsが自動的に以下を実行:
   - macOS (x64, arm64): DMG, ZIP
   - Windows (x64): NSIS installer, Portable
   - Linux (x64): AppImage, DEB

3. リリースページに成果物が自動的にアップロード

### 手動リリース

GitHub Actionsの"Build and Release"ワークフローから手動実行も可能

## プロジェクト構造

```
markdown-viewer/
├── .github/
│   └── workflows/
│       └── release.yml     # GitHub Actions設定
├── build/                  # アイコン等のビルドリソース
├── public/                 # 公開アセット
│   └── gfm.md
├── src/
│   ├── main/               # Electronメインプロセス
│   │   ├── main.ts
│   │   └── config.ts
│   ├── preload/            # preloadスクリプト
│   │   └── preload.ts
│   └── renderer/           # レンダラープロセス (React)
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
├── tests/                  # テスト
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 技術スタック

- **フレームワーク**: Electron 28
- **UI**: React 19
- **ビルドツール**: Vite 5 + vite-plugin-electron
- **パッケージャー**: electron-builder 24
- **Markdown**: react-markdown + remark-gfm
- **コードハイライト**: react-syntax-highlighter (Prism)
- **数式**: KaTeX
- **ダイアグラム**: Mermaid.js
- **言語**: TypeScript 5
- **テスト**: Vitest

## セキュリティ

- `contextIsolation: true` でレンダラープロセスを分離
- `nodeIntegration: false` でNode.js統合を無効化
- `sandbox: true` でサンドボックス化
- contextBridgeを使用した安全なAPI公開
- rehypeプラグインによるHTML sanitization

## ライセンス

MIT
