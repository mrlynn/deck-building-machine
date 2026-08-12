'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const {
  scoreDeck,
  parseDeliveryMinutes,
  formatHumanReport,
} = require('./deck-quality');

function minimalSlide(overrides = {}) {
  return {
    type: 'content',
    headline: 'Adoption grew forty percent in ninety days',
    content: {
      bullets: [
        { text: 'Cut review cycles from days to hours', detail: 'Four hours median last sprint' },
        { text: 'Keep brand rules loaded by default', detail: 'No slash needed for palette' },
      ],
      takeaway: 'Depth beats slide count when evidence is real',
    },
    notes: {
      opening: 'Start with the outcome, not the tool.',
      points: ['Teams skipped formal rollout', 'Evidence is in the brief only', 'Flag gaps instead of inventing'],
      transition: 'Next we look at the pipeline.',
      timeMinutes: 2,
    },
    ...overrides,
  };
}

describe('parseDeliveryMinutes', () => {
  it('parses Delivery line', () => {
    assert.equal(parseDeliveryMinutes('## Constraints\nDelivery: 20 minutes\n'), 20);
  });
  it('returns null when missing', () => {
    assert.equal(parseDeliveryMinutes('No timing here'), null);
  });
});

describe('scoreDeck', () => {
  it('scores a polished mini-deck with zero errors', () => {
    const deck = {
      metadata: { title: 'Test Deck' },
      slides: [
        {
          type: 'title',
          headline: 'Cursor turns briefs into branded decks fast',
          content: { subtitle: 'Quality scorecard demo' },
          notes: {
            opening: 'Welcome.',
            points: ['One idea', 'Brand locked', 'Export last'],
            transition: 'Agenda next.',
            timeMinutes: 0.5,
          },
        },
        {
          type: 'chart',
          headline: 'MAU climbed while rollout stayed organic',
          content: {
            chartType: 'bar',
            categories: ['Q1', 'Q2', 'Q3', 'Q4'],
            series: [{ name: 'MAU', values: [800, 950, 1100, 1300] }],
            highlight: 'Q4',
            caption: 'Brief metrics — illustrative',
            takeaway: 'Organic growth still moved the needle',
          },
          notes: {
            opening: 'Look at Q4.',
            points: ['Highlight carries the claim', 'Caption names the source', 'No invented precision'],
            transition: 'Closing.',
            timeMinutes: 2,
          },
        },
        {
          type: 'closing',
          headline: 'Ship the next deck with the scorecard on',
          content: {
            items: [{ number: '01', action: 'Run /deck-score', owner: 'FE', date: 'Today' }],
          },
          notes: {
            opening: 'Ask for one owner.',
            points: ['Strict is opt-in', 'Polish fills gaps', 'Share only after brand-check'],
            transition: 'Questions.',
            timeMinutes: 1,
          },
        },
      ],
    };
    const report = scoreDeck(deck, { deckPath: 'test.json', mode: 'warn' });
    assert.equal(report.gate.errorCount, 0);
    assert.equal(report.gate.passed, true);
    assert.ok(report.overall.score >= 90);
    assert.ok(report.categories.aesthetics);
    assert.ok(report.categories.aesthetics.applicable >= 3);
  });

  it('flags missing notes as errors and fails gate.passed', () => {
    const deck = {
      metadata: { title: 'Thin' },
      slides: [
        {
          type: 'content',
          headline: 'Overview',
          content: { bullets: ['Improve efficiency'] },
        },
      ],
    };
    const report = scoreDeck(deck, { mode: 'warn' });
    assert.ok(report.gate.errorCount > 0);
    assert.equal(report.gate.passed, false);
    const ids = report.checks.filter((c) => !c.passed).map((c) => c.id);
    assert.ok(ids.includes('notes.present'));
    assert.ok(ids.includes('depth.takeaway'));
    assert.ok(ids.includes('depth.bannedGeneric'));
  });

  it('never emits aesthetics errors', () => {
    const deck = {
      metadata: { title: 'Metrics wall' },
      slides: [
        {
          type: 'metrics',
          headline: 'Too many tiles crowd the slide',
          content: {
            takeaway: 'Cap metrics at four',
            metrics: [
              { value: '1', label: 'A' },
              { value: '2', label: 'B' },
              { value: '3', label: 'C' },
              { value: '4', label: 'D' },
              { value: '5', label: 'E' },
            ],
          },
          notes: {
            opening: 'Five tiles is too many.',
            points: ['Exporter supports four', 'Split the slide', 'Keep deltas when you can'],
            transition: 'Done.',
            timeMinutes: 1,
          },
        },
      ],
    };
    const report = scoreDeck(deck, { mode: 'strict' });
    const aesErrors = report.checks.filter(
      (c) => c.category === 'aesthetics' && c.severity === 'error'
    );
    assert.equal(aesErrors.length, 0);
    const tile = report.checks.find((c) => c.id === 'aesthetics.metricsTileCap');
    assert.ok(tile);
    assert.equal(tile.passed, false);
    assert.equal(tile.severity, 'warning');
  });

  it('formatHumanReport includes Aesthetics', () => {
    const report = scoreDeck(
      { metadata: { title: 'T' }, slides: [minimalSlide()] },
      { mode: 'warn' }
    );
    const text = formatHumanReport(report);
    assert.match(text, /Aesthetics/i);
    assert.match(text, /Quality:/i);
  });
});
