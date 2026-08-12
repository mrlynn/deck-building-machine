# Deck Quality Scorecard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a zero-dependency Node deck quality scorecard (`/deck-score`) with warn-by-default coaching, opt-in strict structural gate, aesthetics category, and hooks into brand-check / export / build / polish.

**Architecture:** Pure `scoreDeck()` in `.agents/skills/_shared/deck-quality.js` evaluates a fixed checklist and returns `DeckQualityReport` JSON. Thin CLI `score-deck.js` prints human or JSON and sets exit codes. Skills/agents run the CLI; `brand-guardian` merges the Node report with judgment (including aesthetics). Strict mode fails only on structural `error` counts — never aesthetics or LLM judgment.

**Tech Stack:** Node.js built-ins only (`fs`, `path`, `assert`, `node:test`). No new npm packages. Existing `pptxgenjs` exporter unchanged except skill docs that call the scorer before export.

**Spec:** `docs/superpowers/specs/2026-07-17-deck-quality-scorecard-design.md`

## Global Constraints

- No new entries in any `package.json` `dependencies` / `devDependencies`
- Do not invent slide numbers or brief evidence inside the scorer
- Aesthetics checks: `warning` or always-pass `info` only — never `error`
- Reject scoring targets: body ≥18pt, 5/5/5, dual fonts, Color Hunt, white-space %, Morph/Fade
- `slideIndex` is 1-based; deck-level checks use `slideIndex: null`
- Template kit under `templates/deck-machine/` must stay in sync with live `.agents/` / `.cursor/agents/`
- Prefer `node --test` + `node:assert/strict` for smoke (no Jest/Vitest)

---

## File map

| File | Responsibility |
|---|---|
| `.agents/skills/_shared/deck-quality.js` | `scoreDeck`, `parseDeliveryMinutes`, `formatHumanReport`, checklist logic |
| `.agents/skills/_shared/deck-quality.test.js` | Node test suite for scorer |
| `.agents/skills/deck-score/scripts/score-deck.js` | CLI entry |
| `.agents/skills/deck-score/SKILL.md` | `/deck-score` skill |
| `scripts/smoke-deck-quality.js` | Smoke: polished ≥90 / 0 errors; thin strict exits 1 |
| `examples/delight-sample/deck-content.polished.json` | High-score fixture |
| `.agents/skills/brand-check/SKILL.md` | Run scorer then brand-guardian |
| `.agents/skills/export-pptx/SKILL.md` | Quality line + strict gate |
| `.agents/skills/build-deck/SKILL.md` | Same gate policy |
| `.agents/skills/polish-deck/SKILL.md` | Same gate policy |
| `.cursor/agents/brand-guardian.md` | `scorecard` + `judgment.aesthetics` |
| `AGENTS.md` | Skill table row |
| `docs/primitives-lab.md` | Lab 4 one-liner |
| `templates/deck-machine/dot-agents/skills/_shared/deck-quality.js` | Mirror |
| `templates/deck-machine/dot-agents/skills/deck-score/**` | Mirror |
| `templates/deck-machine/dot-agents/skills/brand-check/SKILL.md.mustache` | Mirror updates |
| `templates/deck-machine/dot-agents/skills/export-pptx/SKILL.md.mustache` | Mirror updates |
| `templates/deck-machine/dot-agents/skills/build-deck/SKILL.md.mustache` | Mirror updates |
| `templates/deck-machine/dot-agents/skills/polish-deck/SKILL.md.mustache` | Mirror updates |
| `templates/deck-machine/dot-cursor/agents/brand-guardian.md.mustache` | Mirror (create/update) |

---

### Task 1: Core scorer + unit tests (TDD)

**Files:**
- Create: `.agents/skills/_shared/deck-quality.js`
- Create: `.agents/skills/_shared/deck-quality.test.js`

**Interfaces:**
- Produces:
  - `scoreDeck(deck, opts) → DeckQualityReport`
  - `opts = { deckPath?: string, deckJsonPath?: string, mode?: 'warn'|'strict', deliveryMinutes?: number|null }`
  - `parseDeliveryMinutes(briefText: string) → number|null`
  - `formatHumanReport(report: DeckQualityReport) → string`
  - `module.exports = { scoreDeck, parseDeliveryMinutes, formatHumanReport, SLIDE_TYPES, CONTENT_BEARING }`

- [ ] **Step 1: Write the failing tests**

Create `.agents/skills/_shared/deck-quality.test.js`:

```js
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
```

- [ ] **Step 2: Run tests — expect FAIL (module missing)**

```bash
node --test .agents/skills/_shared/deck-quality.test.js
```

Expected: `Cannot find module './deck-quality'` or similar.

- [ ] **Step 3: Implement `.agents/skills/_shared/deck-quality.js`**

Implement the full module. Required behavior (must match spec):

