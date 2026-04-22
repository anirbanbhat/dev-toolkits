import { contextBridge, ipcRenderer } from 'electron';

const api = {
  readDoc: (docId: string): Promise<string> =>
    ipcRenderer.invoke('docs:read', docId),
  listDocs: (): Promise<string[]> => ipcRenderer.invoke('docs:list'),
  onOpenHelp: (handler: (docId: string) => void) => {
    const listener = (_e: unknown, docId: string) => handler(docId);
    ipcRenderer.on('help:open', listener);
    return () => ipcRenderer.removeListener('help:open', listener);
  },
};

contextBridge.exposeInMainWorld('devtools', api);

export type DevtoolsApi = typeof api;
