import { app as o, BrowserWindow as i } from "electron";
import { fileURLToPath as l } from "url";
import { dirname as a, join as n } from "path";
const d = l(import.meta.url), t = a(d);
let e = null;
function r() {
  e = new i({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: n(t, "../preload/preload.js"),
      nodeIntegration: !1,
      contextIsolation: !0,
      sandbox: !0
    }
  }), process.env.VITE_DEV_SERVER_URL ? (e.loadURL(process.env.VITE_DEV_SERVER_URL), e.webContents.openDevTools()) : e.loadFile(n(t, "../../renderer/index.html")), e.on("closed", () => {
    e = null;
  });
}
o.whenReady().then(() => {
  r(), o.on("activate", () => {
    i.getAllWindows().length === 0 && r();
  });
});
o.on("window-all-closed", () => {
  process.platform !== "darwin" && o.quit();
});
