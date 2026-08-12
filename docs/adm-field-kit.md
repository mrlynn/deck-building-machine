# ADM field kit — teach from content blocks

Day-of kit for ADMs. Authoring lives in `content-blocks/`; `examples/assembled-*` is a **build artifact**. Studio does not host these decks — you regenerate PPTX locally and teach from talk tracks.

## Before the room (once per laptop / before the trip)

```bash
npm run field-kit
```

That assembles every block in `content-blocks/catalog.json` and exports PPTX into:

`examples/assembled-<block-id>/output/*.pptx` (gitignored)

Exports use **Cursor** brand tokens (`brand/cursor/`), not the reference dogfood pack in `brand/`. Customer leave-behinds still encode each account into `brand/brand-pack.json` via Studio.

Optional — one job only:

```bash
npm run field-kit -- use-cursor-cli
```

## Modules (jobs, not course numbers)

| Job | Talk track | Assembled deck | Notes |
|---|---|---|---|
| Prove Rules stay on with Lab 4 | `content-blocks/prove-primitives-with-lab4/talk-track.md` | `examples/assembled-prove-primitives-with-lab4/` | Leave-behind spine |
| Encode brand once as tokens | `content-blocks/encode-brand-as-tokens/talk-track.md` | `examples/assembled-encode-brand-as-tokens/` | Leave-behind spine |
| Catch thin decks with `/deck-score` | `content-blocks/govern-quality-with-cli/talk-track.md` | `examples/assembled-govern-quality-with-cli/` | Leave-behind spine |
| Run Agent from the terminal (CLI) | `content-blocks/use-cursor-cli/talk-track.md` | `examples/assembled-use-cursor-cli/` | Draft — SME before external 101 |
| Spend context on the task | `content-blocks/optimize-tokens/talk-track.md` | `examples/assembled-optimize-tokens/` | Draft — SME before external 101 |
| Answer privacy + show review gates | `content-blocks/govern-privacy-and-review/talk-track.md` | `examples/assembled-govern-privacy-and-review/` | Draft — SME + security |

**Leave-behind trio in one file** (Lab 4 path):

```bash
npm run assemble:blocks
# → examples/assembled-primitives-lab/
node .agents/skills/export-pptx/scripts/bundled/export-pptx.cjs \
  examples/assembled-primitives-lab/deck-content.json
```

## Day-of checklist

- [ ] Ran `npm run field-kit` (or confirmed PPTX timestamps are fresh)
- [ ] Opened talk track for the jobs you will teach (not the whole catalog)
- [ ] Privacy / CLI / tokens: only if SME-reviewed for this audience — otherwise keep them internal
- [ ] Package leave-behind in Studio when the customer needs a branded zip
- [ ] Keep Studio **Talk track** open for the Lab 4 demo script; use this doc for curriculum sidebars
- [ ] After first customer PPTX: Lab 4 → `/brand-check` → point at `docs/after-the-demo.md`

## How to use a module in the room

1. Open the talk track markdown — exit line and time estimate first.
2. Flip slides from the exported PPTX (or present from `deck-content.json` via `/preview-deck` if you prefer).
3. Stay on official Cursor docs links in the talk track — do not invent privacy or product claims.
4. Hand off: leave-behind zip + Lab 4, not “here is a pre-baked 101 deck forever.”

## Review gate (enablement)

Blocks ship as `status: draft` until reviewers sign off. For a single spine deck reviewers can walk:

```bash
npm run assemble:standard
# → examples/assembled-standard-enablement/
# leave-behind trio + CLI + tokens + privacy (curriculum still draft)
```

After sign-off, clear draft notes in `catalog.json` and re-run `assemble:standard` / `field-kit`.

## Related

- [content-blocks.md](./content-blocks.md) — authoring and catalog
- [primitives-lab.md](./primitives-lab.md) — Lab 4
- [after-the-demo.md](./after-the-demo.md) — day 2 ownership
- Studio Help → **Teaching modules (field kit)**