```js
'use strict';

/**
 * Deck quality scorecard — structural + Marriott-aligned aesthetics (coach).
 * No npm deps. Rejected scoring targets: body≥18pt, 5/5/5, dual fonts,
 * white-space %, Morph/Fade, external palettes.
 */

const fs = require('fs');
const path = require('path');

const SLIDE_TYPES = new Set([
  'title', 'agenda', 'section', 'content', 'two-column', 'metrics',
  'quote', 'closing', 'chart', 'diagram', 'image',
]);
const CONTENT_BEARING = new Set(['content', 'two-column', 'metrics', 'chart', 'diagram']);
const CHART_TYPES = new Set([
  'bar', 'hbar', 'stacked-bar', 'line', 'pie', 'doughnut', 'area', 'combo',
]);
const BANNED = [
  'improve efficiency',
  'drive alignment',
  'enhance collaboration',
  'streamline processes',
];

function wordCount(s) {
  return String(s || '').trim().split(/\s+/).filter(Boolean).length;
}

function bulletTexts(bullets) {
  return (bullets || []).map((b) => (typeof b === 'string' ? b : (b && b.text) || '')).filter(Boolean);
}

function assertionCount(bullets) {
  return bulletTexts(bullets).length;
}

function detailRatio(bullets) {
  const items = (bullets || []).map((b) => (typeof b === 'string' ? { text: b } : b || {})).filter((b) => b.text);
  if (!items.length) return 1;
  const withDetail = items.filter((b) => b.detail).length;
  return withDetail / items.length;
}

function resolveAssetPath(filePath, deckJsonPath) {
  if (!filePath) return null;
  if (path.isAbsolute(filePath) && fs.existsSync(filePath)) return filePath;
  const deckDir = deckJsonPath ? path.dirname(deckJsonPath) : process.cwd();
  const candidates = [
    path.resolve(deckDir, filePath),
    path.resolve(deckDir, '..', filePath),
    path.resolve(process.cwd(), filePath),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return null;
}

function parseDeliveryMinutes(briefText) {
  if (!briefText) return null;
  const lines = String(briefText).split(/\r?\n/);
  for (const line of lines) {
    if (/delivery\s*:/i.test(line) || /duration\s*:/i.test(line)) {
      const m = line.match(/\b(\d+)\s*(?:min|minutes)\b/i);
      if (m) return Number(m[1]);
    }
    if (/deliver|time/i.test(line)) {
      const m = line.match(/\b(\d+)\s*(?:min|minutes)\b/i);
      if (m) return Number(m[1]);
    }
  }
  return null;
}

function gradeFor(score) {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}

function catStats(checks, category) {
  const subset = checks.filter((c) => c.category === category);
  const applicable = subset.length;
  const passed = subset.filter((c) => c.passed).length;
  const score = applicable ? Math.round((100 * passed) / applicable) : 100;
  return { score, passed, applicable };
}

function pushCheck(checks, partial) {
  checks.push({
    id: partial.id,
    category: partial.category,
    severity: partial.severity,
    passed: Boolean(partial.passed),
    slideIndex: partial.slideIndex === undefined ? null : partial.slideIndex,
    message: partial.message,
    fixHint: partial.fixHint || '',
  });
}

function buildTopFixes(checks) {
  const failed = checks.filter((c) => !c.passed);
  failed.sort((a, b) => {
    const rank = { error: 0, warning: 1, info: 2 };
    return (rank[a.severity] ?? 9) - (rank[b.severity] ?? 9);
  });
  const counts = new Map();
  for (const c of failed) {
    const key = c.id;
    if (!counts.has(key)) counts.set(key, { id: key, n: 0, sample: c });
    counts.get(key).n += 1;
  }
  return [...counts.values()]
    .slice(0, 5)
    .map(({ n, sample }) => (n > 1 ? `${sample.fixHint || sample.message} (${n} slides)` : (sample.fixHint || sample.message)));
}

/**
 * @param {object} deck
 * @param {{ deckPath?: string, deckJsonPath?: string, mode?: 'warn'|'strict', deliveryMinutes?: number|null }} [opts]
 */
function scoreDeck(deck, opts = {}) {
  // CLI owns DECK_QUALITY_GATE / --strict and passes mode explicitly.
  const effectiveMode = opts.mode === 'strict' ? 'strict' : 'warn';
  const checks = [];
  const slides = Array.isArray(deck.slides) ? deck.slides : [];
  const deckJsonPath = opts.deckJsonPath || null;

  // structure.metadata
  pushCheck(checks, {
    id: 'structure.metadata',
    category: 'structure',
    severity: 'warning',
    passed: Boolean(deck.metadata && deck.metadata.title),
    slideIndex: null,
    message: deck.metadata?.title ? 'metadata.title present' : 'metadata.title missing',
    fixHint: 'Set metadata.title on the deck',
  });

  let contentRun = 0;
  let textHeavyRun = 0;
  let textHeavyStart = null;
  let textHeavyWarned = false;
  let hasChartOrDiagram = false;

  slides.forEach((slide, i) => {
    const idx = i + 1;
    const type = slide.type;
    const cnt = slide.content || {};

    pushCheck(checks, {
      id: 'structure.validType',
      category: 'structure',
      severity: 'error',
      passed: SLIDE_TYPES.has(type),
      slideIndex: idx,
      message: SLIDE_TYPES.has(type) ? `Slide ${idx} type ok` : `Slide ${idx} unknown type: ${type}`,
      fixHint: 'Use a supported slide type from the schema',
    });

    const headlineOk = type === 'quote' || Boolean(String(slide.headline || '').trim());
    pushCheck(checks, {
      id: 'structure.hasHeadline',
      category: 'structure',
      severity: 'error',
      passed: headlineOk,
      slideIndex: idx,
      message: headlineOk ? `Slide ${idx} headline ok` : `Slide ${idx} missing headline`,
      fixHint: 'Add an insight headline',
    });

    const notes = slide.notes;
    const notesPresent = notes != null && notes !== '';
    pushCheck(checks, {
      id: 'notes.present',
      category: 'notes',
      severity: 'error',
      passed: notesPresent,
      slideIndex: idx,
      message: notesPresent ? `Slide ${idx} has notes` : `Slide ${idx} missing notes`,
      fixHint: 'Add structured notes: opening, points, transition, timeMinutes',
    });

    let structured = false;
    if (notes && typeof notes === 'object') {
      const pts = notes.points;
      structured =
        Boolean(notes.opening) &&
        Array.isArray(pts) &&
        pts.length >= 2 &&
        pts.length <= 4 &&
        Boolean(notes.transition) &&
        notes.timeMinutes != null;
    }
    pushCheck(checks, {
      id: 'notes.structured',
      category: 'notes',
      severity: 'warning',
      passed: structured,
      slideIndex: idx,
      message: structured ? `Slide ${idx} notes structured` : `Slide ${idx} notes not fully structured`,
      fixHint: 'Use opening, 2–4 points, transition, timeMinutes',
    });

    if (CONTENT_BEARING.has(type)) {
      const hasTakeaway = Boolean(String(cnt.takeaway || '').trim());
      pushCheck(checks, {
        id: 'depth.takeaway',
        category: 'depth',
        severity: 'error',
        passed: hasTakeaway,
        slideIndex: idx,
        message: hasTakeaway ? `Slide ${idx} has takeaway` : `Slide ${idx} missing takeaway`,
        fixHint: 'Add content.takeaway — the one line to remember',
      });
    }

    if (type === 'content') {
      const n = assertionCount(cnt.bullets);
      pushCheck(checks, {
        id: 'depth.bulletCount',
        category: 'depth',
        severity: 'error',
        passed: n <= 5,
        slideIndex: idx,
        message: n <= 5 ? `Slide ${idx} bullet count ok` : `Slide ${idx} has ${n} bullets (max 5)`,
        fixHint: 'Cut to ≤5 bullets or split the slide',
      });
      for (const t of bulletTexts(cnt.bullets)) {
        const ok = wordCount(t) <= 12;
        pushCheck(checks, {
          id: 'depth.bulletLength',
          category: 'depth',
          severity: 'warning',
          passed: ok,
          slideIndex: idx,
          message: ok ? 'Bullet length ok' : `Slide ${idx} bullet exceeds 12 words`,
          fixHint: 'Shorten bullet text to ≤12 words',
        });
        const banned = BANNED.some((p) => t.toLowerCase().includes(p));
        pushCheck(checks, {
          id: 'depth.bannedGeneric',
          category: 'depth',
          severity: 'error',
          passed: !banned,
          slideIndex: idx,
          message: banned ? `Slide ${idx} banned generic bullet` : 'Bullet ok',
          fixHint: 'Replace generic phrasing with a specific claim',
        });
      }
      if (n >= 2) {
        const ratio = detailRatio(cnt.bullets);
        pushCheck(checks, {
          id: 'depth.assertionDetail',
          category: 'depth',
          severity: 'warning',
          passed: ratio >= 0.5,
          slideIndex: idx,
          message: ratio >= 0.5 ? 'Assertion+detail ok' : `Slide ${idx} needs more detail lines`,
          fixHint: 'Use {text, detail} on at least half of bullets',
        });
      }
    }

    if (type === 'two-column') {
      for (const side of ['left', 'right']) {
        const col = cnt[side] || {};
        const n = assertionCount(col.bullets);
        pushCheck(checks, {
          id: 'depth.bulletCount',
          category: 'depth',
          severity: 'error',
          passed: n <= 5,
          slideIndex: idx,
          message: n <= 5 ? `${side} bullets ok` : `Slide ${idx} ${side} has ${n} bullets`,
          fixHint: 'Cut each column to ≤5 bullets',
        });
        for (const t of bulletTexts(col.bullets)) {
          pushCheck(checks, {
            id: 'depth.bulletLength',
            category: 'depth',
            severity: 'warning',
            passed: wordCount(t) <= 12,
            slideIndex: idx,
            message: 'Column bullet length',
            fixHint: 'Shorten bullet text to ≤12 words',
          });
          const banned = BANNED.some((p) => t.toLowerCase().includes(p));
          pushCheck(checks, {
            id: 'depth.bannedGeneric',
            category: 'depth',
            severity: 'error',
            passed: !banned,
            slideIndex: idx,
            message: banned ? 'Banned generic in column' : 'ok',
            fixHint: 'Replace generic phrasing with a specific claim',
          });
        }
        if (n >= 2) {
          pushCheck(checks, {
            id: 'depth.assertionDetail',
            category: 'depth',
            severity: 'warning',
            passed: detailRatio(col.bullets) >= 0.5,
            slideIndex: idx,
            message: 'Column assertion+detail',
            fixHint: 'Use {text, detail} on at least half of bullets',
          });
        }
      }
    }

    if (type === 'metrics') {
      const metrics = cnt.metrics || [];
      if (metrics.length >= 2) {
        const hasDelta = metrics.some((m) => m && m.delta);
        pushCheck(checks, {
          id: 'depth.metricsDelta',
          category: 'depth',
          severity: 'warning',
          passed: hasDelta,
          slideIndex: idx,
          message: hasDelta ? 'Metrics delta present' : `Slide ${idx} metrics missing delta`,
          fixHint: 'Add delta on at least one metric when you have comparison data',
        });
      }
      pushCheck(checks, {
        id: 'aesthetics.metricsTileCap',
        category: 'aesthetics',
        severity: 'warning',
        passed: metrics.length <= 4,
        slideIndex: idx,
        message: metrics.length <= 4 ? 'Metrics tile cap ok' : `Slide ${idx} has ${metrics.length} metrics (max 4)`,
        fixHint: 'Use ≤4 metric tiles or split across slides',
      });
    }

    if (type === 'chart') {
      hasChartOrDiagram = true;
      pushCheck(checks, {
        id: 'visuals.chartCaption',
        category: 'visuals',
        severity: 'error',
        passed: Boolean(String(cnt.caption || '').trim()),
        slideIndex: idx,
        message: 'Chart caption',
        fixHint: 'Add content.caption naming the data source',
      });
      pushCheck(checks, {
        id: 'visuals.chartHighlight',
        category: 'visuals',
        severity: 'error',
        passed: Boolean(String(cnt.highlight || '').trim()),
        slideIndex: idx,
        message: 'Chart highlight',
        fixHint: 'Set content.highlight to the category or series that carries the claim',
      });
      pushCheck(checks, {
        id: 'visuals.chartType',
        category: 'visuals',
        severity: 'error',
        passed: CHART_TYPES.has(cnt.chartType),
        slideIndex: idx,
        message: 'Chart type',
        fixHint: 'Use a supported chartType',
      });
      if (cnt.chartType === 'pie' || cnt.chartType === 'doughnut') {
        const n = (cnt.categories || []).length;
        pushCheck(checks, {
          id: 'visuals.pieSlices',
          category: 'visuals',
          severity: 'warning',
          passed: n <= 5,
          slideIndex: idx,
          message: 'Pie slice count',
          fixHint: 'Use ≤5 slices or switch to bar/hbar',
        });
      }
    }

    if (type === 'diagram') {
      hasChartOrDiagram = true;
      const n = (cnt.nodes || []).length;
      pushCheck(checks, {
        id: 'visuals.diagramNodes',
        category: 'visuals',
        severity: 'warning',
        passed: n <= 6,
        slideIndex: idx,
        message: 'Diagram node count',
        fixHint: 'Keep diagrams to ≤6 nodes',
      });
    }

    if (type === 'image') {
      const resolved = resolveAssetPath(cnt.path, deckJsonPath);
      pushCheck(checks, {
        id: 'visuals.imagePath',
        category: 'visuals',
        severity: 'error',
        passed: Boolean(resolved),
        slideIndex: idx,
        message: resolved ? 'Image path ok' : `Slide ${idx} image path missing on disk`,
        fixHint: 'Generate the PNG into assets/ via visual-creator before export',
      });
      pushCheck(checks, {
        id: 'visuals.imagePrompt',
        category: 'visuals',
        severity: 'warning',
        passed: Boolean(String(cnt.prompt || '').trim()),
        slideIndex: idx,
        message: 'Image prompt',
        fixHint: 'Add content.prompt for regeneration',
      });
    }

    if (type === 'quote') {
      pushCheck(checks, {
        id: 'aesthetics.quoteHasAttribution',
        category: 'aesthetics',
        severity: 'warning',
        passed: Boolean(String(cnt.attribution || '').trim()),
        slideIndex: idx,
        message: 'Quote attribution',
        fixHint: 'Add content.attribution',
      });
    }

    // variety: consecutive content
    if (type === 'content') {
      contentRun += 1;
      if (contentRun === 3) {
        pushCheck(checks, {
          id: 'variety.noTripleContent',
          category: 'variety',
          severity: 'error',
          passed: false,
          slideIndex: idx - 2,
          message: `Three consecutive content slides starting at ${idx - 2}`,
          fixHint: 'Break the run with metrics, chart, diagram, or two-column',
        });
      }
    } else {
      contentRun = 0;
    }

    // aesthetics: text-heavy run
    const heavy =
      (type === 'content' || type === 'two-column') &&
      assertionCount(
        type === 'two-column'
          ? [...((cnt.left && cnt.left.bullets) || []), ...((cnt.right && cnt.right.bullets) || [])]
          : cnt.bullets
      ) > 3;
    if (heavy) {
      if (textHeavyRun === 0) textHeavyStart = idx;
      textHeavyRun += 1;
      if (textHeavyRun >= 5 && !textHeavyWarned) {
        textHeavyWarned = true;
        pushCheck(checks, {
          id: 'aesthetics.textHeavyRun',
          category: 'aesthetics',
          severity: 'warning',
          passed: false,
          slideIndex: textHeavyStart,
          message: `Five or more consecutive text-heavy slides starting at ${textHeavyStart}`,
          fixHint: 'Shorten bullets, add visuals, or split ideas across lighter slides',
        });
      }
    } else {
      textHeavyRun = 0;
      textHeavyStart = null;
    }
  });

  // If never failed triple content, emit a passing check once when ≥3 slides exist? Spec: only emit on failure for variety.noTripleContent. For applicable count, emit a single deck-level pass when no failure:
  if (!checks.some((c) => c.id === 'variety.noTripleContent')) {
    pushCheck(checks, {
      id: 'variety.noTripleContent',
      category: 'variety',
      severity: 'error',
      passed: true,
      slideIndex: null,
      message: 'No three consecutive content slides',
      fixHint: '',
    });
  }

  if (slides.length >= 8) {
    pushCheck(checks, {
      id: 'variety.hasVisual',
      category: 'variety',
      severity: 'warning',
      passed: hasChartOrDiagram,
      slideIndex: null,
      message: hasChartOrDiagram ? 'Deck has chart/diagram' : 'Long deck has no chart or diagram',
      fixHint: 'Add a chart or diagram when the story has numbers or process',
    });
  }

  // notes.timeBudget
  if (opts.deliveryMinutes != null && Number.isFinite(opts.deliveryMinutes)) {
    let total = 0;
    for (const s of slides) {
      if (s.notes && typeof s.notes === 'object' && s.notes.timeMinutes != null) {
        total += Number(s.notes.timeMinutes) || 0;
      }
    }
    const limit = opts.deliveryMinutes * 1.1;
    pushCheck(checks, {
      id: 'notes.timeBudget',
      category: 'notes',
      severity: 'warning',
      passed: total <= limit,
      slideIndex: null,
      message: `Talk time ${total} vs budget ${opts.deliveryMinutes}`,
      fixHint: 'Trim timeMinutes so total fits delivery time',
    });
  }

  // aesthetics invariants (always pass, always applicable)
  pushCheck(checks, {
    id: 'aesthetics.brandTypeInvariant',
    category: 'aesthetics',
    severity: 'info',
    passed: true,
    slideIndex: null,
    message: 'Type scale owned by brand pack / exporter (not 18pt TED rules)',
    fixHint: '',
  });
  pushCheck(checks, {
    id: 'aesthetics.brandColorInvariant',
    category: 'aesthetics',
    severity: 'info',
    passed: true,
    slideIndex: null,
    message: 'Palette owned by brand-pack.json (primary/dark/accent)',
    fixHint: '',
  });
  pushCheck(checks, {
    id: 'aesthetics.noAnimation',
    category: 'aesthetics',
    severity: 'info',
    passed: true,
    slideIndex: null,
    message: 'Exporter emits no animations (restraint satisfied)',
    fixHint: '',
  });

  // If text-heavy run never failed, pass once when any content/two-column existed
  if (!checks.some((c) => c.id === 'aesthetics.textHeavyRun')) {
    pushCheck(checks, {
      id: 'aesthetics.textHeavyRun',
      category: 'aesthetics',
      severity: 'warning',
      passed: true,
      slideIndex: null,
      message: 'No five-slide text-heavy run',
      fixHint: '',
    });
  }

  const errorCount = checks.filter((c) => !c.passed && c.severity === 'error').length;
  const warningCount = checks.filter((c) => !c.passed && c.severity === 'warning').length;
  const applicable = checks.length;
  const passed = checks.filter((c) => c.passed).length;
  const score = applicable ? Math.round((100 * passed) / applicable) : 100;

  const categories = {};
  for (const name of ['structure', 'notes', 'depth', 'visuals', 'variety', 'aesthetics']) {
    categories[name] = catStats(checks, name);
  }

  return {
    version: 1,
    deckPath: opts.deckPath || 'deck-content.json',
    slideCount: slides.length,
    overall: { score, passed, applicable, grade: gradeFor(score) },
    categories,
    gate: {
      mode: effectiveMode,
      passed: errorCount === 0,
      errorCount,
      warningCount,
    },
    checks,
    topFixes: buildTopFixes(checks),
  };
}

function formatHumanReport(report) {
  const g = report.gate;
  const gateLabel = g.passed ? '✓' : '✗';
  const lines = [
    `Quality: ${report.overall.score} (${report.overall.grade}) — gate ${g.mode} ${gateLabel}`,
    '',
    '| Category | Score |',
    '|---|---|',
  ];
  for (const [name, c] of Object.entries(report.categories)) {
    const label = name.charAt(0).toUpperCase() + name.slice(1);
    lines.push(`| ${label} | ${c.score} |`);
  }
  lines.push('', `Errors: ${g.errorCount}  Warnings: ${g.warningCount}`, '', 'Top fixes:');
  if (!report.topFixes.length) lines.push('1. None — structural checks clear');
  else report.topFixes.forEach((f, i) => lines.push(`${i + 1}. ${f}`));
  lines.push(
    '',
    'Strict mode: DECK_QUALITY_GATE=strict or --strict (structural errors only; aesthetics never hard-fail)'
  );
  return lines.join('\n');
}

module.exports = {
  scoreDeck,
  parseDeliveryMinutes,
  formatHumanReport,
  SLIDE_TYPES,
  CONTENT_BEARING,
};
```

