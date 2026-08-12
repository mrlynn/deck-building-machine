# Deck Quality Scorecard Design

**Date:** 2026-07-17  
**Status:** Approved for implementation planning  
**Constraint:** No new npm dependencies; reuse Node stdlib + existing bundled exporter toolchain only

## Problem

Deck quality today depends on LLM judgment in `brand-guardian` / `/brand-check`. That review is useful but:

- Not numeric or repeatable across runs
- Does not block thin decks from exporting
- Leaves structural depth gaps (missing notes, takeaways, chart `highlight` / `caption`) easy to miss
- Is invisible during a fast `/export-pptx` path

We need a **coachable scorecard** always, and an **opt-in structural gate** when teams want export to fail closed.

## Goals

- Emit a clear, repeatable structural score for any `deck-content.json`
- Always coach (print score + ranked fixes); never surprise-block by default
- Hard-fail only when `DECK_QUALITY_GATE=strict` or `--strict` is set, and only for a defined structural error set
- Hybrid model: Node owns structural metrics; agent owns insight/voice/spine judgment
- Coach visual aesthetics aligned to **Marriott Executive Classic** (density, mix, brand type/color invariants) — never override brand typography with generic TED-style rules
- Two surfaces: fast `/deck-score`, combined `/brand-check`
- Zero new npm packages

## Non-goals

- New charting, PDF, or image libraries
- Blocking export by default
- Using agent judgment to hard-fail export (agents warn only)
- Aesthetics checks that hard-fail the strict gate (aesthetics are coach-only: `warning` / always-pass `info`)
- Generic 5/5/5 or “body ≥18pt” rules that conflict with Marriott type scale (body 13–15pt, ~12 words/bullet)
- Measuring literal white-space % or PowerPoint Drawing Guides from JSON
- Scoring Morph/Fade/animations the exporter does not emit
- A Studio UI dashboard in this iteration (CLI + chat report only)
- Inventing brief evidence or rewriting slides inside the scorer (scoring only; fix via `/polish-deck` / `/revise-deck`)
- Pulling colors from Color Hunt or non-brand palettes

## Decisions (locked)

| Decision | Choice |
|---|---|
| Mode | Coach always; structural hard-fail only when strict |
| Default gate | Warn (exit 0 with warnings); strict via env or flag |
| Computation | Hybrid — Node structural + agent judgment |
| Surfaces | `/deck-score` (Node only) and `/brand-check` (Node + brand-guardian) |
| Scoring model | Checklist points + category percentages; strict ignores overall % |
| Aesthetics | Coach-only category; Marriott-aligned; never contributes structural `error` |

## Approach (selected)

**Hybrid score + gate floors**

1. A pure Node module walks `deck-content.json` and evaluates a fixed checklist.
2. Each check contributes to category percentages (coaching) and a severity (`error` | `warning` | `info`). `info` always passes; used for documented invariants (esp. aesthetics).
3. Strict mode fails the process only if one or more **structural errors** are present (never aesthetics).
4. `brand-guardian` consumes the Node JSON and adds judgment dimensions; it never overrides structural counts.

Rejected:

- **Weights-only 0–100** — harder to map to “must fix before share”
- **Agent-only score** — not repeatable; cannot safely gate export
- **Strict by default on `/export-pptx`** — blocks intentional thin decks and demos

## Architecture

```
deck-content.json
       │
       ▼
┌──────────────────────────┐
│ deck-quality.js (shared) │  ← pure functions, no deps
│  scoreDeck(deck, opts)   │
└────────────┬─────────────┘
             │
     ┌───────┴────────┐
     ▼                ▼
 score-deck.js     brand-check / brand-guardian
 (/deck-score)     (merge structural + judgment)
     │
     ▼
 export-pptx / build-deck / polish-deck
 (print one-line summary; exit 1 only if strict + errors)
```

| Piece | Role |
|---|---|
| `.agents/skills/_shared/deck-quality.js` | Core scorer: checklist, categories, JSON report |
| `.agents/skills/deck-score/SKILL.md` | `/deck-score` skill instructions |
| `.agents/skills/deck-score/scripts/score-deck.js` | CLI: load JSON, call scorer, print, exit code |
| `.agents/skills/brand-check/SKILL.md` | Updated: run scorer first, then brand-guardian |
| `.cursor/agents/brand-guardian.md` | Updated: require `scorecard` passthrough + `judgment` block |
| `.agents/skills/export-pptx/SKILL.md` | Print summary; honor strict gate before write |
| `.agents/skills/build-deck/SKILL.md`, `polish-deck/SKILL.md` | Same gate policy as export |
| `examples/delight-sample/` | Thin fixture stays; add polished fixture for high score |
| `templates/deck-machine/...` | Mirror skill/agent/shared changes for factory output |

