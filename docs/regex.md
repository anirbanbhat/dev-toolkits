# Regex Tester

Test JavaScript regular expressions against a test string. Matches are highlighted live and each match's capture groups are listed.

## How to use

1. Type or paste a regex pattern into the **Pattern** field (no slashes — the tool wraps it as `/pattern/flags`).
2. Toggle flags with the checkboxes in the pane header.
3. Paste the text you want to test against into the **Test string** pane.
4. The lower half of the Test string pane shows the input with each match highlighted.
5. The **Matches** pane lists every match with its index and capture groups.

## Flags

| Flag | Meaning |
|------|---------|
| `g` | **global** — find all matches, not just the first. |
| `i` | **case-insensitive** — `ABC` matches `abc`. |
| `m` | **multiline** — `^` and `$` match line starts/ends, not just the whole string. |
| `s` | **dotall** — `.` matches newlines too. |
| `u` | **unicode** — proper Unicode handling (surrogate pairs, `\p{...}` property escapes). |
| `y` | **sticky** — match only at `lastIndex`. |

The tool always iterates all matches internally regardless of the `g` toggle, so you can see the full match list even without global.

## Capture groups

Each listed match shows its full match plus any capture groups as `$1`, `$2`, etc. Named groups (`(?<name>...)`) appear as additional numbered entries; their names can be inspected by changing the pattern.

## Actions

| Button | What it does |
|--------|--------------|
| **Sample** | Load an example email-extraction pattern and test text. |
| **Clear** | Empty the test string. |

## Tips

- Escape special characters (`. ^ $ * + ? ( ) [ ] { } | \`) with a backslash when you want a literal match.
- In JavaScript regex, lookbehind `(?<=...)` / `(?<!...)` works in modern browsers and is supported here.
- A pattern that can match an empty string (e.g. `a*`) would loop forever without special handling — the tool auto-advances past zero-length matches.

## Errors

If the pattern is invalid (e.g. unbalanced parentheses), the Matches pane shows the exact JavaScript error message.

## Privacy

All matching happens locally. The test string never leaves your machine.
