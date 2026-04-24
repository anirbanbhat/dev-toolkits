import { describe, it, expect } from 'vitest';
import { parseSource, serialize, convert } from './ConvertTool';

const jsonSample = '[{"a":1,"b":"x"},{"a":2,"b":"y"}]';
const yamlSample = '- a: 1\n  b: x\n- a: 2\n  b: y\n';
const csvSample = 'a,b\n1,x\n2,y\n';

describe('parseSource', () => {
  it('parses JSON arrays', () => {
    expect(parseSource(jsonSample, 'json')).toEqual([
      { a: 1, b: 'x' },
      { a: 2, b: 'y' },
    ]);
  });

  it('parses YAML lists', () => {
    expect(parseSource(yamlSample, 'yaml')).toEqual([
      { a: 1, b: 'x' },
      { a: 2, b: 'y' },
    ]);
  });

  it('parses CSV with header row', () => {
    expect(parseSource(csvSample, 'csv')).toEqual([
      { a: 1, b: 'x' },
      { a: 2, b: 'y' },
    ]);
  });

  it('throws on invalid JSON', () => {
    expect(() => parseSource('{not:"json"}', 'json')).toThrow();
  });

  it('returns null for whitespace-only input', () => {
    expect(parseSource('   \n', 'json')).toBeNull();
  });
});

describe('serialize', () => {
  const data = [{ a: 1, b: 'x' }];

  it('serializes to pretty JSON', () => {
    const out = serialize(data, 'json');
    expect(JSON.parse(out)).toEqual(data);
    expect(out).toContain('\n');
    expect(out).toContain('  '); // 2-space indent
  });

  it('serializes to YAML', () => {
    const out = serialize(data, 'yaml');
    expect(out).toContain('a: 1');
    expect(out).toContain('b: x');
  });

  it('serializes to CSV with header', () => {
    const out = serialize(data, 'csv');
    // Papa's default line-terminator is \r\n; assert on the trimmed first line.
    expect(out.split(/\r?\n/)[0]).toBe('a,b');
    expect(out).toContain('1,x');
  });

  it('refuses CSV for non-array input', () => {
    expect(() => serialize({ a: 1 }, 'csv')).toThrow(/array of objects/i);
  });
});

describe('convert', () => {
  it('round-trips JSON → YAML → JSON cleanly', () => {
    const toYaml = convert(jsonSample, 'json', 'yaml');
    expect(toYaml.ok).toBe(true);
    if (!toYaml.ok) return;
    const back = convert(toYaml.output, 'yaml', 'json');
    expect(back.ok).toBe(true);
    if (back.ok) {
      expect(JSON.parse(back.output)).toEqual([
        { a: 1, b: 'x' },
        { a: 2, b: 'y' },
      ]);
    }
  });

  it('round-trips JSON → CSV → JSON with type coercion', () => {
    const toCsv = convert(jsonSample, 'json', 'csv');
    expect(toCsv.ok).toBe(true);
    if (!toCsv.ok) return;
    const back = convert(toCsv.output, 'csv', 'json');
    expect(back.ok).toBe(true);
    if (back.ok) {
      expect(JSON.parse(back.output)).toEqual([
        { a: 1, b: 'x' },
        { a: 2, b: 'y' },
      ]);
    }
  });

  it('same-format conversion normalizes formatting', () => {
    const messy = '{"b":"x","a":1}';
    const out = convert(messy, 'json', 'json');
    expect(out.ok).toBe(true);
    if (out.ok) {
      expect(JSON.parse(out.output)).toEqual({ b: 'x', a: 1 });
      expect(out.output).toContain('\n'); // pretty-printed
    }
  });

  it('returns a clear error for invalid input', () => {
    const r = convert('{ not json', 'json', 'yaml');
    expect(r.ok).toBe(false);
  });

  it('refuses nested JSON → CSV with a helpful error', () => {
    const nested = '{"a":{"b":1}}';
    const r = convert(nested, 'json', 'csv');
    expect(r.ok).toBe(false);
  });

  it('handles empty input', () => {
    const r = convert('', 'json', 'yaml');
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.output).toBe('');
  });
});
