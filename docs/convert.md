# JSON / YAML / CSV Converter

Convert between three of the formats you touch daily: JSON, YAML, and CSV.

## How to use

1. Pick the **From** format (the format of your input).
2. Pick the **To** format (the format you want the output in).
3. Paste your data into the left pane. The right pane updates live.
4. **Copy** to clipboard or **Swap** to reverse direction (puts the current output into the input).

## Format-specific notes

### JSON
- Standard pretty-print with 2-space indent on output.
- Any valid JSON value works — objects, arrays, nested structures, primitives.

### YAML
- Uses the standard block style on output.
- Multiline strings, anchors, and aliases are supported on input.
- Line width capped at 120 characters for readability.

### CSV
- The first row is treated as a header.
- Numbers and booleans are auto-detected when parsing (so `"1"` → `1`, `"true"` → `true`).
- CSV **output requires an array of flat objects**. If your JSON/YAML is a nested structure, CSV conversion will fail with a clear error; flatten it first.

## Common flows

- **JSON → YAML** for pasting into k8s manifests or CI config.
- **YAML → JSON** when a service only accepts JSON body.
- **JSON → CSV** for opening structured data in a spreadsheet.
- **CSV → JSON** for quick API smoke tests.

## Errors

If the input doesn't parse, the right pane shows the parser's exact error message (line number for YAML/JSON, message string for CSV).

## Privacy

All conversion happens locally — your data never leaves your machine.
