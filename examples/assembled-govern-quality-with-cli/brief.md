# Deck Brief

> Assembled from content-blocks via `npm run assemble:blocks`.
> Review, then run `/build-deck` or `/polish-deck` on the sibling deck-content.json.

---

## Deck information

| Field | Value |
|---|---|
| **Topic** | Leave-behind teaching blocks (assembled) |
| **Audience** | Customer champions and engineers in a Cursor demo |
| **Purpose** | Inform |
| **Target slide count** | 5 |
| **Presenter** | ADM / FE |
| **Delivery time** | 20–30 minutes |

---

## Background

Assembled content blocks for the Deck Machine leave-behind teaching spine.
Blocks are JTBD-named units under `content-blocks/` — not a Hub Studio hub.

**Included blocks**

- Catch thin decks with /deck-score before export (`govern-quality-with-cli@1.0.0`)

---

## Key messages

1. Rules stay on; Skills are buttons; Agents are the pipeline.
2. Brand tokens are encoded once for Agents and exporters.
3. Quality gates (`/brand-check` + `/deck-score`) catch failures before export.

---

## Content to include

### Catch thin decks with /deck-score before export

**Job:** Add a structural quality gate next to brand judgment so leave-behinds do not ship with topic labels or missing depth.

**Key messages**
1. `/brand-check` runs brand-guardian — voice, banned phrases, insight headlines.
2. `/deck-score` is a Node CLI on `deck-content.json` — structure, depth, aesthetics (warn by default; `--strict` to fail).
3. Lab 4 optional path: delete a takeaway → score drops → fix → re-check.

**Content to include**
- When to run brand-check vs deck-score
- `npm run smoke:deck-quality` / skill script paths for maintainers
- Strict mode for CI-minded champions
- Not a Studio dashboard — CLI and skills only (per scorecard spec)

**What to avoid**
- Treating scorecard as a vanity dashboard in Studio
- Inventing metrics to “pass” aesthetics

---

## Assembled talk tracks

# Talk track — Govern quality with CLI

**Open:** “Brand-check is judgment. Deck-score is the structural gate — both before you trust the PPTX.”

**Beats**
1. After Lab 4 break — run `/brand-check` as usual.
2. Optional: strip a takeaway, run `/deck-score` (or `--strict`), show Depth/errors move.
3. Fix and re-export. Point at `.agents/skills/deck-score/` for champions who want CI later.
4. Reminder: Studio does not host a scorecard UI on purpose.

**Exit line:** “You have two gates: guardian for brand voice, CLI for thin structure.”

**Time:** ~3–5 minutes inside Lab 4, or a short add-on after the required brand-check pass.

---

## What to avoid

- Topic-label headlines
- Treating Studio as an Office SaaS
- Skipping Lab 4 exit criteria
