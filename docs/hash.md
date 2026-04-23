# Hash Generator

Compute cryptographic hashes of text locally.

## How to use

1. Type or paste text into the **Input** pane.
2. The **Hashes** pane shows MD5, SHA-1, SHA-256, SHA-384, and SHA-512 hashes, updated live as you type.
3. Click **Copy** next to any hash to copy it to your clipboard.

## Algorithms

| Algorithm | Output length | Common uses |
|-----------|---------------|-------------|
| **MD5** | 32 hex chars (128 bits) | Legacy checksums, file integrity. *Not cryptographically secure.* |
| **SHA-1** | 40 hex chars (160 bits) | Git object hashing, legacy systems. Deprecated for security. |
| **SHA-256** | 64 hex chars (256 bits) | General-purpose modern hashing, Bitcoin, certificates. |
| **SHA-384** | 96 hex chars (384 bits) | Higher-assurance contexts, TLS 1.3. |
| **SHA-512** | 128 hex chars (512 bits) | Maximum-strength needs, password derivation (with a KDF). |

## Implementation notes

- SHA-* hashes use the browser's built-in **Web Crypto API** (`crypto.subtle.digest`) — no JavaScript fallback needed.
- MD5 is computed via `js-md5` because MD5 is not in the Web Crypto standard (for good reason — it's broken for security-critical use).

## Actions

| Button | What it does |
|--------|--------------|
| **Sample** | Load a classic pangram to verify against well-known reference hashes. |
| **Clear** | Empty the input. |
| **Copy** (per algorithm) | Copy that algorithm's hash to the clipboard. |

## Important

- **Don't use MD5 or SHA-1 for security.** Both have practical collision attacks. Use SHA-256 or better.
- **Don't hash passwords directly** with any of these. For passwords, use a real key-derivation function: bcrypt, Argon2, or scrypt. These hashes are too fast for password storage.

## Privacy

All hashing happens locally. Input text never leaves your machine.
