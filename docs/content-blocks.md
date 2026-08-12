# Content blocks

Versioned teaching units under `content-blocks/`. Author here; assemble into a brief + `deck-content.json`; Hub Studio can consume the catalog later.

## Why

Enablement needs atomic, task-named content (not another packaging UI). This repo already holds leave-behind teaching (Lab 4, brand pack, scorecard). Content blocks make those units remixable and versioned.

## Quick start

```bash
# Default: three leave-behind blocks → examples/assembled-primitives-lab/
npm run assemble:blocks

# Specific blocks
npm run assemble:blocks -- prove-primitives-with-lab4 govern-quality-with-cli
```

Then open `examples/assembled-*/deck-content.json` and run `/polish-deck` or `/export-pptx` if you want a PPTX proof.

**ADM field kit** (assemble every catalog block + export PPTX in one shot):

```bash
npm run field-kit
# → examples/assembled-<id>/ + output/*.pptx (gitignored)
```

**Standard enablement spine** (all six jobs in one brief/deck for SME review):

```bash
npm run assemble:standard
# → examples/assembled-standard-enablement/
```

Day-of runbook: [adm-field-kit.md](./adm-field-kit.md). Studio Help → **Teaching modules (field kit)**.

## Block shape

Each block folder:

| File | Role |
|---|---|
| `block.json` | id, semver, jobTitle, audience, deps, sourceDocs |
| `slides.json` | Array of `deck-content` slides (with notes) |
| `brief-fragment.md` | Section for briefs / outlines |
| `talk-track.md` | ADM lines for the live room |

See `content-blocks/schema.json` and `content-blocks/README.md`.

## Catalog today

**Stable enough to assemble (draft status)**

1. `prove-primitives-with-lab4` — Lab 4 + Rules/Skills/Agents
2. `encode-brand-as-tokens` — brand pack → rules + exporters
3. `govern-quality-with-cli` — `/brand-check` + `/deck-score`
4. `use-cursor-cli` — Cursor CLI Agent parity (SME review before external 101)
5. `optimize-tokens` — context budget / rule scoping (SME review before external 101)
6. `govern-privacy-and-review` — Privacy Mode + leave-behind review gates (SME + security review before external 101)

**Queued** — empty for now; new curriculum jobs go in `catalog.json` → `queued` first.

```bash
npm run assemble:blocks -- use-cursor-cli
# → examples/assembled-use-cursor-cli/

npm run assemble:blocks -- optimize-tokens
# → examples/assembled-optimize-tokens/

npm run assemble:blocks -- govern-privacy-and-review
# → examples/assembled-govern-privacy-and-review/
```

## Naming rules

- Ids are kebab-case **jobs**: `prove-primitives-with-lab4`
- `jobTitle` is insight-style, not “101 / Topic”
- Bump semver when slides or talk track change meaningfully (Hub stale flags later)

## Out of scope

- Hub Studio / LMS, auth, per-customer hubs
- Studio wizard to pick blocks
- Treating Office exporters as content blocks (they are renderers)

## Related

- [adm-field-kit.md](./adm-field-kit.md)
- [primitives-lab.md](./primitives-lab.md)
- [after-the-demo.md](./after-the-demo.md)
- [primitives-decision-tree.md](./primitives-decision-tree.md)
