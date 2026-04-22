#!/usr/bin/env node
/* eslint-disable */
// Launcher used when Dev Toolkits is installed via `npm install -g dev-toolkits`.
// Spawns the local Electron binary against the project's main entry.
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

let electronPath;
try {
  electronPath = require('electron');
} catch (e) {
  console.error(
    'Electron binary not found. Try reinstalling: `npm install -g dev-toolkits`.',
  );
  process.exit(1);
}

const projectRoot = path.resolve(__dirname, '..');

const child = spawn(electronPath, [projectRoot], {
  stdio: 'inherit',
  windowsHide: false,
});

child.on('exit', (code) => process.exit(code ?? 0));
child.on('error', (err) => {
  console.error('Failed to launch Dev Toolkits:', err);
  process.exit(1);
});
