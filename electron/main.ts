import { app, BrowserWindow, Menu, ipcMain, shell, dialog } from 'electron';
import path from 'node:path';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

// Must be set before `app` emits 'ready'. Without this, raw-binary launches
// (e.g. via the npm bin) show "Electron" in the macOS menu bar, because the
// default comes from Electron's own .app bundle CFBundleName.
app.setName('Dev Toolkits');

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// In dev, Vite serves the renderer; in prod we load from the built dist.
const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL;

// Docs ship in two places: inside the project during dev, and in resources/docs
// in production (declared under extraResources in package.json build config).
const DOCS_DIR = app.isPackaged
  ? path.join(process.resourcesPath, 'docs')
  : path.join(__dirname, '..', 'docs');

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 500,
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
    mainWindow?.focus();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function openHelpDoc(docId: string) {
  if (!mainWindow) return;
  mainWindow.webContents.send('help:open', docId);
}

function buildMenu() {
  const isMac = process.platform === 'darwin';

  const template: Electron.MenuItemConstructorOptions[] = [
    ...(isMac
      ? [
          {
            label: app.name,
            submenu: [
              { role: 'about' as const },
              { type: 'separator' as const },
              { role: 'services' as const },
              { type: 'separator' as const },
              { role: 'hide' as const },
              { role: 'hideOthers' as const },
              { role: 'unhide' as const },
              { type: 'separator' as const },
              { role: 'quit' as const },
            ],
          },
        ]
      : []),
    {
      label: 'File',
      submenu: [isMac ? { role: 'close' } : { role: 'quit' }],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' },
      ],
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'User Manual',
          accelerator: isMac ? 'Cmd+?' : 'F1',
          click: () => openHelpDoc('index'),
        },
        {
          label: 'Mermaid Renderer — Docs',
          click: () => openHelpDoc('mermaid'),
        },
        {
          label: 'JSON Formatter — Docs',
          click: () => openHelpDoc('json-formatter'),
        },
        {
          label: 'JWT Decoder — Docs',
          click: () => openHelpDoc('jwt'),
        },
        {
          label: 'Hash Generator — Docs',
          click: () => openHelpDoc('hash'),
        },
        {
          label: 'Regex Tester — Docs',
          click: () => openHelpDoc('regex'),
        },
        {
          label: 'UUID / ULID Generator — Docs',
          click: () => openHelpDoc('uuid'),
        },
        {
          label: 'Cron Explainer — Docs',
          click: () => openHelpDoc('cron'),
        },
        {
          label: 'Diff Viewer — Docs',
          click: () => openHelpDoc('diff'),
        },
        {
          label: 'JSON / YAML / CSV — Docs',
          click: () => openHelpDoc('convert'),
        },
        {
          label: 'Markdown Viewer — Docs',
          click: () => openHelpDoc('markdown'),
        },
        {
          label: 'Number Base Converter — Docs',
          click: () => openHelpDoc('numberbase'),
        },
        { type: 'separator' },
        {
          label: 'Report an Issue',
          click: () =>
            shell.openExternal('https://github.com/anirbanbhat/dev-toolkits/issues'),
        },
        {
          label: 'About Dev Toolkits',
          click: () => openHelpDoc('about'),
        },
      ],
    },
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

// IPC: renderer asks for a doc by id, main reads it from disk.
ipcMain.handle('docs:read', async (_event, docId: string) => {
  // Whitelist doc ids to prevent path traversal.
  if (!/^[a-z0-9-]+$/i.test(docId)) {
    throw new Error(`Invalid doc id: ${docId}`);
  }
  const filePath = path.join(DOCS_DIR, `${docId}.md`);
  return await readFile(filePath, 'utf8');
});

ipcMain.handle('docs:list', async () => {
  const entries = await readdir(DOCS_DIR);
  return entries
    .filter((name) => name.endsWith('.md'))
    .map((name) => name.replace(/\.md$/, ''));
});

// Save the current window's contents as a PDF via a native save dialog.
// The renderer is expected to toggle any "printing" class it wants applied
// before calling this; printToPDF respects @media print styles.
ipcMain.handle(
  'pdf:save',
  async (event, defaultFilename: string = 'document.pdf') => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (!win) throw new Error('No owning window for the request.');

    const { filePath, canceled } = await dialog.showSaveDialog(win, {
      defaultPath: defaultFilename,
      filters: [{ name: 'PDF', extensions: ['pdf'] }],
    });
    if (canceled || !filePath) return { ok: false as const, canceled: true };

    const data = await win.webContents.printToPDF({
      pageSize: 'Letter',
      printBackground: true,
      margins: { marginType: 'default' },
    });
    await writeFile(filePath, data);
    return { ok: true as const, path: filePath };
  },
);

app.whenReady().then(async () => {
  // When launched as a raw binary from a terminal (e.g. via the npm bin
  // launcher), macOS defaults the process to agent-mode: no dock icon and no
  // focus stealing, so the window opens invisibly. Force regular-app mode.
  if (process.platform === 'darwin') {
    app.setActivationPolicy?.('regular');
    await app.dock?.show();
  }

  buildMenu();
  createWindow();
  app.focus({ steal: true });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
