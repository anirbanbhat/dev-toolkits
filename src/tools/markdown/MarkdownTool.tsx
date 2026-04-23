import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import MermaidBlock from '../../components/MermaidBlock';

const SAMPLE = `# Project Notes

A quick tour of what this renderer supports.

## Formatting

**Bold**, *italic*, ~~strikethrough~~, \`inline code\`, and [links](https://example.com).

## Lists and tables

- Nested bullets work
  - like this
  - and this
1. Ordered lists too
2. Second item

| Env | Status |
|-----|--------|
| dev | ✅ healthy |
| staging | ⚠ degraded |
| prod | ✅ healthy |

## Code with syntax highlighting

\`\`\`ts
function greet(name: string): string {
  return \`Hello, \${name}!\`;
}
\`\`\`

\`\`\`python
def fib(n: int) -> int:
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a
\`\`\`

## Mermaid diagrams

\`\`\`mermaid
graph LR
  Idea --> Draft --> Review --> Ship
  Review -->|Reject| Draft
\`\`\`

## Quotes and horizontal rules

> "Simplicity is prerequisite for reliability." — Dijkstra

---

That's it. Edit the left pane to see your own content rendered here.
`;

export default function MarkdownTool() {
  const [source, setSource] = useState(SAMPLE);
  const [status, setStatus] = useState<string | null>(null);

  const exportPdf = async () => {
    // The print CSS in index.css hides everything except .md-preview while
    // this class is on the body; printToPDF (Electron) or window.print
    // (browser fallback) then captures only the preview.
    document.body.classList.add('printing-md');

    // Let the browser apply the print-mode layout before we snapshot.
    await new Promise((r) => requestAnimationFrame(() => r(undefined)));

    try {
      if (window.devtools?.savePdf) {
        // Desktop app: go straight to a native save-file dialog; no printer
        // step in the middle.
        const result = await window.devtools.savePdf('document.pdf');
        if (result.ok) {
          setStatus(`Saved: ${result.path}`);
          setTimeout(() => setStatus(null), 4000);
        }
      } else {
        // Browser fallback (dev server, npm-serve): fall back to window.print
        // and let the user pick "Save as PDF" in the system dialog.
        window.print();
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      setStatus(`PDF export failed: ${message}`);
    } finally {
      document.body.classList.remove('printing-md');
    }
  };

  return (
    <div className="split" style={{ height: '100%' }}>
      <section className="pane">
        <div className="pane-header">
          <span>Markdown</span>
          <div className="pane-actions">
            <button onClick={() => setSource(SAMPLE)}>Sample</button>
            <button onClick={() => setSource('')}>Clear</button>
          </div>
        </div>
        <div className="pane-body" style={{ padding: 0 }}>
          <textarea
            className="code"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            spellCheck={false}
            placeholder="Type or paste markdown here..."
            style={{ padding: '12px' }}
          />
        </div>
      </section>

      <section className="pane">
        <div className="pane-header">
          <span>
            Preview
            {status && (
              <span
                className="muted"
                style={{ marginLeft: 10, fontSize: 12, fontWeight: 400 }}
              >
                {status}
              </span>
            )}
          </span>
          <div className="pane-actions">
            <button
              onClick={exportPdf}
              title="Save the preview as a PDF file"
            >
              Export PDF
            </button>
          </div>
        </div>
        <div className="pane-body md-preview">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{
              code(props) {
                const { className, children, node: _node, ...rest } = props as {
                  className?: string;
                  children?: React.ReactNode;
                  node?: unknown;
                };
                const match = /language-(\w+)/.exec(className || '');
                const isBlock =
                  typeof children === 'object' || (typeof children === 'string' && children.includes('\n'));
                if (match?.[1] === 'mermaid' && isBlock) {
                  const src = String(children).replace(/\n$/, '');
                  return <MermaidBlock source={src} />;
                }
                return (
                  <code className={className} {...rest}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {source}
          </ReactMarkdown>
        </div>
      </section>
    </div>
  );
}
