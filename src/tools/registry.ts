import type { Tool } from '../types';
import MermaidTool from './mermaid/MermaidTool';
import JsonTool from './json/JsonTool';
import JwtTool from './jwt/JwtTool';
import HashTool from './hash/HashTool';
import RegexTool from './regex/RegexTool';
import UuidTool from './uuid/UuidTool';
import CronTool from './cron/CronTool';
import DiffTool from './diff/DiffTool';

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
  {
    id: 'jwt',
    name: 'JWT Decoder',
    description: 'Decode JWT header and payload; show expiry.',
    icon: 'JWT',
    docId: 'jwt',
    component: JwtTool,
  },
  {
    id: 'hash',
    name: 'Hash Generator',
    description: 'MD5, SHA-1, SHA-256, SHA-384, SHA-512 of text.',
    icon: '#',
    docId: 'hash',
    component: HashTool,
  },
  {
    id: 'regex',
    name: 'Regex Tester',
    description: 'Test JavaScript regular expressions live.',
    icon: '.*',
    docId: 'regex',
    component: RegexTool,
  },
  {
    id: 'uuid',
    name: 'UUID / ULID Generator',
    description: 'Generate UUID v4, v7, or ULID in batches.',
    icon: 'ID',
    docId: 'uuid',
    component: UuidTool,
  },
  {
    id: 'cron',
    name: 'Cron Explainer',
    description: 'Translate cron expressions into plain English with upcoming run times.',
    icon: '⏱',
    docId: 'cron',
    component: CronTool,
  },
  {
    id: 'diff',
    name: 'Diff Viewer',
    description: 'Compare two texts with line-by-line diff highlighting.',
    icon: '±',
    docId: 'diff',
    component: DiffTool,
  },
];

export function getToolById(id: string): Tool | undefined {
  return tools.find((t) => t.id === id);
}
