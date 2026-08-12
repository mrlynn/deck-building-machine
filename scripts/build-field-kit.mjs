#!/usr/bin/env node
/**
 * Build the ADM field kit: assemble every catalog block, export PPTX.
 *
 * Usage:
 *   npm run field-kit
 *   node scripts/build-field-kit.mjs [blockId ...]
 *
 * PPTX lands in examples/assembled-<id>/output/ (gitignored).
 * Talk tracks stay in content-blocks/<id>/talk-track.md (source of truth).
 *
 * Teaching exports use Cursor brand tokens (brand/cursor/), not the Marriott
 * dogfood pack in brand/. Override with DECK_BRAND_DIR if needed.
 */

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const catalogPath = path.join(root, 'content-blocks', 'catalog.json');
const assembleScript = path.join(root, 'scripts', 'assemble-content-blocks.mjs');
const exportScript = path.join(
  root,
  '.agents/skills/export-pptx/scripts/bundled/export-pptx.cjs',
);

function readCatalogIds() {
  const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
  return (catalog.blocks ?? []).map((b) => b.id);
}

function runNode(script, args, label, env = {}) {
  const result = spawnSync(process.execPath, [script, ...args], {
    cwd: root,
    encoding: 'utf8',
    env: { ...process.env, ...env },
  });
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  if (result.status !== 0) {
    throw new Error(`${label} failed (exit ${result.status})`);
  }
}

function main() {
  const ids =
    process.argv.slice(2).length > 0 ? process.argv.slice(2) : readCatalogIds();

  if (!fs.existsSync(exportScript)) {
    throw new Error(`Missing exporter: ${exportScript}`);
  }

  console.log(`Field kit: ${ids.length} block(s)\n`);

  const rows = [];

  for (const id of ids) {
    console.log(`── ${id}`);
    runNode(assembleScript, [id], `assemble ${id}`);

    const deckPath = path.join(
      root,
      'examples',
      `assembled-${id}`,
      'deck-content.json',
    );
    if (!fs.existsSync(deckPath)) {
      throw new Error(`Expected ${deckPath} after assemble`);
    }

    // Field-kit / curriculum decks are Cursor enablement — not Marriott dogfood.
    runNode(exportScript, [deckPath], `export ${id}`, {
      DECK_BRAND_DIR: process.env.DECK_BRAND_DIR || 'brand/cursor',
    });

    const outDir = path.join(root, 'examples', `assembled-${id}`, 'output');
    const pptx =
      fs.existsSync(outDir) &&
      fs.readdirSync(outDir).find((f) => f.endsWith('.pptx'));
    const talkTrack = path.join('content-blocks', id, 'talk-track.md');

    rows.push({
      id,
      talkTrack,
      pptx: pptx
        ? path.join('examples', `assembled-${id}`, 'output', pptx)
        : '(missing)',
      deck: path.join('examples', `assembled-${id}`, 'deck-content.json'),
    });
    console.log('');
  }

  console.log('Field kit ready (PPTX is local / gitignored):\n');
  for (const row of rows) {
    console.log(`  ${row.id}`);
    console.log(`    talk:  ${row.talkTrack}`);
    console.log(`    deck:  ${row.deck}`);
    console.log(`    pptx:  ${row.pptx}`);
  }
  console.log('\nDay-of runbook: docs/adm-field-kit.md');
}

main();
