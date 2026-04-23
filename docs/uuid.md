# UUID / ULID Generator

Generate unique identifiers in three formats. Useful for database primary keys, request correlation IDs, distributed systems, file names — anywhere you need something unique.

## How to use

1. Pick a **Format** from the dropdown.
2. Pick a **Count** (1, 5, 10, 25, or 100).
3. Click **Generate**.
4. Copy individual IDs with the per-row button, or all at once with **Copy all**.

## Formats

### UUID v4 (random)

128-bit, randomly generated. Example: `f47ac10b-58cc-4372-a567-0e02b2c3d479`.

- ✅ Zero coordination needed — collision odds are negligible (2⁻¹²² per ID).
- ✅ Universally supported.
- ❌ Random ordering — bad for database indexes (causes B-tree fragmentation).
- ❌ Gives away no information about when it was generated.

**Use when:** you need a unique ID that carries no time information and don't care about DB ordering.

### UUID v7 (time-ordered)

128-bit, first 48 bits are a Unix millisecond timestamp. Example: `018dc3f6-8c91-7a34-8a52-6b4c3e7e9f12`.

- ✅ Sortable — newer IDs sort after older ones.
- ✅ Friendly to database indexes.
- ✅ Still 74 bits of randomness — collision-safe.
- ❌ Slightly newer standard (RFC 9562, 2024); older SDKs may not recognize them.

**Use when:** you're generating IDs for database rows and want them to cluster by insertion time. Strongly preferred over UUID v1.

### ULID

128-bit, Crockford Base32 encoded (26 characters). Example: `01HKX2E4R9ZSQ6E7VJ8XG0P1YT`.

- ✅ Lexicographically sortable (timestamp first).
- ✅ URL-safe — no hyphens, no `+/=` padding.
- ✅ Shorter in text form than UUIDs (26 vs 36 characters).
- ❌ Less widely supported than UUIDs — not a database primary-key type in most engines.

**Use when:** you need a sortable ID that looks clean in URLs or logs. Newer systems often pick ULID for this reason.

## Implementation notes

- UUID v4 uses `crypto.randomUUID()` (built into every modern browser).
- UUID v7 uses the `uuid` npm package (RFC 9562 implementation).
- ULID uses the `ulid` npm package.

## Privacy

Generation happens entirely locally — your IDs never leave your machine.
