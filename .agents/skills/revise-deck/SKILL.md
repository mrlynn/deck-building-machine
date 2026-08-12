---
name: revise-deck
description: Apply surgical natural-language edits to deck-content.json, then regenerate the HTML preview. Use for weekly iteration — fix slide N, sharpen an ask, cut a bullet — without a full /build-deck rebuild.
---

# /revise-deck

Surgical edit loop: change the JSON, preview, confirm — then export when ready.

## How to use

```
/revise-deck Fix slide 4 headline to lead with the minutes vs days claim. Cut the third bullet on slide 3.
```

Or interactive:

```
/revise-deck
```

(Agent asks what to change.)

## What happens

1. Reads `deck-content.json` (or path you specify)
2. Applies only the requested edits — does **not** rebuild the whole deck
3. Keeps brand rules (insight headlines, assertion+detail, ≤5 bullets, speaker notes intact unless asked)
4. Writes `deck-content.json`
5. Runs `/preview-deck` so you can see the result
6. Asks whether to `/export-pptx`, keep revising, or `/brand-check`

## Prompt for agent

When invoked:

### 1. Resolve target

- Default file: `deck-content.json` in the workspace root
- If the user names a slide (“slide 4”, “the metrics slide”), map to the 1-based index or matching headline

### 2. Apply edits surgically

- Prefer patching fields in place over rewriting the file from scratch
- Preserve `notes` unless the user asks to change the talk track
- Preserve chart/diagram data unless the edit is about that visual
- After edits, re-check: insight headline, max 5 bullets, assertion+detail where evidence exists
- Do **not** invent metrics

### 3. Preview

Run the preview script (same as `/preview-deck`):

```bash
cd .agents/skills/preview-deck/scripts
node preview-deck.js ../../../../deck-content.json
```

### 4. Confirm loop

Show a short diff summary (what changed), the preview path, then:

```
Revised. Preview: output/preview.html

Next: describe another change, /export-pptx, or /brand-check
```

If the user keeps giving edits in the same thread, stay in this loop — do not restart `/build-deck` unless they ask for a full rebuild.

## Anti-patterns

- Do not regenerate all slides for a one-line fix
- Do not skip the HTML preview after edits
- Do not ask the user to hand-edit JSON unless they prefer it
