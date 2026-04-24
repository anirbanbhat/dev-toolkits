import { describe, it, expect } from 'vitest';
import { generate } from './UuidTool';

const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const UUID_V7 = /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const ULID = /^[0-9A-HJ-KM-NP-TV-Z]{26}$/; // Crockford Base32, 26 chars.

describe('UUID/ULID generate', () => {
  it('returns the requested number of IDs', () => {
    expect(generate('uuid-v4', 5)).toHaveLength(5);
    expect(generate('uuid-v7', 10)).toHaveLength(10);
    expect(generate('ulid', 25)).toHaveLength(25);
  });

  it('returns zero IDs when count is 0', () => {
    expect(generate('uuid-v4', 0)).toEqual([]);
  });

  it('emits UUID v4 matching the spec shape', () => {
    for (const id of generate('uuid-v4', 20)) {
      expect(id).toMatch(UUID_V4);
    }
  });

  it('emits UUID v7 with version=7 nibble', () => {
    for (const id of generate('uuid-v7', 20)) {
      expect(id).toMatch(UUID_V7);
    }
  });

  it('emits ULIDs matching Crockford Base32 / 26 chars', () => {
    for (const id of generate('ulid', 20)) {
      expect(id).toMatch(ULID);
    }
  });

  it('produces unique IDs across a batch', () => {
    const ids = generate('uuid-v4', 100);
    expect(new Set(ids).size).toBe(100);
  });

  it('UUID v7 values are time-sortable when generated sequentially', () => {
    // UUID v7 puts a ms timestamp in the first 48 bits, so lexicographic
    // order matches generation order at ms granularity or coarser.
    const ids = generate('uuid-v7', 5);
    const sorted = [...ids].sort();
    // Allow equality (same ms) but not inversion.
    expect(ids).toEqual(sorted);
  });
});
