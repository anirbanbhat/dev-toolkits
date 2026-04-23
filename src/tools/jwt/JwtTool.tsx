import { useMemo, useState } from 'react';

const SAMPLE =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkphbmUgRGV2ZWxvcGVyIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE5OTk5OTk5OTl9.dummy_signature_not_verified';

interface DecodedSection {
  ok: boolean;
  json?: unknown;
  raw?: string;
  error?: string;
}

interface DecodeResult {
  header: DecodedSection;
  payload: DecodedSection;
  signature: string;
}

function base64UrlDecode(input: string): string {
  // JWT uses base64url; convert to base64 and pad.
  const b64 = input.replace(/-/g, '+').replace(/_/g, '/');
  const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4);
  // atob produces a binary string; decode it as UTF-8.
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder('utf-8').decode(bytes);
}

function decodeSection(part: string | undefined): DecodedSection {
  if (!part) return { ok: false, error: 'Missing.' };
  try {
    const raw = base64UrlDecode(part);
    return { ok: true, json: JSON.parse(raw), raw };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

function decode(token: string): DecodeResult | null {
  const trimmed = token.trim();
  if (!trimmed) return null;
  const parts = trimmed.split('.');
  if (parts.length < 2) {
    return {
      header: { ok: false, error: 'Not a JWT — expected three dot-separated segments.' },
      payload: { ok: false, error: 'Not a JWT.' },
      signature: '',
    };
  }
  return {
    header: decodeSection(parts[0]),
    payload: decodeSection(parts[1]),
    signature: parts[2] ?? '',
  };
}

function describeExpiry(payload: unknown): { label: string; tone: 'ok' | 'err' | 'neutral' } | null {
  if (!payload || typeof payload !== 'object') return null;
  const exp = (payload as Record<string, unknown>).exp;
  if (typeof exp !== 'number') return null;
  const now = Math.floor(Date.now() / 1000);
  const diff = exp - now;
  const date = new Date(exp * 1000).toISOString();
  if (diff < 0) return { label: `Expired ${formatRelative(-diff)} ago (${date})`, tone: 'err' };
  return { label: `Expires in ${formatRelative(diff)} (${date})`, tone: 'ok' };
}

function formatRelative(seconds: number): string {
  const abs = Math.abs(seconds);
  if (abs < 60) return `${abs}s`;
  if (abs < 3600) return `${Math.round(abs / 60)}m`;
  if (abs < 86400) return `${Math.round(abs / 3600)}h`;
  return `${Math.round(abs / 86400)}d`;
}

export default function JwtTool() {
  const [token, setToken] = useState(SAMPLE);
  const decoded = useMemo(() => decode(token), [token]);

  const expiry = decoded?.payload.ok ? describeExpiry(decoded.payload.json) : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="split" style={{ flex: 1 }}>
        <section className="pane">
          <div className="pane-header">
            <span>JWT</span>
            <div className="pane-actions">
              <button onClick={() => setToken(SAMPLE)}>Sample</button>
              <button onClick={() => setToken('')}>Clear</button>
            </div>
          </div>
          <div className="pane-body" style={{ padding: 0 }}>
            <textarea
              className="code"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              spellCheck={false}
              placeholder="Paste a JWT (header.payload.signature)..."
              style={{ padding: '12px' }}
            />
          </div>
        </section>

        <section className="pane">
          <div className="pane-header">
            <span>Decoded</span>
          </div>
          <div className="pane-body">
            {decoded === null ? (
              <div className="muted" style={{ fontSize: 13 }}>
                Paste a JWT to see its header and payload.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <DecodedBlock title="Header" section={decoded.header} />
                <DecodedBlock title="Payload" section={decoded.payload} />
                <div>
                  <div className="muted" style={{ fontSize: 12, marginBottom: 4 }}>
                    Signature (not verified — verification needs the secret/key)
                  </div>
                  <pre
                    style={{
                      background: 'var(--bg-elev-2)',
                      padding: 10,
                      borderRadius: 6,
                      fontSize: 12,
                      wordBreak: 'break-all',
                      whiteSpace: 'pre-wrap',
                      margin: 0,
                    }}
                  >
                    {decoded.signature || '(empty)'}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
      {expiry && (
        <div className="status-bar">
          <span className={expiry.tone === 'err' ? 'err' : 'ok'}>{expiry.label}</span>
        </div>
      )}
    </div>
  );
}

function DecodedBlock({ title, section }: { title: string; section: DecodedSection }) {
  return (
    <div>
      <div className="muted" style={{ fontSize: 12, marginBottom: 4 }}>
        {title}
      </div>
      {section.ok ? (
        <pre
          style={{
            background: 'var(--bg-elev-2)',
            padding: 10,
            borderRadius: 6,
            fontSize: 12.5,
            margin: 0,
            overflow: 'auto',
          }}
        >
          {JSON.stringify(section.json, null, 2)}
        </pre>
      ) : (
        <div className="error">{section.error}</div>
      )}
    </div>
  );
}
