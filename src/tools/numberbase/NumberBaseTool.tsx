import { useMemo, useState } from 'react';

export type Base = 2 | 8 | 10 | 16;

const BASE_ORDER: Base[] = [2, 8, 10, 16];

const BASE_META: Record<Base, { label: string; prefix: string; chars: RegExp }> = {
  2: { label: 'Binary', prefix: '0b', chars: /^[01]+$/ },
  8: { label: 'Octal', prefix: '0o', chars: /^[0-7]+$/ },
  10: { label: 'Decimal', prefix: '', chars: /^[0-9]+$/ },
  16: { label: 'Hex', prefix: '0x', chars: /^[0-9a-fA-F]+$/ },
};

export type InputMode = 'auto' | Base;

interface Parsed {
  value: bigint;
  negative: boolean;
}
type ParseResult = { ok: true; parsed: Parsed } | { ok: false; error: string };

export function detectBase(trimmed: string): Base {
  const lower = trimmed.toLowerCase();
  if (lower.startsWith('0x')) return 16;
  if (lower.startsWith('0b')) return 2;
  if (lower.startsWith('0o')) return 8;
  return 10;
}

export function parseInput(raw: string, mode: InputMode): ParseResult {
  const trimmed = raw.trim();
  if (trimmed === '') return { ok: false, error: '' };

  // Allow leading sign.
  const negative = trimmed.startsWith('-');
  const body = (negative || trimmed.startsWith('+') ? trimmed.slice(1) : trimmed).trim();
  if (body === '') return { ok: false, error: 'Missing digits after sign.' };

  const base = mode === 'auto' ? detectBase(body) : mode;
  // Strip prefix if present and the detected/selected base matches.
  let digits = body;
  const lower = digits.toLowerCase();
  if (base === 16 && lower.startsWith('0x')) digits = digits.slice(2);
  else if (base === 2 && lower.startsWith('0b')) digits = digits.slice(2);
  else if (base === 8 && lower.startsWith('0o')) digits = digits.slice(2);

  // Allow underscores as digit separators for readability (e.g. 1_000_000).
  digits = digits.replace(/_/g, '');

  if (digits === '') return { ok: false, error: 'No digits provided.' };
  if (!BASE_META[base].chars.test(digits)) {
    return { ok: false, error: `Invalid digit for ${BASE_META[base].label.toLowerCase()}.` };
  }

  try {
    const value = BigInt(`${base === 10 ? '' : BASE_META[base].prefix}${digits}`);
    return { ok: true, parsed: { value, negative } };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

export function format(parsed: Parsed, base: Base): string {
  const sign = parsed.negative ? '-' : '';
  return sign + parsed.value.toString(base);
}

export default function NumberBaseTool() {
  const [input, setInput] = useState('42');
  const [mode, setMode] = useState<InputMode>('auto');

  const parsed = useMemo(() => parseInput(input, mode), [input, mode]);

  const copy = (value: string) => navigator.clipboard.writeText(value);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 12 }}>
      <section className="pane">
        <div className="pane-header">
          <span>Input</span>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <label style={{ fontSize: 12, color: 'var(--text-dim)' }}>Treat as</label>
            <select
              value={mode}
              onChange={(e) => {
                const v = e.target.value;
                setMode(v === 'auto' ? 'auto' : (Number(v) as Base));
              }}
              style={{
                background: 'var(--bg-elev-2)',
                color: 'var(--text)',
                border: '1px solid var(--border)',
                borderRadius: 4,
                padding: '2px 6px',
                fontSize: 12,
              }}
            >
              <option value="auto">Auto (detect 0x/0b/0o prefixes)</option>
              <option value="2">Binary</option>
              <option value="8">Octal</option>
              <option value="10">Decimal</option>
              <option value="16">Hex</option>
            </select>
          </div>
        </div>
        <div
          className="pane-body"
          style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 8 }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
            placeholder="e.g. 42, 0xff, 0b1010, 0o755, -100"
            style={{
              flex: 1,
              background: 'transparent',
              color: 'var(--text)',
              border: 'none',
              outline: 'none',
              fontFamily: 'ui-monospace, monospace',
              fontSize: 15,
            }}
          />
        </div>
      </section>

      <section className="pane" style={{ flex: 1, minHeight: 0 }}>
        <div className="pane-header">
          <span>Representations</span>
        </div>
        <div className="pane-body">
          {!parsed.ok ? (
            <div className={input.trim() === '' ? 'muted' : 'error'} style={{ fontSize: 13 }}>
              {input.trim() === '' ? 'Enter a number.' : parsed.error}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {BASE_ORDER.map((b) => {
                const text = format(parsed.parsed, b);
                const display = BASE_META[b].prefix + text.replace(/^-/, '');
                const withSign = text.startsWith('-') ? '-' + display : display;
                return (
                  <div key={b}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: 4,
                      }}
                    >
                      <span className="muted" style={{ fontSize: 12, fontWeight: 600 }}>
                        {BASE_META[b].label} (base {b})
                      </span>
                      <button
                        style={{
                          background: 'var(--bg-elev-2)',
                          border: '1px solid var(--border)',
                          color: 'var(--text)',
                          padding: '2px 8px',
                          borderRadius: 4,
                          fontSize: 11,
                        }}
                        onClick={() => copy(withSign)}
                      >
                        Copy
                      </button>
                    </div>
                    <pre
                      style={{
                        background: 'var(--bg-elev-2)',
                        padding: 8,
                        borderRadius: 6,
                        fontSize: 13,
                        wordBreak: 'break-all',
                        whiteSpace: 'pre-wrap',
                        margin: 0,
                      }}
                    >
                      {withSign}
                    </pre>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <div className="status-bar">
        <span>Supports BigInt — any integer length.</span>
        <span>•</span>
        <span>Underscores allowed as digit separators (e.g. 1_000_000).</span>
      </div>
    </div>
  );
}
