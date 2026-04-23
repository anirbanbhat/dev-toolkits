import { useMemo, useState } from 'react';
import cronstrue from 'cronstrue';
import { CronExpressionParser } from 'cron-parser';

const PRESETS: Array<{ label: string; expr: string }> = [
  { label: 'Every minute', expr: '* * * * *' },
  { label: 'Hourly', expr: '0 * * * *' },
  { label: 'Daily 9am', expr: '0 9 * * *' },
  { label: 'Weekdays 9am', expr: '0 9 * * 1-5' },
  { label: 'Every 15 min', expr: '*/15 * * * *' },
  { label: 'Monthly 1st', expr: '0 0 1 * *' },
  { label: 'Sunday midnight', expr: '0 0 * * 0' },
];

interface ParseOk {
  ok: true;
  description: string;
  nextRuns: Date[];
}
interface ParseErr {
  ok: false;
  error: string;
}
type ParseResult = ParseOk | ParseErr;

function explain(expression: string): ParseResult {
  const trimmed = expression.trim();
  if (!trimmed) return { ok: false, error: 'Enter a cron expression.' };

  let description: string;
  try {
    description = cronstrue.toString(trimmed, { use24HourTimeFormat: true });
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }

  const nextRuns: Date[] = [];
  try {
    const interval = CronExpressionParser.parse(trimmed);
    for (let i = 0; i < 5; i++) {
      nextRuns.push(interval.next().toDate());
    }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }

  return { ok: true, description, nextRuns };
}

function formatDate(d: Date): string {
  // Local-timezone ISO-ish display: YYYY-MM-DD HH:MM:SS (tz)
  const pad = (n: number) => n.toString().padStart(2, '0');
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'local';
  return (
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ` +
    `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())} (${tz})`
  );
}

export default function CronTool() {
  const [expression, setExpression] = useState('0 9 * * 1-5');
  const result = useMemo(() => explain(expression), [expression]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 12 }}>
      <section className="pane">
        <div className="pane-header">
          <span>Cron expression</span>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => setExpression(p.expr)}
                style={{
                  background: 'var(--bg-elev-2)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-dim)',
                  padding: '2px 8px',
                  borderRadius: 999,
                  fontSize: 11,
                }}
                title={p.expr}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
        <div
          className="pane-body"
          style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 8 }}
        >
          <input
            type="text"
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            spellCheck={false}
            placeholder="e.g. 0 9 * * 1-5"
            style={{
              flex: 1,
              background: 'transparent',
              color: 'var(--text)',
              border: 'none',
              outline: 'none',
              fontFamily: 'ui-monospace, monospace',
              fontSize: 14,
            }}
          />
        </div>
      </section>

      <div className="split" style={{ flex: 1 }}>
        <section className="pane">
          <div className="pane-header">
            <span>In plain English</span>
          </div>
          <div className="pane-body">
            {result.ok ? (
              <div style={{ fontSize: 15, lineHeight: 1.5 }}>{result.description}</div>
            ) : (
              <div className="error">{result.error}</div>
            )}
          </div>
        </section>

        <section className="pane">
          <div className="pane-header">
            <span>Next 5 fire times</span>
          </div>
          <div className="pane-body">
            {result.ok ? (
              <ol
                style={{
                  margin: 0,
                  paddingLeft: 20,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                  fontFamily: 'ui-monospace, monospace',
                  fontSize: 13,
                }}
              >
                {result.nextRuns.map((d, i) => (
                  <li key={i}>{formatDate(d)}</li>
                ))}
              </ol>
            ) : (
              <div className="muted" style={{ fontSize: 13 }}>
                —
              </div>
            )}
          </div>
        </section>
      </div>

      <div className="status-bar">
        <span>Format: minute hour day-of-month month day-of-week</span>
        <span>•</span>
        <span>Values 0-59 0-23 1-31 1-12 0-6 (Sun=0)</span>
      </div>
    </div>
  );
}
