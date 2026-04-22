import { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
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
      <Sidebar
        tools={tools}
        activeToolId={activeToolId}
        onSelect={setActiveToolId}
        onOpenHelp={() => setHelpDocId(activeTool.docId)}
      />
      <main className="main">
        <header className="toolbar">
          <div>
            <h1>{activeTool.name}</h1>
            <p className="muted">{activeTool.description}</p>
          </div>
          <button
            className="help-btn"
            onClick={() => setHelpDocId(activeTool.docId)}
            title="Open documentation for this tool"
          >
            ? Help
          </button>
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
