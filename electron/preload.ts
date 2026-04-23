import { contextBridge, ipcRenderer } from 'electron';

type SavePdfResult =
  | { ok: true; path: string }
  | { ok: false; canceled: true };

const api = {
  readDoc: (docId: string): Promise<string> =>
    ipcRenderer.invoke('docs:read', docId),
  listDocs: (): Promise<string[]> => ipcRenderer.invoke('docs:list'),
  onOpenHelp: (handler: (docId: string) => void) => {
    const listener = (_e: unknown, docId: string) => handler(docId);
    ipcRenderer.on('help:open', listener);
    return () => ipcRenderer.removeListener('help:open', listener);
  },
  savePdf: (defaultFilename?: string): Promise<SavePdfResult> =>
    ipcRenderer.invoke('pdf:save', defaultFilename),
};

contextBridge.exposeInMainWorld('devtools', api);

export type DevtoolsApi = typeof api;
