import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Props {
  docId: string;
  onClose: () => void;
}

const NAV: Array<{ id: string; label: string }> = [
  { id: 'index', label: 'Overview' },
  { id: 'mermaid', label: 'Mermaid' },
  { id: 'json-formatter', label: 'JSON Formatter' },
  { id: 'jwt', label: 'JWT' },
  { id: 'hash', label: 'Hash' },
  { id: 'regex', label: 'Regex' },
  { id: 'uuid', label: 'UUID / ULID' },
  { id: 'cron', label: 'Cron' },
  { id: 'diff', label: 'Diff' },
  { id: 'convert', label: 'JSON/YAML/CSV' },
  { id: 'markdown', label: 'Markdown' },
  { id: 'numberbase', label: 'Number Base' },
  { id: 'extending', label: 'Extending' },
  { id: 'about', label: 'About' },
];

export default function HelpViewer({ docId, onClose }: Props) {
  const [currentDoc, setCurrentDoc] = useState(docId);
  const [content, setContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setCurrentDoc(docId);
  }, [docId]);

  useEffect(() => {
    let cancelled = false;
    if (!window.devtools) {
      setError('Help docs are only available in the desktop app.');
      return;
    }
    window.devtools
      .readDoc(currentDoc)
      .then((text) => {
        if (!cancelled) {
          setContent(text);
          setError(null);
        }
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : String(e));
          setContent('');
        }
      });
    return () => {
      cancelled = true;
    };
  }, [currentDoc]);

  // Close on Escape.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="help-modal" onClick={onClose}>
      <div className="help-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="help-header">
          <h2>User Manual</h2>
          <button className="close-btn" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <div className="help-nav">
          {NAV.map((item) => (
            <button
              key={item.id}
              className={item.id === currentDoc ? 'active' : ''}
              onClick={() => setCurrentDoc(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="help-body">
          {error ? (
            <div className="error">{error}</div>
          ) : (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          )}
        </div>
      </div>
    </div>
  );
}
