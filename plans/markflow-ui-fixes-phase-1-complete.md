## Phase 1 Complete: スクロール先頭リセット修正

スクロールリセットをappコンテナ基準に変更し、初期welcome読込がユーザー操作を上書きしないようガードしたうえで、全ロード経路で先頭表示を保証した。さらにHTML/BODYのスクロールをロックして二重スクロールバーを防止した。

**Files created/changed:**
- src/renderer/App.tsx
- tests/scroll-reset.spec.ts

**Functions created/changed:**
- resetScrollPosition
- applyLoadedContent
- loadDefaultFile（useEffect内ロジック）
- handleFileLoad

**Tests created/changed:**
- scroll-reset.spec.ts（初期ロード/ファイルオープン/再読み込み/ドラッグ&ドロップでスクロールトップ確認＋スクロールロックの有効/復元を検証）

**Review Status:** APPROVED

**Git Commit Message:**
fix: prevent double scrollbars and reset properly

- lock document/body scroll during app lifecycle
- reset scroll on app container via token for all load paths
- guard welcome load from overwriting user files
- add scroll reset and scroll-lock tests
