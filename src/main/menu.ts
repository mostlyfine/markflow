import type { BrowserWindow, MenuItemConstructorOptions } from 'electron';

export type MainWindowProvider = () => BrowserWindow | null;

export function buildMenuTemplate(
  getMainWindow: MainWindowProvider,
  quitApplication: () => void,
  platform: NodeJS.Platform = process.platform,
): MenuItemConstructorOptions[] {
  const sendToRenderer = (channel: string): void => {
    const targetWindow = getMainWindow();
    if (targetWindow) {
      targetWindow.webContents.send(channel);
    }
  };

  const isMac = platform === 'darwin';

  const template: MenuItemConstructorOptions[] = [];

  if (isMac) {
    template.push({
      role: 'appMenu',
      submenu: [
        { role: 'about', label: 'MarkFlowについて' },
        { type: 'separator' },
        {
          label: '設定...',
          accelerator: 'CmdOrCtrl+,',
          click: () => sendToRenderer('toggle-settings'),
        },
        { type: 'separator' },
        { role: 'hide', label: 'MarkFlowを隠す' },
        { role: 'hideOthers', label: 'ほかを隠す' },
        { role: 'unhide', label: 'すべてを表示' },
        { type: 'separator' },
        { role: 'quit', label: 'MarkFlow を終了' },
      ],
    });
  }

  template.push(
    {
      label: 'ファイル',
      submenu: [
        {
          label: 'ファイルを開く...',
          accelerator: 'CmdOrCtrl+O',
          click: () => sendToRenderer('trigger-file-open'),
        },
        {
          label: 'ファイルを再読み込み',
          accelerator: 'CmdOrCtrl+R',
          click: () => sendToRenderer('trigger-file-reload'),
        },
        { type: 'separator' },
        ...(!isMac
          ? [{
            label: '終了',
            accelerator: 'CmdOrCtrl+Q',
            click: () => quitApplication(),
          }]
          : []),
      ],
    },
    {
      label: '表示',
      submenu: [
        {
          label: '設定...',
          accelerator: 'CmdOrCtrl+,',
          click: () => sendToRenderer('toggle-settings'),
        },
        { type: 'separator' },
        { role: 'toggleDevTools', label: '開発者ツール' },
        { type: 'separator' },
        { role: 'resetZoom', label: '実際のサイズ' },
        { role: 'zoomIn', label: '拡大' },
        { role: 'zoomOut', label: '縮小' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: 'フルスクリーン' },
      ],
    },
    {
      label: '編集',
      submenu: [
        { role: 'undo', label: '元に戻す' },
        { role: 'redo', label: 'やり直す' },
        { type: 'separator' },
        { role: 'cut', label: '切り取り' },
        { role: 'copy', label: 'コピー' },
        { role: 'paste', label: '貼り付け' },
        { role: 'selectAll', label: 'すべて選択' },
      ],
    },
  );

  const cleanSubmenu = (
    items: (MenuItemConstructorOptions | undefined)[],
  ): MenuItemConstructorOptions[] => {
    const pruned = items.filter(
      (item): item is MenuItemConstructorOptions => Boolean(item),
    );

    const cleaned: MenuItemConstructorOptions[] = [];
    for (const entry of pruned) {
      if (entry.type === 'separator') {
        if (cleaned.length === 0) continue; // skip leading separator
        if (cleaned[cleaned.length - 1]?.type === 'separator') continue; // skip duplicate
      }
      cleaned.push(entry);
    }

    while (cleaned.at(-1)?.type === 'separator') {
      cleaned.pop(); // remove trailing separator
    }

    return cleaned;
  };

  return template.map((item) => {
    if (Array.isArray(item.submenu)) {
      return { ...item, submenu: cleanSubmenu(item.submenu as (MenuItemConstructorOptions | undefined)[]) };
    }
    return item;
  });
}
