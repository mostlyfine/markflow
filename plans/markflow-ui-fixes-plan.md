## Plan: MarkFlow UI Fixes

This plan tracks TDD-driven fixes for scroll handling, menus, settings toggles, and the macOS menu-bar name, along with regression tests.

**Phases 4**
1. **Phase 1: Scroll reset fix**
    - **Objective:** Always show the top of the document after load/reload/drag-and-drop/initial render.
    - **Files/Functions to Modify/Create:** src/renderer/App.tsx plus src/renderer/components/MarkdownViewer.tsx if needed.
    - **Tests to Write:** Unit/component tests asserting scroll resets to top after each load.
    - **Steps:**
        1. Identify the current scroll target and add failing tests.
        2. Reset `scrollTop` on the app container (or viewer element) to 0.
        3. Ensure reload resets even when state does not change.
        4. Make tests pass and do a quick manual verification.

2. **Phase 2: Menu cleanup and settings toggle**
    - **Objective:** Remove the redundant page-reload menu entry and ensure the settings toggle always works.
    - **Files/Functions to Modify/Create:** src/main/main.ts (menu template), plus src/preload/preload.ts or src/renderer/App.tsx if needed.
    - **Tests to Write:** Unit tests that verify menu structure and IPC emissions.
    - **Steps:**
        1. Add failing tests confirming the page-reload entry currently exists.
        2. Remove the page-reload entry while keeping the settings toggle accelerator.
        3. Adjust/add tests verifying the IPC event fires.
        4. Turn tests green.

3. **Phase 3: Rename macOS app menu to MarkFlow**
    - **Objective:** Display “MarkFlow” in the macOS menu bar.
    - **Files/Functions to Modify/Create:** src/main/main.ts (add appMenu / set app.name) and package.json if necessary.
    - **Tests to Write:** Unit test verifying appMenu exists at the top of the template.
    - **Steps:**
        1. Add a failing test that expects an appMenu entry.
        2. Insert the appMenu at the start of the template and ensure app.name is MarkFlow.
        3. Make the new test pass.

4. **Phase 4: Regression check and polish**
    - **Objective:** Verify settings, scrolling, and menus continue to behave consistently.
    - **Files/Functions to Modify/Create:** Minor adjustments to touched files and documentation as needed.
    - **Tests to Write:** Stabilize new tests and re-run the suite for regressions.
    - **Steps:**
        1. Run all new tests and confirm no regressions.
        2. Do a quick manual pass for settings toggle + scroll behavior.
        3. Apply any final polish.

**Open Questions**
1. Should we reset the app-container directly (most reliable) or perform the reset inside MarkdownViewer?
2. Is adding an appMenu entry enough for macOS naming, or do we need to regenerate Info.plist?
3. Is it acceptable to remove the page-reload menu entirely, or should we preserve it under a different accelerator?
