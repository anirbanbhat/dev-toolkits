import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { ensureMermaidInitialized } from '../lib/mermaid-init';

let counter = 0;

ensureMermaidInitialized();

export default function MermaidBlock({ source }: { source: string }) {
  const [svg, setSvg] = useState('');
  const [error, setError] = useState<string | null>(null);
  const idRef = useRef(`md-mermaid-${++counter}`);

  useEffect(() => {
    let cancelled = false;
    mermaid
      .render(idRef.current, source)
      .then((r) => {
        if (!cancelled) {
          setSvg(r.svg);
          setError(null);
        }
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : String(e));
          setSvg('');
        }
      });
    return () => {
      cancelled = true;
    };
  }, [source]);

  if (error) {
    return <div className="error">Mermaid: {error}</div>;
  }
  return (
    <div
      className="mermaid-inline"
      // mermaid returns sanitized SVG (securityLevel: 'strict').
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
