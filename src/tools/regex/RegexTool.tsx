import { useMemo, useState } from 'react';

const SAMPLE_PATTERN = '\\b(\\w+)@(\\w+\\.\\w+)\\b';
const SAMPLE_FLAGS = 'g';
const SAMPLE_TEST = `Send updates to alice@example.com and bob@example.org.
Backup contact: charlie@example.net.
Not an email: hello world.`;

const FLAG_OPTIONS: Array<{ flag: string; label: string }> = [
  { flag: 'g', label: 'global' },
  { flag: 'i', label: 'case-insensitive' },
  { flag: 'm', label: 'multiline' },
  { flag: 's', label: 'dotall' },
  { flag: 'u', label: 'unicode' },
  { flag: 'y', label: 'sticky' },
];

interface MatchInfo {
  fullMatch: string;
  index: number;
  length: number;
  groups: string[];
}

interface CompileOk {
  ok: true;
  matches: MatchInfo[];
}
interface CompileErr {
  ok: false;
  error: string;
}
type CompileResult = CompileOk | CompileErr;

function runRegex(pattern: string, flags: string, test: string): CompileResult {
  if (!pattern) return { ok: true, matches: [] };
  let re: RegExp;
  try {
    // Force the global flag so matchAll yields all hits — toggle preserved separately for display.
    const effectiveFlags = flags.includes('g') ? flags : flags + 'g';
    re = new RegExp(pattern, effectiveFlags);
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
  const matches: MatchInfo[] = [];
  for (const m of test.matchAll(re)) {
    matches.push({
      fullMatch: m[0],
      index: m.index ?? 0,
      length: m[0].length,
      groups: m.slice(1),
    });
    // If the regex matches an empty string, advance manually to avoid an infinite loop.
    if (m[0].length === 0) re.lastIndex++;
  }
  return { ok: true, matches };
}

function highlight(text: string, matches: MatchInfo[]): React.ReactNode {
  if (matches.length === 0) return text;
  const out: React.ReactNode[] = [];
  let cursor = 0;
  matches.forEach((m, i) => {
    if (m.index > cursor) out.push(text.slice(cursor, m.index));
    out.push(
      <mark key={i} className="regex-hit">
        {text.slice(m.index, m.index + m.length)}
      </mark>,
    );
    cursor = m.index + m.length;
  });
  if (cursor < text.length) out.push(text.slice(cursor));
  return out;
}

export default function RegexTool() {
  const [pattern, setPattern] = useState(SAMPLE_PATTERN);
  const [flags, setFlags] = useState(SAMPLE_FLAGS);
  const [test, setTest] = useState(SAMPLE_TEST);

  const result = useMemo(() => runRegex(pattern, flags, test), [pattern, flags, test]);

  const toggleFlag = (flag: string) => {
    setFlags((current) => (current.includes(flag) ? current.replace(flag, '') : current + flag));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 12 }}>
      <section className="pane">
        <div className="pane-header">
          <span>Pattern</span>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            {FLAG_OPTIONS.map(({ flag, label }) => (
              <label
                key={flag}
                style={{ fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}
                title={label}
              >
                <input
                  type="checkbox"
                  checked={flags.includes(flag)}
                  onChange={() => toggleFlag(flag)}
                />
                {flag}
              </label>
            ))}
          </div>
        </div>
        <div
          className="pane-body"
          style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 8 }}
        >
          <span style={{ color: 'var(--text-dim)', fontFamily: 'ui-monospace, monospace' }}>/</span>
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            spellCheck={false}
            placeholder="regex pattern (no slashes)"
            style={{
              flex: 1,
              background: 'transparent',
              color: 'var(--text)',
              border: 'none',
              outline: 'none',
              fontFamily: 'ui-monospace, monospace',
              fontSize: 13,
            }}
          />
          <span style={{ color: 'var(--text-dim)', fontFamily: 'ui-monospace, monospace' }}>
            /{flags}
          </span>
        </div>
      </section>

      <div className="split" style={{ flex: 1 }}>
        <section className="pane">
          <div className="pane-header">
            <span>Test string</span>
            <div className="pane-actions">
              <button
                onClick={() => {
                  setPattern(SAMPLE_PATTERN);
                  setFlags(SAMPLE_FLAGS);
                  setTest(SAMPLE_TEST);
                }}
              >
                Sample
              </button>
              <button onClick={() => setTest('')}>Clear</button>
            </div>
          </div>
          <div className="pane-body" style={{ padding: 0, display: 'flex', flexDirection: 'column' }}>
            <textarea
              className="code"
              value={test}
              onChange={(e) => setTest(e.target.value)}
              spellCheck={false}
              placeholder="Text to test the pattern against..."
              style={{ padding: '12px', flex: 1, minHeight: 140 }}
            />
            {result.ok && (
              <div
                style={{
                  borderTop: '1px solid var(--border)',
                  padding: '12px',
                  fontSize: 13,
                  lineHeight: 1.55,
                  whiteSpace: 'pre-wrap',
                  fontFamily: 'ui-monospace, monospace',
                  background: 'var(--bg-elev)',
                  maxHeight: '40%',
                  overflow: 'auto',
                }}
              >
                {highlight(test, result.matches)}
              </div>
            )}
          </div>
        </section>

        <section className="pane">
          <div className="pane-header">
            <span>Matches {result.ok ? `(${result.matches.length})` : ''}</span>
          </div>
          <div className="pane-body">
            {!result.ok ? (
              <div className="error">{result.error}</div>
            ) : result.matches.length === 0 ? (
              <div className="muted" style={{ fontSize: 13 }}>
                No matches.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {result.matches.map((m, i) => (
                  <div
                    key={i}
                    style={{
                      background: 'var(--bg-elev-2)',
                      borderRadius: 6,
                      padding: 10,
                      fontSize: 12.5,
                      fontFamily: 'ui-monospace, monospace',
                    }}
                  >
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>
                      Match {i + 1} <span className="muted">@ {m.index}</span>
                    </div>
                    <div style={{ wordBreak: 'break-all' }}>{m.fullMatch}</div>
                    {m.groups.length > 0 && (
                      <div style={{ marginTop: 6 }}>
                        {m.groups.map((g, gi) => (
                          <div key={gi} style={{ fontSize: 12 }}>
                            <span className="muted">${gi + 1}:</span>{' '}
                            <span>{g === undefined ? '(undefined)' : g}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
