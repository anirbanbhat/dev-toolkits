# Cron Explainer

Decode a cron expression into plain English and preview its next few fire times.

## How to use

1. Type a cron expression into the **input** at the top, or click a **preset**.
2. **In plain English** shows what the expression means.
3. **Next 5 fire times** lists the upcoming runs based on your local timezone.

## Cron format

Classic 5-field cron (what Unix `cron` and most schedulers use):

```
minute  hour  day-of-month  month  day-of-week
  0      9         *          *        1-5
```

| Field | Range | Notes |
|-------|-------|-------|
| minute | 0–59 | |
| hour | 0–23 | 24-hour clock |
| day-of-month | 1–31 | |
| month | 1–12 | or JAN–DEC |
| day-of-week | 0–6 | Sunday=0 (or SUN–SAT) |

### Operators

| Operator | Meaning | Example |
|----------|---------|---------|
| `*` | Every value | `* * * * *` — every minute |
| `,` | List of values | `0 9,17 * * *` — 9am and 5pm |
| `-` | Range | `0 9 * * 1-5` — weekdays at 9am |
| `/` | Step | `*/15 * * * *` — every 15 minutes |
| `L` | Last | `0 0 L * *` — midnight on last day of month *(not all schedulers)* |
| `#` | Nth weekday | `0 0 * * 1#2` — 2nd Monday *(not all schedulers)* |

## Presets

Quick-load buttons for common schedules. Click any preset to populate the input; edit from there.

## Timezone

The "Next 5 fire times" uses your local timezone (shown in parentheses after each timestamp). Your production scheduler may use UTC — verify before copy-pasting.

## Privacy

All parsing happens locally — cron expressions never leave your machine.
