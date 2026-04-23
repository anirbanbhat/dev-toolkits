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

Click **Export PDF** → a native **save-file dialog** opens → pick a location and filename → the PDF is written directly to disk. No printer selection, no detour.

The PDF includes only the preview (editor/toolbar are stripped via a print stylesheet), uses a light theme for readability, and breaks cleanly across pages for code blocks and tables.

If you're running the markdown tool in a regular browser instead of the desktop app, Export PDF falls back to the system print dialog, where you can still choose "Save as PDF".

## Privacy

All rendering happens locally — your markdown never leaves your machine.