**Important fix while implementing:** In `scoreDeck`, do **not** read `process.env.DECK_QUALITY_GATE` to force `effectiveMode` unless `opts.mode` is omitted — the CLI will pass `mode` explicitly. Prefer:

```js
const effectiveMode = opts.mode === 'strict' ? 'strict' : 'warn';
```

Env handling belongs in the CLI only (Task 2).

Also fix the unused `mode` variable from the sketch above — use only `effectiveMode` as shown in the Important fix.

- [ ] **Step 4: Run tests — expect PASS**

```bash
node --test .agents/skills/_shared/deck-quality.test.js
```

Expected: all tests pass.

- [ ] **Step 5: Commit** (if committing incrementally)

```bash
git add .agents/skills/_shared/deck-quality.js .agents/skills/_shared/deck-quality.test.js
git commit -m "$(cat <<'EOF'
feat(deck-quality): add structural scorecard core module

EOF
)"
```

---

### Task 2: CLI `score-deck.js`

**Files:**
- Create: `.agents/skills/deck-score/scripts/score-deck.js`

**Interfaces:**
- Consumes: `scoreDeck`, `parseDeliveryMinutes`, `formatHumanReport` from `../../_shared/deck-quality.js`
- Produces: process exit `0` | `1` | `2`; stdout human or JSON

