# Cursor Deck Machine

## Michael Lynn, AI Adoption Engineer (Cursor)

A Cursor-native presentation builder. Talk or paste notes → get a branded deck with native charts, diagrams, and agent-generated images.

> **ADMs / FEs:** To generate a deck machine for a specific customer, use **Deck Machine Studio** (this repo's Next.js app — see [docs/studio-readme.md](./docs/studio-readme.md)). It interpolates brand packs and optional Databricks account data into a downloadable repo.

Built from three Cursor primitives:

- **Rules** — brand standards loaded automatically into every session
- **Skills** — reusable one-command workflows (`/create-brief`, `/build-deck`, etc.)
- **Subagents** — autonomous orchestration for multi-step deck creation (including `visual-creator` for charts, diagrams, and images)

**Teaching docs:** [docs/primitives-decision-tree.md](docs/primitives-decision-tree.md) (where does X go?) · [docs/primitives-lab.md](docs/primitives-lab.md) (20-min labs + exit criteria) · [docs/after-the-demo.md](docs/after-the-demo.md) (day 2 ownership)

---



## How it works

```
Talk or paste notes
    → /create-brief  →  brief.md
    → /build-deck    →  deck-content.json  →  output/*.pptx
```

Or run end-to-end when a brief already exists:

```
/build-deck brief.md
```

You do **not** write `deck-content.json` by hand. You do **not** fill the brief template by hand. `/create-brief` writes the brief; `/build-deck` writes the JSON and PPTX.

---



## Setup

1. Clone this repo and open it in Cursor
2. The brand rules load automatically (`.cursor/rules/*-brand.mdc`)
3. Skills are available via `/` in Agent chat

Office exporters (PPTX / DOCX / XLSX) ship **pre-bundled** under each skill’s `scripts/bundled/` folder. No `npm install` for day-to-day use — `/export-pptx`, `/export-docx`, and `/export-metrics-xlsx` run the bundles. Brand tokens load from `brand/brand-pack.json`. Node must be on PATH (Cursor Agent usually has it); customers do not need a JS toolchain.

Maintainers regenerating bundles: `npm run bundle:office`

---



## Quick start

**Step 1: Create a brief (no template typing)**

```
# In Cursor Agent chat — interview mode:
/create-brief

# Or paste messy notes:
/create-brief

Need a deck for Naveen Aug 7. Ask for sprint resources.
1,300 MAU, 40% MCP. Peers: NAB, Money Forward.
```

**Step 2: Build the deck**

```
/build-deck brief.md
```

**Step 3: Get your deck**

```
output/your-deck-title.pptx
```

---



## Skills reference


| Skill             | What it does                        | When to use                                 |
| ----------------- | ----------------------------------- | ------------------------------------------- |
| `/create-brief`   | MCP / interview / paste → `brief.md` | Starting any new deck                      |
| `/build-deck`     | End-to-end: brief → PPTX            | One-shot deck creation                      |
| `/build-doc`      | Brief or deck → branded DOCX        | Narrative leave-behind (same factory)       |
| `/create-outline` | Brief → structured outline          | When you want to review/edit before writing |
| `/write-slide`    | Write content for one slide         | Iterating on a specific slide               |
| `/revise-deck`    | Surgical JSON edits + HTML preview  | Weekly iteration without a full rebuild     |
| `/preview-deck`   | `deck-content.json` → HTML preview  | Confidence before `/export-pptx`             |
| `/polish-deck`    | Retrofit depth: notes, takeaways, chart highlights | Older or hand-edited decks           |
| `/brand-check`    | Review content for brand compliance | Before any external share                   |
| `/export-pptx`    | Convert deck JSON → PPTX            | After editing deck-content.json             |
| `/export-docx`    | Convert doc JSON → DOCX             | After editing doc-content.json              |
| `/export-metrics-xlsx` | Metrics/chart slides → XLSX     | Numbers pack from an existing deck          |


---



## Subagents reference


| Subagent         | Role                                                        |
| ---------------- | ----------------------------------------------------------- |
| `deck-builder`   | Orchestrates full deck pipeline                             |
| `brief-analyzer` | Extracts structure from brief, creates outline              |
| `slide-writer`   | Writes content for individual slides                        |
| `visual-creator` | Validates chart/diagram JSON; generates PNGs into `assets/` |
| `narrative-editor` | Headline spine, assertion+detail bullets, takeaways, speaker notes |
| `brand-guardian` | Reviews and flags brand violations                          |


---



## Brand standards

Color palette, typography, voice, and slide type definitions live in `brand/`.
Update these with the customer's official brand guide values.


| File                   | Contents                         |
| ---------------------- | -------------------------------- |
| `brand/palette.md`     | Hex codes, usage rules           |
| `brand/typography.md`  | Font sizes and hierarchy         |
| `brand/voice.md`       | Tone, word choice, what to avoid |
| `brand/slide-types.md` | Slide type catalog               |


---



## Updating brand standards

1. Edit files in `brand/`
2. Update the brand rules file under `.cursor/rules/` with any new rules
3. Commit to your repo — all teammates pick up changes automatically

---


## Change Log

| Change | Date |
| ----- | -----  |
| 7/13/2026 | Initial Releease |



