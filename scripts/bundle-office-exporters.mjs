#!/usr/bin/env node
/**
 * Bundle pptx / docx / xlsx exporters so customer kits need no `npm install`.
 * Writes bundled/export-*.cjs into dogfood skills and Studio templates.
 *
 * Usage: node scripts/bundle-office-exporters.mjs
 * Requires: deps installed in each exporter's scripts/ folder (CI / maintainer only).
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const exporters = [
  {
    name: 'pptx',
    scriptsDir: path.join(root, '.agents/skills/export-pptx/scripts'),
    entry: 'build-pptx.js',
    outfile: 'export-pptx.cjs',
    templateBundled: path.join(
      root,
      'templates/deck-machine/dot-agents/skills/export-pptx/scripts/bundled',
    ),
  },
  {
    name: 'docx',
    scriptsDir: path.join(root, '.agents/skills/export-docx/scripts'),
    entry: 'build-docx.js',
    outfile: 'export-docx.cjs',
    templateBundled: path.join(
      root,
      'templates/deck-machine/dot-agents/skills/export-docx/scripts/bundled',
    ),
  },
  {
    name: 'xlsx',
    scriptsDir: path.join(root, '.agents/skills/export-metrics-xlsx/scripts'),
    entry: 'build-metrics-xlsx.js',
    outfile: 'export-xlsx.cjs',
    templateBundled: path.join(
      root,
      'templates/deck-machine/dot-agents/skills/export-metrics-xlsx/scripts/bundled',
    ),
  },
];

function ensureDeps(scriptsDir) {
  const nm = path.join(scriptsDir, 'node_modules');
  if (fs.existsSync(nm)) return;
  console.log(`Installing deps in ${path.relative(root, scriptsDir)} …`);
  const r = spawnSync('npm', ['install'], {
    cwd: scriptsDir,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });
  if (r.status !== 0) {
    throw new Error(`npm install failed in ${scriptsDir}`);
  }
}

function bundleOne(exp) {
  ensureDeps(exp.scriptsDir);
  const bundledDir = path.join(exp.scriptsDir, 'bundled');
  fs.mkdirSync(bundledDir, { recursive: true });
  const outPath = path.join(bundledDir, exp.outfile);
  const entryAbs = path.join(exp.scriptsDir, exp.entry);

  console.log(`Bundling ${exp.name} → ${path.relative(root, outPath)}`);
  const r = spawnSync(
    'npx',
    [
      '--yes',
      'esbuild',
      entryAbs,
      '--bundle',
      '--platform=node',
      '--format=cjs',
      '--target=node18',
      `--outfile=${outPath}`,
      '--log-level=warning',
    ],
    { cwd: root, stdio: 'inherit', shell: process.platform === 'win32' },
  );
  if (r.status !== 0) {
    throw new Error(`esbuild failed for ${exp.name}`);
  }

  fs.mkdirSync(exp.templateBundled, { recursive: true });
  const templateOut = path.join(exp.templateBundled, exp.outfile);
  fs.copyFileSync(outPath, templateOut);
  console.log(`  copied → ${path.relative(root, templateOut)}`);
}

for (const exp of exporters) {
  bundleOne(exp);
}

console.log('\nOffice exporters bundled. Customers run bundled/export-*.cjs (no npm install).');