- [ ] **Step 1: Implement CLI**

```js
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
```

- [ ] **Step 2: Manual smoke on thin delight sample**

```bash
node .agents/skills/deck-score/scripts/score-deck.js examples/delight-sample/deck-content.json
echo exit:$?
DECK_QUALITY_GATE=strict node .agents/skills/deck-score/scripts/score-deck.js examples/delight-sample/deck-content.json --strict; echo exit:$?
```

Expected: human report with errors; second command exit `1`.

- [ ] **Step 3: Commit**

```bash
git add .agents/skills/deck-score/scripts/score-deck.js
git commit -m "$(cat <<'EOF'
feat(deck-score): add score-deck CLI with warn/strict gates

EOF
)"
```

---

### Task 3: Polished fixture + repo smoke script

**Files:**
- Create: `examples/delight-sample/deck-content.polished.json`
- Create: `scripts/smoke-deck-quality.js`
- Modify: `package.json` (add script only — **no new dependencies**)

**Interfaces:**
- Consumes: CLI / `scoreDeck`
- Produces: exit 0 when polished is clean and thin fails strict

- [ ] **Step 1: Create polished fixture**

Copy `examples/delight-sample/deck-content.json` and upgrade every slide to satisfy structural errors:

- Add structured `notes` on every slide
- Add `takeaway` on content-bearing slides (`content`, `metrics`, `chart`, `diagram`)
- Add chart `highlight` (e.g. `"Q4"`)
- Convert content bullets to `{text, detail}` where possible
- Keep existing story; do not invent new metrics beyond what’s already in the thin sample
- Ensure no 3 consecutive `content` slides (sample already mixes types)
- Quote: keep attribution
- Metrics: keep ≤4 tiles; add `delta` where sample already has them

