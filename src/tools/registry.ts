import type { Tool } from '../types';
import MermaidTool from './mermaid/MermaidTool';
import JsonTool from './json/JsonTool';

/**
 * The single source of truth for which tools exist. Adding a new tool is a
 * one-line change here plus a file under src/tools/<name>/ and docs/<id>.md.
 */
export const tools: Tool[] = [
  {
    id: 'mermaid',
    name: 'Mermaid Renderer',
    description: 'Render Mermaid diagrams from source.',
    icon: 'M',
    docId: 'mermaid',
    component: MermaidTool,
  },
  {
    id: 'json',
    name: 'JSON Formatter',
    description: 'Format, minify, and validate JSON.',
    icon: '{}',
    docId: 'json-formatter',
    component: JsonTool,
  },
];

export function getToolById(id: string): Tool | undefined {
  return tools.find((t) => t.id === id);
}
