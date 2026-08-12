# Quick start

Personal copy of **Cursor Deck Machine** — a Cursor-native presentation builder.

## Setup

1. Clone this repo and open it in Cursor.
2. Brand rules load automatically from `.cursor/rules/*-brand.mdc`.
3. Skills are available via `/` in Agent chat.

Office exporters (PPTX / DOCX / XLSX) ship pre-bundled under each skill's `scripts/bundled/` folder. No `npm install` required for day-to-day deck work — only Node on PATH.

To run **Deck Machine Studio** (the Next.js app for generating customer-specific deck machines):

```bash
cp .env.example .env.local   # add API keys as needed
npm install
npm run dev
```

## Build a deck

```
/create-brief          # interview or paste notes → brief.md
/build-deck brief.md   # brief → deck-content.json → output/*.pptx
```

See [README.md](./README.md) and [AGENTS.md](./AGENTS.md) for the full skill reference.

## Brand

Default reference brand is Acme (`brand/brand-pack.json`, `.cursor/rules/corporate-brand.mdc`). Replace with your customer's palette, voice, and slide types in `brand/` and update the matching rule file.