- [ ] **Step 2: Write `scripts/smoke-deck-quality.js`**

```js
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
```

- [ ] **Step 3: Add npm script (no new deps)**

In root `package.json` `scripts`, add:

```json
"smoke:deck-quality": "node scripts/smoke-deck-quality.js"
```

- [ ] **Step 4: Run smoke**

```bash
npm run smoke:deck-quality
node --test .agents/skills/_shared/deck-quality.test.js
```

Expected: both pass.

- [ ] **Step 5: Commit**

```bash
git add examples/delight-sample/deck-content.polished.json scripts/smoke-deck-quality.js package.json
git commit -m "$(cat <<'EOF'
test(deck-quality): add polished fixture and smoke script

EOF
)"
```

---

### Task 4: `/deck-score` skill

**Files:**
- Create: `.agents/skills/deck-score/SKILL.md`

- [ ] **Step 1: Write skill**

```markdown
---
name: deck-score
description: Score a deck-content.json for structural depth, visuals, variety, and Marriott-aligned aesthetics. Warn by default; optional strict gate.
---

# /deck-score

Run the zero-dependency quality scorecard on a deck.

## How to use

```
/deck-score
/deck-score path/to/deck-content.json
/deck-score path/to/deck-content.json --strict
```

Defaults to `deck-content.json` in the repo root.

## What it measures

Structural categories: structure, notes, depth, visuals, variety.  
Aesthetics (coach only): brand type/color invariants, no animation, metrics tile cap, text-heavy runs, quote attribution.

**Not scored (conflicts with Marriott brand):** body ≥18pt, 5/5/5 word rules, dual fonts, external palettes, white-space %, Morph/Fade.

## Prompt for agent

1. Resolve deck path (argument or `deck-content.json`).
2. If `brief.md` exists beside the deck, pass `--brief` to enable talk-time check.
3. Run (never `npm install`):

```bash
node .agents/skills/deck-score/scripts/score-deck.js path/to/deck-content.json
```

For machine-readable:

```bash
node .agents/skills/deck-score/scripts/score-deck.js path/to/deck-content.json --json
```

4. Display the human summary (categories including Aesthetics, top fixes, gate line).
5. If `overall.score < 80` or `errorCount > 0`, suggest `/polish-deck`.
6. Remind: strict fails only on structural errors — `DECK_QUALITY_GATE=strict` or `--strict`. Aesthetics never hard-fail.
```

