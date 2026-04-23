# Number Base Converter

Convert integers between binary, octal, decimal, and hexadecimal. All four representations display simultaneously.

## How to use

1. Type a number in the **input** field.
2. All four representations update live in the pane below.
3. Click **Copy** next to any row to put that representation on your clipboard.

## Input formats

The **"Treat as"** selector controls how the input is interpreted:

| Setting | Behavior |
|---------|----------|
| **Auto** | Detects the base from prefixes: `0x` hex, `0b` binary, `0o` octal. No prefix = decimal. |
| **Binary** | Input is read as base-2 regardless of prefix. |
| **Octal** | Input is read as base-8. |
| **Decimal** | Input is read as base-10. |
| **Hex** | Input is read as base-16 (case-insensitive: `0xff` = `0xFF`). |

### Examples

| Input | Auto mode output |
|-------|------------------|
| `42` | decimal 42 → `0b101010`, `0o52`, `42`, `0x2a` |
| `0xff` | hex 255 → `0b11111111`, `0o377`, `255`, `0xff` |
| `0b1010` | binary 10 → `0b1010`, `0o12`, `10`, `0xa` |
| `-100` | negative 100 → signed output in every base |

## Tips

- **Underscores** are allowed as digit separators for readability: `1_000_000` or `0xDEAD_BEEF`.
- **Negative numbers** are supported — the sign is preserved across all bases.
- **Arbitrary precision:** The tool uses JavaScript `BigInt` internally, so integers of any length work. No 32/64-bit overflow.
- **Case-insensitive** hex input: `0xABCD` and `0xabcd` both work; output uses lowercase.

## Privacy

All conversion happens locally — your input never leaves your machine.
