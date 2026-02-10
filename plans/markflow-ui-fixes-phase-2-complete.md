## Phase 2 Complete: メニュー整理と設定トグル修復

ページ再読み込みメニューを削除し、ファイル再読み込みのみをCmd/Ctrl+Rに残した上で、設定トグルIPCを確実にレンダラーへ送るようメニューを分離・整理した。macではアプリメニューに「設定…」を移し、Viewへの重複を排除。設定パネルのトグル挙動をテストで担保した。

**Files created/changed:**
- src/main/main.ts
- src/main/menu.ts
- tests/menu.spec.ts
- tests/settings-toggle.spec.tsx

**Functions created/changed:**
- buildMenuTemplate（プラットフォーム別メニュー分岐）
- setupMenu（メニュー分離版の利用）

**Tests created/changed:**
- menu.spec.ts（ページ再読み込み削除、ファイル再読み込みショートカット、設定トグル送信、macのappMenuに設定を配置）
- settings-toggle.spec.tsx（toggle-settings IPCでパネルが開閉することを検証）

**Review Status:** APPROVED

**Git Commit Message:**
fix: remove page reload menu and secure settings toggle

- drop duplicate page reload entry; keep Cmd/Ctrl+R for file reload
- extract menu template helper and guard renderer sends
- add menu and settings toggle tests for IPC wiring
