import type { BrowserWindow, MenuItemConstructorOptions } from 'electron';
import { describe, it, expect, vi } from 'vitest';
import { buildMenuTemplate } from '../src/main/menu';

const normalizeSubmenu = (
  submenu: MenuItemConstructorOptions['submenu'],
): MenuItemConstructorOptions[] => {
  if (Array.isArray(submenu)) {
    return submenu as MenuItemConstructorOptions[];
  }
  return [];
};

describe('application menu', () => {
  it('excludes page reload menu entry', () => {
    const template = buildMenuTemplate(() => null, () => undefined, 'win32');
    const viewMenu = template.find((item) => item.label === '表示');
    const submenuItems = normalizeSubmenu(viewMenu?.submenu);

    const hasPageReload = submenuItems.some(
      (item) => item.role === 'forceReload' || item.label === 'ページを再読み込み',
    );

    expect(hasPageReload).toBe(false);
  });

  it('keeps file reload shortcut on CmdOrCtrl+R', () => {
    const template = buildMenuTemplate(() => null, () => undefined, 'linux');
    const fileMenu = template.find((item) => item.label === 'ファイル');
    const submenuItems = normalizeSubmenu(fileMenu?.submenu);
    const reloadItem = submenuItems.find(
      (item) => item.label === 'ファイルを再読み込み',
    );

    expect(reloadItem?.accelerator).toBe('CmdOrCtrl+R');
  });

  it('sends toggle-settings to the renderer when selected in view menu', () => {
    const send = vi.fn();
    const fakeWindow = { webContents: { send } } as unknown as BrowserWindow;
    const template = buildMenuTemplate(() => fakeWindow, () => undefined, 'darwin');
    const viewMenu = template.find((item) => item.label === '表示');
    const submenuItems = normalizeSubmenu(viewMenu?.submenu);
    const toggleItem = submenuItems.find((item) => item.label === '設定...');

    expect(toggleItem).toBeTruthy();

    toggleItem?.click?.(toggleItem as never, fakeWindow, undefined);

    expect(send).toHaveBeenCalledWith('toggle-settings');
  });

  it('has Preferences in appMenu on mac and no duplicate in view menu', () => {
    const send = vi.fn();
    const fakeWindow = { webContents: { send } } as unknown as BrowserWindow;
    const template = buildMenuTemplate(() => fakeWindow, () => undefined, 'darwin');

    const appMenu = template.find((item) => item.role === 'appMenu');
    expect(appMenu).toBeTruthy();
    const appSubmenu = normalizeSubmenu(appMenu?.submenu);
    const prefItem = appSubmenu.find((item) => item.label === '設定...');
    expect(prefItem?.accelerator).toBe('CmdOrCtrl+,');

    prefItem?.click?.(prefItem as never, fakeWindow, undefined);
    expect(send).toHaveBeenCalledWith('toggle-settings');

    const viewMenu = template.find((item) => item.label === '表示');
    const viewSub = normalizeSubmenu(viewMenu?.submenu);
    const hasSettingsInView = viewSub.some((item) => item.label === '設定...');
    expect(hasSettingsInView).toBe(true);
  });
});
