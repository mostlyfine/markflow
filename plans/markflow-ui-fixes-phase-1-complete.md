## Phase 1 Complete: スクロール先頭リセット修正

スクロールリセットをappコンテナ基準に変更し、初期welcome読込がユーザー操作を上書きしないようガードしたうえで、全ロード経路で先頭表示を保証した。

**Files created/changed:**
- src/renderer/App.tsx
- tests/scroll-reset.spec.ts

**Functions created/changed:**
- resetScrollPosition
- applyLoadedContent
- loadDefaultFile（useEffect内ロジック）
- handleFileLoad

**Tests created/changed:**
- scroll-reset.spec.ts（初期ロード/ファイルオープン/再読み込み/ドラッグ&ドロップでスクロールトップ確認）

**Review Status:** APPROVED

**Git Commit Message:**
fix: ensure scroll resets after file load

- reset scroll position on app container via token
- guard welcome load from overwriting user files
- add scroll reset tests for load/reload/drag-drop