- [ ] **Step 2: Commit**

```bash
git add .agents/skills/deck-score/SKILL.md
git commit -m "$(cat <<'EOF'
feat(deck-score): add /deck-score skill

EOF
)"
```

---

### Task 5: Wire export / build / polish skills

**Files:**
- Modify: `.agents/skills/export-pptx/SKILL.md`
- Modify: `.agents/skills/build-deck/SKILL.md`
- Modify: `.agents/skills/polish-deck/SKILL.md`

- [ ] **Step 1: Update `/export-pptx` prompt**

After verifying `deck-content.json` exists and before running the bundled exporter, insert:

```markdown
## Quality scorecard (before export)

1. Run:
```bash
node .agents/skills/deck-score/scripts/score-deck.js path/to/deck-content.json --json
```
2. Print one line to the user: `Quality: {score} ({grade}) — {errorCount} errors, {warningCount} warnings`
3. If `DECK_QUALITY_GATE=strict` or user passed `--strict`: when `errorCount > 0`, **do not export**; show `topFixes` and stop.
4. Otherwise continue export even when errors/warnings exist (coach only).
```

Keep existing export command unchanged when gate allows.

- [ ] **Step 2: Update `/build-deck` and `/polish-deck`**

In both skills, before the export step, add the same quality scorecard policy (one-line summary; refuse export only when strict + errors). Point agents at the same CLI path.

