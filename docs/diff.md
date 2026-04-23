# Diff Viewer

Compare two blocks of text and see the line-by-line differences with color-coded highlighting.

## How to use

1. Paste the **Original** text into the left pane.
2. Paste the **Modified** text into the right pane.
3. The **Diff** pane below shows every line of both texts with:
   - <span style="color:#4ade80">**+** green</span> for lines added to Modified
   - <span style="color:#ff6b6b">**-** red</span> for lines removed from Original
   - gray for unchanged context

The header shows summary counts (e.g. `+3 -2`) and an option to ignore whitespace.

## Actions

| Button | What it does |
|--------|--------------|
| **Sample** (each pane) | Load an example to see how the tool renders diffs. |
| **Clear** (each pane) | Empty that pane. |
| **Ignore whitespace** | Treat pure-whitespace changes as unchanged — useful when reviewing reformats or tab/space conversions. |

## What counts as "line diff"

This tool uses line-level diffing (matching whole lines). It's best for:

- Comparing code snippets or config files
- Reviewing text edits
- Spotting missing/added lines

For character- or word-level diffs (useful on a single paragraph), paste both into a character-diff tool. That's planned but not yet built.

## Tips

- Very long inputs may make the diff pane scroll significantly. The browser will render everything — performance is fine for up to tens of thousands of lines.
- The diff algorithm is deterministic: same inputs always produce the same output, regardless of order.

## Privacy

Diffing happens entirely locally — neither text ever leaves your machine.
