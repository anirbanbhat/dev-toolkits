import { describe, it, expect } from 'vitest';
import { runRegex } from './RegexTool';

describe('runRegex', () => {
  it('returns no matches on empty pattern', () => {
    const r = runRegex('', '', 'some text');
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.matches).toEqual([]);
  });

  it('returns all matches with capture groups', () => {
    const r = runRegex('\\b(\\w+)@(\\w+\\.\\w+)\\b', 'g', 'a@b.c and x@y.z');
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.matches).toHaveLength(2);
      expect(r.matches[0].fullMatch).toBe('a@b.c');
      expect(r.matches[0].groups).toEqual(['a', 'b.c']);
      expect(r.matches[1].fullMatch).toBe('x@y.z');
      expect(r.matches[1].groups).toEqual(['x', 'y.z']);
    }
  });

  it('still iterates all matches even when the global flag is off', () => {
    // The tool forces `g` internally so you can see every match; flag toggle
    // is for user display only.
    const r = runRegex('foo', '', 'foo bar foo baz foo');
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.matches).toHaveLength(3);
  });

  it('respects the case-insensitive flag', () => {
    const withI = runRegex('hello', 'i', 'HELLO');
    expect(withI.ok).toBe(true);
    if (withI.ok) expect(withI.matches).toHaveLength(1);

    const withoutI = runRegex('hello', '', 'HELLO');
    expect(withoutI.ok).toBe(true);
    if (withoutI.ok) expect(withoutI.matches).toHaveLength(0);
  });

  it('tracks the starting index of each match', () => {
    const r = runRegex('cat', 'g', 'a cat, another cat');
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.matches[0].index).toBe(2);
      expect(r.matches[1].index).toBe(15);
    }
  });

  it('returns an error result for invalid regex', () => {
    const r = runRegex('(', '', 'text');
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/regular expression|syntax/i);
  });

  it('handles zero-length matches without infinite-looping', () => {
    const r = runRegex('a*', 'g', 'aa');
    expect(r.ok).toBe(true);
    // Shouldn't hang; we don't care about the exact count, just that it terminates.
    if (r.ok) expect(r.matches.length).toBeGreaterThan(0);
  });

  it('supports multi-line mode for anchors', () => {
    const withM = runRegex('^foo', 'm', 'bar\nfoo\nbar');
    expect(withM.ok).toBe(true);
    if (withM.ok) expect(withM.matches).toHaveLength(1);

    const withoutM = runRegex('^foo', '', 'bar\nfoo\nbar');
    expect(withoutM.ok).toBe(true);
    if (withoutM.ok) expect(withoutM.matches).toHaveLength(0);
  });
});