Template kit (`templates/deck-machine/`) must stay in sync with `.agents/` and `.cursor/agents/` copies.

## Data model

### Scorer output (`DeckQualityReport`)

```json
{
  "version": 1,
  "deckPath": "deck-content.json",
  "slideCount": 12,
  "overall": {
    "score": 72,
    "passed": 36,
    "applicable": 50,
    "grade": "C"
  },
  "categories": {
    "structure": { "score": 100, "passed": 4, "applicable": 4 },
    "notes": { "score": 50, "passed": 6, "applicable": 12 },
    "depth": { "score": 40, "passed": 4, "applicable": 10 },
    "visuals": { "score": 67, "passed": 2, "applicable": 3 },
    "variety": { "score": 100, "passed": 1, "applicable": 1 },
    "aesthetics": { "score": 80, "passed": 4, "applicable": 5 }
  },
  "gate": {
    "mode": "warn",
    "passed": true,
    "errorCount": 0,
    "warningCount": 5
  },
  "checks": [
    {
      "id": "notes.present",
      "category": "notes",
      "severity": "error",
      "passed": false,
      "slideIndex": 3,
      "message": "Slide 3 missing notes",
      "fixHint": "Add structured notes: opening, points, transition, timeMinutes"
    }
  ],
  "topFixes": [
    "Add structured speaker notes on 6 slides",
    "Add takeaway on 4 content-bearing slides",
    "Set chart highlight on slide 5"
  ]
}
```

### Scoring rules

- `overall.score` = `round(100 * passed / applicable)` when `applicable > 0`, else `100`
- Category scores use the same formula over checks in that category
- Checks that do not apply (e.g. chart rules on a content slide) are omitted from `applicable`
- Grades: `A` ≥90, `B` ≥80, `C` ≥70, `D` ≥60, `F` &lt;60 (coaching only; not used by the gate)
- `topFixes`: up to 5 human-readable aggregations of failed checks, errors first
- `slideIndex` is **1-based** (matches `brand-guardian`); deck-level checks use `slideIndex: null`
- `gate.passed` is `true` iff `errorCount === 0` (structural cleanliness). Warn mode still exits `0` when `gate.passed` is false; only `--strict` / `DECK_QUALITY_GATE=strict` turns `gate.passed === false` into process exit `1`
- Failed checks still count toward `applicable` (they lower the score); only inapplicable checks are omitted

### Agent merge (`brand-guardian`)

```json
{
  "overallCompliance": "pass|review|fail",
  "scorecard": { "...DeckQualityReport..." },
  "judgment": {
    "spine": "pass|warn|fail",
    "voice": "pass|warn|fail",
    "evidence": "pass|warn|fail",
    "aesthetics": "pass|warn|fail",
    "summary": "One paragraph"
  },
  "slideReviews": [],
  "globalIssues": [],
  "summary": "Brief summary"
}
```

`overallCompliance` mapping:

- `fail` — any structural `error` **or** judgment `spine`/`evidence` is `fail`
- `review` — no structural errors, but warnings or judgment warn (including judgment `aesthetics: warn`)
- `pass` — no structural errors, no judgment fail/warn

Strict export gate uses **only** `scorecard.gate` (structural `error` counts), not `judgment` and not aesthetics warnings.

Judgment `aesthetics` covers what Node cannot: one-idea crowding beyond bullet counts, takeaway that merely restates the headline, “wall of text” feel, contrast/color only if content escapes brand tokens (rare).

## Checklist catalog

### Category: `structure` (schema / shape)

| id | Severity | Rule |
|---|---|---|
| `structure.validType` | error | Every slide `type` is one of the known enum values |
| `structure.hasHeadline` | error | Non-quote slides have a non-empty `headline` (quote may use empty headline) |
| `structure.metadata` | warning | `metadata.title` present |

### Category: `notes`

| id | Severity | Rule |
|---|---|---|
| `notes.present` | error | Every slide has `notes` (string or object) |
| `notes.structured` | warning | `notes` is an object with `opening`, `points` (array length 2–4), `transition`, `timeMinutes` |
| `notes.timeBudget` | warning | Only when `--brief` is passed and a delivery time can be parsed from the brief (first match of `/\b(\d+)\s*(?:min|minutes)\b/i` in a line containing `deliver` or `time`, or an explicit `Delivery:` / `Duration:` line). Then require sum of slide `timeMinutes` ≤ parsed minutes × 1.1. If no time can be parsed, omit this check |

### Category: `depth`

Applies to content-bearing types: `content`, `two-column`, `metrics`, `chart`, `diagram`.

