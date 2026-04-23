import mermaid from 'mermaid';

let initialized = false;

/**
 * Initialize mermaid once per page load. Safe to call from multiple tools.
 *
 * `flowchart.htmlLabels` is turned off because node labels inside
 * <foreignObject> cannot be rasterized by canvas.drawImage — without this
 * flag, the JPEG export in MermaidTool renders shapes but no text.
 */
export function ensureMermaidInitialized() {
  if (initialized) return;
  mermaid.initialize({
    startOnLoad: false,
    theme: 'default',
    securityLevel: 'strict',
    flowchart: { htmlLabels: false },
  });
  initialized = true;
}
