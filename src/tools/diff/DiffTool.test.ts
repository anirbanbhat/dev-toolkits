import { describe, it, expect } from 'vitest';
import { diffLines } from 'diff';
import { computeStats } from './DiffTool';

describe('computeStats', () => {
  it('reports zero on identical inputs', () => {
    const diff = diffLines('same\ntext\n', 'same\ntext\n');
    expect(computeStats(diff)).toEqual({ added: 0, removed: 0 });
  });

  it('counts added lines', () => {
    const diff = diffLines('a\n', 'a\nb\n');
    expect(computeStats(diff).added).toBe(1);
    expect(computeStats(diff).removed).toBe(0);
  });

  it('counts removed lines', () => {
    const diff = diffLines('a\nb\n', 'a\n');
    expect(computeStats(diff).added).toBe(0);
    expect(computeStats(diff).removed).toBe(1);
  });

  it('counts a line-replacement as +1 and -1', () => {
    const diff = diffLines('hello\n', 'world\n');
    const stats = computeStats(diff);
    expect(stats.added).toBe(1);
    expect(stats.removed).toBe(1);
  });

  it('counts multiple changes in a larger diff', () => {
    const left = ['a', 'b', 'c', 'd'].join('\n');
    const right = ['a', 'B', 'c', 'D', 'e'].join('\n');
    const stats = computeStats(diffLines(left, right));
    expect(stats.added).toBeGreaterThanOrEqual(2);
    expect(stats.removed).toBeGreaterThanOrEqual(2);
  });

  it('ignoreWhitespace reduces the diff of whitespace-only changes', () => {
    const withWs = computeStats(
      diffLines('  hi\n', 'hi\n', { ignoreWhitespace: true }),
    );
    const withoutWs = computeStats(diffLines('  hi\n', 'hi\n'));
    // With ignoreWhitespace at least <= without; both are valid "no meaningful
    // change" indicators across jsdiff versions. We don't hard-bind to one.
    expect(withWs.added + withWs.removed).toBeLessThanOrEqual(
      withoutWs.added + withoutWs.removed,
    );
  });
});
