# About Dev Toolkits

Dev Toolkits is a desktop toolkit of common developer utilities, packaged as both a native app (`.dmg` / `.exe`) and an npm-installable CLI.

## Why

Developers reach for the same handful of small tools over and over — diagram renderers, formatters, encoders. Most live as standalone websites that send your data to a third party. Dev Toolkits collects them in one offline-first desktop app.

## Principles

- **Offline-first.** Every tool runs locally. Nothing you paste is sent over the network.
- **One app, many tools.** A single window — no juggling tabs.
- **Easy to extend.** Adding a tool is one component file plus one registry entry. See **Extending**.

## Tech stack

- **Electron** for the desktop shell.
- **React + TypeScript** for the UI.
- **Vite** for development and bundling.
- **electron-builder** for `.dmg` / `.exe` packaging.
