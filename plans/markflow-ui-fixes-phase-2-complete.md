## Phase 2 Complete: Menu cleanup and settings toggle

Removed the page-reload menu item, left Cmd/Ctrl+R dedicated to file reload, and reorganized menus to ensure the settings toggle IPC always reaches the renderer. On macOS the Settings entry now lives under the app menu, eliminating duplicates in View, and tests lock down the toggle behavior.

**Files created/changed:**
- src/main/main.ts
- src/main/menu.ts
- tests/menu.spec.ts
- tests/settings-toggle.spec.tsx

**Functions created/changed:**
- buildMenuTemplate (platform-specific menu branching)
- setupMenu (wires up the split menus)

**Tests created/changed:**
- menu.spec.ts (ensures page reload removal, file reload shortcut, settings toggle send, Settings under mac appMenu)
- settings-toggle.spec.tsx (verifies the toggle-settings IPC opens/closes the panel)

**Review Status:** APPROVED

**Git Commit Message:**
fix: remove page reload menu and secure settings toggle

- drop duplicate page reload entry; keep Cmd/Ctrl+R for file reload
- extract menu template helper and guard renderer sends
- add menu and settings toggle tests for IPC wiring
