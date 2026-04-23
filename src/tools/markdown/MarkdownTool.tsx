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

  const exportPdf = () => {
    // The print CSS in index.css hides everything except .md-preview while
    // the user is picking a target in the native print dialog. From there
    // they can save as PDF (macOS: "Save as PDF" option in the dialog;
    // Windows/Linux: "Microsoft Print to PDF" / similar).
    document.body.classList.add('printing-md');
    window.print();
    // A short delay lets the print dialog settle before we clean up; many
    // browsers restore styles themselves, but removing the class ensures
    // we're back to normal regardless.
    setTimeout(() => document.body.classList.remove('printing-md'), 500);
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
          <span>Preview</span>
          <div className="pane-actions">
            <button onClick={exportPdf} title="Open the print dialog; save as PDF there">
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
