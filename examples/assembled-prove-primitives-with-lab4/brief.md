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
| **Target slide count** | 6 |
| **Presenter** | ADM / FE |
| **Delivery time** | 20–30 minutes |

---

## Background

Assembled content blocks for the Deck Machine leave-behind teaching spine.
Blocks are JTBD-named units under `content-blocks/` — not a Hub Studio hub.

**Included blocks**

- Prove Rules stay on with Lab 4 (`prove-primitives-with-lab4@1.0.0`)

---

## Key messages

1. Rules stay on; Skills are buttons; Agents are the pipeline.
2. Brand tokens are encoded once for Agents and exporters.
3. Quality gates (`/brand-check` + `/deck-score`) catch failures before export.

---

## Content to include

### Prove Rules stay on with Lab 4

**Job:** After the happy-path PPTX, spend ~20 minutes so the room feels Rules / Skills / Agents — not another feature tour.

**Key messages**
1. Rules shape Agent output without typing `@` or `/` (`alwaysApply` brand rule).
2. Skills are what humans type under `/`; agents are the pipeline behind them.
3. Lab 4 proves quality: break a headline → `/brand-check` → fix → `/export-pptx`.

**Content to include**
- Always-on brand rule vs contextual deck-workflow rule
- Atomic skills: `/write-slide`, `/brand-check`, `/export-pptx` (not only `/build-deck`)
- Lab 4 exit: deliberate bad edit caught by brand-guardian
- Optional: `/deck-score` when a takeaway is deleted

**What to avoid**
- Topic-label headlines (“Overview”, “Q2 Results”)
- Treating the PPTX as the product — it is the proof artifact

---

## Assembled talk tracks

# Talk track — Prove primitives with Lab 4

**Open:** “The PowerPoint proved the pipeline. These next minutes prove *why* the repo is wired this way.”

**Beats**
1. Rules — open `.cursor/rules/*-brand.mdc`, note `alwaysApply: true`. Ask for a topic-label slide without a skill; watch the insight rewrite.
2. Skills — open `/`, run `/write-slide` only, then `/export-pptx`. Atomic change, no full rebuild.
3. Agents — `/brand-check` wraps `brand-guardian`. Skills are the button; agents are the pipeline.
4. Lab 4 — break a headline or insert a banned phrase → `/brand-check` → fix → export.

**Exit line:** “You saw the rule catch a violation you introduced on purpose. That is the leave-behind working.”

**Time:** ~20 minutes total (Labs 1–4). Skip Lab 5 unless the room wants depth.

---

## What to avoid

- Topic-label headlines
- Treating Studio as an Office SaaS
- Skipping Lab 4 exit criteria
