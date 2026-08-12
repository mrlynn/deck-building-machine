import fs from 'fs/promises';
import path from 'path';
import Mustache from 'mustache';
import JSZip from 'jszip';
import { BrandPack, hexBare } from './types';
import {
  LAYOUT_STYLES,
  resolveLayoutStyle,
  type LayoutStyleId,
} from './layouts';

Mustache.escape = (text) => text;

export interface TemplateContext {
  customerName: string;
  customerSlug: string;
  displayName: string;
  website: string;
  industry: string;
  defaultAudience: string;
  presenterHint: string;
  voiceSummary: string;
  wordsToAvoidBullets: string;
  fontStack: string;
  primaryColor: string;
  primaryBare: string;
  darkColor: string;
  darkBare: string;
  grayColor: string;
  grayBare: string;
  lightGrayColor: string;
  lightGrayBare: string;
  midGrayColor: string;
  midGrayBare: string;
  whiteColor: string;
  whiteBare: string;
  accentColor: string;
  accentBare: string;
  ruleFileName: string;
  generatedAt: string;
  layoutStyle: LayoutStyleId;
  layoutLabel: string;
  layoutTagline: string;
  layoutGuidance: string;
  layoutSlideMixHint: string;
  layoutClassic: boolean;
  layoutMinimal: boolean;
  layoutBold: boolean;
}

function templatesRoot(): string {
  return path.join(process.cwd(), 'templates', 'deck-machine');
}

export function toTemplateContext(brand: BrandPack): TemplateContext {
  const words = brand.wordsToAvoid?.length
    ? brand.wordsToAvoid
    : ['leverage', 'synergies', 'best-in-class'];
  const layoutStyle = resolveLayoutStyle(brand.layoutStyle);
  const layout = LAYOUT_STYLES[layoutStyle];

  return {
    customerName: brand.customerName,
    customerSlug: brand.customerSlug,
    displayName: brand.displayName || brand.customerName,
    website: brand.website || '',
    industry: brand.industry || '',
    defaultAudience: brand.defaultAudience || `${brand.customerName} leadership`,
    presenterHint: brand.presenterHint || '',
    voiceSummary: brand.voiceSummary,
    wordsToAvoidBullets: words.map((w) => `- ${w}`).join('\n'),
    fontStack: brand.fontStack,
    primaryColor: brand.primaryColor.startsWith('#')
      ? brand.primaryColor
      : `#${brand.primaryColor}`,
    primaryBare: hexBare(brand.primaryColor),
    darkColor: brand.darkColor.startsWith('#') ? brand.darkColor : `#${brand.darkColor}`,
    darkBare: hexBare(brand.darkColor),
    grayColor: brand.grayColor.startsWith('#') ? brand.grayColor : `#${brand.grayColor}`,
    grayBare: hexBare(brand.grayColor),
    lightGrayColor: brand.lightGrayColor.startsWith('#')
      ? brand.lightGrayColor
      : `#${brand.lightGrayColor}`,
    lightGrayBare: hexBare(brand.lightGrayColor),
    midGrayColor: brand.midGrayColor.startsWith('#')
      ? brand.midGrayColor
      : `#${brand.midGrayColor}`,
    midGrayBare: hexBare(brand.midGrayColor),
    whiteColor: brand.whiteColor.startsWith('#') ? brand.whiteColor : `#${brand.whiteColor}`,
    whiteBare: hexBare(brand.whiteColor),
    accentColor: brand.accentColor.startsWith('#')
      ? brand.accentColor
      : `#${brand.accentColor}`,
    accentBare: hexBare(brand.accentColor),
    ruleFileName: `${brand.customerSlug}-brand.mdc`,
    generatedAt: new Date().toISOString().slice(0, 10),
    layoutStyle,
    layoutLabel: layout.label,
    layoutTagline: layout.tagline,
    layoutGuidance: layout.agentGuidance,
    layoutSlideMixHint: layout.slideMixHint,
    layoutClassic: layoutStyle === 'classic',
    layoutMinimal: layoutStyle === 'minimal',
    layoutBold: layoutStyle === 'bold',
  };
}

async function walkDir(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkDir(full)));
    } else {
      files.push(full);
    }
  }
  return files;
}

function stripMustacheExt(rel: string): string {
  return rel.endsWith('.mustache') ? rel.slice(0, -'.mustache'.length) : rel;
}

/**
 * Template source uses NFT-safe names (dot-* ) because Next/Vercel file tracing
 * and many globs skip directories that start with `.`. Map to real Cursor paths
 * in the downloaded zip.
 */
