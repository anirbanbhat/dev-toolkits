import { describe, it, expect, vi } from 'vitest';
import {
  base64UrlDecode,
  decodeSection,
  decode,
  describeExpiry,
  formatRelative,
} from './JwtTool';

// Known-good JWT (HS256) with header {alg:HS256,typ:JWT} and payload
// {sub:"abc",name:"Jane",iat:1,exp:9999999999}. Signature is a placeholder.
const VALID_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhYmMiLCJuYW1lIjoiSmFuZSIsImlhdCI6MSwiZXhwIjo5OTk5OTk5OTk5fQ.signature';

describe('base64UrlDecode', () => {
  it('decodes a standard base64url segment', () => {
    // "Hello, World!" base64url-encoded.
    expect(base64UrlDecode('SGVsbG8sIFdvcmxkIQ')).toBe('Hello, World!');
  });

  it('handles padding omitted in base64url', () => {
    // "Hi" needs one '=' in classic base64 but none in base64url.
    expect(base64UrlDecode('SGk')).toBe('Hi');
  });

  it('handles url-safe chars (- and _)', () => {
    // "abc??" contains chars that map to - and _ in url-safe base64.
    const enc = Buffer.from('??abc').toString('base64url');
    expect(base64UrlDecode(enc)).toBe('??abc');
  });

  it('decodes UTF-8 multibyte characters', () => {
    const enc = Buffer.from('héllo ✨').toString('base64url');
    expect(base64UrlDecode(enc)).toBe('héllo ✨');
  });
});

describe('decodeSection', () => {
  it('returns parsed JSON for a valid segment', () => {
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
    const result = decodeSection(header);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.json).toEqual({ alg: 'HS256', typ: 'JWT' });
  });

  it('returns error for malformed input', () => {
    const result = decodeSection('not-valid-base64-or-json');
    expect(result.ok).toBe(false);
  });

  it('returns error for missing input', () => {
    const result = decodeSection(undefined);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/missing/i);
  });
});

describe('decode', () => {
  it('returns null for empty input', () => {
    expect(decode('')).toBeNull();
    expect(decode('   ')).toBeNull();
  });

  it('rejects strings that are not dot-separated', () => {
    const result = decode('notajwt');
    expect(result).not.toBeNull();
    expect(result?.header.ok).toBe(false);
  });

  it('decodes a full JWT into header, payload, signature', () => {
    const result = decode(VALID_JWT);
    expect(result).not.toBeNull();
    expect(result?.header.ok).toBe(true);
    expect(result?.payload.ok).toBe(true);
    expect(result?.signature).toBe('signature');
    if (result?.header.ok) {
      expect(result.header.json).toEqual({ alg: 'HS256', typ: 'JWT' });
    }
    if (result?.payload.ok) {
      expect(result.payload.json).toMatchObject({ sub: 'abc', name: 'Jane' });
    }
  });

  it('trims whitespace around the token', () => {
    const result = decode(`  ${VALID_JWT}\n`);
    expect(result?.header.ok).toBe(true);
    expect(result?.payload.ok).toBe(true);
  });

  it('handles a two-part token (no signature yet)', () => {
    const parts = VALID_JWT.split('.');
    const twoPart = `${parts[0]}.${parts[1]}`;
    const result = decode(twoPart);
    expect(result?.header.ok).toBe(true);
    expect(result?.payload.ok).toBe(true);
    expect(result?.signature).toBe('');
  });
});

describe('describeExpiry', () => {
  it('returns null when payload has no exp claim', () => {
    expect(describeExpiry({ sub: 'abc' })).toBeNull();
    expect(describeExpiry(null)).toBeNull();
    expect(describeExpiry('not-an-object')).toBeNull();
  });

  it('marks tokens expired in the past', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-15T12:00:00Z'));
    const past = Math.floor(new Date('2026-01-15T11:00:00Z').getTime() / 1000);
    const result = describeExpiry({ exp: past });
    expect(result?.tone).toBe('err');
    expect(result?.label).toMatch(/expired/i);
    vi.useRealTimers();
  });

  it('marks tokens still valid when exp is in the future', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-15T12:00:00Z'));
    const future = Math.floor(new Date('2026-01-16T12:00:00Z').getTime() / 1000);
    const result = describeExpiry({ exp: future });
    expect(result?.tone).toBe('ok');
    expect(result?.label).toMatch(/expires in/i);
    vi.useRealTimers();
  });
});

describe('formatRelative', () => {
  it('formats seconds, minutes, hours, days', () => {
    expect(formatRelative(30)).toBe('30s');
    expect(formatRelative(120)).toBe('2m');
    expect(formatRelative(3600)).toBe('1h');
    expect(formatRelative(86400 * 3)).toBe('3d');
  });

  it('handles negative inputs (absolute value)', () => {
    expect(formatRelative(-45)).toBe('45s');
  });
});
