## Plan: MarkFlow UI Fixes

MarkFlowのスクロール、メニュー、設定トグル、macOSメニューバー名称をTDDで順次修正し、回帰防止テストを追加する。

**Phases 4**
1. **Phase 1: スクロール先頭リセット修正**
    - **Objective:** ファイル読込/再読込/ドラッグ&ドロップ/初回表示で必ず先頭表示にする。
    - **Files/Functions to Modify/Create:** src/renderer/App.tsx、必要なら src/renderer/components/MarkdownViewer.tsx。
    - **Tests to Write:** スクロール位置リセットの単体/コンポーネントテスト（ロード後にスクロールトップになること）。
    - **Steps:**
        1. 現行スクロール対象を確認しテスト（fail）追加。
        2. app-container もしくはビューア要素の scrollTop を0にリセットする実装。
        3. リロード時に state が変わらなくてもリセットされるパスを追加。
        4. テストをパスさせ、手動確認を短く実施。

2. **Phase 2: メニュー整理と設定トグル修復**
    - **Objective:** ページ再読み込みメニューを削除し、設定画面トグルが確実に動くようにする。
    - **Files/Functions to Modify/Create:** src/main/main.ts（メニューテンプレート）、必要なら src/preload/preload.ts、src/renderer/App.tsx。
    - **Tests to Write:** メニュー項目の存在/非存在を検証する単体テスト（テンプレート構造、IPCイベント発火）。
    - **Steps:**
        1. ページ再読み込み項目が存在することを確認するテストを先に書きfailさせる。
        2. ページ再読み込み項目を削除し、設定トグル項目のアクセラレータを維持。
        3. IPCイベントが発火することを確認するテストを調整/追加。
        4. テストをパスさせる。

3. **Phase 3: macOSアプリメニュー名称をMarkFlowに**
    - **Objective:** macOSメニューバーのアプリ名をMarkFlowで表示させる。
    - **Files/Functions to Modify/Create:** src/main/main.ts（appMenu追加、app.name設定位置）、必要なら package.json。
    - **Tests to Write:** メニューテンプレート先頭に appMenu があることを確認する単体テスト。
    - **Steps:**
        1. appMenu追加を検出するテストを先に書きfailさせる。
        2. テンプレート先頭に appMenu を追加し、app.name が MarkFlow であることを確認。
        3. テストをパスさせる。

4. **Phase 4: リグレッション確認と仕上げ**
    - **Objective:** 設定画面表示、スクロール、メニューの一貫動作を総合確認する。
    - **Files/Functions to Modify/Create:** 変更ファイルの微調整、必要なら README など。
    - **Tests to Write:** 追加テストの安定化・回帰確認。
    - **Steps:**
        1. 追加テストを全て実行し回帰を確認。
        2. 手動で設定トグルとスクロール挙動を簡易チェック。
        3. 仕上げの微調整があれば反映。

**Open Questions**
1. スクロール対象は app-container を直接リセットする案（確実性高）で進めてよいか、MarkdownViewer 内部で行うか。
2. macOSメニューは appMenu 追加のみで良いか、それとも Info.plist 再生成まで含めるか。
3. ページ再読み込みメニューは完全削除で問題ないか、別アクセラレータへ退避すべきか。
