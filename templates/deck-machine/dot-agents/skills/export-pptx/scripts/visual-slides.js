'use strict';
/**
 * Native visual slide renderers for the deck machine.
 * Charts → PptxGenJS addChart; diagrams → shapes; images → agent-generated assets/.
 * Shared text helpers: native bullet lists, takeaway strips, speaker-note flattening.
 */
const fs = require('fs');
const path = require('path');

const CHART_TYPES = new Set(['bar', 'hbar', 'stacked-bar', 'line', 'pie', 'doughnut', 'area', 'combo']);

/** Axis / data-label number format codes by friendly name. */
const VALUE_FORMAT_CODES = {
  percent: '0"%"',
  currency: '"$"#,##0',
  number: '#,##0',
};

/**
 * Resolve an assets path relative to the deck JSON, then repo root, then CWD.
 * @param {string} filePath
 * @param {string} deckJsonPath absolute path to deck-content.json
 */
function resolveAssetPath(filePath, deckJsonPath) {
  if (!filePath) return null;
  if (path.isAbsolute(filePath) && fs.existsSync(filePath)) return filePath;

  const deckDir = path.dirname(deckJsonPath);
  const candidates = [
    path.resolve(deckDir, filePath),
    path.resolve(deckDir, '..', filePath),
    path.resolve(process.cwd(), filePath),
    path.resolve(__dirname, '../../../../', filePath),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return null;
}

function headlineSize(hl, base) {
  const len = (hl || '').length;
  if (len > 70) return Math.max(base - 4, 20);
  if (len > 55) return Math.max(base - 2, 22);
  return base;
}

/**
 * Flatten a slide's speaker notes into the text placed in the PPTX notes pane.
 * Accepts a plain string or the structured talk track:
 * { opening, points: [], transition, timeMinutes }
 */
function speakerNotesText(notes) {
  if (!notes) return '';
  if (typeof notes === 'string') return notes.trim();

  const lines = [];
  if (notes.opening) lines.push(`OPEN: ${notes.opening}`);
  const points = notes.points || [];
  if (points.length) {
    lines.push('POINTS:');
    for (const p of points) lines.push(`• ${p}`);
  }
  if (notes.transition) lines.push(`TRANSITION: ${notes.transition}`);
  if (notes.timeMinutes != null) lines.push(`TIME: ~${notes.timeMinutes} min`);
  return lines.join('\n');
}

/**
 * Render a native PPTX bulleted list in one text box.
 * Each bullet is a string or { text, detail } — `text` is the assertion
 * (bold when a detail follows), `detail` is an indented evidence line.
 *
 * @param {object} ctx needs C, F, TYPE
 * @param {object} sl pptx slide
 * @param {Array<string|{text:string, detail?:string}>} bullets
 * @param {object} opts { x, y, w, h, fontSize, detailSize, color, detailColor, paraSpaceAfter }
 */
function renderBullets(ctx, sl, bullets, opts) {
  const { C, F, TYPE } = ctx;
  const type = TYPE || { body: 15 };
  const size = opts.fontSize || type.body;
  const detailSize = opts.detailSize || Math.max(size - 2, 10);
  const gapAfter = opts.paraSpaceAfter != null ? opts.paraSpaceAfter : Math.round(size * 0.65);

  const items = (bullets || [])
    .map((b) => (typeof b === 'string' ? { text: b } : b || {}))
    .filter((b) => b.text);
  if (!items.length) return;

  const paras = [];
  items.forEach((item) => {
    paras.push({
      text: item.text,
      options: {
        bullet: { code: '2022', indent: 12 },
        color: opts.color || C.dark,
        fontSize: size,
        bold: Boolean(item.detail),
        paraSpaceAfter: item.detail ? 3 : gapAfter,
        breakLine: true,
      },
    });
    if (item.detail) {
      paras.push({
        text: item.detail,
        options: {
          bullet: false,
          indentLevel: 1,
          color: opts.detailColor || C.gray,
          fontSize: detailSize,
          paraSpaceAfter: gapAfter,
          breakLine: true,
        },
      });
    }
  });

  sl.addText(paras, {
    x: opts.x,
    y: opts.y,
    w: opts.w,
    h: opts.h,
    fontFace: F,
    align: 'left',
    valign: 'top',
    wrap: true,
    fit: 'shrink',
  });
}

/**
 * Bottom-of-slide takeaway strip: accent bar + one bold "so what" line.
 */
function renderTakeaway(ctx, sl, takeaway, opts = {}) {
  if (!takeaway) return;
  const { t, box, C, ML, CW, H } = ctx;
  const y = opts.y != null ? opts.y : H - 1.1;
  box(sl, ML, y + 0.02, 0.07, 0.36, C.red);
  t(sl, takeaway, ML + 0.22, y, CW - 0.22, 0.42, {
    fontSize: 13,
    bold: true,
    color: opts.darkBg ? C.white : C.dark,
    valign: 'middle',
    wrap: true,
    fit: 'shrink',
  });
}

function drawHeadline(ctx, sl, hl) {
  const { t, box, hline, leftRail, C, ML, MT, CW, LAYOUT, TYPE } = ctx;
  const type = TYPE || { slideTitle: 26 };
  if (LAYOUT === 'minimal') {
    leftRail(sl, 0.7, 0.9, 0.05);
    t(sl, hl, ML + 0.1, 0.7, CW - 0.1, 0.75, {
      fontSize: headlineSize(hl, type.slideTitle + 2),
      color: C.dark,
    });
  } else if (LAYOUT === 'bold') {
    box(sl, ML, MT, CW, 0.1, C.red);
    t(sl, hl, ML, 0.85, CW, 0.7, {
      fontSize: headlineSize(hl, type.slideTitle),
      color: C.dark,
    });
  } else {
    box(sl, ML, MT, CW, 0.04, C.red);
    t(sl, hl, ML, 0.75, CW, 0.7, {
      fontSize: headlineSize(hl, type.slideTitle),
      color: C.dark,
    });
    hline(sl, ML, 1.55, ML + CW, C.lgray, 0.75);
  }
}

/**
 * Light frame around an image: lgray border + primary left accent.
 */
function frameImage(ctx, sl, x, y, w, h) {
  const { box, C } = ctx;
  box(sl, x - 0.04, y - 0.04, w + 0.08, h + 0.08, C.lgray);
  box(sl, x - 0.04, y - 0.04, 0.05, h + 0.08, C.red);
}

/** Case-insensitive match of a highlight target against a category or series name. */
function matchesHighlight(name, highlight) {
  if (highlight == null || name == null) return false;
  return String(name).trim().toLowerCase() === String(highlight).trim().toLowerCase();
}

/**
 * Build the chart color array. Without `highlight`, brand rotation.
 * With `highlight`: the named category (single-series bar/pie) or series
 * (multi-series) gets the primary color; everything else recedes to grays.
 */
function chartColors(ctx, cnt, categories, series, isPie) {
  const { C } = ctx;
  const brand = [C.red, C.dark, C.gray, C.gold, C.mgray].filter(Boolean);
  const grays = ['C9C9C9', 'B1B1B1', '989898', '7F7F7F', 'D8D8D8'];
  const hl = cnt.highlight;
  if (hl == null) return brand;

  const perPoint = isPie || series.length === 1;
  if (perPoint && categories.some((c) => matchesHighlight(c, hl))) {
    return categories.map((c, i) =>
      matchesHighlight(c, hl) ? C.red : grays[i % grays.length],
    );
  }
  if (series.some((s) => matchesHighlight(s.name, hl))) {
    return series.map((s, i) =>
      matchesHighlight(s.name, hl) ? C.red : grays[i % grays.length],
    );
  }
  return brand;
}

/**
 * @param {object} ctx renderer context from build-pptx
 * @param {object} sl pptx slide
 * @param {string} hl headline
 * @param {object} cnt content
 */
function renderChartSlide(ctx, sl, hl, cnt) {
  const { t, C, ML, CW, H, LAYOUT } = ctx;
  sl.background = { color: C.white };
  drawHeadline(ctx, sl, hl);

  const requested = CHART_TYPES.has(cnt.chartType) ? cnt.chartType : 'bar';
  const categories = cnt.categories || [];
  const series = (cnt.series || []).map((s) => ({
    name: s.name || 'Series',
    labels: categories,
    values: s.values || [],
    type: s.type,
  }));

  const hasInsights = Array.isArray(cnt.insights) && cnt.insights.length > 0;
  const hasTakeaway = Boolean(cnt.takeaway);
  const chartY = LAYOUT === 'minimal' ? 1.7 : 1.85;
  const chartW = hasInsights ? CW * 0.58 : CW;
  let chartH = 4.55;
  if (cnt.caption) chartH -= 0.4;
  if (hasTakeaway) chartH -= 0.45;

  if (!series.length || !categories.length) {
    t(sl, 'Chart data missing — categories and series required.', ML, 3.0, CW, 0.5, {
      fontSize: 14,
      color: C.mgray,
    });
    return;
  }

  const isPie = requested === 'pie' || requested === 'doughnut';
  const isBarish = requested === 'bar' || requested === 'hbar' || requested === 'stacked-bar';
  const colors = chartColors(ctx, cnt, categories, series, isPie);
  const formatCode = VALUE_FORMAT_CODES[cnt.valueFormat] || null;

  const opts = {
    x: ML,
    y: chartY,
    w: chartW,
    h: chartH,
    showTitle: false,
    showLegend:
      cnt.showLegend !== false &&
      (series.length > 1 || isPie) &&
      // per-point highlight colors turn every bar into a legend entry — hide it
      !(cnt.highlight != null && series.length === 1 && !isPie),
    legendPos: 'b',
    chartColors: colors,
    border: { pt: 0 },
    chartArea: { fill: { type: 'none' } },
    valAxisHidden: isPie,
    catAxisHidden: false,
    catAxisLabelColor: C.gray,
    valAxisLabelColor: C.gray,
    catAxisLabelFontSize: 11,
    valAxisLabelFontSize: 11,
    catAxisLineShow: false,
    valAxisLineShow: false,
    valGridLineShow: !isPie,
    valGridLineColor: C.lgray,
    valGridLineWidth: 0.75,
    legendColor: C.dark,
    legendFontSize: 11,
  };
  if (formatCode) {
    opts.valAxisLabelFormatCode = formatCode;
    opts.dataLabelFormatCode = formatCode;
  }
  if (cnt.valAxisTitle) {
    opts.showValAxisTitle = true;
    opts.valAxisTitle = cnt.valAxisTitle;
    opts.valAxisTitleFontSize = 11;
    opts.valAxisTitleColor = C.gray;
  }
  if (cnt.catAxisTitle) {
    opts.showCatAxisTitle = true;
    opts.catAxisTitle = cnt.catAxisTitle;
    opts.catAxisTitleFontSize = 11;
    opts.catAxisTitleColor = C.gray;
  }
  if (isBarish) {
    opts.barDir = requested === 'hbar' ? 'bar' : 'col';
    if (requested === 'stacked-bar') opts.barGrouping = 'stacked';
    opts.barGapWidthPct = 40;
    opts.showValue = categories.length <= 8 && series.length <= 2;
  }
  if (requested === 'line' || requested === 'area') {
    opts.lineDataSymbol = 'circle';
    opts.lineDataSymbolSize = 8;
    opts.showValue = false;
  }
  if (isPie) {
    opts.showPercent = true;
    opts.showValue = false;
  }

  if (requested === 'combo') {
    renderComboChart(ctx, sl, series, cnt, opts);
  } else {
    const pptxType = requested === 'hbar' || requested === 'stacked-bar' ? 'bar' : requested;
    sl.addChart(pptxType, series.map(({ type, ...s }) => { void type; return s; }), opts);
  }

  if (cnt.target != null) {
    t(sl, `Target: ${cnt.target}`, ML + chartW - 2.2, chartY - 0.05, 2.2, 0.3, {
      fontSize: 11,
      bold: true,
      color: C.red,
      align: 'right',
    });
  }

  if (hasInsights) {
    const ix = ML + chartW + 0.4;
    renderBullets(ctx, sl, cnt.insights, {
      x: ix,
      y: chartY + 0.1,
      w: CW - chartW - 0.4,
      h: chartH - 0.1,
      fontSize: 13,
      detailSize: 11,
    });
  }

  if (cnt.caption) {
    t(sl, cnt.caption, ML, H - (hasTakeaway ? 1.4 : 0.85), CW, 0.35, {
      fontSize: 11,
      color: C.mgray,
      italic: true,
    });
  }

  renderTakeaway(ctx, sl, cnt.takeaway);
}

/**
 * Combo chart: bar series + line series (series marked `type: "line"`;
 * defaults to the last series when none is marked). Optional
 * `secondaryAxis: true` puts the line on a right-hand value axis.
 */
function renderComboChart(ctx, sl, series, cnt, opts) {
  const { C } = ctx;
  const anyLine = series.some((s) => s.type === 'line');
  const lineSeries = [];
  const barSeries = [];
  series.forEach((s, i) => {
    const isLine = anyLine ? s.type === 'line' : i === series.length - 1;
    const { type, ...data } = s;
    void type;
    (isLine ? lineSeries : barSeries).push(data);
  });

  const comboOpts = { ...opts };
  if (cnt.secondaryAxis) {
    comboOpts.valAxes = [
      {
        showValAxisTitle: Boolean(cnt.valAxisTitle),
        valAxisTitle: cnt.valAxisTitle || '',
        valAxisTitleFontSize: 11,
        valAxisTitleColor: C.gray,
      },
      {
        showValAxisTitle: Boolean(cnt.secondaryValAxisTitle),
        valAxisTitle: cnt.secondaryValAxisTitle || '',
        valAxisTitleFontSize: 11,
        valAxisTitleColor: C.gray,
        valGridLine: { style: 'none' },
      },
    ];
    comboOpts.catAxes = [{ catAxisLabelColor: C.gray }, { catAxisHidden: true }];
    delete comboOpts.showValAxisTitle;
    delete comboOpts.valAxisTitle;
  }

  const barColors =
    barSeries.length === 1 ? [C.red] : [C.red, C.dark, C.gray].slice(0, barSeries.length);
  const types = [
    {
      type: 'bar',
      data: barSeries,
      options: { chartColors: barColors, barGapWidthPct: 40 },
    },
    {
      type: 'line',
      data: lineSeries,
      options: {
        chartColors: [C.gold || C.dark],
        lineDataSymbol: 'circle',
        lineDataSymbolSize: 7,
        secondaryValAxis: Boolean(cnt.secondaryAxis),
        secondaryCatAxis: Boolean(cnt.secondaryAxis),
      },
    },
  ].filter((tdef) => tdef.data.length);

  sl.addChart(types, comboOpts);
}

/**
 * Draw a horizontal flow or grid of nodes with optional edges.
 */
function renderDiagramSlide(ctx, sl, hl, cnt) {
  const { t, C, ML, CW, H, LAYOUT } = ctx;
  sl.background = { color: C.white };
  drawHeadline(ctx, sl, hl);

  const nodes = cnt.nodes || [];
  const layout = cnt.layout || 'flow';
  const hasTakeaway = Boolean(cnt.takeaway);
  const areaY = LAYOUT === 'minimal' ? 1.75 : 1.9;
  let areaH = cnt.caption ? 4.3 : 4.7;
  if (hasTakeaway) areaH -= 0.45;

  if (!nodes.length) {
    t(sl, 'Diagram nodes missing.', ML, 3.0, CW, 0.5, { fontSize: 14, color: C.mgray });
    return;
  }

  if (layout === 'grid') {
    renderGrid(ctx, sl, nodes, ML, areaY, CW, areaH);
  } else if (layout === 'swimlane') {
    renderSwimlane(ctx, sl, nodes, cnt.lanes || [], ML, areaY, CW, areaH);
  } else {
    renderFlow(ctx, sl, nodes, cnt.edges || [], ML, areaY, CW, areaH);
  }

  if (cnt.caption) {
    t(sl, cnt.caption, ML, H - (hasTakeaway ? 1.4 : 0.85), CW, 0.35, {
      fontSize: 11,
      color: C.mgray,
      italic: true,
    });
  }

  renderTakeaway(ctx, sl, cnt.takeaway);
}

function renderFlow(ctx, sl, nodes, edges, x, y, w, h) {
  const { t, box, C } = ctx;
  const n = Math.min(nodes.length, 6);
  const gap = n <= 3 ? 0.32 : 0.22;
  const arrowW = n <= 3 ? 0.34 : 0.28;
  const usable = w - (n - 1) * (gap + arrowW);
  // Fewer nodes → wider cards with more air
  const maxNw = n <= 3 ? 3.4 : n <= 4 ? 2.8 : usable / n;
  const nw = Math.min(maxNw, usable / n);
  const totalW = n * nw + (n - 1) * (gap + arrowW);
  const startX = x + Math.max(0, (w - totalW) / 2);
  const nh = Math.min(n <= 3 ? 2.6 : 2.4, h * 0.55);
  const ny = y + (h - nh) / 2 - 0.15;

  const positions = {};
  for (let i = 0; i < n; i++) {
    const node = nodes[i];
    const nx = startX + i * (nw + gap + arrowW);
    positions[node.id || String(i)] = { x: nx, y: ny, w: nw, h: nh };

    box(sl, nx, ny, nw, nh, C.lgray);
    box(sl, nx, ny, nw, 0.07, C.red);
    t(sl, node.label || '', nx + 0.14, ny + 0.4, nw - 0.28, 0.9, {
      fontSize: n <= 3 ? 15 : 14,
      bold: true,
      color: C.dark,
      align: 'center',
      valign: 'middle',
      wrap: true,
    });
    if (node.sublabel) {
      t(sl, node.sublabel, nx + 0.14, ny + 1.4, nw - 0.28, 0.75, {
        fontSize: 11,
        color: C.gray,
        align: 'center',
        valign: 'top',
        wrap: true,
      });
    }

    if (i < n - 1) {
      const ax = nx + nw + 0.04;
      const ay = ny + nh / 2;
      sl.addShape('rightArrow', {
        x: ax,
        y: ay - 0.11,
        w: arrowW + gap - 0.08,
        h: 0.22,
        fill: { color: C.red },
        line: { type: 'none' },
      });
    }
  }

  for (const e of edges) {
    const from = positions[e.from];
    const to = positions[e.to];
    if (!from || !to || !e.label) continue;
    const lx = (from.x + from.w + to.x) / 2 - 0.6;
    const ly = from.y - 0.45;
    t(sl, e.label, lx, ly, 1.4, 0.35, {
      fontSize: 10,
      color: C.mgray,
      align: 'center',
    });
  }
}

function renderGrid(ctx, sl, nodes, x, y, w, h) {
  const { t, box, C } = ctx;
  const n = Math.min(nodes.length, 6);
  const cols = n <= 3 ? n : Math.ceil(n / 2);
  const rows = Math.ceil(n / cols);
  const gapX = 0.28;
  const gapY = 0.32;
  const nw = (w - (cols - 1) * gapX) / cols;
  const nh = (h - (rows - 1) * gapY) / rows;

  for (let i = 0; i < n; i++) {
    const node = nodes[i];
    const col = i % cols;
    const row = Math.floor(i / cols);
    const nx = x + col * (nw + gapX);
    const ny = y + row * (nh + gapY);

    box(sl, nx, ny, nw, nh, C.lgray);
    box(sl, nx, ny, 0.08, nh, C.red);
    t(sl, node.label || '', nx + 0.28, ny + 0.4, nw - 0.45, 0.7, {
      fontSize: 15,
      bold: true,
      color: C.dark,
      wrap: true,
    });
    if (node.sublabel) {
      t(sl, node.sublabel, nx + 0.28, ny + 1.2, nw - 0.45, nh - 1.45, {
        fontSize: 12,
        color: C.gray,
        wrap: true,
      });
    }
  }
}

function renderSwimlane(ctx, sl, nodes, lanes, x, y, w, h) {
  const { t, box, C } = ctx;
  const laneNames = lanes.length
    ? lanes
    : [...new Set(nodes.map((n) => n.lane || 'Process'))];
  const laneH = h / Math.max(laneNames.length, 1);

  laneNames.forEach((lane, li) => {
    const ly = y + li * laneH;
    box(sl, x, ly, w, laneH - 0.14, C.lgray);
    box(sl, x, ly, 0.06, laneH - 0.14, C.red);
    t(sl, lane, x + 0.2, ly + 0.15, 1.7, laneH - 0.4, {
      fontSize: 12,
      bold: true,
      color: C.red,
      valign: 'middle',
    });

    const inLane = nodes.filter((n) => (n.lane || laneNames[0]) === lane).slice(0, 4);
    const nodeW = Math.min(2.5, (w - 2.3) / Math.max(inLane.length, 1) - 0.18);
    inLane.forEach((node, ni) => {
      const nx = x + 2.1 + ni * (nodeW + 0.22);
      const ny = ly + 0.28;
      const nh = laneH - 0.58;
      box(sl, nx, ny, nodeW, nh, C.white);
      box(sl, nx, ny, nodeW, 0.06, C.red);
      t(sl, node.label || '', nx + 0.12, ny + 0.15, nodeW - 0.24, nh - 0.28, {
        fontSize: 12,
        color: C.dark,
        align: 'center',
        valign: 'middle',
        wrap: true,
      });
    });
  });
}

/**
 * Embed an agent-generated image from assets/.
 */
function renderImageSlide(ctx, sl, hl, cnt, deckJsonPath) {
  const { t, box, C, ML, CW, H, W, LAYOUT } = ctx;
  sl.background = { color: C.white };

  const layout = cnt.layout || 'right';
  const resolved = resolveAssetPath(cnt.path, deckJsonPath);
  const gap = 0.35;

  if (layout === 'full') {
    drawHeadline(ctx, sl, hl);
    const imgY = 1.7;
    const imgH = cnt.caption ? 4.2 : 4.6;
    if (resolved) {
      frameImage(ctx, sl, ML, imgY, CW, imgH);
      sl.addImage({ path: resolved, x: ML, y: imgY, w: CW, h: imgH });
    } else {
      missingImage(ctx, sl, ML, 2.2, CW, 3.5, cnt.path);
    }
  } else if (layout === 'left') {
    const imgW = CW * 0.5;
    if (resolved) {
      frameImage(ctx, sl, ML, 0.75, imgW, 5.6);
      sl.addImage({ path: resolved, x: ML, y: 0.75, w: imgW, h: 5.6 });
    } else {
      missingImage(ctx, sl, ML, 0.75, imgW, 5.6, cnt.path);
    }
    const tx = ML + imgW + gap;
    const tw = CW - imgW - gap;
    t(sl, hl, tx, 1.2, tw, 1.2, {
      fontSize: headlineSize(hl, 24),
      color: C.dark,
      wrap: true,
    });
    if (cnt.bullets) {
      renderBullets(ctx, sl, cnt.bullets.slice(0, 4), {
        x: tx,
        y: 2.7,
        w: tw,
        h: 3.6,
        fontSize: 13,
        detailSize: 11,
      });
    }
  } else {
    if (LAYOUT === 'bold') box(sl, ML, 0.6, CW, 0.1, C.red);
    else if (LAYOUT !== 'minimal') box(sl, ML, 0.6, CW, 0.04, C.red);

    const textW = CW * 0.45;
    t(sl, hl, ML, 0.9, textW, 1.4, {
      fontSize: headlineSize(hl, 24),
      color: C.dark,
      wrap: true,
    });
    if (cnt.bullets) {
      renderBullets(ctx, sl, cnt.bullets.slice(0, 4), {
        x: ML,
        y: 2.5,
        w: textW,
        h: 3.7,
        fontSize: 13,
        detailSize: 11,
      });
    }
    const imgX = ML + textW + gap;
    const imgW = CW - textW - gap;
    if (resolved) {
      frameImage(ctx, sl, imgX, 0.9, imgW, 5.3);
      sl.addImage({ path: resolved, x: imgX, y: 0.9, w: imgW, h: 5.3 });
    } else {
      missingImage(ctx, sl, imgX, 0.9, imgW, 5.3, cnt.path);
    }
  }

  if (cnt.caption) {
    t(sl, cnt.caption, ML, H - 0.55, CW, 0.3, {
      fontSize: 11,
      color: C.mgray,
      italic: true,
    });
  }

  void W;
}

function missingImage(ctx, sl, x, y, w, h, expectedPath) {
  const { t, box, C } = ctx;
  box(sl, x, y, w, h, C.lgray);
  t(
    sl,
    `Image not found: ${expectedPath || '(no path)'}\nGenerate via visual-creator into assets/ before export.`,
    x + 0.2,
    y + h / 2 - 0.4,
    w - 0.4,
    0.9,
    { fontSize: 12, color: C.mgray, align: 'center', valign: 'middle', wrap: true },
  );
}

module.exports = {
  renderChartSlide,
  renderDiagramSlide,
  renderImageSlide,
  renderBullets,
  renderTakeaway,
  resolveAssetPath,
  speakerNotesText,
  headlineSize,
};
