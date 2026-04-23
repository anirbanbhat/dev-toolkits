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
  // Render labels as native SVG <text>, not HTML inside <foreignObject>.
  // foreignObject cannot be rasterized by canvas.drawImage, so without this
  // the JPEG export renders the diagram shapes but drops all the text labels.
  flowchart: { htmlLabels: false },
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

    try {
      // Parse so we can inspect/patch dimensions and namespace.
      const doc = new DOMParser().parseFromString(svg, 'image/svg+xml');
      const svgEl = doc.documentElement as unknown as SVGSVGElement;

      // Some toolchains strip xmlns; Image element refuses to load SVG without it.
      if (!svgEl.getAttribute('xmlns')) {
        svgEl.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      }

      // Work out width/height from attrs or viewBox.
      let width = parseFloat(svgEl.getAttribute('width') || '0');
      let height = parseFloat(svgEl.getAttribute('height') || '0');
      if (!width || !height) {
        const viewBox = svgEl.getAttribute('viewBox');
        const parts = viewBox ? viewBox.trim().split(/[\s,]+/).map(Number) : [];
        width = parts[2] || 1200;
        height = parts[3] || 800;
      }
      // Force explicit width/height so the Image rasterizes at a known size.
      svgEl.setAttribute('width', String(width));
      svgEl.setAttribute('height', String(height));

      const serialized = new XMLSerializer().serializeToString(svgEl);
      // data: URLs work more reliably than blob: URLs for <Image> + SVG,
      // especially in Electron's file:// context.
      const dataUrl =
        'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(serialized);

      const scale = 2;
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(width * scale));
      canvas.height = Math.max(1, Math.round(height * scale));
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not acquire 2D context.');

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.scale(scale, scale);

      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () =>
          reject(new Error('Browser could not load the SVG for rasterization.'));
        img.src = dataUrl;
      });
      ctx.drawImage(img, 0, 0, width, height);

      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, 'image/jpeg', 0.92);
      });
      if (!blob) {
        throw new Error(
          'Canvas refused to export (likely tainted by cross-origin content).',
        );
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'diagram.jpg';
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      console.error('JPEG export failed:', e);
      setError(`JPEG export failed: ${message}`);
    }
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
