"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("electronAPI", {
  platform: process.platform,
  versions: {
    node: process.versions.node,
    chrome: process.versions.chrome,
    electron: process.versions.electron
  },
  // 設定API
  getCustomCSS: () => electron.ipcRenderer.invoke("get-custom-css"),
  setCustomCSS: (css) => electron.ipcRenderer.invoke("set-custom-css", css),
  // ファイル読み込みAPI
  selectFile: () => electron.ipcRenderer.invoke("select-file"),
  // メニューからのファイルを開くイベント
  onFileOpen: (callback) => {
    electron.ipcRenderer.on("trigger-file-open", callback);
  },
  // メニューからの設定画面トグルイベント
  onToggleSettings: (callback) => {
    electron.ipcRenderer.on("toggle-settings", callback);
  },
  // CLIから渡されたファイルを開くイベント
  onFileOpenFromCLI: (callback) => {
    electron.ipcRenderer.on("load-file-from-cli", (_event, data) => callback(data));
  },
  // 外部リンクを開く
  openExternal: (url) => electron.ipcRenderer.invoke("open-external", url)
});
