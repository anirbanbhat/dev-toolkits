import { useCallback, useState } from 'react';
import { v4 as uuidv4, v7 as uuidv7 } from 'uuid';
import { ulid } from 'ulid';

export type Format = 'uuid-v4' | 'uuid-v7' | 'ulid';

const FORMAT_LABELS: Record<Format, string> = {
  'uuid-v4': 'UUID v4 (random)',
  'uuid-v7': 'UUID v7 (time-ordered)',
  ulid: 'ULID',
};

const COUNT_OPTIONS = [1, 5, 10, 25, 100];

export function generate(format: Format, count: number): string[] {
  const fn =
    format === 'uuid-v4' ? uuidv4 : format === 'uuid-v7' ? uuidv7 : ulid;
  return Array.from({ length: count }, () => fn());
}

export default function UuidTool() {
  const [format, setFormat] = useState<Format>('uuid-v4');
  const [count, setCount] = useState(5);
  const [ids, setIds] = useState<string[]>(() => generate('uuid-v4', 5));

  const regen = useCallback(() => {
    setIds(generate(format, count));
  }, [format, count]);

  const copyAll = () => navigator.clipboard.writeText(ids.join('\n'));
  const copyOne = (id: string) => navigator.clipboard.writeText(id);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 12 }}>
      <section className="pane">
        <div className="pane-header">
          <span>Options</span>
        </div>
        <div
          className="pane-body"
          style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}
        >
          <label style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: 13 }}>
            Format
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as Format)}
              style={{
                background: 'var(--bg-elev-2)',
                color: 'var(--text)',
                border: '1px solid var(--border)',
                borderRadius: 4,
                padding: '4px 8px',
                fontSize: 13,
              }}
            >
              {(Object.keys(FORMAT_LABELS) as Format[]).map((f) => (
                <option key={f} value={f}>
                  {FORMAT_LABELS[f]}
                </option>
              ))}
            </select>
          </label>

          <label style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: 13 }}>
            Count
            <select
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              style={{
                background: 'var(--bg-elev-2)',
                color: 'var(--text)',
                border: '1px solid var(--border)',
                borderRadius: 4,
                padding: '4px 8px',
                fontSize: 13,
              }}
            >
              {COUNT_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>

          <button
            onClick={regen}
            style={{
              background: 'var(--accent-dim)',
              border: '1px solid var(--accent)',
              color: 'var(--text)',
              padding: '6px 14px',
              borderRadius: 6,
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            Generate
          </button>
        </div>
      </section>

      <section className="pane" style={{ flex: 1 }}>
        <div className="pane-header">
          <span>Result ({ids.length})</span>
          <div className="pane-actions">
            <button onClick={copyAll} disabled={ids.length === 0}>
              Copy all
            </button>
          </div>
        </div>
        <div className="pane-body">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {ids.map((id, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '6px 8px',
                  background: 'var(--bg-elev-2)',
                  borderRadius: 4,
                  fontFamily: 'ui-monospace, monospace',
                  fontSize: 13,
                }}
              >
                <span style={{ flex: 1, wordBreak: 'break-all' }}>{id}</span>
                <button
                  style={{
                    background: 'var(--bg-elev)',
                    border: '1px solid var(--border)',
                    color: 'var(--text)',
                    padding: '2px 8px',
                    borderRadius: 4,
                    fontSize: 11,
                  }}
                  onClick={() => copyOne(id)}
                >
                  Copy
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
