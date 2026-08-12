/** In-app help topics for Deck Machine Studio. Deep-link via HelpButton topic ids. */

export type HelpTopicId =
  | 'overview'
  | 'how-it-works'
  | 'skills-and-rules'
  | 'deck-pipeline'
  | 'improve-decks'
  | 'layout-preview'
  | 'factory-outputs'
  | 'customer'
  | 'databricks'
  | 'brandfetch'
  | 'repo-slug'
  | 'brand-pack'
  | 'generate'
  | 'after-download'
  | 'account-team'
  | 'field-kit'
  | 'faq';

/** Teaching diagrams rendered by HelpDiagram (one per topic where it clarifies the model). */
export type HelpDiagramId =
  | 'studio-vs-cursor'
  | 'wizard-steps'
  | 'primitives-stack'
  | 'deck-pipeline'
  | 'quality-loop'
  | 'layout-styles'
  | 'customer-paths'
  | 'databricks-optional'
  | 'brandfetch-flow'
  | 'slug-ripple'
  | 'brand-bake'
  | 'zip-contents'
  | 'factory-outputs'
  | 'after-download'
  | 'talk-track'
  | 'faq-map';

export type HelpSection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type HelpTopic = {
  id: HelpTopicId;
  title: string;
  /** One-line blurb for the table of contents */
  summary: string;
  paragraphs: string[];
  bullets?: string[];
  /** Optional sub-sections for longer topics */
  sections?: HelpSection[];
  /** Optional callout under the body */
  tip?: string;
  /** Embed the shared primitives overview video after the lead paragraphs */
  media?: 'primitives-video';
  /** Optional teaching diagram after lead paragraphs (and before media when both are set) */
  diagram?: HelpDiagramId;
};

