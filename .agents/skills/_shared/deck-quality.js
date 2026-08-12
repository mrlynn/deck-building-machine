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
