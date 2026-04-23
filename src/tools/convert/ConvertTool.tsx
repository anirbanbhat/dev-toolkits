import { useMemo, useState } from 'react';
import yaml from 'js-yaml';
import Papa from 'papaparse';

type Format = 'json' | 'yaml' | 'csv';

const FORMAT_LABELS: Record<Format, string> = {
  json: 'JSON',
  yaml: 'YAML',
  csv: 'CSV',
};

const SAMPLE: Record<Format, string> = {
  json: `[
  { "id": 1, "name": "Alice", "role": "admin" },
  { "id": 2, "name": "Bob", "role": "user" },
  { "id": 3, "name": "Charlie", "role": "user" }
]`,
  yaml: `- id: 1
  name: Alice
  role: admin
- id: 2
  name: Bob
  role: user
- id: 3
  name: Charlie
  role: user
`,
  csv: `id,name,role
1,Alice,admin
2,Bob,user
3,Charlie,user
`,
};

function parseSource(source: string, from: Format): unknown {
  if (source.trim() === '') return null;
  if (from === 'json') return JSON.parse(source);
  if (from === 'yaml') return yaml.load(source);
  // CSV: parse with headers; returns array of records.
  const result = Papa.parse<Record<string, string>>(source.trim(), {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true,
  });
  if (result.errors.length > 0) {
    throw new Error(result.errors[0].message);
  }
  return result.data;
}

function serialize(value: unknown, to: Format): string {
  if (to === 'json') return JSON.stringify(value, null, 2);
  if (to === 'yaml') return yaml.dump(value, { lineWidth: 120 });
  // CSV: require an array of flat objects.
  if (!Array.isArray(value)) {
    throw new Error('CSV output needs an array of objects at the top level.');
  }
  return Papa.unparse(value);
}

type ConvertResult =
  | { ok: true; output: string }
  | { ok: false; error: string };

function convert(source: string, from: Format, to: Format): ConvertResult {
  try {
    const parsed = parseSource(source, from);
    if (parsed === null) return { ok: true, output: '' };
    if (from === to) {
      // Still re-serialize so formatting is normalized.
      return { ok: true, output: serialize(parsed, to) };
    }
    return { ok: true, output: serialize(parsed, to) };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

export default function ConvertTool() {
  const [from, setFrom] = useState<Format>('json');
  const [to, setTo] = useState<Format>('yaml');
  const [input, setInput] = useState(SAMPLE.json);

  const result = useMemo(() => convert(input, from, to), [input, from, to]);

  const swap = () => {
    setFrom(to);
    setTo(from);
    if (result.ok) setInput(result.output);
  };

  const copy = () => {
    if (result.ok) navigator.clipboard.writeText(result.output);
  };

  const FormatPicker = ({
    value,
    onChange,
    id,
  }: {
    value: Format;
    onChange: (f: Format) => void;
    id: string;
  }) => (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value as Format)}
      style={{
        background: 'var(--bg-elev-2)',
        color: 'var(--text)',
        border: '1px solid var(--border)',
        borderRadius: 4,
        padding: '2px 6px',
        fontSize: 12,
      }}
    >
      {(Object.keys(FORMAT_LABELS) as Format[]).map((f) => (
        <option key={f} value={f}>
          {FORMAT_LABELS[f]}
        </option>
      ))}
    </select>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="split" style={{ flex: 1 }}>
        <section className="pane">
          <div className="pane-header">
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              From
              <FormatPicker id="from" value={from} onChange={setFrom} />
            </span>
            <div className="pane-actions">
              <button onClick={() => setInput(SAMPLE[from])}>Sample</button>
              <button onClick={() => setInput('')}>Clear</button>
            </div>
          </div>
          <div className="pane-body" style={{ padding: 0 }}>
            <textarea
              className="code"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              spellCheck={false}
              placeholder={`Paste ${FORMAT_LABELS[from]} here...`}
              style={{ padding: '12px' }}
            />
          </div>
        </section>

        <section className="pane">
          <div className="pane-header">
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              To
              <FormatPicker id="to" value={to} onChange={setTo} />
            </span>
            <div className="pane-actions">
              <button onClick={swap} title="Swap directions and use current output as input">
                Swap
              </button>
              <button onClick={copy} disabled={!result.ok || !result.output}>
                Copy
              </button>
            </div>
          </div>
          <div className="pane-body" style={{ padding: 0 }}>
            {result.ok ? (
              <textarea
                className="code"
                value={result.output}
                readOnly
                spellCheck={false}
                style={{ padding: '12px' }}
              />
            ) : (
              <div style={{ padding: 12 }}>
                <div className="error">{result.error}</div>
              </div>
            )}
          </div>
        </section>
      </div>
      <div className="status-bar">
        {result.ok ? (
          <span className="ok">
            ✓ {FORMAT_LABELS[from]} → {FORMAT_LABELS[to]}
          </span>
        ) : (
          <span className="err">✗ Input is not valid {FORMAT_LABELS[from]}</span>
        )}
      </div>
    </div>
  );
}
