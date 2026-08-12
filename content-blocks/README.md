# Content blocks

Versioned, JTBD-named teaching units. Assemble into a brief + `deck-content.json` fragment. Hub Studio / Enablement OS can consume this catalog later — this folder is the authoring home.

## Naming

- Block ids use kebab-case jobs: `prove-primitives-with-lab4`, not `topic-101`
- `jobTitle` is an insight-style job (“Prove Rules stay on with Lab 4”), not a topic label (“Skills overview”)
- Audience is who the **ADM teaches**, not who runs Studio

## Layout

```
content-blocks/
  schema.json                 # block.json shape
  catalog.json                # published ids + versions
  <block-id>/
    block.json                # metadata + paths
    slides.json               # deck-content slide array (fragment)
    brief-fragment.md         # section for /create-brief / outline
    talk-track.md             # ADM lines for the live room
```

## Assemble

```bash
npm run assemble:blocks -- prove-primitives-with-lab4 encode-brand-as-tokens
# → examples/assembled-<slug>/brief.md + deck-content.json
```

Default (no args) builds the three leave-behind blocks into `examples/assembled-primitives-lab/`.

## ADM field kit

```bash
npm run field-kit
```

Assembles every catalog block and exports PPTX to `examples/assembled-*/output/` (gitignored). Day-of runbook: [docs/adm-field-kit.md](../docs/adm-field-kit.md).

## Out of scope (for now)

- Hub Studio / LMS, per-customer hubs, stale-hub UI
- Studio wizard block picker
- Full Cursor 101/201 curriculum rewrite
- Treating PPTX/DOCX/XLSX renderers as content blocks
