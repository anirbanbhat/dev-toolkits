import '@testing-library/jest-dom/vitest';
import { webcrypto } from 'node:crypto';

// jsdom doesn't expose SubtleCrypto. Polyfill from Node so the hash tool's
// crypto.subtle.digest() calls work under test.
if (!globalThis.crypto) {
  Object.defineProperty(globalThis, 'crypto', {
    value: webcrypto,
    configurable: true,
  });
}