| id | Severity | Rule |
|---|---|---|
| `depth.takeaway` | error | Each content-bearing slide has non-empty `content.takeaway` |
| `depth.bulletCount` | error | `content` bullets ≤ 5; each `two-column` column’s bullets ≤ 5 independently |
| `depth.bulletLength` | warning | Each bullet `text` (or string bullet) ≤ 12 words |
| `depth.assertionDetail` | warning | Prefer `{text, detail}`: at least half of bullets on a content/two-column slide use `detail` when the slide has ≥2 bullets |
| `depth.bannedGeneric` | error | Bullet text must not match banned phrases (case-insensitive): “improve efficiency”, “drive alignment”, “enhance collaboration”, “streamline processes” |
| `depth.metricsDelta` | warning | Metrics slides: at least one metric has `delta` when ≥2 metrics exist |

### Category: `visuals`

| id | Severity | Rule |
|---|---|---|
| `visuals.chartCaption` | error | Every `chart` has non-empty `content.caption` |
| `visuals.chartHighlight` | error | Every `chart` has non-empty `content.highlight` |
| `visuals.chartType` | error | `chartType` is a supported value |
| `visuals.pieSlices` | warning | `pie`/`doughnut` categories ≤ 5 |
| `visuals.diagramNodes` | warning | `diagram` nodes ≤ 6 |
| `visuals.imagePath` | error | `image` `content.path` resolves to an existing file under `assets/` (same resolution rules as exporter) |
| `visuals.imagePrompt` | warning | `image` slides have non-empty `content.prompt` |

### Category: `variety`

| id | Severity | Rule |
|---|---|---|
| `variety.noTripleContent` | error | No run of 3+ consecutive `content` slides |
| `variety.hasVisual` | warning | If deck has ≥8 slides and contains no `chart` or `diagram` slide, emit one deck-level warning (`slideIndex` null) |

### Category: `aesthetics` (Marriott-aligned visual craft — coach only)

Preamble for implementers and agents: these checks adapt common presentation aesthetics to **Executive Classic**, not generic conference rules. The exporter already applies brand fonts, type scale, palette, 16:9 layout, and zero animations. The scorer coaches density and mix; it does **not** re-litigate brand pt sizes.

**Rejected as scoring targets (document in code comments + skill text):**

| Generic rule | Why rejected here |
|---|---|
| Body text ≥18pt | Marriott body is 13–15pt (min 12pt) |
| 5 words per line / strict 5/5/5 | Bullets allow ~12 words; assertion+detail would always fail |
| Dual heading/body typefaces | Single brand stack (Arial first); exporter uses one `fontFace` |
| Literal 15–20% white space | Not measurable from JSON without a layout engine |
| Morph / Fade / Drawing Guides | Exporter does not emit animations; N/A |
| External palettes (Color Hunt) | Colors come only from `brand/brand-pack.json` |

**Node checks** (severity is `warning` or always-pass `info` only — never `error`):

| id | Severity | Rule |
|---|---|---|
| `aesthetics.brandTypeInvariant` | info | Always pass. Documents that type scale/font are owned by the exporter + brand pack (slide title 26pt+, body 13–15pt, one fontFace). Included so the scorecard surfaces the invariant |
| `aesthetics.brandColorInvariant` | info | Always pass. Documents 3-role palette (primary / dark / accent) + high-contrast pairs (white on red/dark; dark on white). No per-slide color overrides exist in schema |
| `aesthetics.noAnimation` | info | Always pass until the exporter supports motion. Documents “animate with restraint”: 0 animated slides is correct |
| `aesthetics.metricsTileCap` | warning | Each `metrics` slide has ≤4 tiles in `content.metrics` |
| `aesthetics.textHeavyRun` | warning | A slide is text-heavy when `type` is `content` or `two-column` and assertion bullet count &gt; 3 (string bullets + `{text}` items; do not count `detail` lines). No run of **5+** consecutive text-heavy slides. Emit once for the run; `slideIndex` = 1-based index of the first slide in the run |
| `aesthetics.quoteHasAttribution` | warning | Each `quote` slide has non-empty `content.attribution` |

Diagram node density (≤6) stays under `visuals.diagramNodes` only — do not duplicate into aesthetics.

**Relationship to `depth` / `variety`:** bullet caps and ~12-word length stay in `depth`; triple-`content` error stays in `variety`. Aesthetics adds the softer 5-in-a-row text-heavy run and metrics tile cap without changing gate severity.

**Info checks and `applicable`:** `brandTypeInvariant`, `brandColorInvariant`, and `noAnimation` always pass and **do** count toward `aesthetics.applicable` (they keep the category visible on thin decks). They never fail and never affect the gate.

Agent-only (not in Node): insight headline quality, headline spine coherence, takeaway ≠ restated headline, notes points beyond slide text, invented numbers vs brief, jargon/passive voice, one-idea crowding beyond counts, visual hierarchy “feel” after `/preview-deck`.

## CLI and gate behavior

### `score-deck.js`

