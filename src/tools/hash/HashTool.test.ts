import { describe, it, expect } from 'vitest';
import { bytesToHex, hash } from './HashTool';

describe('bytesToHex', () => {
  it('encodes a known byte pattern', () => {
    const buf = new Uint8Array([0x00, 0x0f, 0xaa, 0xff]).buffer;
    expect(bytesToHex(buf)).toBe('000faaff');
  });

  it('returns empty string for empty buffer', () => {
    expect(bytesToHex(new ArrayBuffer(0))).toBe('');
  });

  it('preserves leading zeros in each byte', () => {
    const buf = new Uint8Array([0x01, 0x02, 0x03]).buffer;
    expect(bytesToHex(buf)).toBe('010203');
  });
});

describe('hash', () => {
  // Reference values from the canonical pangram test vector.
  const text = 'The quick brown fox jumps over the lazy dog';

  it('produces the known MD5 of the pangram', async () => {
    expect(await hash(text, 'MD5')).toBe('9e107d9d372bb6826bd81d3542a419d6');
  });

  it('produces the known SHA-1 of the pangram', async () => {
    expect(await hash(text, 'SHA-1')).toBe('2fd4e1c67a2d28fced849ee1bb76e7391b93eb12');
  });

  it('produces the known SHA-256 of the pangram', async () => {
    expect(await hash(text, 'SHA-256')).toBe(
      'd7a8fbb307d7809469ca9abcb0082e4f8d5651e46d3cdb762d02d0bf37c9e592',
    );
  });

  it('produces the known SHA-512 of the pangram', async () => {
    expect(await hash(text, 'SHA-512')).toBe(
      '07e547d9586f6a73f73fbac0435ed76951218fb7d0c8d788a309d785436bbb642e93a252a954f23912547d1e8a3b5ed6e1bfd7097821233fa0538f3db854fee6',
    );
  });

  it('handles empty input (MD5)', async () => {
    expect(await hash('', 'MD5')).toBe('d41d8cd98f00b204e9800998ecf8427e');
  });

  it('handles UTF-8 input', async () => {
    const emoji = await hash('héllo ✨', 'SHA-256');
    // Sanity: SHA-256 is always 64 hex chars.
    expect(emoji).toMatch(/^[0-9a-f]{64}$/);
  });

  it('produces distinct outputs across algorithms', async () => {
    const md5 = await hash(text, 'MD5');
    const sha1 = await hash(text, 'SHA-1');
    const sha256 = await hash(text, 'SHA-256');
    expect(new Set([md5, sha1, sha256]).size).toBe(3);
  });
});