export const HELP_TOPICS: HelpTopic[] = [
  {
    id: 'overview',
    title: 'What is Deck Machine Studio?',
    summary: 'A demo asset that shows skills, rules, and agents',
    paragraphs: [
      'Deck Machine Studio builds a powerful demonstration asset for a customer account: a Cursor-native repo with branded skills, always-on rules, and agent definitions. The goal is not “shipping decks as a product.” The goal is helping the customer understand — by using — how skills and rules shape Agent behavior.',
      'The deck-building workflow (brief → outline → slides → brand check → PPTX) is the concrete demo vehicle. It makes skills, rules, and subagents visible in one sitting. Marriott is the reference instance; the zip you download is fully parameterized for the customer you configure here.',
      'This is not a new IT app or a seat purchase. Customers who already use Cursor get a leave-behind they can open, explore, and run. ADMs and FEs use Studio to package that demonstration for each account.',
    ],
    sections: [
      {
        heading: 'What the customer receives',
        bullets: [
          'Always-on brand rules (colors, voice, slide writing standards)',
          'Slash-command skills: /create-brief, /build-deck, /revise-deck, /preview-deck, /build-doc, /brand-check, /export-pptx, /export-metrics-xlsx',
          'Subagents that outline, write, review, and export — invoked by skills, not typed as slash commands',
          'Pre-bundled Office exporters (PPTX / DOCX / XLSX) wired to brand-pack.json tokens and logos — no npm install',
        ],
      },
      {
        heading: 'What this studio does vs. what Cursor does',
        paragraphs: [
          'Studio only configures and downloads the repo. Cursor is where the demonstration happens — rules load into context, skills appear under /, and agents run the multi-step pipeline. The PPTX is proof the system worked, not the product you are selling.',
        ],
      },
    ],
    diagram: 'studio-vs-cursor',
    tip: 'Audience: ADMs and FEs packaging a skills/rules/agents demo — not a PowerPoint SaaS. Studio toolkit (Library, Talk track, Rehearse): Help → How the wizard works. Overview video: Help → Skills, rules, and agents.',
  },
  {
    id: 'how-it-works',
    title: 'How the wizard works',
    summary: 'Three steps from account to downloadable demo repo',
    paragraphs: [
      'Studio lands on a home screen with a ChatGTM-style sidebar (Package leave-behind, Home, recent accounts) and secondary job cards for Resume / Rehearse / Talk track — time-to-action without becoming a chat app. Packaging still runs as a short three-step wizard. Each step feeds the brand pack that gets Mustache-rendered into templates/deck-machine and zipped for download. You are assembling the demonstration asset, not generating a finished customer deck in the browser.',
    ],
    diagram: 'wizard-steps',
    bullets: [
      'Home — Library card grid + Prepare jobs; logo / Home returns here',
      'Find account — Databricks, Brandfetch search, recent accounts, import, or manual entry',
      'Encode brand — colors, fonts, voice, and logos (optional Brandfetch prefill + trust checks)',
      'Download leave-behind — preview files, talk track, then download <slug>-deck-machine.zip',
    ],
    sections: [
      {
        heading: 'Studio toolkit (sidebar)',
        bullets: [
          'Package leave-behind — primary CTA starts the three-step wizard',
          'Accounts — resume recent brand packs from this browser (also on Find account)',
          'Export / Import brand pack — JSON handoff to a teammate, including logos when present',
          'Copy share link — URL prefills customer name, domain, and key colors (no logos)',
          'Talk track / Rehearse / Assistant / Help — footer icons on desktop; menu on mobile',
        ],
      },
      {
        heading: 'Deep links and resume',
        bullets: [
          '?customer=Acme&domain=acme.com — open Studio with identity (and optional primary/dark/layout) prefilled',
          '?resume=1 — load the most recent saved brand pack and jump to Encode brand',
          '#help=how-it-works — open this topic directly (same pattern for other topic ids)',
        ],
      },
      {
        heading: 'What gets interpolated',
        paragraphs: [
          'Customer name, slug, audience defaults, hex colors, font stack, voice summary, words to avoid, and logo files land in .cursor/rules, brand/ docs, AGENTS.md, README, and the PPTX exporter script. Generate never requires Databricks or Brandfetch — those only speed up data entry.',
        ],
      },
    ],
    tip: 'Landing home offers job cards (Package / Resume / Rehearse). Under pressure: Resume from the accounts rail → Encode brand → Download → Mission control. Talk track in the room; Rehearse the night before.',
  },
  {
    id: 'skills-and-rules',
    title: 'Skills, rules, and agents',
    summary: 'The capabilities this demo is meant to show',
    paragraphs: [
      'This is the heart of the leave-behind. When the customer opens the zip in Cursor, they should see how three Cursor primitives work together: rules constrain behavior, skills are the user-facing commands, and agents do the multi-step work. Use the deck pipeline as the story that makes those pieces concrete.',
    ],
    diagram: 'primitives-stack',
    media: 'primitives-video',
    sections: [
      {
        heading: 'Rules (.cursor/rules/)',
        paragraphs: [
          'Two rule files ship in every zip. The brand rule (<slug>-brand.mdc) is alwaysApply: true — palette hex values, typography scale, insight-headline rules, bullet limits, voice, and slide-type guidance stay in context for every chat. The deck-workflow rule loads when working on decks — brief intake, outline-first, story arcs, and the deck-content.json schema.',
        ],
        bullets: [
          '<slug>-brand.mdc — always on; brand + writing standards',
          'deck-workflow.mdc — when creating or editing slides; process + JSON shape',
        ],
      },
      {
        heading: 'Skills (.agents/skills/)',
        bullets: [
          '/create-brief — MCP when connected, else interview or paste → writes brief.md (never hand-fill the template)',
          '/create-outline — brief → outline table in chat for review before a full build',
          '/build-deck — brief → outline → slides → narrative polish → brand check → PPTX (delegates deck-builder)',
          '/revise-deck + /preview-deck — surgical edits and HTML preview before re-export',
          '/build-doc — same brief/spine → branded DOCX; /export-metrics-xlsx — chart/metrics → workbook',
          '/write-slide — rewrite or add one slide into deck-content.json',
          '/polish-deck — retrofit takeaways, speaker notes, and chart highlights on an existing deck',
          '/brand-check — run brand-guardian on deck-content.json; optional auto-fix',
          '/export-pptx — re-run build-pptx.js from deck-content.json only (fast tweak path)',
          '/export-docx — re-run DOCX from doc-content.json',
        ],
      },
      {
        heading: 'Agents (.cursor/agents/)',
        bullets: [
          'deck-builder — orchestrator for the full pipeline',
          'brief-analyzer (readonly) — audience, three key messages, story arc, slide types + insight headlines',
          'slide-writer — one slide JSON at a time (bullets, metrics, quote, etc.)',
          'visual-creator — chart/diagram validation; generates PNGs into assets/ for image slides',
          'narrative-editor — headline spine, assertion+detail bullets, takeaways, speaker notes',
          'brand-guardian (readonly) — pass/warn/fail on headlines, bullets, voice, one-idea-per-slide',
        ],
      },
      {
        heading: 'Brand docs (brand/)',
        paragraphs: [
          'Human- and agent-readable reference that mirrors the rules: palette.md, typography.md, voice.md, slide-types.md, plus logo.png and logo-on-light.png for the exporter footer. brand-pack.json stores the wizard metadata round-trip.',
        ],
      },
      {
        heading: 'Teaching docs (docs/)',
        paragraphs: [
          'Every zip ships a placement guide and a timed lab so the leave-behind teaches primitives after the happy-path PPTX — not only how to make slides.',
        ],
        bullets: [
          'docs/primitives-decision-tree.md — Rule vs Skill vs Agent vs Doc (where does X go?)',
          'docs/primitives-lab.md — four labs (~20 min) with exit criteria; Lab 4 is break→fix via /brand-check',
          'docs/after-the-demo.md — day 2 ownership, Cursor preflight, regenerate vs edit, what is out of scope',
        ],
      },
    ],
    tip: 'In a demo, name the three layers out loud: rules (always on), skills (/ menu), agents (work behind /build-deck). Play the overview above if someone wants the 45-second picture first. End on Lab 4, not only the PPTX. MCP is optional intake for /create-brief when tools are connected; Hooks are still a next factory layer. Then open docs/primitives-decision-tree.md if they ask where to put a new instruction.',
  },
  {
    id: 'deck-pipeline',
    title: 'How a PowerPoint gets built',
    summary: 'The demo path from brief.md to output/*.pptx',
    paragraphs: [
      'After the customer opens the zip in Cursor, the deck pipeline is how you demonstrate skills and rules in action. Understanding each file helps you run the demo and coach quality — the PPTX is the artifact that proves the system worked.',
    ],
    diagram: 'deck-pipeline',
    sections: [
      {
        heading: 'One-time setup',
        bullets: [
          'Unzip and open the folder in Cursor (brand rules load automatically)',
          'Office exporters are pre-bundled under .agents/skills/export-*/scripts/bundled/ — no npm install',
        ],
      },
      {
        heading: 'Happy path',
        bullets: [
          '/create-brief — Agent interviews or accepts pasted notes; writes brief.md from templates/brief.md schema',
          '/build-deck brief.md — deck-builder runs the rest end-to-end',
          'Pick up the file from output/ (filename from metadata.title, slugified)',
        ],
      },
      {
        heading: 'Inside /build-deck',
        paragraphs: [
          'deck-builder validates the brief, then calls brief-analyzer for an outline (slide types + insight headlines). That outline lives in the conversation — it is not saved as outline.md unless someone copies it. slide-writer produces one slide object per outline row; visual-creator handles chart/diagram/image slides; narrative-editor deepens bullets, takeaways, and speaker notes. deck-builder assembles deck-content.json at the repo root, runs brand-guardian, applies fixes, then executes:',
        ],
        bullets: [
          'cd .agents/skills/export-pptx/scripts',
          'node bundled/export-pptx.cjs ../../../../deck-content.json',
          '→ output/<deck-title>.pptx',
        ],
      },
      {
        heading: 'Canonical files',
        bullets: [
          'brief.md — structured intake (audience, ask, three messages, evidence, constraints)',
          'deck-content.json — { metadata, slides[] }; each slide has type, headline, content',
          'output/*.pptx — final PowerPoint (both JSON and PPTX are typically gitignored)',
        ],
      },
      {
        heading: 'What the exporter renders',
        paragraphs: [
          'bundled/export-pptx.cjs is a pre-bundled PptxGenJS exporter (13.33" × 7.5" widescreen). It maps eleven slide types to fixed layouts using brand colors and logos from brand/brand-pack.json:',
        ],
        bullets: [
          'title — primary/full-bleed background, large white title, subtitle + presenter/date',
          'agenda — light background, numbered items',
          'section — primary background, large section number + title',
          'content — white, primary accent bar, primary bullet dots; optional content.note caption',
          'metrics — large stat tiles (value in primary color)',
          'two-column — side-by-side cards with headings + bullets',
          'quote — pull quote with attribution',
          'closing — numbered next steps (action, owner, date)',
          'chart — native PPTX chart from categories + series in JSON',
          'diagram — flow / grid / swimlane shapes from nodes + edges',
          'image — agent-generated PNG from assets/ (visual-creator writes the file)',
        ],
      },
      {
        heading: 'Optional paths',
        bullets: [
          '/create-outline brief.md — review story and headlines in chat before /build-deck',
          '/build-deck with no path — uses brief.md if present, else starts create-brief intake',
          '/revise-deck → /preview-deck → /export-pptx — skip full rebuild for copy/layout tweaks',
          '/write-slide — fix one weak slide without regenerating the whole deck',
        ],
      },
    ],
    tip: 'Demo shortcut on the Marriott reference repo: /build-deck examples/ai-studio-brief.md. Customer zips use the same skill flow with their brand tokens.',
  },
  {
    id: 'improve-decks',
    title: 'Making decks better',
    summary: 'Raise demo quality after skills and rules are installed',
    paragraphs: [
      'The exporter uses eight fixed programmatic layouts — not freeform PowerPoint design. “More beautiful and professional” comes almost entirely from better inputs, better slide-type choices, stricter brand tokens, and an edit loop on deck-content.json. Coach customers on these levers when the demo output needs to look executive-ready.',
    ],
    diagram: 'quality-loop',
    sections: [
      {
        heading: '1. Raise the brief (highest impact)',
        paragraphs: [
          'Everything downstream inherits the brief. Vague briefs produce topic-label headlines and bullet walls. Strong briefs name the audience, the decision or ask, exactly three key messages, real metrics, and what to avoid.',
        ],
        bullets: [
          'Use /create-brief with real meeting notes — not a hand-filled template',
          'Insist on three key messages and concrete numbers (with context)',
          'Set slide-count and tone constraints in the brief when the room is executive',
          'Compare against examples/ai-studio-brief.md (Marriott reference) as a quality bar',
        ],
      },
      {
        heading: '2. Tighten the brand pack, layout style, and logos',
        paragraphs: [
          'Primary color drives title/section backgrounds, metric values, accent bars, and bullet dots in PPTX. Font stack sets the export font (first family in the stack). Layout style (Classic / Minimal / Bold) changes how those tokens are framed — pick it in Studio and preview before generate. Logos appear on every slide footer.',
        ],
        bullets: [
          'In Studio: review Brandfetch prefills, then compare layout previews with your colors',
          'After install: edit brand/palette.md, typography.md, voice.md and sync .cursor/rules/<slug>-brand.mdc',
          'To change layout style post-install, regenerate the zip from Studio (exporter is compiled at generate time)',
          'Replace brand/logo.png and brand/logo-on-light.png with crisp marks, then /export-pptx',
          'Keep voice “words to avoid” current — brand-guardian and slide-writer read them',
        ],
      },
      {
        heading: '3. Insight headlines and one idea per slide',
        paragraphs: [
          'The always-on brand rule and brand-guardian enforce insight headlines (not topic labels), max five bullets, ~12 words per bullet, and one idea per slide. This is the largest “professional vs. template” signal in the rendered deck — and a clear example of rules shaping Agent output.',
        ],
        bullets: [
          'Bad: “Q2 Results” → Good: “Q2 revenue exceeded forecast by 14%”',
          'Run /brand-check before external share; accept auto-fixes when offered',
          'If a slide says “and also…”, split it with /write-slide',
        ],
      },
      {
        heading: '4. Choose stronger slide types',
        paragraphs: [
          'brief-analyzer picks types in the outline. Metrics and quote slides read more executive than walls of content bullets. Section dividers help decks over ~12 slides. Agenda only when the deck is long enough to need a map (workflow guidance: typically 10+).',
        ],
        bullets: [
          'Prefer metrics when you have 2–4 real numbers; prefer chart when the story is a trend or comparison',
          'Use diagram for processes, architecture, and swimlanes — agents author the nodes',
          'Use quote for a single sharp customer or executive line',
          'Use two-column for true contrasts (before/after, us/them) — not two unrelated lists',
          'See brand/slide-types.md for when to use each of the eleven types',
        ],
      },
      {
        heading: '5. Review the outline before writing slides',
        paragraphs: [
          'Run /create-outline brief.md and fix the story arc in chat before /build-deck. Workflow arcs: Executive brief (8–10), Team update (10–14), Proposal (10–15). A coherent outline prevents weak slides later.',
        ],
      },
      {
        heading: '6. Edit deck-content.json, then re-export',
        paragraphs: [
          'For precise control, open deck-content.json: change headlines, bullets, slide order, type, metric values, or closing owners/dates. Then /export-pptx — no full rebuild. Use /write-slide when you want the agent to rewrite one slide into that JSON for you.',
        ],
        bullets: [
          'content.note on content slides → gray italic footnote (sources, caveats)',
          'closing items need action + owner + date for a crisp next-steps slide',
          'Reorder slides in the JSON array to fix narrative flow quickly',
        ],
      },
      {
        heading: 'Honest aesthetic ceiling',
        paragraphs: [
          'Decks support eleven slide types, including native charts (JSON → PptxGenJS), structured diagrams (nodes/edges → shapes), and agent-generated images written into assets/ during /build-deck. Prefer chart and diagram over generative image for structural or numeric ideas. The pipeline does not do stock photo collages, custom masters, or freeform designer layouts — and it never asks an ADM, FE, or end user to drop PNGs by hand. Visual quality comes from the compiled layout style (classic / minimal / bold), typography and spacing in the exporter, polished chart/diagram treatments, and agent-authored slide mix. Push quality through brief → layout style → types → headlines → visual-creator → JSON edit → /export-pptx.',
        ],
      },
    ],
    tip: 'Fast coaching loop: pick layout in Studio → better brief → /create-outline → /build-deck → /preview-deck → /brand-check → /revise-deck → /export-pptx.',
  },
  {
    id: 'layout-preview',
    title: 'Layout styles & preview',
    summary: 'Three templates with a live mini-slide preview',
    paragraphs: [
      'On the Brand pack step you pick a deck layout style. The live preview shows title, content, metrics, and a chart silhouette using your current colors (and logos when attached). The same choice is compiled into the PPTX exporter and written into always-on brand rules so agents prefer a matching slide mix — another place rules steer Agent behavior.',
    ],
    diagram: 'layout-styles',
    sections: [
      {
        heading: 'The three templates',
        bullets: [
          'Executive Classic — primary full-bleed titles, thin accent bars, light-gray metric tiles (default boardroom look)',
          'Minimal Air — light title slides, left accent rail, more whitespace, quieter chrome',
          'Bold Signal — dark title/section frames, thicker primary accents, metrics with dark headers',
        ],
      },
      {
        heading: 'What the preview is (and is not)',
        paragraphs: [
          'The Studio preview is a proportional mock of how build-pptx.js will frame those three slide types — not a pixel-perfect PowerPoint render. Use it to compare Classic vs Minimal vs Bold with the customer’s palette before you download.',
        ],
        bullets: [
          'Colors and layout style update the preview immediately',
          'Attached logos appear on the title mini-slide when present',
          'Changing layout after the customer already has a zip means regenerating from Studio — the exporter is compiled at generate time',
        ],
      },
      {
        heading: 'What gets baked into the zip',
        bullets: [
          'build-pptx.js — LAYOUT constant + branched slide treatments',
          '.cursor/rules/<slug>-brand.mdc — layout guidance + slide-mix hint for agents',
          'brand/slide-types.md and brand/brand-pack.json — layoutStyle recorded for humans',
        ],
      },
    ],
    tip: 'Pick the layout on Brand pack, confirm again on Preview & generate, then download.',
  },
  {
    id: 'customer',
    title: 'Find the customer',
    summary: 'Three ways to start a brand pack',
    paragraphs: [
      'Step 1 identifies who the demonstration asset is for. That name, slug, website, and default audience flow into generated README, AGENTS.md, briefs, rule filenames, and PPTX footers.',
    ],
    diagram: 'customer-paths',
    bullets: [
      'Databricks — search Salesforce accounts when credentials are configured',
      'Brandfetch search — type a brand name to resolve a domain (requires Search client ID)',
      'Manual entry — type customer name, website, industry, and audience yourself',
    ],
    sections: [
      {
        heading: 'Why default audience matters',
        paragraphs: [
          'defaultAudience seeds brief and deck metadata (for example “Acme leadership”). brief-analyzer uses audience to pick story arc length and tone — executives get shorter decks with sharper asks.',
        ],
      },
    ],
  },
  {
    id: 'databricks',
    title: 'Databricks account search',
    summary: 'Optional Salesforce account lookup via Statement API',
    paragraphs: [
      'When Databricks is configured in .env.local, the Customer step searches revops.pt_salesforce.account (catalog/schema overridable). Selecting a hit prefills name, website, industry, and Salesforce account id.',
      'Without Databricks, the chip shows Manual entry and you type the customer yourself. Generate never requires Databricks.',
    ],
    diagram: 'databricks-optional',
    tip: 'Restart npm run dev after editing .env.local. See .env.example for Statement API or SQL connector style vars.',
  },
  {
    id: 'brandfetch',
    title: 'Brandfetch prefill',
    summary: 'Optional colors, fonts, and logos from a domain',
    paragraphs: [
      'Two Brandfetch pieces work independently. The browser Search client ID powers name → domain autocomplete. The server Brand API key powers Prefill from Brandfetch on the Brand pack step.',
      'Prefill pulls primary/dark/accent colors, a font stack guess, industry, and logo variants as base64 images. Logo theme mapping: Brandfetch theme light → logo for dark/primary backgrounds; theme dark → logo for light backgrounds. Those images show as thumbnails in the Brand pack step so you can reject a stale mark before generate.',
      'Prefill is a starting point only. APIs sometimes return a marketing accent or a stale mark — always review colors and logo previews before you generate.',
    ],
    diagram: 'brandfetch-flow',
    bullets: [
      'NEXT_PUBLIC_BRANDFETCH_CLIENT_ID — brand name search in the wizard',
      'BRANDFETCH_API_KEY — domain lookup for colors, fonts, and logo image download',
      'You can still upload replacement PNGs manually if the API mark is wrong',
    ],
    tip: 'After prefill, check the logo thumbnails on dark and light swatches, then compare layout previews with those colors.',
  },
  {
    id: 'repo-slug',
    title: 'Repo slug',
    summary: 'Folder names, rule filenames, and the zip name',
    paragraphs: [
      'The slug is a URL-safe short name derived from the customer (for example acme). It appears in the download filename (<slug>-deck-machine.zip), rule paths (.cursor/rules/<slug>-brand.mdc), and other interpolated paths.',
      'Change it only when you need a cleaner folder name than the auto-slugified customer name.',
    ],
    diagram: 'slug-ripple',
  },
  {
    id: 'brand-pack',
    title: 'Brand pack',
    summary: 'Colors, type, voice, and logos baked into Cursor rules',
    paragraphs: [
      'The brand pack becomes always-on Cursor rules, brand/ reference docs, and hardcoded tokens inside build-pptx.js in the zip. Getting this right in Studio is the cheapest way to make the demo look on-brand — and to show how rules enforce standards without the customer rewriting prompts every time.',
    ],
    diagram: 'brand-bake',
    sections: [
      {
        heading: 'How colors map in PPTX',
        bullets: [
          'Primary — title/section backgrounds, accent bars, bullet dots, metric values',
          'Dark — body text on light slides; Bold layout also uses dark title/section frames',
          'Gray / mid gray / light gray — secondary text, captions, card and agenda fills',
          'Accent — defined for luxury emphasis; use sparingly',
        ],
      },
      {
        heading: 'Layout style (Studio preview)',
        paragraphs: [
          'Pick Executive Classic, Minimal Air, or Bold Signal on the Brand pack step. The live preview shows title, content, and metrics treatments with your colors. That choice is compiled into build-pptx.js and written into the always-on brand rule so agents prefer a matching slide mix.',
        ],
        bullets: [
          'Executive Classic — primary title slides, thin accent bars (default boardroom look)',
          'Minimal Air — light titles, more whitespace, quieter chrome',
          'Bold Signal — dark frames, thicker primary accents, louder metrics',
        ],
      },
      {
        heading: 'Voice and logos',
        paragraphs: [
          'Voice summary and words to avoid shape how slide-writer and brand-guardian write and review copy. Logos land on title slides and every footer — provide both on-dark and on-light variants for clean contrast.',
        ],
      },
    ],
    tip: 'Use Prefill from Brandfetch when a website is set, then pick a layout style and tighten colors before Preview.',
  },
  {
    id: 'generate',
    title: 'Preview & generate',
    summary: 'What the demonstration zip contains',
    paragraphs: [
      'Generate Mustache-renders templates/deck-machine into a zip named <slug>-deck-machine.zip. That zip is a Cursor factory — rules, skills, agents, and bundled Office exporters — not a folder of finished PPTX/DOCX/XLSX files. The download step shows (1) what is in the kit vs what the customer builds, (2) a format switcher for how the same brand pack lands as slides, Word, or Excel, and (3) an expandable file list of paths after unzip. Nothing runs until the customer opens the folder in Cursor.',
    ],
    diagram: 'zip-contents',
    bullets: [
      '.cursor/rules — brand (includes layout style) + deck workflow',
      '.cursor/agents — deck-builder, brief-analyzer, slide-writer, visual-creator, narrative-editor, brand-guardian',
      '.agents/skills — brief → deck / doc / revise / preview / polish / export (PPTX, DOCX, metrics XLSX)',
      'brand/ — palette, typography, voice, logos, brand-pack.json (runtime tokens for all exporters)',
      'Bundled exporters under scripts/bundled/ — no customer npm install',
      'templates/brief.md — schema /create-brief writes into brief.md',
      'Not included: finished .pptx / .docx / .xlsx (customer creates those in Cursor)',
    ],
    tip: 'Use the format switcher to flip Doc → Workbook → Slides and watch the file list highlight the matching exporter. Confirm layout on Encode brand before download.',
  },
  {
    id: 'factory-outputs',
    title: 'Factory outputs (slides, doc, workbook)',
    summary: 'One zip, three renderers — without a second product',
    paragraphs: [
      'The download step separates two ideas: what Studio packages (a Cursor kit) and what the customer produces later (Office files in output/). The format switcher shows silhouettes for Doc and Excel; Slides shows a live layout preview. Flipping formats also highlights the matching bundled exporter in What’s in the zip.',
      'Do not demo Studio as a multi-format content SaaS. Say: same factory, more renderers. Customers run /build-doc and /export-metrics-xlsx after the happy-path PPTX.',
    ],
    diagram: 'factory-outputs',
    sections: [
      {
        heading: 'What each toggle means',
        bullets: [
          'Slides — /build-deck → /export-pptx (layout style + brand colors) → output/*.pptx',
          'Document — /build-doc → /export-docx (narrative from the same brief) → output/*.docx',
          'Workbook — /export-metrics-xlsx (metrics/chart slides only; no invented numbers) → output/*-metrics.xlsx',
        ],
      },
      {
        heading: 'What stays on Brand pack',
        bullets: [
          'Layout style picker + mini slide preview — layout is PPTX-specific',
          'Do not put Doc/Excel toggles on Encode brand; keep that step about tokens and layout',
        ],
      },
    ],
    tip: 'In the room: flip to Document once, then Workbook, then back to Slides before Download. Ten seconds proves the factory story — and that finished Office files are not in the zip.',
  },
  {
    id: 'after-download',
    title: 'After you download',
    summary: 'Open in Cursor and run the skills demo',
    paragraphs: [
      'Unzip the archive, open the folder in Cursor, and run the skills — no npm install. Office exporters (PPTX, DOCX, XLSX) ship pre-bundled. Narrate rules loading, the / skill menu, and agents working behind /build-deck.',
      'Right after Generate, Studio opens Mission control — checklist with copy buttons for demo paste, slash commands, Lab 4, and an email handoff blurb.',
    ],
    diagram: 'after-download',
    sections: [
      {
        heading: 'Setup',
        bullets: [
          'unzip <slug>-deck-machine.zip && cd <slug>-deck-machine',
          'Open the folder in Cursor (brand rules load automatically)',
          'Confirm bundled exporters exist under .agents/skills/export-*/scripts/bundled/ (no npm)',
        ],
      },
      {
        heading: 'First demo run',
        bullets: [
          'In Agent chat: /create-brief (talk or paste real meeting notes)',
          'Optional: /create-outline brief.md — approve the story before writing slides',
          'Then: /build-deck brief.md — pick up the PPTX from output/',
          'Before sharing: /brand-check',
        ],
      },
      {
        heading: 'Iterate',
        bullets: [
          '/revise-deck → /preview-deck → /export-pptx for surgical deck edits',
          'Optional: /build-doc brief.md · /export-metrics-xlsx from the deck',
          'Rewrite one slide: /write-slide',
          'Need a better look overall? See “Making decks better”',
        ],
      },
      {
        heading: 'Teach the primitives (required after first PPTX)',
        bullets: [
          'docs/primitives-lab.md Lab 4 — deliberate bad headline → /brand-check → fix (learning exit criterion)',
          'docs/primitives-decision-tree.md — placement guide (Rule vs Skill vs Agent vs Doc)',
          'docs/after-the-demo.md — ownership, preflight, regenerate vs edit',
          'Contrast always-on brand rule vs contextual deck-workflow.mdc',
        ],
      },
    ],
    tip: 'Account-team demo script: rules → skills → agents → PPTX → Lab 4. Open Talk track in Studio for the same script with copy helpers. The PPTX proves the pipeline; Lab 4 proves they learned the primitives.',
  },
  {
    id: 'account-team',
    title: 'Account-team talk track',
    summary: 'Say / don’t say, live demo script, and email handoff',
    paragraphs: [
      'Use this when packaging or presenting the leave-behind. Lead with Cursor capabilities (skills, rules, agents). The branded deck is proof those pieces work — not the product you are selling.',
      'Studio surfaces the same script in Talk track and Mission control. Rehearse (~5 min) is practice before the call: guided beats, flashcards, readiness quiz.',
    ],
    diagram: 'talk-track',
    sections: [
      {
        heading: 'Before the call (Studio)',
        bullets: [
          'Package the zip: Find account → Encode brand → Download leave-behind',
          'Or resume a recent account / open a share link / import brand-pack JSON',
          'Optional: run Rehearse once before the room',
          'Keep Talk track open during the live Cursor demo',
        ],
      },
      {
        heading: 'Say',
        bullets: [
          'Customers leave with a working Cursor repo tailored to their brand',
          'Brief in chat → branded PPTX out — skills and always-on rules do the work',
          'This is the model for showing how Cursor primitives land in a real workflow',
        ],
      },
      {
        heading: "Don't say",
        bullets: [
          '“New AI tool” or “IT procurement”',
          '“Learn the brief template” (they never fill it by hand)',
          'A feature tour of Cursor disconnected from the leave-behind',
        ],
      },
      {
        heading: 'Next 20 minutes (live)',
        bullets: [
          'Open the unzipped folder in Cursor together',
          'Run /create-brief with a real upcoming meeting (talk or paste)',
          'Run /build-deck and open the PPTX from output/',
          'Change one headline → /export-pptx',
          'Required: Lab 4 in docs/primitives-lab.md (bad headline → /brand-check → fix)',
          'Point at docs/after-the-demo.md for ownership and regenerate rules',
          'Agree the next real deck ships this way',
        ],
      },
      {
        heading: 'Align on',
        paragraphs: [
          'The zip is the leave-behind. Demo script = talk/paste → brief → PPTX → Lab 4. Use it to prep deeper enablement — rules load without asking, skills appear under /, agents run behind /build-deck. Self-serve next: docs/primitives-lab.md, docs/primitives-decision-tree.md, docs/after-the-demo.md.',
        ],
      },
      {
        heading: 'Email leave-behind blurb (paste after the call)',
        paragraphs: [
          'Mission control copies a ready email (subject + body) with unzip instructions, /create-brief → /build-deck, Lab 4, and docs/after-the-demo.md. Prefer that over chat paste — many customer accounts are not on Slack.',
        ],
      },
      {
        heading: 'Curriculum sidebars (CLI, tokens, privacy)',
        bullets: [
          'Not in the zip picker — open Teaching modules (field kit) in Help',
          'docs/adm-field-kit.md — day-of checklist + talk-track paths',
          'npm run field-kit — assemble + export PPTX for every catalog block',
        ],
      },
    ],
    tip: 'If someone asks “is this for building decks?”, answer: “It’s for demonstrating Cursor skills and rules — decks are how we make that concrete.”',
  },
  {
    id: 'field-kit',
    title: 'Teaching modules (field kit)',
    summary: 'JTBD content blocks — talk tracks and PPTX outside Studio',
    paragraphs: [
      'Enablement content lives as versioned jobs under content-blocks/ (CLI, tokens, privacy, Lab 4, brand tokens, scorecard). Studio packages the branded leave-behind zip; it does not host a block library. ADMs regenerate slides locally and teach from talk tracks.',
      'Canonical day-of runbook: docs/adm-field-kit.md in this repo.',
    ],
    sections: [
      {
        heading: 'Before the room',
        bullets: [
          'npm run field-kit — assemble every catalog block and export PPTX',
          'PPTX lands in examples/assembled-<id>/output/ (gitignored)',
          'Open content-blocks/<id>/talk-track.md for the jobs you will teach',
        ],
      },
      {
        heading: 'Jobs in the catalog today',
        bullets: [
          'Prove Rules stay on with Lab 4',
          'Encode brand once as shared tokens',
          'Catch thin decks with /deck-score before export',
          'Run the same Agent from the terminal (Cursor CLI) — draft / SME',
          'Spend context on the task, not rule bloat — draft / SME',
          'Answer privacy questions and show review gates — draft / SME + security',
        ],
      },
      {
        heading: 'In the room',
        bullets: [
          'Leave-behind demo: Studio Talk track + Lab 4 (primitives-lab.md)',
          'Curriculum sidebar: matching talk track + exported PPTX from the field kit',
          'Stay on official Cursor docs for privacy and product claims',
          'Do not treat a pre-baked PPTX as forever truth — re-run field-kit when blocks change',
        ],
      },
    ],
    tip: 'Hub Studio can consume content-blocks/catalog.json later. Until then, field-kit + talk tracks are how you extract value from the examples.',
  },
  {
    id: 'faq',
    title: 'FAQ',
    summary: 'Common questions about Studio and the leave-behind',
    paragraphs: [
      'Short answers for ADMs and FEs packaging a demonstration asset. Deep links: #help=faq.',
    ],
    diagram: 'faq-map',
    sections: [
      {
        heading: 'What is Deck Machine Studio for?',
        paragraphs: [
          'It packages a branded Cursor repo so a customer can experience skills, rules, and agent definitions working together. The deck workflow is the demonstration vehicle — not a “we build your slides for you” service.',
        ],
      },
      {
        heading: 'Is this a PowerPoint product?',
        paragraphs: [
          'No. Studio downloads a Cursor-native project. PowerPoint is the tangible output of the demo so stakeholders can see rules and skills change Agent behavior in a familiar artifact.',
        ],
      },
      {
        heading: 'Who is this for?',
        paragraphs: [
          'ADMs and FEs who already work with Cursor-using accounts. The customer needs Cursor; Studio is how you leave behind a concrete skills/rules/agents example tailored to their brand.',
        ],
      },
      {
        heading: 'What is the difference between skills, rules, and agents?',
        paragraphs: [
          'Rules are always-on (or context-triggered) guidance in .cursor/rules. Skills are slash commands under / in Agent chat. Agents are specialized workers that skills (especially /build-deck) invoke for multi-step jobs. See “Skills, rules, and agents” for the files in the zip.',
        ],
      },
      {
        heading: 'Do I need Databricks or Brandfetch to generate?',
        paragraphs: [
          'No. Those integrations only speed up account search and brand prefill. You can enter customer name, colors, fonts, voice, and logos by hand and still download a complete zip.',
        ],
      },
      {
        heading: 'How do I resume or hand off a brand pack?',
        paragraphs: [
          'Library (home) and Recent accounts (Find account) restore up to twelve packs from this browser — search by name or domain. Export brand pack downloads JSON for a teammate; Import loads it. Copy share link builds a URL with name/domain/colors (no logos). ?resume=1 reloads the most recent pack. See Help → How the wizard works.',
        ],
      },
      {
        heading: 'Where are Talk track and Rehearse?',
        paragraphs: [
          'Header actions (on phone: ☰ menu). Talk track is the live demo script with copy helpers. Rehearse is a ~5-minute practice flow before the call. After download, Mission control repeats the checklist with email handoff copy.',
        ],
      },
      {
        heading: 'Will Marriott branding appear in the customer zip?',
        paragraphs: [
          'No. Generate interpolates the customer brand pack. No Marriott-specific names or tokens remain in the output — only the customer you configured.',
        ],
      },
      {
        heading: 'What should I show in a live demo?',
        paragraphs: [
          'Open the zip in Cursor, point out the brand rule loading, open the / skill menu, run /create-brief with real notes, then /build-deck. Call out that subagents (brief-analyzer, slide-writer, brand-guardian) ran behind the skill. Show the PPTX as pipeline proof, then run Lab 4 (break → /brand-check → fix) as the learning exit. Leave them on docs/after-the-demo.md. Keep Studio Talk track open for the script.',
        ],
      },
      {
        heading: 'What Cursor setup does /build-deck need?',
        paragraphs: [
          'Agent mode with slash skills available. Office exporters ship pre-bundled (no npm install); Node on PATH is enough for /export-pptx, /export-docx, and /export-metrics-xlsx. Chart and diagram slides do not need image generation. Image slides do — if image gen is unavailable, prefer diagram/chart or let visual-creator fall back. See docs/after-the-demo.md in the zip for the full preflight checklist.',
        ],
      },
      {
        heading: 'Will the Agent invent numbers or off-brand copy?',
        paragraphs: [
          'Agents must use brief evidence only for precise metrics — never invent chart numbers. brand-guardian (via /brand-check and the build pipeline) flags topic-label headlines, banned phrases, and voice issues. Still review before external share.',
        ],
      },
      {
        heading: 'How is this different from a rules pack, Team Kit, or marketplace plugin?',
        paragraphs: [
          'Those are distribution formats for Cursor capabilities. This leave-behind is a full branded workflow they open and run: always-on rules, slash skills, agents, and a proof artifact (PPTX). Use it to teach the pattern; plugins can come later for org-wide distribution.',
        ],
      },
      {
        heading: 'Laptop zip or team GitHub?',
        paragraphs: [
          'Prefer a team Git repo owned by the customer champion so brand edits and decks are not trapped on one laptop. The zip is the seed; Git is the home. Documented in docs/after-the-demo.md.',
        ],
      },
      {
        heading: 'What if Studio templates improve after we left the zip?',
        paragraphs: [
          'Local edits to deck-content.json and brand docs stay in their repo. Layout style, exporter polish, and new teaching docs ship when you regenerate from Studio and they re-open the new zip (or merge carefully). Call out regenerate vs edit in docs/after-the-demo.md to avoid version drift surprises.',
        ],
      },
      {
        heading: 'Are agent-generated images brand-safe?',
        paragraphs: [
          'Prefer chart and diagram for numeric or structural ideas. Image slides are optional illustration — flat corporate style, no stock collage. For strict brand review, stick to chart/diagram or have brand approve generated assets before external use.',
        ],
      },
      {
        heading: 'Where are Hooks and MCP?',
        paragraphs: [
          'MCP is optional intake inside /create-brief when tools are connected — paste and interview still work offline. Hooks and the plugin marketplace remain usual next factory layers beyond this zip. The leave-behind still teaches Rules, Skills, and Agents first. Placement guidance lives in docs/primitives-decision-tree.md.',
        ],
      },
      {
        heading: 'What about InfoSec / data leaving the tenant?',
        paragraphs: [
          'Brandfetch and Databricks in Studio are optional ADM-side prefills when packaging the zip. Customer work (briefs, decks, Agent runs) happens in their Cursor workspace on the downloaded repo — not inside Studio.',
        ],
      },
      {
        heading: 'Can the customer keep using this after the meeting?',
        paragraphs: [
          'Yes. The zip is a normal Cursor project. They can edit brand docs and rules, re-run skills, and regenerate PPTX. If they need a different layout style baked into the exporter, regenerate from Studio.',
        ],
      },
      {
        heading: 'Where do I go for more detail?',
        bullets: [
          'Overview — positioning and what the customer receives',
          'Skills, rules, and agents — file-level walkthrough',
          'How a PowerPoint gets built — end-to-end pipeline',
          'After you download — setup and first demo run',
          'Account-team talk track — say / don’t say, live script, email handoff',
          'Teaching modules (field kit) — content-block talk tracks + npm run field-kit',
        ],
      },
    ],
    tip: 'If someone asks “is this for building decks?”, answer: “It’s for demonstrating Cursor skills and rules — decks are how we make that concrete.”',
  },
];

