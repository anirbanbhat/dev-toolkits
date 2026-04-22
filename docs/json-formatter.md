# JSON Formatter

Format, minify, and validate JSON locally.

## How to use

1. Paste JSON into the **Input** pane on the left.
2. The **Formatted** pane on the right shows pretty-printed output as you type.
3. The status bar at the bottom shows the input size and whether the JSON is valid.

## Actions

### Input pane

| Button | What it does |
|--------|--------------|
| **Format** | Reformat the input in place using the chosen indent. |
| **Minify** | Collapse the input to a single line with no extra whitespace. |
| **Clear** | Empty the input. |

### Output pane

| Control | What it does |
|---------|--------------|
| **Indent** | Choose the number of spaces used for indentation (2, 4, or none for minified). |
| **Copy** | Copy the formatted output to your clipboard. |
| **Download** | Save the formatted JSON as `data.json`. |

## Validation

The status bar shows:

- **✓ Valid JSON** — input parses cleanly.
- **✗ Invalid JSON** — input cannot be parsed; the parser's error message appears in the output pane.

Common errors:

| Error | Likely cause |
|-------|--------------|
| `Unexpected token ... in JSON at position N` | Trailing comma, unquoted key, or single quotes instead of double. |
| `Unexpected end of JSON input` | Truncated input (missing closing `}` or `]`). |
| `Unexpected non-whitespace character after JSON at position N` | Multiple top-level values pasted together. |

## Tips

- JSON keys must be wrapped in double quotes (`"key"`), never single quotes.
- JSON does not allow comments. Strip `//` or `/* */` from your input before formatting.
- Numbers cannot have leading zeros (`007` is invalid; `7` is valid).

## Privacy

Parsing and formatting happen entirely locally — your JSON never leaves your machine.
