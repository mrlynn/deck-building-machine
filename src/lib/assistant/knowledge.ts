import { HELP_TOPICS, type HelpTopic } from '@/content/help';

function formatTopic(topic: HelpTopic): string {
  const lines: string[] = [`### ${topic.title} (\`${topic.id}\`)`, '', topic.summary, ''];

  for (const paragraph of topic.paragraphs) {
    lines.push(paragraph, '');
  }

  if (topic.bullets?.length) {
    for (const bullet of topic.bullets) {
      lines.push(`- ${bullet}`);
    }
    lines.push('');
  }

  for (const section of topic.sections ?? []) {
    lines.push(`#### ${section.heading}`, '');
    for (const paragraph of section.paragraphs ?? []) {
      lines.push(paragraph, '');
    }
    if (section.bullets?.length) {
      for (const bullet of section.bullets) {
        lines.push(`- ${bullet}`);
      }
      lines.push('');
    }
  }

  if (topic.tip) {
    lines.push(`Tip: ${topic.tip}`, '');
  }

  return lines.join('\n');
}

/** Distilled product architecture — keeps the model grounded without dumping the whole repo. */
const APP_ARCHITECTURE_CRIB = `
## Application architecture (Studio source)

Deck Machine Studio is a Next.js App Router app. The live UI is a single page that renders \`Wizard\`.

### Main surfaces
- \`src/app/page.tsx\` → \`<Wizard />\`
- \`src/components/Wizard.tsx\` — home + 3-step package wizard: Find account → Encode brand → Download
- \`src/components/StudioHome.tsx\` — Library tab (AccountLibrary) + Prepare jobs
- \`src/components/AccountLibrary.tsx\` — searchable account card grid with Ready/Downloaded chips
- \`src/components/AccountsRail.tsx\` — ChatGTM-style sidebar chrome (md+): logo, Package CTA, Home, accounts, footer tools
- \`src/components/StudioAppBar.tsx\` — mobile-only top chrome (Package + menu)
- \`src/components/TalkTrackDrawer.tsx\` — live demo script + copy helpers
- \`src/components/RehearseDialog.tsx\` — tour → flashcards → readiness quiz
- \`src/components/MissionControlDialog.tsx\` — post-download checklist + email handoff blurb
- brand-pack import/export/share link
- \`src/components/DeckPreview.tsx\` — mini slide preview on Encode brand (layout style)
- \`src/components/FactoryOutputPreview.tsx\` — Download step switcher: Slides / Document / Workbook (same brand tokens; PPTX stays default demo vehicle)
- \`src/components/LayoutStylePicker.tsx\` — Classic / Minimal / Bold
- \`src/components/HelpProvider.tsx\` + \`HelpDialog.tsx\` — topic help (\`#help=<topicId>\`)
- \`src/content/help.ts\` — canonical in-app help topics (also the primary assistant knowledge base)

### Brand pack schema (\`src/lib/types.ts\`)
BrandPack fields the wizard collects and passes to generate:
- Identity: customerName, customerSlug, displayName, website, industry, salesforceAccountId
- Colors: primaryColor, darkColor, grayColor, lightGrayColor, midGrayColor, whiteColor, accentColor
- Voice: fontStack, voiceSummary, wordsToAvoid, defaultAudience, presenterHint
- Layout: layoutStyle (\`classic\` | \`minimal\` | \`bold\`)
- Logos: logoOnDarkBase64, logoOnLightBase64 (data URLs)

Defaults start as reference reference tokens; the downloaded zip is fully parameterized for the selected customer (no Acme leakage in output).

### API routes
- \`GET /api/customers/search?q=\` — Databricks Salesforce account search (optional)
- \`GET /api/brand/status\` — Brandfetch Brand API + Search client ID readiness
- \`GET|POST /api/brand/lookup\` — Brandfetch domain → BrandPack prefill
- \`POST /api/generate\` — Mustache-render \`templates/deck-machine/**\` into a zip download
- \`POST /api/assistant\` — this help assistant (streaming chat)

### Integrations
- Databricks: set \`ENABLE_DATABRICKS=true\` plus \`DATABRICKS_*\` env vars. Off by default — Customer step uses manual entry / Brandfetch search.
- Brandfetch: \`BRANDFETCH_API_KEY\` (server) + \`NEXT_PUBLIC_BRANDFETCH_CLIENT_ID\` (browser search). Prefill is advisory — user should review colors/logos.
- Logo theme mapping: Brandfetch \`theme: light\` → logoOnDark; \`theme: dark\` → logoOnLight.

### What the zip contains
- \`.cursor/rules/<slug>-brand.mdc\` + \`deck-workflow.mdc\`
- \`.cursor/agents/\` — deck-builder, brief-analyzer, slide-writer, visual-creator, brand-guardian
- \`.agents/skills/\` — /create-brief, /build-deck, /write-slide, /brand-check, /export-pptx, /create-outline
- \`brand/\` — palette, typography, voice, slide-types, logos, brand-pack.json
- \`docs/primitives-decision-tree.md\` + \`docs/primitives-lab.md\` + \`docs/after-the-demo.md\` — placement guide, timed labs (Lab 4 = learning exit), day-2 ownership/preflight
- Parameterized \`build-pptx.js\`, README, AGENTS.md, templates/brief.md

### Critical product boundary
Studio configures and downloads the demo repo. Cursor is where the demonstration happens (rules, skills, agents, PPTX export). Studio does not run /build-deck in the browser. This zip teaches Rules / Skills / Agents — Hooks and MCP are next primitives, not included.

### After download (tell users this clearly)
1. Unzip \`<slug>-deck-machine.zip\`
2. Open the folder in Cursor (brand rules load automatically)
3. Run \`/create-brief\` then \`/build-deck\` — the zip is a Cursor factory (skills + bundled exporters), not finished Office files; PPTX appears in \`output/\` after they run the skill
4. Required learning exit: docs/primitives-lab.md Lab 4 (break → /brand-check → fix)
5. Point at docs/after-the-demo.md for ownership and regenerate vs edit

### Studio convenience
- Recent accounts / \`?resume=1\` / share link / brand-pack JSON — see Help topic \`how-it-works\`
- Talk track + Rehearse + Mission control — see Help topics \`account-team\` and \`after-download\`

### Audience
ADMs and FEs packaging a skills/rules/agents demo for a customer account — not a PowerPoint SaaS for end users.
`.trim();

let cachedKnowledge: string | null = null;

/** Full grounded knowledge for the assistant system prompt (help topics + architecture crib). */
export function getAssistantKnowledge(): string {
  if (cachedKnowledge) return cachedKnowledge;

  const helpDocs = HELP_TOPICS.map(formatTopic).join('\n---\n\n');

  cachedKnowledge = [
    '# Deck Machine Studio knowledge base',
    '',
    '## Help topics (canonical product copy)',
    '',
    helpDocs,
    '---',
    '',
    APP_ARCHITECTURE_CRIB,
  ].join('\n');

  return cachedKnowledge;
}
