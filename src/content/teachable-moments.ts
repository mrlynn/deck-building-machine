/**
 * Short progressive-disclosure strings for Studio teachable moments.
 * Long-form curriculum stays in help.ts — this module only maps UI → captions + Help topic ids.
 */

import type { HelpTopicId } from './help';

export type CursorPrimitive = 'Rules' | 'Skills' | 'Agents' | 'Docs';

export type PrimitiveStripItem = {
  id: CursorPrimitive;
  label: string;
  caption: string;
  helpTopic: HelpTopicId;
};

/** Hero + Welcome: Rules / Skills / Agents one-liners. */
export const PRIMITIVE_STRIP: PrimitiveStripItem[] = [
  {
    id: 'Rules',
    label: 'Rules',
    caption: 'Always-on brand and writing standards in every chat.',
    helpTopic: 'skills-and-rules',
  },
  {
    id: 'Skills',
    label: 'Skills',
    caption: 'Slash commands under / — brief, build, brand-check, export.',
    helpTopic: 'skills-and-rules',
  },
  {
    id: 'Agents',
    label: 'Agents',
    caption: 'Multi-step workers skills invoke; not typed as slash commands.',
    helpTopic: 'skills-and-rules',
  },
];

export type WelcomePill = {
  label: string;
  helpTopic: HelpTopicId;
};

export const WELCOME_PRIMITIVE_PILLS: WelcomePill[] = [
  { label: 'Skills', helpTopic: 'skills-and-rules' },
  { label: 'Rules', helpTopic: 'skills-and-rules' },
  { label: 'Agents', helpTopic: 'skills-and-rules' },
];

/** Post-download arc shown on Welcome and Generate. */
export const POST_DOWNLOAD_ARC =
  'After download: open in Cursor → /create-brief → /build-deck → PPTX appears in output/ (not in the zip). Optional: /build-doc or /export-metrics-xlsx. Required exit: Lab 4. Day 2: docs/after-the-demo.md.';

export const BRAND_PACK_ENTER_ALERT =
  'You are encoding brand as always-on rules. Colors, voice, and layout land in .cursor/rules and shape Agent output in Cursor.';

export type FieldCaptionId =
  | 'colors'
  | 'fonts'
  | 'voice'
  | 'wordsToAvoid'
  | 'layout';

export const FIELD_CAPTIONS: Record<
  FieldCaptionId,
  { caption: string; helpTopic: HelpTopicId }
> = {
  colors: {
    caption:
      'Writes into always-on .cursor/rules/<slug>-brand.mdc and the PPTX exporter.',
    helpTopic: 'brand-pack',
  },
  fonts: {
    caption:
      'Font stack is baked into the brand rule and exporter — same tokens Agents and PPTX use.',
    helpTopic: 'brand-pack',
  },
  voice: {
    caption:
      'slide-writer and brand-guardian read this — rules shaping Agent output.',
    helpTopic: 'skills-and-rules',
  },
  wordsToAvoid: {
    caption:
      'brand-guardian flags these phrases — demo how rules constrain Agent copy.',
    helpTopic: 'skills-and-rules',
  },
  layout: {
    caption:
      'Agents prefer this slide mix per brand rule; exporter frames title, content, and metrics to match.',
    helpTopic: 'layout-preview',
  },
};

export type ArtifactAnnotation = {
  /** Match preview path (supports {{slug}} placeholder). */
  pathPattern: string;
  primitive: CursorPrimitive;
  /** One-line caption on the collapsed file row. */
  teaches: string;
  /** Longer explanation shown when the file is expanded. */
  explanation: string;
  /** What the account team should say or do when pointing at this file. */
  demoTip: string;
};

/**
 * Annotated zip paths for Step 2 file list.
 * Paths with {{slug}} are resolved at render time.
 * Order = Studio preview teaching order.
 */
