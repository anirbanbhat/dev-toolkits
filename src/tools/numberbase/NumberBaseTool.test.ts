import { describe, it, expect } from 'vitest';
import { detectBase, parseInput, format } from './NumberBaseTool';

describe('detectBase', () => {
  it('detects hex from 0x prefix', () => {
    expect(detectBase('0xff')).toBe(16);
    expect(detectBase('0XAB')).toBe(16);
  });

  it('detects binary from 0b prefix', () => {
    expect(detectBase('0b1010')).toBe(2);
    expect(detectBase('0B101')).toBe(2);
  });

  it('detects octal from 0o prefix', () => {
    expect(detectBase('0o755')).toBe(8);
  });

  it('defaults to decimal with no prefix', () => {
    expect(detectBase('42')).toBe(10);
  });
});

describe('parseInput', () => {
  it('rejects empty input', () => {
    expect(parseInput('', 'auto').ok).toBe(false);
    expect(parseInput('   ', 'auto').ok).toBe(false);
  });

  it('parses decimal by default', () => {
    const r = parseInput('42', 'auto');
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.parsed.value).toBe(42n);
  });

  it('parses hex with 0x prefix', () => {
    const r = parseInput('0xff', 'auto');
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.parsed.value).toBe(255n);
  });

  it('parses binary with 0b prefix', () => {
    const r = parseInput('0b1010', 'auto');
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.parsed.value).toBe(10n);
  });

  it('parses octal with 0o prefix', () => {
    const r = parseInput('0o755', 'auto');
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.parsed.value).toBe(493n);
  });

  it('respects explicit base selection', () => {
    // "100" interpreted as hex = 256.
    const r = parseInput('100', 16);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.parsed.value).toBe(256n);
  });

  it('handles negative numbers', () => {
    const r = parseInput('-100', 'auto');
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.parsed.value).toBe(100n);
      expect(r.parsed.negative).toBe(true);
    }
  });

  it('allows underscore digit separators', () => {
    const r = parseInput('1_000_000', 'auto');
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.parsed.value).toBe(1_000_000n);
  });

  it('supports arbitrarily large integers (BigInt)', () => {
    const big = '123456789012345678901234567890';
    const r = parseInput(big, 'auto');
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.parsed.value).toBe(BigInt(big));
  });

  it('rejects digits outside the chosen base', () => {
    expect(parseInput('12', 2).ok).toBe(false); // 2 isn't a binary digit
    expect(parseInput('9', 8).ok).toBe(false); // 9 isn't octal
    expect(parseInput('0xgg', 'auto').ok).toBe(false);
  });
});

describe('format', () => {
  it('renders each base correctly', () => {
    const p = { value: 255n, negative: false };
    expect(format(p, 2)).toBe('11111111');
    expect(format(p, 8)).toBe('377');
    expect(format(p, 10)).toBe('255');
    expect(format(p, 16)).toBe('ff');
  });

  it('preserves sign', () => {
    const p = { value: 10n, negative: true };
    expect(format(p, 10)).toBe('-10');
    expect(format(p, 16)).toBe('-a');
  });

  it('handles zero', () => {
    const p = { value: 0n, negative: false };
    expect(format(p, 2)).toBe('0');
    expect(format(p, 16)).toBe('0');
  });
});
