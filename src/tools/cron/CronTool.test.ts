import { describe, it, expect, vi } from 'vitest';
import { explain } from './CronTool';

describe('cron explain', () => {
  it('rejects empty input', () => {
    const r = explain('');
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/enter/i);
  });

  it('returns a human description for "0 9 * * 1-5"', () => {
    const r = explain('0 9 * * 1-5');
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.description.toLowerCase()).toContain('09:00');
      expect(r.description.toLowerCase()).toMatch(/monday.*friday|weekday/i);
    }
  });

  it('returns next 5 fire times as Date objects', () => {
    const r = explain('0 9 * * 1-5');
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.nextRuns).toHaveLength(5);
      for (const d of r.nextRuns) {
        expect(d).toBeInstanceOf(Date);
        expect(d.getHours()).toBe(9);
        expect(d.getMinutes()).toBe(0);
        // Monday=1, Friday=5 in Date.getDay()
        expect(d.getDay()).toBeGreaterThanOrEqual(1);
        expect(d.getDay()).toBeLessThanOrEqual(5);
      }
    }
  });

  it('returns fire times in strictly increasing order', () => {
    const r = explain('*/5 * * * *');
    expect(r.ok).toBe(true);
    if (r.ok) {
      for (let i = 1; i < r.nextRuns.length; i++) {
        expect(r.nextRuns[i].getTime()).toBeGreaterThan(r.nextRuns[i - 1].getTime());
      }
    }
  });

  it('returns an error for an invalid expression', () => {
    const r = explain('not a cron');
    expect(r.ok).toBe(false);
  });

  it('handles every-minute and hourly presets', () => {
    expect(explain('* * * * *').ok).toBe(true);
    expect(explain('0 * * * *').ok).toBe(true);
  });

  it('next-runs window respects the current time', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-01T00:00:00Z'));
    const r = explain('0 0 1 * *'); // midnight on the 1st each month
    expect(r.ok).toBe(true);
    if (r.ok) {
      // The immediate next fire after 2026-03-01 00:00:00Z is 2026-04-01.
      expect(r.nextRuns[0].getTime()).toBeGreaterThan(
        new Date('2026-03-01T00:00:00Z').getTime(),
      );
    }
    vi.useRealTimers();
  });
});
