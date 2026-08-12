# After the demo — ownership, preflight, and next steps

The PowerPoint proved the pipeline. This page is what happens on day 2.

## What you just proved

Three Cursor primitives worked together for Marriott:

1. **Rules** — brand standards loaded without anyone typing `@` or `/`
2. **Skills** — humans typed `/create-brief` and `/build-deck`
3. **Agents** — multi-step workers ran behind the skills

The PPTX is **proof**, not the product. The product is a repeatable Cursor factory.

## Cursor preflight

Before the next live run, confirm:

- [ ] Cursor **Agent** mode is available (skills under `/` appear in Agent chat)
- [ ] Bundled Office exporters present: `.agents/skills/export-*/scripts/bundled/export-*.cjs` (no npm install)
- [ ] Chart and diagram slides work without image generation
- [ ] `image` slides need Cursor image generation — if unavailable, prefer `diagram` / `chart` (or let `visual-creator` fall back to diagram)

## Who owns what

| Piece | Owner | Notes |
|---|---|---|
| `brand/` + `.cursor/rules/marriott-brand.mdc` | Brand / marketing + champion | Keep palette, voice, and the always-on rule in sync |
| This repo (Git home) | Customer champion | Prefer a **team Git repo** over one laptop |
| Studio zip / layout style / exporter templates | Cursor ADM / FE | Regenerate from Deck Machine Studio when templates improve |
| Day-to-day decks | Whoever runs `/create-brief` | Same repo; no new IT app |

## When to regenerate vs edit

| Change | Do this |
|---|---|
| Palette, fonts, voice, logos, layout style (classic / minimal / bold) | Regenerate the zip from **Deck Machine Studio**, then re-open in Cursor |
| One headline or bullet | `/revise-deck` (HTML preview) → `/export-pptx` |
| New “always apply” brand writing standard | Update the brand rule (and mirror in `brand/`) — see [primitives-decision-tree.md](./primitives-decision-tree.md) |
| New human-triggered workflow | Add or extend a **Skill** |
| Multi-step specialized job | Add or extend an **Agent**, usually invoked by a skill |

## Extra renderers and the weekly loop

Same factory, thin skills (optional after the happy-path PPTX):

| Skill | Output |
|---|---|
| `/preview-deck` / `/revise-deck` | HTML preview + surgical edits before PPTX |
| `/build-doc` | Branded Word narrative (`doc-content.json` → DOCX) |
| `/export-metrics-xlsx` | Metrics/chart slides → branded workbook |

`/create-brief` will use meeting/account **MCP tools when connected**; paste and interview still work offline.

## What this leave-behind is not

- Not a PowerPoint / Office SaaS or design-agency replacement
- Not a full Cursor curriculum — it teaches **Rules, Skills, and Agents** through one concrete workflow
- **Hooks** and the plugin marketplace remain common *next* factory layers beyond this zip. MCP is supported as an optional intake for `/create-brief`, not as a required setup step. Use [primitives-decision-tree.md](./primitives-decision-tree.md) when you extend later

## Next 20 minutes (learning exit criterion)

PPTX shows the pipeline worked. **Lab 4** shows they learned the primitives:

1. Open [primitives-lab.md](./primitives-lab.md)
2. Complete **Lab 4 — Break → fix** (bad headline or banned phrase → `/brand-check` → fix → `/export-pptx`)
3. Optionally skim Labs 1–3 if the room is new to Rules vs Skills vs Agents

Done when someone can say: **Skills are the button; agents are the pipeline; rules stay on without asking.**
