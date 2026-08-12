# Cursor Deck Machine

This repo is a Cursor-native presentation builder. Talk or paste notes → get a branded deck with native charts, diagrams, and agent-generated images.

**Teaching docs:** [docs/primitives-decision-tree.md](docs/primitives-decision-tree.md) (Rule vs Skill vs Agent) · [docs/primitives-lab.md](docs/primitives-lab.md) (20-min practice) · [docs/after-the-demo.md](docs/after-the-demo.md) (day 2) · [docs/adm-field-kit.md](docs/adm-field-kit.md) (ADM day-of content blocks)

## When to use each skill

| Skill | Use when... |
|---|---|
| `/create-brief` | Starting a deck — MCP context when available, else interview or paste; writes `brief.md` |
| `npm run assemble:blocks` | Assemble JTBD content-blocks into `examples/assembled-*/brief.md` + `deck-content.json` ([docs/content-blocks.md](docs/content-blocks.md)) |
| `npm run assemble:standard` | Leave-behind + curriculum blocks → `examples/assembled-standard-enablement/` (SME review spine) |
| `npm run field-kit` | Assemble every catalog block and export PPTX for the ADM day-of kit ([docs/adm-field-kit.md](docs/adm-field-kit.md)) |
| `/build-deck` | You have a brief and want a complete deck in one shot |
| `/build-doc` | Branded Word narrative from the same brief (or from a deck) |
| `/create-outline` | You want to review the story structure before writing slides |
| `/write-slide` | You're iterating on a specific slide or adding one |
| `/revise-deck` | Surgical edits to an existing deck, then HTML preview |
| `/preview-deck` | HTML story preview before PPTX export |
| `/polish-deck` | An existing deck needs depth: takeaways, speaker notes, chart highlights |
| `/deck-score` | Structural + aesthetics scorecard for `deck-content.json` (warn by default; `--strict` / `DECK_QUALITY_GATE=strict` to fail on structural errors) |
| `/brand-check` | Before sharing externally — runs the Node scorecard first, then `brand-guardian` |
| `/export-pptx` | You've edited `deck-content.json` and need a new PPTX |
| `/export-docx` | You've edited `doc-content.json` and need a new DOCX |
| `/export-metrics-xlsx` | Metrics/chart slides → branded Excel workbook |

Office exporters are **pre-bundled** (`scripts/bundled/export-*.cjs`) — no `npm install` for day-to-day use. Brand tokens load from `brand/brand-pack.json` (customer leave-behind). Field-kit / enablement exports use `brand/cursor/` via `DECK_BRAND_DIR`. Maintainers regenerating bundles: `npm run bundle:office`.

## Where things live

- **Brand standards**: `.cursor/rules/*-brand.mdc` (always loaded)
- **Deck workflow**: `.cursor/rules/deck-workflow.mdc` (loaded when working on decks)
- **Skills**: `.agents/skills/` — available via `/` in Cursor Agent chat
- **Subagents**: `.cursor/agents/` — used automatically by the deck-builder
- **Content blocks**: `content-blocks/` — versioned JTBD teaching units; assemble with `npm run assemble:blocks`
- **Templates**: `templates/` — schema for briefs (written by `/create-brief`, not by hand)
- **Brand reference**: `brand/` — palette, typography, voice, slide types
- **Visual assets**: `assets/` — written by `visual-creator` during `/build-deck` (not by hand)
- **Example**: `examples/ai-studio-brief.md` — complete example brief

## How a deck is built

1. Run `/create-brief` (talk or paste notes — do not fill the template by hand)
2. Run `/build-deck brief.md`
3. The `deck-builder` subagent orchestrates:
   - `brief-analyzer` → creates the outline (including `chart` / `diagram` / `image` when needed)
   - `slide-writer` → writes each slide
   - `visual-creator` → validates chart/diagram JSON; generates PNGs into `assets/` for image slides
   - `narrative-editor` → headline spine, assertion+detail bullets, takeaways, speaker notes, chart highlights
   - `brand-guardian` → reviews for compliance
   - Export script → generates `output/<name>.pptx`
4. Pick up your PPTX from `output/`

Humans do **not** supply slide images. Agents author chart data, diagram JSON, and generated art.

`templates/brief.md` is the schema the Agent writes to. Humans use `/create-brief`.

## Updating brand standards

Edit files in `brand/` and update the brand rules file under `.cursor/rules/`.
Commit to version control — all teammates pick up the changes.