```bash
node .agents/skills/deck-score/scripts/score-deck.js path/to/deck-content.json
node .agents/skills/deck-score/scripts/score-deck.js path/to/deck-content.json --json
node .agents/skills/deck-score/scripts/score-deck.js path/to/deck-content.json --strict
node .agents/skills/deck-score/scripts/score-deck.js path/to/deck-content.json --brief brief.md
```

- `DECK_QUALITY_GATE=strict` is equivalent to `--strict`
- Exit codes: `0` in warn mode even when `errorCount > 0` (coach only); `1` if strict and `errorCount > 0`; `2` on I/O or parse failure
- Default stdout: human summary (overall, categories, topFixes, gate line)
- `--json`: stdout is the full `DeckQualityReport` only
- `--brief` is optional; only enables `notes.timeBudget` when parseable

### Integration points

| Flow | Behavior |
|---|---|
| `/deck-score` | Run CLI; show report; mention `/polish-deck` when score &lt; 80 or errors &gt; 0 |
| `/brand-check` | Run CLI `--json`, pass report into brand-guardian prompt, render combined table |
| `/export-pptx` | Run scorer in warn mode by default; print one line `Quality: 72 (C) — 0 errors, 5 warnings`. If strict and errors: **do not write PPTX**, print topFixes, exit |
| `/build-deck`, `/polish-deck` | After brand pass, before/at export: same as export-pptx |

Agents invoke the CLI with `node` the same way they invoke `bundled/export-pptx.cjs` — no `npm install`.

## Human report shape (chat)

```
## Deck quality: 72 (C) — gate warn ✓

| Category | Score |
|---|---|
| Structure | 100 |
| Notes | 50 |
| Depth | 40 |
| Visuals | 67 |
| Variety | 100 |
| Aesthetics | 80 |

Top fixes:
1. ...
2. ...

Strict mode: DECK_QUALITY_GATE=strict or --strict (fails on structural errors only; aesthetics never hard-fail)
```

Then, for `/brand-check`, the existing per-slide brand table follows under a **Judgment** heading.

## Fixtures and tests

| Fixture | Purpose |
|---|---|
| `examples/delight-sample/deck-content.json` | Thin / demo deck — expect low depth/notes scores; useful for “before” |
| `examples/delight-sample/deck-content.polished.json` (new) | High structural score; used as golden for scorer smoke |
| `examples/delight-sample/score-report.golden.json` (optional) | Snapshot of polished report categories (stable ids) |

Smoke (no test framework required):

```bash
node .agents/skills/deck-score/scripts/score-deck.js examples/delight-sample/deck-content.polished.json --json
# expect gate.errorCount === 0 and overall.score >= 90
```

Node `assert` in a tiny `scripts/smoke-deck-quality.js` is acceptable; do not add Jest/Vitest.

## Docs and teaching

- Mention scorecard in `AGENTS.md` skill table (`/deck-score`, note on `/brand-check`)
- Optional one-liner in `docs/primitives-lab.md` Lab 4: break a takeaway → see score drop / strict fail
- Do not expand brand markdown with a second parallel checklist — brand-guardian remains the judgment source of truth; this spec’s Node catalog is the structural source of truth

## Implementation order (for planning)

1. `deck-quality.js` + CLI + polished fixture + smoke (include `aesthetics` category)
2. `/deck-score` skill (report table includes Aesthetics; note coach-only)
3. Wire warn summary + strict gate into export / build / polish skills
4. Extend brand-guardian + `/brand-check` (judgment.`aesthetics`)
5. Sync `templates/deck-machine/` mirrors
6. AGENTS.md + lab note

## Risks

| Risk | Mitigation |
|---|---|
| False-positive strict fails on quote/title slides | Content-bearing takeaway rules only apply to listed types; quote headline may be empty |
| Word-count heuristics too strict | Bullet length and assertionDetail are warnings, not errors |
| Template drift | Same files mirrored under `templates/deck-machine/`; checklist in implementation plan |
| Agents skip Node and “estimate” scores | Skill prompts require running the CLI; brand-guardian must paste real JSON |
| Agents “fix” aesthetics by bumping body to 18pt or enforcing 5/5/5 | Spec + skill text explicitly reject those rules; brand rules remain source of truth for type |

## Success criteria

- `/deck-score` on polished fixture exits 0 with score ≥ 90 and 0 errors
- `/deck-score --strict` on current delight sample exits 1 with actionable topFixes
- `/export-pptx` without strict still writes PPTX and prints a quality line
- `/export-pptx` with `DECK_QUALITY_GATE=strict` refuses thin decks
- `/brand-check` shows structural scorecard (including Aesthetics) above judgment table
- Aesthetics failures never set `gate.passed` to false (no `error` severity in that category)
- No new packages in any `package.json`
