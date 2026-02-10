## Plan: macOS向けMarkdownビューア

ElectronとViteでGFM対応のMarkdownビューアを新規構築します。TypeScriptで型安全性を確保し、electron-storeで設定永続化を行い、CSSカスタマイズ可能な設定画面とデフォルトCSSを用意します。TDDに従って段階的に実装します。

**Phases 4 phases**
1. **Phase 1: 基盤セットアップ**
   - **Objective:** Electron+Viteのプロジェクト構成、最小起動、テスト基盤（Vitest）の整備を行う
   - **Files/Functions to Modify/Create:** package.json, vite.config.ts, tsconfig.json, src/main/main.ts, src/preload/preload.ts, src/renderer/index.html, src/renderer/main.ts, tests/app.spec.ts
   - **Tests to Write:** アプリが起動してウィンドウが表示されるテスト、レンダラープロセスの初期化テスト
   - **Steps:**
        1. プロジェクト構成とテスト基盤のテストを作成して失敗を確認
        2. package.json、Vite設定、Electronエントリポイント、最小のレンダラーHTMLを作成
        3. アプリが起動してテストが通ることを確認
        4. Lintとフォーマットを実行

2. **Phase 2: GFMレンダリング**
   - **Objective:** marked-gfmでGFM対応のMarkdown→HTMLレンダリングとプレビュー表示を実装
   - **Files/Functions to Modify/Create:** src/renderer/main.ts, src/renderer/markdown.ts, src/renderer/components/MarkdownViewer.ts, src/renderer/styles/default.css, tests/markdown.spec.ts
   - **Tests to Write:** GFM要素（テーブル、タスクリスト、コードブロック、URL自動リンク）のレンダリングテスト、プレビュー表示のテスト
   - **Steps:**
        1. GFM要素のレンダリングテストを追加し失敗を確認
        2. markedとmarked-gfmをインストールし最小限のレンダリング実装を追加
        3. 各GFM機能を順に実装してテストを通す
        4. デフォルトCSSを作成してプレビューに適用
        5. Lintとフォーマットを実行

3. **Phase 3: 設定画面とCSS編集**
   - **Objective:** 設定画面でカスタムCSSを編集・保存し、即座にプレビューに反映する機能を実装
   - **Files/Functions to Modify/Create:** src/main/main.ts, src/preload/preload.ts, src/renderer/components/Settings.ts, src/renderer/components/MarkdownViewer.ts, src/main/config.ts, tests/settings.spec.ts, tests/css-injection.spec.ts
   - **Tests to Write:** electron-storeへのCSS保存・読み込みテスト、CSS変更時のプレビュー更新テスト、設定画面の開閉テスト
   - **Steps:**
        1. CSS設定の保存・読み込み・適用のテストを追加し失敗を確認
        2. electron-storeをインストールして設定ストアを実装
        3. IPCでメインプロセス↔レンダラー間のCSS送受信を実装
        4. 設定画面UIを作成してカスタムCSS編集機能を追加
        5. プレビューへのCSS適用ロジックを実装
        6. テストが通ることを確認してLint・フォーマット実行

4. **Phase 4: 仕上げと安定化**
   - **Objective:** ファイル読み込みUI、エラーハンドリング、デフォルトCSS微調整、ウィンドウサイズ保存など使い勝手の向上
   - **Files/Functions to Modify/Create:** src/renderer/components/FileLoader.ts, src/renderer/components/MarkdownViewer.ts, src/renderer/styles/default.css, src/main/main.ts, tests/file-loader.spec.ts, tests/error-handling.spec.ts
   - **Tests to Write:** ファイル読み込みテスト、エラーハンドリングテスト、ウィンドウ状態保存テスト
   - **Steps:**
        1. ファイル操作とエラーハンドリングのテストを追加し失敗を確認
        2. ファイル選択・読み込みUIと処理を実装
        3. エラー表示とバリデーションを追加
        4. ウィンドウサイズ・位置の保存機能を実装
        5. デフォルトCSSを調整してGitHub風に整備
        6. 全テストが通ることを確認してLint・フォーマット実行

**Open Questions 0 questions**
（選択済み: TypeScript、Vite、electron-store）
