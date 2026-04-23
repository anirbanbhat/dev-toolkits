import { useEffect, useState } from 'react';
import { md5 } from 'js-md5';

const ALGORITHMS = ['MD5', 'SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'] as const;
type Algorithm = (typeof ALGORITHMS)[number];

const SAMPLE = 'The quick brown fox jumps over the lazy dog';

function bytesToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function hash(text: string, algorithm: Algorithm): Promise<string> {
  if (algorithm === 'MD5') return md5(text);
  // Web Crypto's algorithm names are SHA-1, SHA-256, etc — same strings.
  const buf = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest(algorithm, buf);
  return bytesToHex(digest);
}

export default function HashTool() {
  const [input, setInput] = useState(SAMPLE);
  const [results, setResults] = useState<Record<Algorithm, string>>(
    () => Object.fromEntries(ALGORITHMS.map((a) => [a, ''])) as Record<Algorithm, string>,
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const next: Record<string, string> = {};
      for (const algo of ALGORITHMS) {
        try {
          next[algo] = await hash(input, algo);
        } catch (e) {
          next[algo] = `Error: ${e instanceof Error ? e.message : String(e)}`;
        }
      }
      if (!cancelled) setResults(next as Record<Algorithm, string>);
    })();
    return () => {
      cancelled = true;
    };
  }, [input]);

  const copy = (value: string) => navigator.clipboard.writeText(value);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="split" style={{ flex: 1 }}>
        <section className="pane">
          <div className="pane-header">
            <span>Input</span>
            <div className="pane-actions">
              <button onClick={() => setInput(SAMPLE)}>Sample</button>
              <button onClick={() => setInput('')}>Clear</button>
            </div>
          </div>
          <div className="pane-body" style={{ padding: 0 }}>
            <textarea
              className="code"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              spellCheck={false}
              placeholder="Enter text to hash..."
              style={{ padding: '12px' }}
            />
          </div>
        </section>

        <section className="pane">
          <div className="pane-header">
            <span>Hashes</span>
          </div>
          <div className="pane-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {ALGORITHMS.map((algo) => (
                <div key={algo}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 4,
                    }}
                  >
                    <span className="muted" style={{ fontSize: 12, fontWeight: 600 }}>
                      {algo}
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
                      onClick={() => copy(results[algo])}
                      disabled={!results[algo]}
                    >
                      Copy
                    </button>
                  </div>
                  <pre
                    style={{
                      background: 'var(--bg-elev-2)',
                      padding: 8,
                      borderRadius: 6,
                      fontSize: 12,
                      wordBreak: 'break-all',
                      whiteSpace: 'pre-wrap',
                      margin: 0,
                    }}
                  >
                    {results[algo] || '...'}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <div className="status-bar">
        <span>Input length: {input.length.toLocaleString()} chars</span>
        <span>•</span>
        <span>Bytes: {new Blob([input]).size.toLocaleString()}</span>
      </div>
    </div>
  );
}
