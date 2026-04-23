# JWT Decoder

Decode a JSON Web Token into its header and payload, see expiry status, and inspect the signature — all locally. Nothing is ever sent over the network.

## How to use

1. Paste a JWT into the **left pane**. A JWT looks like `xxxxx.yyyyy.zzzzz` — three base64url-encoded segments separated by dots.
2. The **right pane** shows the decoded **header** and **payload** as formatted JSON, plus the raw signature string.
3. If the token has an `exp` (expiry) claim, the **status bar** at the bottom shows whether it's still valid and when it expires.

## Actions

| Button | What it does |
|--------|--------------|
| **Sample** | Load an example JWT to see the output format. |
| **Clear** | Empty the input. |

## What's decoded

- **Header** — usually contains `alg` (signing algorithm) and `typ` (always `"JWT"` in practice).
- **Payload** — the claims your application cares about: `sub`, `iat`, `exp`, `iss`, custom fields, etc.
- **Signature** — shown raw (base64url). **Not verified.** See below.

## Why we don't verify the signature

Verifying a JWT signature requires the **signing secret** (for HMAC algorithms like HS256) or the **public key** (for RS256/ES256). Asking users to paste secrets into any tool — even a local one — is a bad security habit.

If you need to verify a token, use a library in your actual codebase (`jsonwebtoken` for Node, `PyJWT` for Python, etc.) with the appropriate secret or JWKS endpoint.

## Privacy

All decoding happens locally in this app. Your tokens never leave your machine.
