---
name: export-metrics-xlsx
description: Export metrics and chart slides from deck-content.json into a branded Excel workbook. Not a financial modeler — a thin metrics pack renderer for numbers already in the deck.
---

# /export-metrics-xlsx

Pull `metrics` and `chart` slides from `deck-content.json` into a branded `.xlsx` workbook.

## How to use

```
/export-metrics-xlsx
```

Or:

```
/export-metrics-xlsx path/to/deck-content.json
```

## No npm install

This skill ships a **bundled** exporter. Do **not** run `npm install`. Brand tokens load from `brand/brand-pack.json`.

## What you get

- **Cover** sheet — deck title, audience, date, brand accent
- **Metrics** sheet — one row per metric tile (value, label, description, delta, source slide)
- **Charts** sheet(s) — category × series tables for each chart slide (plus highlight + caption)

If the deck has no `metrics` or `chart` slides, say so and stop — do not invent numbers.

## Prompt for agent

1. Verify `deck-content.json` exists
2. Scan for `type: metrics` and `type: chart` slides; if none, report and exit
3. Run the bundled exporter (never `npm install`):
```bash
cd .agents/skills/export-metrics-xlsx/scripts
node bundled/export-xlsx.cjs ../../../../deck-content.json
```
4. Report output path and counts (metrics rows, chart sheets)
5. If `node` is missing, say Office export needs Node on PATH — do not ask for npm. If the bundle is missing, re-download the kit from Studio.

## Scope guard

- Do **not** build financial models, pivots, or formula engines
- Do **not** invent or “clean up” numbers beyond formatting already in the JSON
- This skill exists so Doc/Deck numbers can travel as a workbook — not as a second product