export const HELP_TOPIC_BY_ID: Record<HelpTopicId, HelpTopic> = HELP_TOPICS.reduce(
  (acc, topic) => {
    acc[topic.id] = topic;
    return acc;
  },
  {} as Record<HelpTopicId, HelpTopic>,
);

export const DEFAULT_HELP_TOPIC: HelpTopicId = 'overview';

export function isHelpTopicId(value: string | null | undefined): value is HelpTopicId {
  return Boolean(value && value in HELP_TOPIC_BY_ID);
}

function topicSearchText(topic: HelpTopic): string {
  const parts: string[] = [
    topic.title,
    topic.summary,
    ...topic.paragraphs,
    ...(topic.bullets ?? []),
  ];
  if (topic.tip) parts.push(topic.tip);
  if (topic.diagram) parts.push(topic.diagram.replace(/-/g, ' '));
  for (const section of topic.sections ?? []) {
    parts.push(section.heading);
    if (section.paragraphs) parts.push(...section.paragraphs);
    if (section.bullets) parts.push(...section.bullets);
  }
  return parts.join(' ').toLowerCase();
}

/** Case-insensitive multi-term search across all help topic fields. */
export function searchHelpTopics(query: string): HelpTopic[] {
  const terms = query
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
  if (terms.length === 0) return HELP_TOPICS;

  return HELP_TOPICS.filter((topic) => {
    const haystack = topicSearchText(topic);
    return terms.every((term) => haystack.includes(term));
  });
}
