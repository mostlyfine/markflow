# Markdown Viewer

GFM対応のmacOS向けMarkdownビューア（Electron + Vite + TypeScript）

## Phase 1: 基盤セットアップ ✓

Electron+Viteのプロジェクト構成、最小起動、テスト基盤（Vitest）の整備が完了しました。

## セットアップ

```bash
# 依存関係のインストール
npm install

# 開発モードで起動
npm run dev

# ビルド
npm run build

# テスト実行
npm test

# Lint実行
npm run lint

# フォーマット実行
npm run format
```

## プロジェクト構造

```
markdown-viewer/
├── src/
│   ├── main/           # Electronメインプロセス
│   │   └── main.ts
│   ├── preload/        # preloadスクリプト
│   │   └── preload.ts
│   └── renderer/       # レンダラープロセス
│       ├── index.html
│       └── main.ts
├── tests/              # テスト
│   └── app.spec.ts
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 技術スタック

- **Electron**: ^28.2.0
- **Vite**: ^5.0.12
- **TypeScript**: ^5.3.3
- **Vitest**: ^1.2.2
- **ESLint**: ^8.56.0
- **Prettier**: ^3.2.5

## セキュリティ

- `contextIsolation: true` でレンダラープロセスを分離
- `nodeIntegration: false` でNode.js統合を無効化
- `sandbox: true` でサンドボックス化
- contextBridgeを使用した安全なAPI公開

## 次のフェーズ

Phase 2: GFMレンダリング（marked-gfmによるMarkdown→HTML変換）
