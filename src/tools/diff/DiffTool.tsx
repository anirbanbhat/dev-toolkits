import { useMemo, useState } from 'react';
import { diffLines, type Change } from 'diff';

const DEFAULT_LEFT = `function greet(name) {
  return "Hello, " + name;
}

greet("Alice");`;

const DEFAULT_RIGHT = `function greet(name, greeting = "Hello") {
  return greeting + ", " + name + "!";
}

greet("Alice");
greet("Bob", "Hi");`;

export function computeStats(diff: Change[]): { added: number; removed: number } {
  let added = 0;
  let removed = 0;
  for (const part of diff) {
    const lineCount = part.count ?? part.value.split('\n').length;
    if (part.added) added += lineCount;
    else if (part.removed) removed += lineCount;
  }
  return { added, removed };
}

export default function DiffTool() {
  const [left, setLeft] = useState(DEFAULT_LEFT);
  const [right, setRight] = useState(DEFAULT_RIGHT);
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);

  const diff = useMemo(
    () => diffLines(left, right, { ignoreWhitespace }),
    [left, right, ignoreWhitespace],
  );

  const stats = useMemo(() => computeStats(diff), [diff]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 12 }}>
      <div className="split" style={{ flex: '0 0 40%' }}>
        <section className="pane">
          <div className="pane-header">
            <span>Original</span>
            <div className="pane-actions">
              <button onClick={() => setLeft(DEFAULT_LEFT)}>Sample</button>
              <button onClick={() => setLeft('')}>Clear</button>
            </div>
          </div>
          <div className="pane-body" style={{ padding: 0 }}>
            <textarea
              className="code"
              value={left}
              onChange={(e) => setLeft(e.target.value)}
              spellCheck={false}
              placeholder="Original text..."
              style={{ padding: '12px' }}
            />
          </div>
        </section>

        <section className="pane">
          <div className="pane-header">
            <span>Modified</span>
            <div className="pane-actions">
              <button onClick={() => setRight(DEFAULT_RIGHT)}>Sample</button>
              <button onClick={() => setRight('')}>Clear</button>
            </div>
          </div>
          <div className="pane-body" style={{ padding: 0 }}>
            <textarea
              className="code"
              value={right}
              onChange={(e) => setRight(e.target.value)}
              spellCheck={false}
              placeholder="Modified text..."
              style={{ padding: '12px' }}
            />
          </div>
        </section>
      </div>

      <section className="pane" style={{ flex: 1, minHeight: 0 }}>
        <div className="pane-header">
          <span>Diff</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
              <input
                type="checkbox"
                checked={ignoreWhitespace}
                onChange={(e) => setIgnoreWhitespace(e.target.checked)}
              />
              Ignore whitespace
            </label>
            <span style={{ color: 'var(--ok)', fontSize: 12, fontFamily: 'ui-monospace, monospace' }}>
              +{stats.added}
            </span>
            <span style={{ color: 'var(--danger)', fontSize: 12, fontFamily: 'ui-monospace, monospace' }}>
              -{stats.removed}
            </span>
          </div>
        </div>
        <div
          className="pane-body"
          style={{ padding: 0, overflow: 'auto', fontFamily: 'ui-monospace, monospace', fontSize: 13 }}
        >
          {left === right ? (
            <div
              className="muted"
              style={{ padding: 16, textAlign: 'center', fontSize: 13 }}
            >
              {left === '' ? 'Both sides empty.' : 'No differences.'}
            </div>
          ) : (
            <pre style={{ margin: 0, padding: 12, lineHeight: 1.55 }}>
              {diff.map((part, i) => {
                const bg = part.added
                  ? 'rgba(74, 222, 128, 0.12)'
                  : part.removed
                    ? 'rgba(255, 107, 107, 0.12)'
                    : 'transparent';
                const color = part.added
                  ? 'var(--ok)'
                  : part.removed
                    ? 'var(--danger)'
                    : 'var(--text-dim)';
                const prefix = part.added ? '+ ' : part.removed ? '- ' : '  ';
                const lines = part.value.split('\n');
                // diffLines keeps a trailing empty string when value ends with \n; drop it so we
                // don't render a blank extra line with a marker.
                if (lines[lines.length - 1] === '') lines.pop();
                return (
                  <span key={i} style={{ display: 'block' }}>
                    {lines.map((line, li) => (
                      <span
                        key={li}
                        style={{
                          display: 'block',
                          background: bg,
                          color,
                          padding: '0 8px',
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-all',
                        }}
                      >
                        {prefix}
                        {line || ' '}
                      </span>
                    ))}
                  </span>
                );
              })}
            </pre>
          )}
        </div>
      </section>
    </div>
  );
}
