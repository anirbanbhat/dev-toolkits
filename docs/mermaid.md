# Mermaid Renderer

Turn Mermaid source code into a rendered diagram in real time.

## How to use

1. Type or paste Mermaid syntax into the **left pane**.
2. The diagram renders in the **right pane** as you type.
3. If the source is invalid, an error message appears in place of the diagram.

## Actions

| Button | What it does |
|--------|--------------|
| **Reset** | Restore the default example source. |
| **Clear** | Empty the editor. |
| **Copy SVG** | Copy the rendered SVG markup to your clipboard. |
| **SVG** | Save the rendered diagram as `diagram.svg` (vector — best for editing or scaling). |
| **JPEG** | Save the rendered diagram as `diagram.jpg` (raster, 2× scale, white background). |

## Supported diagram types

Mermaid supports many diagram kinds. A few common examples:

### Flowchart

```
graph TD
    A[Start] --> B{Decide}
    B -->|Yes| C[Do it]
    B -->|No| D[Skip]
```

### Sequence diagram

```
sequenceDiagram
    Alice->>Bob: Hello Bob
    Bob-->>Alice: Hi Alice
```

### Class diagram

```
classDiagram
    class Animal {
      +String name
      +move()
    }
    Animal <|-- Dog
```

### Gantt chart

```
gantt
    title Project Plan
    dateFormat YYYY-MM-DD
    section Design
    Wireframes :a1, 2025-01-01, 7d
    Review     :after a1, 3d
```

For the full syntax reference, see [mermaid.js.org](https://mermaid.js.org/).

## Troubleshooting

- **Parse error**: Check for a missing node label, arrow, or a mismatched bracket. Mermaid's error messages usually point to the offending line.
- **Diagram is cut off**: Resize the window or zoom out via the **View → Zoom Out** menu.
- **Nothing renders**: An empty editor renders nothing — this is expected. Paste valid Mermaid source to see output.

## Privacy

Rendering happens entirely locally — your diagram source never leaves your machine.
