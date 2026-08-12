---
name: polish-deck
description: Retrofit depth onto an existing deck — headline spine, assertion+detail bullets, takeaways, speaker notes, and chart highlights — then re-export the PPTX.
---

# /polish-deck

Upgrade any existing `deck-content.json` to the current depth standard in one command. Built decks from before the standard, hand-edited decks, and quick drafts all come out with a coherent headline story, evidence-bearing bullets, takeaway lines, full structured speaker notes, and charts that make their point.

## How to use

```
/polish-deck
```

Or with an explicit path:

```
/polish-deck path/to/deck-content.json
```

Defaults to `deck-content.json` in the repo root. If a brief exists (`brief.md`), it is used as the evidence source.

## What happens

1. Runs the `narrative-editor` pass over the deck:
   - Headline spine check — headlines alone must tell the story
   - Bullets deepened to `{text, detail}` assertion + evidence (from the brief only — never invented)
   - `takeaway` written for every content-bearing slide
   - Structured speaker `notes` (opening, points, transition, timeMinutes) on every slide
   - Charts get `highlight`, `insights`, and a source `caption`
2. Runs `brand-guardian` on the polished deck; applies corrections
3. Runs the quality scorecard, then re-exports the PPTX to `output/` when the gate allows

## Prompt for agent

1. Resolve the deck file (argument path, else `deck-content.json` in the repo root). If none exists, say so and point to `/build-deck`.
2. Read `brief.md` when present — it is the only allowed source for new numbers, names, and examples.
3. Delegate to `narrative-editor` with the deck and brief. Apply its corrected deck to `deck-content.json`.
4. Delegate to `brand-guardian`; apply corrections.
5. **Quality scorecard (before export)** — same CLI as `/export-pptx`:
   ```bash
   node .agents/skills/deck-score/scripts/score-deck.js path/to/deck-content.json --json
   ```
   Pass `--brief brief.md` when present. Print one line: `Quality: {score} ({grade}) — {errorCount} errors, {warningCount} warnings`. If `DECK_QUALITY_GATE=strict` or the user passed `--strict` and `errorCount > 0`, **do not export**; show `topFixes` and stop. Otherwise continue (coach only).
6. Export:
```bash
cd .agents/skills/export-pptx/scripts
node bundled/export-pptx.cjs ../../../../deck-content.json
```
7. Report the change log: quality one-liner, headlines rewritten, bullets deepened, takeaways added, notes coverage, total talk time vs. delivery time, charts highlighted, and any flags (claims with no evidence).

Never invent data to fill a gap — surface flagged slides for the user to resolve.

## Output

- `deck-content.json` — polished in place (editable)
- `output/<deck-title>.pptx` — re-exported with native bullets, takeaways, and the talk track in the notes pane
