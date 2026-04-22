# Dev Toolkits

An open-source desktop toolkit of common developer utilities. One window, one sidebar, many tools — all running locally.

## Tools included

- **Mermaid Renderer** — render Mermaid diagrams from source, copy or download as SVG.
- **JSON Formatter** — format, minify, and validate JSON.

More tools coming. The architecture is plugin-style — see [docs/extending.md](docs/extending.md).

## Install

### macOS (`.dmg`)

Download the latest `.dmg` from the [Releases](https://github.com/anirbanbhat/dev-toolkits/releases) page and drag the app to `/Applications`.

### npm (cross-platform)

```bash
npm install -g dev-toolkits
dev-toolkits
```

This works on macOS, Windows, and Linux. The `dev-toolkits` command launches the app.

## Usage

- Pick a tool from the sidebar.
- Each tool has contextual actions in its header.
- Press **Cmd+?** (macOS) or **F1** (Windows/Linux), or click **? Help** in any tool, to open the in-app User Manual.
- The Help menu in the menu bar links directly to each tool's documentation.

## Develop

```bash
git clone https://github.com/anirbanbhat/dev-toolkits.git
cd dev-toolkits
npm install
npm run dev      # start in development mode
npm run build    # build production bundle
npm run package  # build .dmg / .exe / AppImage for the current OS
```

### Adding a tool

1. Create `src/tools/<name>/<Name>Tool.tsx` — a default-exported React component.
2. Register it in `src/tools/registry.ts`.
3. Write `docs/<id>.md`.

Full guide: [docs/extending.md](docs/extending.md).

## Tech stack

Electron · React 18 · TypeScript · Vite · electron-builder

## License

[MIT](LICENSE)
