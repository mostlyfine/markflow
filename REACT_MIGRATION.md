# React + react-markdown構成への移行

React、react-markdown (remark)、react-syntax-highlighterを使用する構成に変更しました。

## 実装内容

### 1. パッケージの変更

**削除:**
- marked
- highlight.js
- dompurify

**追加:**
- react & react-dom
- react-markdown
- remark-gfm (GitHub Flavored Markdown)
- react-syntax-highlighter
- rehype-raw & rehype-sanitize

### 2. コンポーネント構成

```
src/renderer/
├── main.tsx         # Reactエントリポイント
├── App.tsx          # メインアプリコンポーネント
└── components/
    ├── MarkdownViewer.tsx  # Markdownレンダリング
    ├── Settings.tsx         # 設定画面
    └── FileLoader.tsx       # ファイル読み込み
```

### 3. 主な機能

- **react-markdown**: GFM対応のMarkdownパーサー
- **remark-gfm**: テーブル、タスクリスト、打ち消し線等のGFM拡張
- **react-syntax-highlighter**: コードブロックのシンタックスハイライト (VS Code Dark Plusテーマ)
- **rehype-sanitize**: XSS保護
- **外部リンク**: デフォルトブラウザで自動的に開く

### 4. ビルド設定

- **vite.config.ts**: @vitejs/plugin-reactを追加
- **tsconfig.json**: jsx: "react-jsx"を設定

## 動作確認

```bash
npm run build
npx electron dist-electron/main.js
```

## テスト

既存のテストは更新が必要です。React Testing Libraryを使用したテストに書き換えることを推奨します。

```bash
npm install -D @testing-library/react @testing-library/jest-dom
```
