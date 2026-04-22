import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

const DEFAULT_SOURCE = `graph TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Ship it]
    B -->|No| D[Debug]
    D --> B`;

mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'strict',
});

export default function MermaidTool() {
  const [source, setSource] = useState(DEFAULT_SOURCE);
  const [svg, setSvg] = useState('');
  const [error, setError] = useState<string | null>(null);
  const renderIdRef = useRef(0);

  useEffect(() => {
    const currentId = ++renderIdRef.current;
    const id = `mermaid-${currentId}`;
    mermaid
      .render(id, source)
      .then((result) => {
        // Guard against stale renders.
        if (currentId !== renderIdRef.current) return;
        setSvg(result.svg);
        setError(null);
      })
      .catch((e: unknown) => {
        if (currentId !== renderIdRef.current) return;
        const message = e instanceof Error ? e.message : String(e);
        setError(message);
        setSvg('');
      });
  }, [source]);

  const downloadSvg = () => {
    if (!svg) return;
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'diagram.svg';
    a.click();
    URL.revokeObjectURL(url);
  };

  const copySvg = async () => {
    if (!svg) return;
    await navigator.clipboard.writeText(svg);
  };

  return (
    <div className="split">
      <section className="pane">
        <div className="pane-header">
          <span>Mermaid source</span>
          <div className="pane-actions">
            <button onClick={() => setSource(DEFAULT_SOURCE)}>Reset</button>
            <button onClick={() => setSource('')}>Clear</button>
          </div>
        </div>
        <div className="pane-body" style={{ padding: 0 }}>
          <textarea
            className="code"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            spellCheck={false}
            placeholder="Enter Mermaid diagram source..."
            style={{ padding: '12px' }}
          />
        </div>
      </section>

      <section className="pane">
        <div className="pane-header">
          <span>Preview</span>
          <div className="pane-actions">
            <button onClick={copySvg} disabled={!svg}>
              Copy SVG
            </button>
            <button onClick={downloadSvg} disabled={!svg}>
              Download
            </button>
          </div>
        </div>
        <div className="pane-body">
          {error ? (
            <div className="error">{error}</div>
          ) : (
            <div
              className="mermaid-output"
              // eslint-disable-next-line react/no-danger -- mermaid returns sanitized SVG via securityLevel:'strict'
              dangerouslySetInnerHTML={{ __html: svg }}
            />
          )}
        </div>
      </section>
    </div>
  );
}
