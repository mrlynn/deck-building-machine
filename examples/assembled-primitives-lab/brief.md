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
| **Target slide count** | 12 |
| **Presenter** | ADM / FE |
| **Delivery time** | 20–30 minutes |

---

## Background

Assembled content blocks for the Deck Machine leave-behind teaching spine.
Blocks are JTBD-named units under `content-blocks/` — not a Hub Studio hub.

**Included blocks**

- Prove Rules stay on with Lab 4 (`prove-primitives-with-lab4@1.0.0`)
- Encode brand once so Agents and exporters share tokens (`encode-brand-as-tokens@1.0.0`)
- Catch thin decks with /deck-score before export (`govern-quality-with-cli@1.0.0`)

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

### Encode brand once so Agents and exporters share tokens

**Job:** Show that Studio is encoding brand as always-on rules and shared export tokens — not decorating a single PowerPoint.

**Key messages**
1. Colors, fonts, voice, and words-to-avoid land in `.cursor/rules` and `brand/`.
2. Layout style (classic / minimal / bold) shapes both Agent slide mix and exporter frames.
3. Same tokens feed PPTX, DOCX, and XLSX skills — thin renderers, one factory.

**Content to include**
- Brand pack fields: primary/dark/grays, voice summary, logos on dark/light
- Always-on rule path: `.cursor/rules/<slug>-brand.mdc`
- Factory outputs: slides default; doc and workbook prove more renderers
- Day-2 ownership: brand/ stays with marketing + champion

**What to avoid**
- Implying Studio generates finished customer Office files in the browser
- Inventing chart numbers not in the brief

---

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

# Talk track — Encode brand as tokens

**Open:** “We are not picking colors for one deck. We are encoding brand so every Agent chat and every exporter agrees.”

**Beats**
1. In Studio Encode brand — point at the alert: colors and voice become always-on rules.
2. After download — open `brand/brand-pack.json` and `.cursor/rules/*-brand.mdc`.
3. Factory outputs — PPTX is the demo vehicle; Doc/XLSX are the same tokens, thin skills.
4. Ownership — marketing owns palette/voice; champion owns the Git home.

**Exit line:** “Change the brand pack once; Agents and exporters pick it up without a redesign loop.”

**Time:** ~5 minutes inside the packaging demo, or a short Encode brand teachable moment.

---

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
