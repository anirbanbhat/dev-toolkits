import { useEffect, useMemo, useRef, useState } from 'react';
import type { Tool } from '../types';

interface Props {
  tools: Tool[];
  activeToolId: string;
  onSelect: (id: string) => void;
}

export default function ToolSelector({ tools, activeToolId, onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlightIndex, setHighlightIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const active = tools.find((t) => t.id === activeToolId) ?? tools[0];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tools;
    return tools.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q),
    );
  }, [tools, query]);

  // Reset highlight when filter changes; keep it in bounds.
  useEffect(() => {
    setHighlightIndex(0);
  }, [query, open]);

  // Focus the search input as soon as the panel opens.
  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => inputRef.current?.focus());
    } else {
      setQuery('');
    }
  }, [open]);

  // Close on click outside.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  const choose = (id: string) => {
    onSelect(id);
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const tool = filtered[highlightIndex];
      if (tool) choose(tool.id);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
    }
  };

  return (
    <div className="tool-selector" ref={containerRef}>
      <button
        className="tool-selector-trigger"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="tool-icon">{active.icon}</span>
        <span className="tool-selector-name">{active.name}</span>
        <span className="tool-selector-caret" aria-hidden>
          ▾
        </span>
      </button>

      {open && (
        <div className="tool-selector-panel" role="listbox">
          <input
            ref={inputRef}
            className="tool-selector-search"
            type="text"
            placeholder="Search tools..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
          />
          {filtered.length === 0 ? (
            <div className="tool-selector-empty">No tools match.</div>
          ) : (
            <ul className="tool-selector-list">
              {filtered.map((tool, i) => (
                <li
                  key={tool.id}
                  role="option"
                  aria-selected={tool.id === activeToolId}
                  className={[
                    'tool-selector-item',
                    i === highlightIndex ? 'highlighted' : '',
                    tool.id === activeToolId ? 'active' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => choose(tool.id)}
                  onMouseEnter={() => setHighlightIndex(i)}
                >
                  <span className="tool-icon">{tool.icon}</span>
                  <span className="tool-selector-item-text">
                    <span className="tool-selector-item-name">{tool.name}</span>
                    <span className="tool-selector-item-desc">{tool.description}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
