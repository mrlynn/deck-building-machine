# Deck Machine Studio

Next.js + Material UI app for ADMs and FEs to package a **branded Cursor demonstration asset** — skills, rules, and agent definitions — from a brand pack. The deck workflow is the demo vehicle so customers can feel how those capabilities work together. Marriott is the reference instance; Studio interpolates customer name, colors, logos, voice, and rules into a downloadable repo zip.

## What it generates

A zip containing:

- `.cursor/rules/<slug>-brand.mdc` + `deck-workflow.mdc`
- `.cursor/agents/` (deck-builder, brief-analyzer, slide-writer, brand-guardian)
- `.agents/skills/` (`/create-brief`, `/build-deck`, `/export-pptx`, …)
- `brand/` (palette, typography, voice, slide-types, logos, brand-pack.json)
- Bundled Office exporters (`scripts/bundled/export-*.cjs`) — no customer `npm install`
- `brand/brand-pack.json` (runtime tokens for PPTX / DOCX / XLSX)
- `README.md` / `AGENTS.md` / `templates/brief.md`

No Marriott-specific strings remain in the output.

## Quick start

```bash
cp .env.example .env.local   # optional Databricks
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Wizard flow

1. **Customer** — search Salesforce accounts via Databricks, match a brand name via Brandfetch Search, or enter manually
2. **Brand pack** — colors, fonts, voice, logos (optional **Prefill from Brandfetch** using the website/domain)
3. **Generate** — download `<slug>-deck-machine.zip`

## Brandfetch (optional)

Prefills primary/dark/accent colors, font stack, industry, and light/dark logo variants from a domain. Inference is prefill only — always review in the wizard.

```bash
# Server-only Brand API (bearer token)
BRANDFETCH_API_KEY=...

# Browser-safe Search client ID (name → domain autocomplete)
# Get both at https://developers.brandfetch.com
NEXT_PUBLIC_BRANDFETCH_CLIENT_ID=...
```

Restart `npm run dev` after editing `.env.local`. Without these keys, the wizard still works with manual brand entry.

Logo theme mapping (Brandfetch docs): `theme: light` → logo for dark backgrounds (`logoOnDark`); `theme: dark` → logo for light backgrounds (`logoOnLight`). Gray ramp stays as product defaults.

## Databricks (optional)

Studio reads `.env.local` at the repo root. **Restart `npm run dev` after changing it.**

Either naming style works:

```bash
# Statement API style
DATABRICKS_HOST=https://your-workspace.cloud.databricks.com
DATABRICKS_WAREHOUSE_ID=abc123
DATABRICKS_TOKEN=dapi...

# OR SQL connector style (common in other Cursor apps)
DATABRICKS_SERVER_HOSTNAME=your-workspace.cloud.databricks.com
DATABRICKS_HTTP_PATH=/sql/1.0/warehouses/abc123
DATABRICKS_TOKEN=dapi...
```

Optional: `DATABRICKS_CATALOG=revops`, `DATABRICKS_SCHEMA=pt_salesforce`.

Without these, the UI falls back to manual customer entry. Generate never requires Databricks.

## Architecture

| Path | Role |
|---|---|
| `src/app/api/customers/search` | Databricks SQL Statement API → account search |
| `src/app/api/brand/status` | Whether Brandfetch Brand API + Search client ID are configured |
| `src/app/api/brand/lookup` | Brandfetch Brand API → BrandPack prefill (colors, fonts, logos as base64) |
| `src/lib/brandfetch.ts` | Domain normalize, Brand API client, logo/color mapping |
| `src/lib/brandfetch-client.ts` | Browser Brand Search helper (Brandfetch requires client-side search) |
| `src/app/api/generate` | Mustache-render `templates/deck-machine/**` → zip |
| `src/app/api/assistant` | Streaming in-app help assistant (Anthropic / OpenAI) |
| `templates/deck-machine/` | Parameterized skeleton (Mustache) |

On disk, Cursor primitive dirs are stored as `dot-cursor/` and `dot-agents/` (Next/Vercel file tracing skips paths that start with `.`). `src/lib/generator.ts` rewrites them to `.cursor/` and `.agents/` in the downloaded zip.
| `src/lib/types.ts` | Brand pack schema |
| `src/lib/assistant/` | Knowledge base + model selection for the Studio assistant |

## In-app assistant

Studio includes a right-hand **Assistant** drawer that answers questions from the help topics plus a distilled architecture crib of the app. It does not fine-tune a model; it grounds each request with that knowledge and the live wizard step.

```bash
# Prefer Anthropic when both exist
ANTHROPIC_API_KEY=...
OPENAI_API_KEY=...

# Optional
# ASSISTANT_PROVIDER=openai
# ASSISTANT_MODEL=gpt-5.4
```

Restart `npm run dev` after editing `.env.local`. Without a key, the assistant returns a clear configuration error.

## After download

```bash
unzip acme-deck-machine.zip
cd acme-deck-machine
# open in Cursor — Office exporters are pre-bundled (no npm install)
```

Then `/create-brief` → `/build-deck`.
