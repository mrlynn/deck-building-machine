'use strict';

const assert = require('node:assert/strict');
const path = require('path');
const { spawnSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const cli = path.join(root, '.agents/skills/deck-score/scripts/score-deck.js');
const polished = path.join(root, 'examples/delight-sample/deck-content.polished.json');
const thin = path.join(root, 'examples/delight-sample/deck-content.json');

function run(args, env = {}) {
  return spawnSync(process.execPath, [cli, ...args], {
    encoding: 'utf8',
    env: { ...process.env, ...env },
  });
}

const good = run([polished, '--json']);
assert.equal(good.status, 0, good.stderr || good.stdout);
const report = JSON.parse(good.stdout);
assert.equal(report.gate.errorCount, 0);
assert.ok(report.overall.score >= 90, `score ${report.overall.score}`);

const bad = run([thin, '--strict']);
assert.equal(bad.status, 1, 'thin deck must fail strict');

console.log('smoke-deck-quality: ok');
