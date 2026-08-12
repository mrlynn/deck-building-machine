---
name: preview-deck
description: Generate an HTML slide preview from deck-content.json so you can review before exporting PPTX. Use after /build-deck, /revise-deck, or any edit to deck JSON.
---

# /preview-deck

Render `deck-content.json` to a branded HTML preview — confidence before `/export-pptx`.

## How to use

```
/preview-deck
```

Or with a path:

```
/preview-deck path/to/deck-content.json
```

## Setup

None — the preview script is pure Node (no npm install).

## Prompt for agent

When invoked:

1. Resolve input: given path, else `deck-content.json` in the workspace root
2. Run:
```bash
cd .agents/skills/preview-deck/scripts
node preview-deck.js ../../../../deck-content.json
```
   (Adjust the relative path if a custom JSON path was given.)
3. Report the output path (`output/preview.html`) and slide count
4. Tell the user to open the file in a browser (or use Simple Browser in Cursor)
5. Offer next steps: `/revise-deck` for edits, `/export-pptx` when ready, `/brand-check` before external share

Do **not** treat the HTML preview as pixel-perfect PowerPoint — it is a proportional story/layout check (headlines, bullets, metrics, chart/diagram summaries).
