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
npm run package  # build .dmg (macOS) or .exe (Windows)
```

### Adding a tool

1. Create `src/tools/<name>/<Name>Tool.tsx` — a default-exported React component.
2. Register it in `src/tools/registry.ts`.
3. Write `docs/<id>.md`.

Full guide: [docs/extending.md](docs/extending.md).

## Tech stack

Electron · React 18 · TypeScript · Vite · electron-builder

## Release automation

Every push to `main` triggers `.github/workflows/release.yml`, which:

1. Bumps the patch version (`x.y.z` → `x.y.(z+1)`) and pushes a commit + tag.
2. Builds `.dmg` (macOS) and `.exe` (Windows) in parallel. Linux is not built; Linux users can install via `npm install -g dev-toolkits`.
3. Publishes the same version to npm.
4. Creates a GitHub Release for the tag with all binaries attached.

The npm package version and the GitHub release tag are always identical — they both come from the same version-bump commit.

### One-time setup

**Required secret:** `NPM_TOKEN`

1. Generate a granular access token at https://www.npmjs.com/settings/~/tokens with:
   - **Packages and scopes:** read/write, scoped to `dev-toolkits`
   - **Bypass 2FA for publishing:** enabled
2. In the GitHub repo, go to **Settings → Secrets and variables → Actions → New repository secret**.
3. Name: `NPM_TOKEN`, Value: the token from step 1.

`GITHUB_TOKEN` is provided automatically — no setup needed.

### Skipping a release

If you push a commit to `main` that shouldn't trigger a release (docs tweak, CI fix, etc.), include `[skip release]` anywhere in the commit message.

## Support

Dev Toolkits is built and maintained in spare time. If you find it useful, two ways to support it:

- **GitHub Sponsors** → https://github.com/sponsors/anirbanbhat (one-time or recurring; same place as the **Sponsor** button at the top of this repo)
- **Polar** → https://polar.sh/devsoft-inc (one-time or recurring, alternative platform)

Both feed back into time spent on new tools and bug fixes. Thank you.