function toZipRelPath(rel: string): string {
  const normalized = rel.split(path.sep).join('/');
  if (normalized === 'dot-gitignore') return '.gitignore';
  if (normalized.startsWith('dot-cursor/')) {
    return `.cursor/${normalized.slice('dot-cursor/'.length)}`;
  }
  if (normalized.startsWith('dot-agents/')) {
    return `.agents/${normalized.slice('dot-agents/'.length)}`;
  }
  // Back-compat if someone restores hidden dirs locally
  return normalized;
}

function assertDeckMachineComplete(files: Record<string, string | Buffer>, slug: string): void {
  const keys = Object.keys(files);
  const requiredSubstrings = [
    `.cursor/rules/${slug}-brand.mdc`,
    '.cursor/rules/deck-workflow.mdc',
    '.cursor/agents/deck-builder.md',
    '.agents/skills/build-deck/SKILL.md',
    '.agents/skills/export-pptx/scripts/build-pptx.js',
    '.agents/skills/export-pptx/scripts/bundled/export-pptx.cjs',
    '.agents/skills/export-docx/scripts/bundled/export-docx.cjs',
    '.agents/skills/export-metrics-xlsx/scripts/bundled/export-xlsx.cjs',
    '.agents/skills/_shared/load-brand.js',
    'docs/primitives-lab.md',
    'docs/primitives-decision-tree.md',
    'docs/after-the-demo.md',
    'AGENTS.md',
    'README.md',
  ];
  const missing = requiredSubstrings.filter((p) => !keys.includes(p));
  if (missing.length) {
    throw new Error(
      `Deck machine zip is incomplete — missing required Cursor primitives: ${missing.join(', ')}. ` +
        `Check templates/deck-machine (dot-cursor / dot-agents) and outputFileTracingIncludes.`,
    );
  }
}

/**
 * Render the deck-machine template tree into a map of relative path → content.
 * Logo binaries are attached separately as base64 → Buffer.
 *
 * On-disk template layout uses `dot-cursor/` and `dot-agents/` (not `.cursor` /
 * `.agents`) so Next.js file tracing includes them. Paths are rewritten to the
 * real Cursor locations in the zip.
 */
export async function renderDeckMachine(
  brand: BrandPack,
): Promise<{ files: Record<string, string | Buffer>; ctx: TemplateContext }> {
  const root = templatesRoot();
  const ctx = toTemplateContext(brand);
  const absoluteFiles = await walkDir(root);
  const files: Record<string, string | Buffer> = {};

  for (const abs of absoluteFiles) {
    const rel = path.relative(root, abs).split(path.sep).join('/');
    // Skip placeholder logos in template; real logos come from brand pack
    if (rel === 'brand/logo.png' || rel === 'brand/logo-on-light.png') continue;

    const outRel = toZipRelPath(
      stripMustacheExt(rel)
        // Rename brand rule file to customer slug
        .replace('CUSTOMER-brand.mdc', ctx.ruleFileName),
    );

    // Text templates only — bundled Office exporters (.cjs) stay binary copies
    if (rel.endsWith('.mustache') || /\.(md|mdc|js|json|txt)$/.test(rel)) {
      const raw = await fs.readFile(abs, 'utf8');
      files[outRel] = Mustache.render(raw, ctx);
    } else {
      files[outRel] = await fs.readFile(abs);
    }
  }

  // Inject logos if provided
  if (brand.logoOnDarkBase64) {
    const b64 = brand.logoOnDarkBase64.replace(/^data:image\/\w+;base64,/, '');
    files['brand/logo.png'] = Buffer.from(b64, 'base64');
  }
  if (brand.logoOnLightBase64) {
    const b64 = brand.logoOnLightBase64.replace(/^data:image\/\w+;base64,/, '');
    files['brand/logo-on-light.png'] = Buffer.from(b64, 'base64');
  }

  // brand-pack.json for round-tripping / studio reload
  files['brand/brand-pack.json'] = JSON.stringify(
    {
      ...brand,
      logoOnDarkBase64: undefined,
      logoOnLightBase64: undefined,
      generatedAt: ctx.generatedAt,
    },
    null,
    2,
  );

  assertDeckMachineComplete(files, ctx.customerSlug);

  return { files, ctx };
}

export async function zipDeckMachine(brand: BrandPack): Promise<Buffer> {
  const { files, ctx } = await renderDeckMachine(brand);
  const zip = new JSZip();
  const rootPrefix = `${ctx.customerSlug}-deck-machine`;

  // Use absolute zip paths (not folder().file) so leading-dot segments stay intact.
  for (const [rel, content] of Object.entries(files)) {
    zip.file(`${rootPrefix}/${rel}`, content);
  }

  return zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
}
