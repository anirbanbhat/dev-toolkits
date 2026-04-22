# Extending DevTools Kit

Adding a new tool is a three-step process. The architecture is intentionally flat — there's no plugin manifest or lifecycle to learn.

## 1. Create the tool component

Add a file under `src/tools/<your-tool>/<YourTool>.tsx`. It is a regular React component that renders into the main panel.

```tsx
// src/tools/base64/Base64Tool.tsx
import { useState } from 'react';

export default function Base64Tool() {
  const [input, setInput] = useState('');
  const encoded = btoa(input);
  return (
    <div className="split">
      <textarea value={input} onChange={(e) => setInput(e.target.value)} />
      <pre>{encoded}</pre>
    </div>
  );
}
```

## 2. Register it

Open `src/tools/registry.ts` and add an entry to the `tools` array:

```ts
import Base64Tool from './base64/Base64Tool';

export const tools: Tool[] = [
  // ...existing tools
  {
    id: 'base64',
    name: 'Base64 Encoder',
    description: 'Encode and decode Base64 strings.',
    icon: 'B64',
    docId: 'base64',
    component: Base64Tool,
  },
];
```

The sidebar, tab switching, and Help button are all wired off this registry — no other UI changes needed.

## 3. Write the docs

Create `docs/base64.md`. Whatever `docId` you set in the registry must match the filename (without `.md`).

Optionally, add a Help menu shortcut in `electron/main.ts` so the tool's docs are reachable from the menu bar.

## Tool contract

```ts
interface Tool {
  id: string;          // unique, [a-z0-9-]
  name: string;        // shown in sidebar and toolbar
  description: string; // shown in toolbar subtitle and tooltip
  icon: string;        // 1–3 chars or emoji shown in sidebar
  docId: string;       // filename of the matching doc under docs/
  component: ComponentType;
}
```

## Style

Tools should reuse the shared classes in `src/index.css`:

- `.split` — two equal columns
- `.pane` / `.pane-header` / `.pane-body` / `.pane-actions` — bordered card with header
- `.code` — monospace textarea
- `.error` — red error block
- `.status-bar` — bottom-row status text

This keeps every tool visually consistent without each one re-styling.

## Pull requests welcome

If you'd like your tool included in the main release, open a PR. Please include the docs and a short description of when the tool is useful.
