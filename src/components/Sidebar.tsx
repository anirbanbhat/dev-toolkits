import type { Tool } from '../types';

interface Props {
  tools: Tool[];
  activeToolId: string;
  onSelect: (id: string) => void;
  onOpenHelp: () => void;
}

export default function Sidebar({ tools, activeToolId, onSelect, onOpenHelp }: Props) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">DT</div>
        <div className="brand-name">Dev Toolkits</div>
      </div>
      <nav className="tool-list">
        {tools.map((tool) => (
          <button
            key={tool.id}
            className={`tool-item ${tool.id === activeToolId ? 'active' : ''}`}
            onClick={() => onSelect(tool.id)}
            title={tool.description}
          >
            <span className="tool-icon">{tool.icon}</span>
            <span className="tool-name">{tool.name}</span>
          </button>
        ))}
      </nav>
      <div className="sidebar-footer">
        <button className="help-link" onClick={onOpenHelp}>
          User Manual
        </button>
      </div>
    </aside>
  );
}