export const ARTIFACT_ANNOTATIONS: ArtifactAnnotation[] = [
  {
    pathPattern: '.cursor/rules/{{slug}}-brand.mdc',
    primitive: 'Rules',
    teaches: 'Always-on brand palette, voice, and slide-writing standards.',
    explanation:
      'This is an always-on Cursor rule. When the customer opens this folder, the Agent reads it in every chat without anyone typing @ or / — colors, voice, and slide-writing standards shape output automatically.',
    demoTip:
      'Open this file first. Say: “Rules load without asking — this is how brand constraints stay on.”',
  },
  {
    pathPattern: '.cursor/rules/deck-workflow.mdc',
    primitive: 'Rules',
    teaches: 'Contextual process rule — outline-first, story arcs, JSON schema.',
    explanation:
      'Not alwaysApply. This rule loads when working on decks: brief intake, outline-first, story arcs, and the deck-content.json shape. Contrast with the brand rule — brand is ambient; workflow is situational.',
    demoTip:
      'Open next to the brand rule. Say: “Two rule modes — always-on brand vs on-demand process.”',
  },
  {
    pathPattern: 'brand/palette.md',
    primitive: 'Docs',
    teaches: 'Human-readable brand reference Agents and teammates can open.',
    explanation:
      'A readable brand reference for humans and Agents. Same tokens as the always-on rule and the PPTX exporter — one source of truth for the leave-behind.',
    demoTip:
      'Show that palette.md matches the colors in the rule. Teammates can open Docs; Agents still obey the rule.',
  },
  {
    pathPattern: 'brand/voice.md',
    primitive: 'Docs',
    teaches: 'Voice and words-to-avoid mirrored into the brand rule.',
    explanation:
      'Voice and banned phrases live here for humans, and are mirrored into the brand rule so slide-writer and brand-guardian stay consistent.',
    demoTip:
      'Point at words-to-avoid. Say: “brand-guardian will flag these in Agent copy.”',
  },
  {
    pathPattern: '.agents/skills/create-brief/SKILL.md',
    primitive: 'Skills',
    teaches: '/create-brief — MCP when connected, else interview or paste.',
    explanation:
      '/create-brief interviews, accepts pasted notes, or (when MCP tools are connected) pulls meeting/account context first — then only asks for gaps. The template is the schema the Agent fills — humans should not hand-edit it as the starting move.',
    demoTip:
      'Demo talk-or-paste (or MCP if connected): run /create-brief with real meeting notes.',
  },
  {
    pathPattern: '.agents/skills/build-deck/SKILL.md',
    primitive: 'Skills',
    teaches: '/build-deck — end-to-end brief → PPTX via deck-builder.',
    explanation:
      'A Skill is a slash command under /. /build-deck is the end-to-end path: brief → outline → slides → brand check → PPTX. Customers type the skill; agents do the multi-step work.',
    demoTip:
      'In Agent chat, open / and find build-deck. Skills are what users invoke.',
  },
  {
    pathPattern: '.agents/skills/revise-deck/SKILL.md',
    primitive: 'Skills',
    teaches: '/revise-deck — surgical edits + HTML preview (weekly loop).',
    explanation:
      'After the first PPTX, weekly use is revise not rebuild. /revise-deck patches deck-content.json and regenerates output/preview.html so they see the story before /export-pptx.',
    demoTip:
      'After the happy-path export, change one headline with /revise-deck and open the HTML preview.',
  },
  {
    pathPattern: '.agents/skills/build-doc/SKILL.md',
    primitive: 'Skills',
    teaches: '/build-doc — Word narrative from the same brief (not a .docx in the zip).',
    explanation:
      'Same brand rules and brief spine; different exporter. The zip ships this skill — the customer runs it in Cursor to create output/*.docx. Proves a factory of skills, not a PowerPoint-only app.',
    demoTip:
      'Say: “PPTX is the demo vehicle; /build-doc is one more skill on the same brand pack — no finished Word file in the download.”',
  },
  {
    pathPattern: '.agents/skills/export-metrics-xlsx/SKILL.md',
    primitive: 'Skills',
    teaches: '/export-metrics-xlsx — chart/metrics slides → branded workbook.',
    explanation:
      'Thin Excel wedge: copy numbers already in deck JSON into a branded workbook. Not a financial modeler. The zip ships the skill + bundled exporter; the customer runs it after a deck with metrics/chart slides.',
    demoTip:
      'Run after a deck with a chart slide. Point at the caption: numbers come from the deck only — nothing invented in Studio.',
  },
  {
    pathPattern: '.agents/skills/brand-check/SKILL.md',
    primitive: 'Skills',
    teaches: '/brand-check — skill that wraps brand-guardian (best skill-vs-agent demo).',
    explanation:
      'Clearest teaching pattern: the human chooses when to audit (/brand-check), the agent does the deep review (brand-guardian), and the always-on brand rule is the rubric. Skill button; agent worker; rule constraint.',
    demoTip:
      'Say: “Skill wraps agent. Run /brand-check after a bad headline to prove it.”',
  },
  {
    pathPattern: 'brand/brand-pack.json',
    primitive: 'Docs',
    teaches: 'Runtime brand tokens for all three Office exporters.',
    explanation:
      'Single JSON pack Studio writes into the zip: colors, fonts, layoutStyle, voice. PPTX, DOCX, and XLSX exporters read this at runtime — flip Factory outputs and show the same hexes land in every format.',
    demoTip:
      'Open this file when flipping Slides → Document → Workbook. Say: “One pack, three renderers.”',
  },
  {
    pathPattern: '.agents/skills/export-pptx/scripts/bundled/export-pptx.cjs',
    primitive: 'Skills',
    teaches: 'Bundled PPTX exporter — customer runs this; no npm install.',
    explanation:
      'Pre-bundled proof engine. Brand colors, fonts, and layout style load from brand/brand-pack.json so the PPTX matches the rules Agents follow — without a customer npm install. Finished .pptx files are not in the zip.',
    demoTip:
      'Highlight this row when Factory outputs = Slides. Then open brand-pack.json for the primary hex.',
  },
  {
    pathPattern: '.agents/skills/export-docx/scripts/bundled/export-docx.cjs',
    primitive: 'Skills',
    teaches: 'Bundled DOCX exporter — Word from /build-doc, no npm.',
    explanation:
      'Same brand-pack.json tokens as PPTX. Customer runs /build-doc (or /export-docx) in Cursor; this script writes output/*.docx. Studio never generates the Word file in the browser.',
    demoTip:
      'Highlight when Factory outputs = Document. Say: “Skill + bundle in the kit; file appears in output/ after they run it.”',
  },
  {
    pathPattern: '.agents/skills/export-metrics-xlsx/scripts/bundled/export-xlsx.cjs',
    primitive: 'Skills',
    teaches: 'Bundled XLSX exporter — metrics/chart pack, no npm.',
    explanation:
      'Pulls metrics and chart slides from deck-content.json into a branded workbook. Numbers only from the deck. Customer runs /export-metrics-xlsx after the happy-path PPTX.',
    demoTip:
      'Highlight when Factory outputs = Workbook. Remind: no invented numbers, no financial modeler.',
  },
  {
    pathPattern: '.cursor/agents/deck-builder.md',
    primitive: 'Agents',
    teaches: 'Orchestrates brief-analyzer → slide-writer → brand-guardian.',
    explanation:
      'Agents are multi-step workers skills invoke. deck-builder orchestrates brief-analyzer → slide-writer → visual-creator → brand-guardian. Customers rarely type agent names; they run /build-deck.',
    demoTip:
      'Contrast with the skill: “Skills are the button; agents are the pipeline behind it.”',
  },
  {
    pathPattern: '.cursor/agents/brief-analyzer.md',
    primitive: 'Agents',
    teaches: 'Readonly outline worker — audience, three messages, insight headlines.',
    explanation:
      'Specialist agent: turns a brief into a slide-by-slide outline (types + insight headlines). Invoked by deck-builder, not typed as a slash command.',
    demoTip:
      'Say: “This agent decides slide types before anyone writes bullets.”',
  },
  {
    pathPattern: '.cursor/agents/slide-writer.md',
    primitive: 'Agents',
    teaches: 'Writes one slide JSON at a time under brand rules.',
    explanation:
      'Worker agent for a single slide object. Brand rules stay in context; the agent focuses on one insight headline and type-specific content.',
    demoTip:
      'Contrast with /write-slide: the skill is how humans ask for one slide; this agent is who writes it in the full pipeline.',
  },
  {
    pathPattern: '.cursor/agents/brand-guardian.md',
    primitive: 'Agents',
    teaches: 'Readonly brand audit — pass/warn/fail on headlines, bullets, voice.',
    explanation:
      'QA agent that grades deck-content.json against the brand rule. Invoked by /brand-check and by deck-builder before export. Best “break → fix” demo target.',
    demoTip:
      'After a deliberate bad headline, run /brand-check and point at this file.',
  },
  {
    pathPattern: '.cursor/agents/visual-creator.md',
    primitive: 'Agents',
    teaches: 'Validates chart/diagram JSON; generates PNGs into assets/.',
    explanation:
      'Specialist for visual slides. Prefer chart/diagram over generative image. Humans never drop PNGs into assets/ — this agent authors them during /build-deck.',
    demoTip:
      'Say: “Agents create visuals; the leave-behind is not a design handoff.”',
  },
  {
    pathPattern: 'docs/primitives-decision-tree.md',
    primitive: 'Docs',
    teaches: 'Placement guide — Rule vs Skill vs Agent vs Doc.',
    explanation:
      'Decision tree for extending the leave-behind. Teaches why brand is a rule, why /build-deck is a skill, and why brand-guardian is an agent — the hard part of enablement.',
    demoTip:
      'After naming the three layers, open this if someone asks “where would I put X?”',
  },
  {
    pathPattern: 'docs/primitives-lab.md',
    primitive: 'Docs',
    teaches: '20-minute hands-on lab with exit criteria.',
    explanation:
      'Four labs: Rules contrast, atomic Skills, Agents peek, break→fix with /brand-check. Exit criteria turn the zip into practice, not only a demo script.',
    demoTip:
      'After the happy-path PPTX, run Lab 4 (break→fix) live — required learning exit, not optional.',
  },
  {
    pathPattern: 'docs/after-the-demo.md',
    primitive: 'Docs',
    teaches: 'Day 2: ownership, preflight, regenerate vs edit, scope limits.',
    explanation:
      'What happens after the meeting: who owns brand and the repo, Cursor preflight, when to regenerate from Studio vs edit JSON, optional renderers (doc/xlsx/preview), and that Hooks remain a next factory layer.',
    demoTip:
      'Leave them on after-the-demo.md after Lab 4 so ownership and regenerate rules are clear.',
  },
  {
    pathPattern: 'README.md',
    primitive: 'Docs',
    teaches: 'Customer leave-behind: how skills, rules, and agents fit together.',
    explanation:
      'The customer-facing leave-behind. How skills, rules, and agents fit together, and the short path from brief to PPTX after they open the folder in Cursor.',
    demoTip:
      'Leave them on the README after the live demo so they can re-run the flow alone — then point at docs/primitives-lab.md Lab 4 and docs/after-the-demo.md.',
  },
];

