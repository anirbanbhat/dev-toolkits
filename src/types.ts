import type { ComponentType } from 'react';

/**
 * A Tool is the unit of extension. To add a tool, drop a file in src/tools/*
 * that default-exports one of these and register it in src/tools/registry.ts.
 */
export interface Tool {
  id: string;
  name: string;
  description: string;
  /** Single emoji/glyph shown in the sidebar. */
  icon: string;
  /** Matches a filename under docs/ (without .md). */
  docId: string;
  component: ComponentType;
}

/** Bridge exposed by electron/preload.ts. */
declare global {
  interface Window {
    devtools: {
      readDoc: (docId: string) => Promise<string>;
      listDocs: () => Promise<string[]>;
      onOpenHelp: (handler: (docId: string) => void) => () => void;
    };
  }
}
