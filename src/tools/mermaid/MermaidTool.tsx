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

  const downloadJpeg = async () => {
    if (!svg) return;

    // Pull dimensions from the SVG (width/height attrs, fall back to viewBox).
    const doc = new DOMParser().parseFromString(svg, 'image/svg+xml');
    const svgEl = doc.documentElement;
    let width = parseFloat(svgEl.getAttribute('width') || '0');
    let height = parseFloat(svgEl.getAttribute('height') || '0');
    if (!width || !height) {
      const viewBox = svgEl.getAttribute('viewBox');
      const parts = viewBox ? viewBox.split(/\s+/).map(Number) : [];
      width = parts[2] || 1200;
      height = parts[3] || 800;
    }

    // Render at 2x so the raster output stays crisp when zoomed.
    const scale = 2;
    const canvas = document.createElement('canvas');
    canvas.width = width * scale;
    canvas.height = height * scale;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // JPEG has no alpha channel — fill white before the diagram is drawn.
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.scale(scale, scale);

    const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    try {
      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Could not load SVG for rasterization'));
        img.src = svgUrl;
      });
      ctx.drawImage(img, 0, 0, width, height);
    } finally {
      URL.revokeObjectURL(svgUrl);
    }

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, 'image/jpeg', 0.92);
    });
    if (!blob) return;

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'diagram.jpg';
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
              SVG
            </button>
            <button onClick={downloadJpeg} disabled={!svg}>
              JPEG
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
