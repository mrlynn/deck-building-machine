'use strict';

const fs = require('fs');
const path = require('path');
const {
  scoreDeck,
  parseDeliveryMinutes,
  formatHumanReport,
} = require('../../_shared/deck-quality');

function parseArgs(argv) {
  const args = { deckPath: null, json: false, strict: false, briefPath: null };
  const rest = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--json') args.json = true;
    else if (a === '--strict') args.strict = true;
    else if (a === '--brief') args.briefPath = argv[++i];
    else if (a.startsWith('-')) {
      console.error(`Unknown flag: ${a}`);
      process.exit(2);
    } else rest.push(a);
  }
  args.deckPath = rest[0] || 'deck-content.json';
  return args;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const strict = args.strict || process.env.DECK_QUALITY_GATE === 'strict';
  const abs = path.resolve(args.deckPath);

  let deck;
  try {
    deck = JSON.parse(fs.readFileSync(abs, 'utf8'));
  } catch (err) {
    console.error(`Failed to read deck: ${err.message}`);
    process.exit(2);
  }

  let deliveryMinutes = null;
  if (args.briefPath) {
    try {
      const brief = fs.readFileSync(path.resolve(args.briefPath), 'utf8');
      deliveryMinutes = parseDeliveryMinutes(brief);
    } catch (err) {
      console.error(`Failed to read brief: ${err.message}`);
      process.exit(2);
    }
  }

  const report = scoreDeck(deck, {
    deckPath: args.deckPath,
    deckJsonPath: abs,
    mode: strict ? 'strict' : 'warn',
    deliveryMinutes,
  });

  if (args.json) {
    process.stdout.write(JSON.stringify(report, null, 2) + '\n');
  } else {
    process.stdout.write(formatHumanReport(report) + '\n');
  }

  if (strict && report.gate.errorCount > 0) process.exit(1);
  process.exit(0);
}

main();
