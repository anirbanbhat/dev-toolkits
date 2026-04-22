import { useMemo, useState } from 'react';

const SAMPLE = `{"name":"Dev Toolkits","version":"0.1.0","tools":[{"id":"mermaid","enabled":true},{"id":"json","enabled":true}],"settings":{"theme":"dark","indent":2}}`;

type ParseResult =
  | { ok: true; value: unknown }
  | { ok: false; error: string };

function parse(source: string): ParseResult {
  if (source.trim() === '') return { ok: false, error: 'Input is empty.' };
  try {
    return { ok: true, value: JSON.parse(source) };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

export default function JsonTool() {
  const [input, setInput] = useState(SAMPLE);
  const [indent, setIndent] = useState(2);

  const parsed = useMemo(() => parse(input), [input]);

  const formatted = useMemo(() => {
    if (!parsed.ok) return '';
    try {
      return JSON.stringify(parsed.value, null, indent);
    } catch (e) {
      return e instanceof Error ? e.message : String(e);
    }
  }, [parsed, indent]);

  const byteSize = useMemo(
    () => new Blob([input]).size,
    [input],
  );

  const handleFormat = () => {
    if (parsed.ok) setInput(JSON.stringify(parsed.value, null, indent));
  };

  const handleMinify = () => {
    if (parsed.ok) setInput(JSON.stringify(parsed.value));
  };

  const handleCopy = async () => {
    if (formatted) await navigator.clipboard.writeText(formatted);
  };

  const handleDownload = () => {
    if (!formatted) return;
    const blob = new Blob([formatted], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="split" style={{ flex: 1 }}>
        <section className="pane">
          <div className="pane-header">
            <span>Input</span>
            <div className="pane-actions">
              <button onClick={handleFormat} disabled={!parsed.ok}>
                Format
              </button>
              <button onClick={handleMinify} disabled={!parsed.ok}>
                Minify
              </button>
              <button onClick={() => setInput('')}>Clear</button>
            </div>
          </div>
          <div className="pane-body" style={{ padding: 0 }}>
            <textarea
              className="code"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              spellCheck={false}
              placeholder="Paste JSON here..."
              style={{ padding: '12px' }}
            />
          </div>
        </section>

        <section className="pane">
          <div className="pane-header">
            <span>Formatted</span>
            <div className="pane-actions">
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                Indent
                <select
                  value={indent}
                  onChange={(e) => setIndent(Number(e.target.value))}
                  style={{
                    background: 'var(--bg-elev-2)',
                    color: 'var(--text)',
                    border: '1px solid var(--border)',
                    borderRadius: 4,
                    padding: '2px 6px',
                  }}
                >
                  <option value={2}>2 spaces</option>
                  <option value={4}>4 spaces</option>
                  <option value={0}>None</option>
                </select>
              </label>
              <button onClick={handleCopy} disabled={!parsed.ok}>
                Copy
              </button>
              <button onClick={handleDownload} disabled={!parsed.ok}>
                Download
              </button>
            </div>
          </div>
          <div className="pane-body" style={{ padding: 0 }}>
            {parsed.ok ? (
              <textarea
                className="code"
                value={formatted}
                readOnly
                spellCheck={false}
                style={{ padding: '12px' }}
              />
            ) : (
              <div style={{ padding: 12 }}>
                <div className="error">{parsed.error}</div>
              </div>
            )}
          </div>
        </section>
      </div>
      <div className="status-bar">
        <span>Size: {byteSize.toLocaleString()} bytes</span>
        <span>•</span>
        {parsed.ok ? (
          <span className="ok">✓ Valid JSON</span>
        ) : (
          <span className="err">✗ Invalid JSON</span>
        )}
      </div>
    </div>
  );
}