export function resolveArtifactPath(pattern: string, slug: string): string {
  return pattern.replace('{{slug}}', slug || 'customer');
}

export function annotationForPath(
  path: string,
  slug: string,
): ArtifactAnnotation | undefined {
  return ARTIFACT_ANNOTATIONS.find(
    (a) => resolveArtifactPath(a.pathPattern, slug) === path,
  );
}

/** Stable order for the Preview & generate file list (annotation order). */
export function previewArtifactPaths(slug: string): string[] {
  return ARTIFACT_ANNOTATIONS.map((a) =>
    resolveArtifactPath(a.pathPattern, slug || 'customer'),
  );
}

/** Account-team demo script surfaced beside Download (from Help after-download). */
export const DEMO_SCRIPT_TITLE = 'Account-team demo script';

export const DEMO_SCRIPT_BULLETS = [
  'Open the unzipped folder in Cursor — brand rules load automatically.',
  'Show Skills under / in Agent chat (create-brief, build-deck, revise-deck, brand-check).',
  'Run /create-brief with real meeting notes (talk, paste, or MCP if connected).',
  'Run /build-deck brief.md — narrate agents working behind the skill.',
  'Run /preview-deck — open output/preview.html before treating PPTX as final.',
  'Open the PPTX from output/ — proof the pipeline worked.',
  'Optional: /build-doc or /export-metrics-xlsx to show thin second renderers.',
  'Required exit: docs/primitives-lab.md Lab 4 (bad headline → /brand-check → fix).',
  'Leave them on docs/after-the-demo.md for ownership and regenerate rules.',
] as const;

export const DEMO_SCRIPT_HELP_TOPIC: HelpTopicId = 'after-download';
