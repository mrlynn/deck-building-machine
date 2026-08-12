# Cursor brand pack (enablement exports)

Used by `npm run field-kit` and any export with:

```bash
DECK_BRAND_DIR=brand/cursor node .agents/skills/export-pptx/scripts/bundled/export-pptx.cjs path/to/deck-content.json
```

| File | Role |
|---|---|
| `brand-pack.json` | Palette / layout for Office exporters |
| `logo.png` | Mark on dark / red-orange fills (from `public/cursor-logo-white.png`) |
| `logo-on-light.png` | Mark on light slides (from `public/cursor-logo-dark.png`) |

Customer leave-behinds do **not** use this folder — Studio writes `brand/brand-pack.json` per account.
