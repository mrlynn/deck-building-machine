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
| **Target slide count** | 7 |
| **Presenter** | ADM / FE |
| **Delivery time** | 20–30 minutes |

---

## Background

Assembled content blocks for the Deck Machine leave-behind teaching spine.
Blocks are JTBD-named units under `content-blocks/` — not a Hub Studio hub.

**Included blocks**

- Spend context on the task, not on rule bloat (`optimize-tokens@1.0.0`)

---

## Key messages

1. Rules stay on; Skills are buttons; Agents are the pipeline.
2. Brand tokens are encoded once for Agents and exporters.
3. Quality gates (`/brand-check` + `/deck-score`) catch failures before export.

---

## Content to include

### Spend context on the task, not on rule bloat

**Job:** Teach that every always-on rule and every pasted file competes with the actual task for context — so champions design Rules like a budget, not a dump.

**Key messages**
1. Applied rules are injected into model context (see Cursor Rules docs) — `alwaysApply: true` pays on every chat.
2. Prefer scoped rules: globs for file types, `description` for Apply Intelligently, manual `@rule` for rare checklists.
3. Keep rules focused (docs: under 500 lines; split large ones). Reference files with `@` instead of copying contents.
4. Session hygiene: new chat when the job changes; let Agent explore instead of attaching a dozen files.

**Content to include**
- Four apply modes: Always / Intelligently / Specific Files / Manual
- Leave-behind pattern: one lean always-on brand rule; workflow rules stay contextual
- Anti-patterns: monolithic always-on style guides, duplicating what Agent already knows
- Tie to Lab / decision tree: “if it should always apply, make it a Rule — but make it short”

**What to avoid**
- Inventing exact token prices or undocumented UI gauges
- Telling teams to delete the brand `alwaysApply` rule — that tax is intentional
- Turning this into a full model-picker tutorial

**Review note:** Draft for SME pass (enablement priority #2). Re-check https://cursor.com/docs/context/rules before customer delivery.

---

## Assembled talk tracks

# Talk track — Optimize tokens / context

**Open:** “Context is working memory. If you fill it with rules nobody needed for this task, the model has less room for your code.”

**Beats**
1. Open `.cursor/rules` in the leave-behind. Point at the brand rule with `alwaysApply: true` — intentional, keep it lean.
2. Open `deck-workflow` (or equivalent) — *not* always on. That is the pattern: pay every turn only for what must always be true.
3. Show the four apply modes from Cursor docs: Always, Intelligently (description), Specific Files (globs), Manual (@-mention).
4. Anti-pattern: “paste the whole style guide into alwaysApply.” Fix: linter + short rule + `@` reference to an example file.
5. Session: when you switch jobs, start a new chat. Prefer Agent exploring the repo over attaching 15 files.

**Exit line:** “Budget always-on. Scope the rest. Point, don’t paste.”

**Time:** ~8–10 minutes. Pairs after Encode brand / Rules lab.

**Live check:** https://cursor.com/docs/context/rules — confirm apply-mode table still matches before the room.

---

## What to avoid

- Topic-label headlines
- Treating Studio as an Office SaaS
- Skipping Lab 4 exit criteria
