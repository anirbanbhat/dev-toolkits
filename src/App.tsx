import { useEffect, useState } from 'react';
import ToolSelector from './components/ToolSelector';
import HelpViewer from './components/HelpViewer';
import { tools } from './tools/registry';

export default function App() {
  const [activeToolId, setActiveToolId] = useState(tools[0].id);
  const [helpDocId, setHelpDocId] = useState<string | null>(null);

  // Listen for Help menu selections from the main process.
  useEffect(() => {
    if (!window.devtools) return;
    const unsub = window.devtools.onOpenHelp((docId) => setHelpDocId(docId));
    return unsub;
  }, []);

  const activeTool = tools.find((t) => t.id === activeToolId) ?? tools[0];
  const ActiveComponent = activeTool.component;

  return (
    <div className="app">
      <main className="main">
        <header className="toolbar">
          <div className="toolbar-left">
            <div className="brand">
              <div className="brand-mark">DT</div>
              <div className="brand-name">Dev Toolkits</div>
            </div>
            <ToolSelector
              tools={tools}
              activeToolId={activeToolId}
              onSelect={setActiveToolId}
            />
            <p className="muted toolbar-desc">{activeTool.description}</p>
          </div>
          <div className="toolbar-right">
            <a
              className="sponsor-btn"
              href="https://github.com/sponsors/anirbanbhat"
              target="_blank"
              rel="noopener noreferrer"
              title="Sponsor on GitHub or Polar"
            >
              ♥ Sponsor
            </a>
            <button
              className="help-btn"
              onClick={() => setHelpDocId('index')}
              title="Open user manual"
            >
              User Manual
            </button>
            <button
              className="help-btn"
              onClick={() => setHelpDocId(activeTool.docId)}
              title="Open documentation for this tool"
            >
              ? Help
            </button>
          </div>
        </header>
        <div className="tool-surface">
          <ActiveComponent />
        </div>
      </main>
      {helpDocId && (
        <HelpViewer docId={helpDocId} onClose={() => setHelpDocId(null)} />
      )}
    </div>
  );
}
