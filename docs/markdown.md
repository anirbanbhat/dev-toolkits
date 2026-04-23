# Markdown Viewer

Live-preview your markdown with GitHub-style extensions, mermaid diagrams, syntax-highlighted code, and one-click PDF export.

## How to use

1. Type or paste markdown into the **left pane**.
2. The **right pane** renders it in real time.
3. Click **Export PDF** to open your OS print dialog; pick "Save as PDF" there.

## Supported features

### GitHub-Flavored Markdown (GFM)
- Tables
- Task lists (`- [ ]`, `- [x]`)
- Strikethrough (`~~text~~`)
- Autolinked URLs

### Code blocks with syntax highlighting
Use triple-backtick fences with a language:

    ```ts
    function greet(name: string) {
      return `Hello, ${name}`;
    }
    ```

All major languages supported via `highlight.js`. If you omit the language, no highlighting is applied but the block is still styled.

### Mermaid diagrams
Use `mermaid` as the code fence language:

    ```mermaid
    graph TD
      A[Start] --> B[End]
    ```

The diagram renders inline, right in the preview.

### Standard markdown
Headings (H1–H6), bold, italic, lists, blockquotes, links, images, horizontal rules — all supported.

## PDF export

The **Export PDF** button opens your OS print dialog with print-specific CSS applied:

- Only the preview pane is included (the editor, toolbar, and sidebar are hidden).
- Background is white for printing.
- Code blocks and tables break sensibly across pages.

From the dialog:

- **macOS:** the "PDF" dropdown in the bottom-left → "Save as PDF".
- **Windows:** pick "Microsoft Print to PDF" as the printer.
- **Linux:** pick "Print to File" and choose PDF format.

## Privacy

All rendering happens locally — your markdown never leaves your machine.
