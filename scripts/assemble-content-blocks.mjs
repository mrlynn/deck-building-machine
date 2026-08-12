#!/usr/bin/env node
/**
 * Assemble content-blocks into a brief.md + deck-content.json fragment.
 *
 * Usage:
 *   node scripts/assemble-content-blocks.mjs [blockId ...]
 *   npm run assemble:blocks -- prove-primitives-with-lab4
 *   npm run assemble:blocks -- --preset standard-enablement
 *
 * Default (no args): all three leave-behind blocks → examples/assembled-primitives-lab/
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const blocksRoot = path.join(root, 'content-blocks');
const catalogPath = path.join(blocksRoot, 'catalog.json');

const DEFAULT_BLOCKS = [
  'prove-primitives-with-lab4',
  'encode-brand-as-tokens',
  'govern-quality-with-cli',
];

/** Named mixes → examples/assembled-<preset>/ */
const PRESETS = {
  'primitives-lab': DEFAULT_BLOCKS,
  'standard-enablement': [
    ...DEFAULT_BLOCKS,
    'use-cursor-cli',
    'optimize-tokens',
    'govern-privacy-and-review',
  ],
};

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function resolveBlockIds(argv) {
  const presetIdx = argv.indexOf('--preset');
  if (presetIdx !== -1) {
    const name = argv[presetIdx + 1];
    if (!name || name.startsWith('-')) {
      throw new Error('Usage: --preset <primitives-lab|standard-enablement>');
    }
    const ids = PRESETS[name];
    if (!ids) {
      throw new Error(
        `Unknown preset "${name}". Known: ${Object.keys(PRESETS).join(', ')}`,
      );
    }
    return { blockIds: ids, slug: name };
  }
  if (argv.length === 0) {
    return { blockIds: DEFAULT_BLOCKS, slug: 'primitives-lab' };
  }
  return { blockIds: argv, slug: null };
}

function loadBlock(id) {
  const dir = path.join(blocksRoot, id);
  const blockPath = path.join(dir, 'block.json');
  if (!fs.existsSync(blockPath)) {
    throw new Error(`Unknown content block: ${id} (missing ${blockPath})`);
  }
  const meta = readJson(blockPath);
  const slides = readJson(path.join(dir, meta.slides || 'slides.json'));
  if (!Array.isArray(slides)) {
    throw new Error(`${id}: slides.json must be an array`);
  }
  const briefFragment = fs.readFileSync(
    path.join(dir, meta.briefFragment || 'brief-fragment.md'),
    'utf8',
  );
  const talkTrack = fs.readFileSync(
    path.join(dir, meta.talkTrack || 'talk-track.md'),
    'utf8',
  );
  return { meta, slides, briefFragment, talkTrack };
}

function slugFor(ids) {
  for (const [name, presetIds] of Object.entries(PRESETS)) {
    if (
      ids.length === presetIds.length &&
      presetIds.every((id, i) => id === ids[i])
    ) {
      return name;
    }
  }
  if (ids.length === 1) return ids[0];
  return ids.join('-').slice(0, 48);
}

function buildBrief(assembled, slug) {
  const jobs = assembled.map((b) => `- ${b.meta.jobTitle} (\`${b.meta.id}@${b.meta.version}\`)`);
  const fragments = assembled.map((b) => b.briefFragment.trim()).join('\n\n---\n\n');
  const talk = assembled.map((b) => b.talkTrack.trim()).join('\n\n---\n\n');
  const isStandard = slug === 'standard-enablement';
  const topic = isStandard
    ? 'Standard enablement spine (leave-behind + curriculum drafts)'
    : 'Leave-behind teaching blocks (assembled)';
  const delivery = isStandard ? '45–60 minutes (modular)' : '20–30 minutes';

  return `# Deck Brief

> Assembled from content-blocks via \`npm run assemble:blocks\`.
> Review, then run \`/build-deck\` or \`/polish-deck\` on the sibling deck-content.json.
${isStandard ? '> **SME package:** curriculum blocks are still draft — sign off before external 101.\n' : ''}
---

## Deck information

| Field | Value |
|---|---|
| **Topic** | ${topic} |
| **Audience** | Customer champions and engineers in a Cursor demo |
| **Purpose** | Inform |
| **Target slide count** | ${assembled.reduce((n, b) => n + b.slides.length, 0) + 2} |
| **Presenter** | ADM / FE |
| **Delivery time** | ${delivery} |

---

## Background

Assembled content blocks for Deck Machine enablement.
Blocks are JTBD-named units under \`content-blocks/\` — not a Hub Studio hub.
${isStandard ? 'This mix is the candidate **standard enablement** spine for review.\n' : ''}
**Included blocks**

${jobs.join('\n')}

---

## Key messages

1. Rules stay on; Skills are buttons; Agents are the pipeline.
2. Brand tokens are encoded once for Agents and exporters.
3. Quality gates (\`/brand-check\` + \`/deck-score\`) catch failures before export.
${isStandard ? '4. CLI, token budget, and privacy/review are the curriculum sidebars ADMs asked for.\n' : ''}
---

## Content to include

${fragments}

---

## Assembled talk tracks

${talk}

---

## What to avoid

- Topic-label headlines
- Treating Studio as an Office SaaS
- Skipping Lab 4 exit criteria
${isStandard ? '- Shipping draft curriculum externally before SME / security sign-off\n' : ''}`;
}