- [ ] **Step 3: Commit**

```bash
git add .agents/skills/export-pptx/SKILL.md .agents/skills/build-deck/SKILL.md .agents/skills/polish-deck/SKILL.md
git commit -m "$(cat <<'EOF'
feat(deck-quality): gate export/build/polish behind optional strict scorecard

EOF
)"
```

---

### Task 6: brand-guardian + `/brand-check`

**Files:**
- Modify: `.cursor/agents/brand-guardian.md`
- Modify: `.agents/skills/brand-check/SKILL.md`

- [ ] **Step 1: Update brand-guardian**

Add near the top (after role paragraph):

```markdown
## Structural scorecard (required input)

The invoking skill runs the Node scorer and pastes a `DeckQualityReport` JSON. You **must**:
- Copy it into `scorecard` unchanged (do not recompute structural scores)
- Add `judgment` with `spine`, `voice`, `evidence`, `aesthetics`, and `summary`
- Never invent structural numbers; never mark aesthetics Node warnings as export-blocking errors

Judgment `aesthetics`: pass/warn/fail for one-idea crowding beyond counts, takeaway that restates the headline, wall-of-text feel. Do **not** recommend body ≥18pt, 5/5/5, or dual fonts — Marriott type scale and single font stack remain.
```

Replace the Output format JSON example with the merged shape from the spec (`scorecard`, `judgment` including `aesthetics`, existing `slideReviews` / `globalIssues` / `summary`). Include the `overallCompliance` mapping from the spec.

- [ ] **Step 2: Update `/brand-check` skill**

```markdown
When invoked:
1. Resolve deck path
2. Run Node scorer (required — do not skip):
```bash
node .agents/skills/deck-score/scripts/score-deck.js path/to/deck-content.json --json
```
3. Delegate to `brand-guardian` with the deck JSON **and** the scorecard JSON pasted in the prompt
4. Display:
   - Structural scorecard table first (all categories including Aesthetics)
   - Then Judgment (`spine` / `voice` / `evidence` / `aesthetics`)
   - Then per-slide brand table (existing)
5. Ask whether to apply suggested fixes
```

- [ ] **Step 3: Commit**

