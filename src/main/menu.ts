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
        { role: 'about', label: 'About MarkFlow' },
        { type: 'separator' },
        {
          label: 'Preferences...',
          accelerator: 'CmdOrCtrl+,',
          click: () => sendToRenderer('toggle-settings'),
        },
        { type: 'separator' },
        { role: 'hide', label: 'Hide MarkFlow' },
        { role: 'hideOthers', label: 'Hide Others' },
        { role: 'unhide', label: 'Show All' },
        { type: 'separator' },
        { role: 'quit', label: 'Quit MarkFlow' },
      ],
    });
  }

  template.push(
    {
      label: 'File',
      submenu: [
        {
          label: 'Open File...',
          accelerator: 'CmdOrCtrl+O',
          click: () => sendToRenderer('trigger-file-open'),
        },
        {
          label: 'Reload File',
          accelerator: 'CmdOrCtrl+R',
          click: () => sendToRenderer('trigger-file-reload'),
        },
        { type: 'separator' },
        ...(!isMac
          ? [{
            label: 'Quit',
            accelerator: 'CmdOrCtrl+Q',
            click: () => quitApplication(),
          }]
          : []),
      ],
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Settings...',
          accelerator: 'CmdOrCtrl+,',
          click: () => sendToRenderer('toggle-settings'),
        },
        { type: 'separator' },
        { role: 'toggleDevTools', label: 'Developer Tools' },
        { type: 'separator' },
        { role: 'resetZoom', label: 'Actual Size' },
        { role: 'zoomIn', label: 'Zoom In' },
        { role: 'zoomOut', label: 'Zoom Out' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: 'Full Screen' },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo', label: 'Undo' },
        { role: 'redo', label: 'Redo' },
        { type: 'separator' },
        { role: 'cut', label: 'Cut' },
        { role: 'copy', label: 'Copy' },
        { role: 'paste', label: 'Paste' },
        { role: 'selectAll', label: 'Select All' },
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