function buildDeckContent(assembled, slug) {
  const isStandard = slug === 'standard-enablement';
  const titleSlide = {
    type: 'title',
    headline: isStandard
      ? 'Standard enablement spine — assembled for review'
      : 'Leave-behind teaching blocks — assembled',
    content: {
      eyebrow: isStandard ? 'Enablement review package' : 'Content blocks',
      subtitle: assembled.map((b) => b.meta.jobTitle).join(' · '),
    },
    notes: {
      opening: isStandard
        ? 'Candidate standard deck — leave-behind plus curriculum drafts.'
        : 'This deck was assembled from versioned content blocks.',
      points: [
        'Edit blocks under content-blocks/, then re-run assemble.',
        isStandard
          ? 'CLI / tokens / privacy stay draft until SME sign-off.'
          : 'Polish or export with existing deck skills.',
      ],
      transition: 'Into the first block section.',
      timeMinutes: 1,
    },
  };

  const closing = {
    type: 'closing',
    headline: isStandard
      ? 'Next: SME sign-off, then Lab 4 in the room'
      : 'Next: run Lab 4, then read after-the-demo',
    content: {
      items: [
        {
          number: '01',
          action: 'Open the leave-behind zip in Cursor',
          owner: 'Champion',
          date: 'Today',
        },
        {
          number: '02',
          action: 'Complete Lab 4 exit criteria',
          owner: 'Room',
          date: 'docs/primitives-lab.md',
        },
        {
          number: '03',
          action: 'Read day-2 ownership',
          owner: 'Champion',
          date: 'docs/after-the-demo.md',
        },
        {
          number: '04',
          action: 'Author new JTBD blocks under content-blocks/',
          owner: 'ADM / content',
          date: 'Next',
        },
      ],
    },
    notes: {
      opening: 'Close on ownership and the required exit.',
      points: isStandard
        ? [
            'Mark reviewed blocks in catalog notes; re-assemble after edits.',
            'Day-of kit: npm run field-kit · docs/adm-field-kit.md.',
          ]
        : [
            'Point at catalog.json for curriculum blocks.',
            'Assemble --preset standard-enablement for the full review spine.',
          ],
      transition: 'End.',
      timeMinutes: 2,
    },
  };

  const slides = [titleSlide];
  for (const block of assembled) {
    slides.push(...block.slides);
  }
  slides.push(closing);

  return {
    metadata: {
      title: `Assembled blocks — ${slug}`,
      audience: 'Customer champions and engineers in a Cursor demo',
      presenter: 'ADM / FE',
      date: new Date().toLocaleString('en-US', {
        month: 'long',
        year: 'numeric',
      }),
      purpose: 'inform',
      assembledFrom: assembled.map((b) => ({
        id: b.meta.id,
        version: b.meta.version,
      })),
    },
    slides,
  };
}

function main() {
  const { blockIds, slug: presetSlug } = resolveBlockIds(process.argv.slice(2));

  if (!fs.existsSync(catalogPath)) {
    throw new Error(`Missing catalog at ${catalogPath}`);
  }
  const catalog = readJson(catalogPath);
  const known = new Set(catalog.blocks.map((b) => b.id));

  for (const id of blockIds) {
    if (!known.has(id) && !fs.existsSync(path.join(blocksRoot, id, 'block.json'))) {
      throw new Error(`Block not in catalog and no folder: ${id}`);
    }
  }

  const assembled = blockIds.map(loadBlock);
  const slug = presetSlug ?? slugFor(blockIds);
  const outDir = path.join(root, 'examples', `assembled-${slug}`);
  fs.mkdirSync(outDir, { recursive: true });

  const brief = buildBrief(assembled, slug);
  const deck = buildDeckContent(assembled, slug);

  fs.writeFileSync(path.join(outDir, 'brief.md'), brief);
  fs.writeFileSync(
    path.join(outDir, 'deck-content.json'),
    `${JSON.stringify(deck, null, 2)}\n`,
  );

  const manifest = {
    assembledAt: new Date().toISOString(),
    blocks: assembled.map((b) => ({
      id: b.meta.id,
      version: b.meta.version,
      jobTitle: b.meta.jobTitle,
      slideCount: b.slides.length,
    })),
    outputs: ['brief.md', 'deck-content.json'],
  };
  fs.writeFileSync(
    path.join(outDir, 'assembly-manifest.json'),
    `${JSON.stringify(manifest, null, 2)}\n`,
  );

  console.log(`Assembled ${assembled.length} block(s) → ${path.relative(root, outDir)}`);
  for (const b of manifest.blocks) {
    console.log(`  - ${b.id}@${b.version} (${b.slideCount} slides)`);
  }
}

try {
  main();
} catch (err) {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
}