```bash
git add .cursor/agents/brand-guardian.md .agents/skills/brand-check/SKILL.md
git commit -m "$(cat <<'EOF'
feat(brand-check): merge Node scorecard with brand-guardian judgment

EOF
)"
```

---

### Task 7: Template kit mirrors

**Files:**
- Create/copy mirrors under `templates/deck-machine/`:
  - `dot-agents/skills/_shared/deck-quality.js` (copy of live file)
  - `dot-agents/skills/deck-score/SKILL.md.mustache` (same body as live SKILL; mustache ok with no tags)
  - `dot-agents/skills/deck-score/scripts/score-deck.js`
  - Update mustaches for brand-check, export-pptx, build-deck, polish-deck to include the same prompt paragraphs as live skills
  - Update or create `dot-cursor/agents/brand-guardian.md.mustache` to match live agent (preserve any `{{customerName}}` / brand tokens if the existing mustache uses them)

- [ ] **Step 1: Diff live vs template brand-guardian**

```bash
ls templates/deck-machine/dot-cursor/agents/
```

If `brand-guardian.md.mustache` exists, merge scorecard sections while keeping mustache brand tokens. If missing, create it from live `.cursor/agents/brand-guardian.md`, substituting customer display name with `{{displayName}}` / `{{customerName}}` only where the sibling agents already do.

- [ ] **Step 2: Copy shared scorer + CLI + skill into templates**

```bash
cp .agents/skills/_shared/deck-quality.js templates/deck-machine/dot-agents/skills/_shared/deck-quality.js
mkdir -p templates/deck-machine/dot-agents/skills/deck-score/scripts
cp .agents/skills/deck-score/scripts/score-deck.js templates/deck-machine/dot-agents/skills/deck-score/scripts/score-deck.js
# Write SKILL.md.mustache from live SKILL.md content
```

Do **not** copy `deck-quality.test.js` into the customer zip unless other tests are shipped (skip tests in templates).

- [ ] **Step 3: Port skill prompt edits into the four mustache skills**

- [ ] **Step 4: Commit**

```bash
git add templates/deck-machine/dot-agents/skills/_shared/deck-quality.js \
  templates/deck-machine/dot-agents/skills/deck-score \
  templates/deck-machine/dot-agents/skills/brand-check/SKILL.md.mustache \
  templates/deck-machine/dot-agents/skills/export-pptx/SKILL.md.mustache \
  templates/deck-machine/dot-agents/skills/build-deck/SKILL.md.mustache \
  templates/deck-machine/dot-agents/skills/polish-deck/SKILL.md.mustache \
  templates/deck-machine/dot-cursor/agents/brand-guardian.md.mustache
git commit -m "$(cat <<'EOF'
feat(templates): mirror deck quality scorecard into deck-machine kit

EOF
)"
```

---

### Task 8: AGENTS.md + lab note

**Files:**
- Modify: `AGENTS.md`
- Modify: `docs/primitives-lab.md`

- [ ] **Step 1: AGENTS.md skill table**

Add row after `/polish-deck` (or near `/brand-check`):

```markdown
| `/deck-score` | Structural + aesthetics scorecard for `deck-content.json` (warn by default; `--strict` / `DECK_QUALITY_GATE=strict` to fail on structural errors) |
```

Update `/brand-check` cell to mention it runs the Node scorecard first, then `brand-guardian`.

- [ ] **Step 2: Lab 4 one-liner**

After step 2 in Lab 4, add:

```markdown
Optional: delete one slide’s `takeaway`, run `/deck-score` (or `--strict`), and watch Depth/errors change before you fix and `/brand-check` again.
```

- [ ] **Step 3: Final verification**

```bash
node --test .agents/skills/_shared/deck-quality.test.js
npm run smoke:deck-quality
```

Expected: all green.

- [ ] **Step 4: Commit**

```bash
git add AGENTS.md docs/primitives-lab.md
git commit -m "$(cat <<'EOF'
docs: document /deck-score and lab scorecard check

EOF
)"
```

---

## Spec coverage checklist (self-review)

| Spec requirement | Task |
|---|---|
| `deck-quality.js` + checklist categories including aesthetics | 1 |
| CLI warn/strict/json/brief + exit codes | 2 |
| Polished fixture + smoke ≥90 / thin strict fail | 3 |
| `/deck-score` skill | 4 |
| export/build/polish quality line + strict refuse | 5 |
| brand-guardian merge + `/brand-check` | 6 |
| templates/deck-machine mirrors | 7 |
| AGENTS.md + lab note | 8 |
| No new npm deps | Global + Task 3 script-only |
| Aesthetics never hard-fail | Task 1 tests + Task 4/5 copy |
| Rejected TED rules documented | Task 1 file comment + Task 4 skill |

## Placeholder / consistency notes

- `scoreDeck` mode: CLI passes `mode`; do not double-apply env inside `scoreDeck`
- `variety.noTripleContent` and `aesthetics.textHeavyRun` emit a single passing deck-level check when clean so categories stay visible
- Template brand-check mustache is currently shorter than live skill — Task 7 should bring scorecard steps into the mustache even if the rest stays shorter
