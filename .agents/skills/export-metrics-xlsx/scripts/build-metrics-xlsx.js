'use strict';
/**
 * Deck Machine — metrics / chart workbook from deck-content.json
 * Brand tokens load from brand/brand-pack.json at runtime.
 * Prefer the bundled exporter (no npm): node bundled/export-xlsx.cjs …
 * Usage: node build-metrics-xlsx.js path/to/deck-content.json
 */
const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');
const { loadBrand, repoRootFromInput } = require('../../_shared/load-brand');

const [,, inputPath] = process.argv;
if (!inputPath) {
  console.error('Usage: node build-metrics-xlsx.js deck-content.json');
  process.exit(1);
}

const deckJsonAbs = path.resolve(inputPath);
const brand = loadBrand(repoRootFromInput(deckJsonAbs));
const C = {
  red: brand.primaryBare,
  dark: brand.darkBare,
  gray: brand.grayBare,
  lgray: brand.lightGrayBare,
  white: brand.whiteBare,
};
const FONT = brand.fontStack.split(',')[0].trim() || 'Arial';

const deck = JSON.parse(fs.readFileSync(deckJsonAbs, 'utf8'));
const outDir = path.resolve(path.dirname(deckJsonAbs), 'output');
fs.mkdirSync(outDir, { recursive: true });

const meta = deck.metadata || {};
const slides = deck.slides || [];
const metricSlides = slides
  .map((s, i) => ({ slide: s, index: i + 1 }))
  .filter(({ slide }) => slide.type === 'metrics');
const chartSlides = slides
  .map((s, i) => ({ slide: s, index: i + 1 }))
  .filter(({ slide }) => slide.type === 'chart');

if (!metricSlides.length && !chartSlides.length) {
  console.error('No metrics or chart slides found in deck-content.json — nothing to export.');
  process.exit(2);
}

const slug = (meta.title || 'metrics')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '')
  .slice(0, 48);
const outFile = path.join(outDir, `${slug || 'metrics'}-metrics.xlsx`);

function styleHeaderRow(row) {
  row.eachCell((cell) => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: `FF${C.red}` } };
    cell.font = { name: FONT, bold: true, color: { argb: `FF${C.white}` }, size: 11 };
    cell.alignment = { vertical: 'middle', wrapText: true };
  });
  row.height = 22;
}

async function build() {
  const wb = new ExcelJS.Workbook();
  wb.creator = meta.presenter || brand.customerName;
  wb.created = new Date();
  wb.title = meta.title || 'Metrics pack';

  // Cover
  const cover = wb.addWorksheet('Cover', {
    properties: { tabColor: { argb: `FF${C.red}` } },
  });
  cover.getColumn(1).width = 22;
  cover.getColumn(2).width = 56;
  cover.mergeCells('A1:B1');
  cover.getCell('A1').value = meta.title || 'Metrics pack';
  cover.getCell('A1').font = { name: FONT, size: 20, color: { argb: `FF${C.dark}` } };
  cover.getCell('A3').value = 'Audience';
  cover.getCell('B3').value = meta.audience || '';
  cover.getCell('A4').value = 'Presenter';
  cover.getCell('B4').value = meta.presenter || '';
  cover.getCell('A5').value = 'Date';
  cover.getCell('B5').value = meta.date || '';
  cover.getCell('A7').value = 'Contents';
  cover.getCell('B7').value = [
    metricSlides.length ? `Metrics (${metricSlides.length} slide(s))` : null,
    chartSlides.length ? `Charts (${chartSlides.length} slide(s))` : null,
  ].filter(Boolean).join(' · ');
  cover.getCell('A9').value = 'Note';
  cover.getCell('B9').value =
    'Numbers are copied from deck-content.json only. This workbook is not a financial model.';
  cover.getCell('B9').font = { name: FONT, size: 10, italic: true, color: { argb: `FF${C.gray}` } };
  ['A3', 'A4', 'A5', 'A7', 'A9'].forEach((addr) => {
    cover.getCell(addr).font = { name: FONT, bold: true, color: { argb: `FF${C.red}` }, size: 11 };
  });
  cover.getCell('A1').border = {
    bottom: { style: 'medium', color: { argb: `FF${C.red}` } },
  };

  // Metrics sheet
  if (metricSlides.length) {
    const ws = wb.addWorksheet('Metrics', {
      properties: { tabColor: { argb: `FF${C.dark}` } },
    });
    const headers = ['Slide', 'Headline', 'Value', 'Delta', 'Label', 'Description', 'Takeaway'];
    ws.addRow(headers);
    styleHeaderRow(ws.getRow(1));
    headers.forEach((_, i) => { ws.getColumn(i + 1).width = [10, 40, 14, 12, 22, 36, 36][i]; });

    for (const { slide, index } of metricSlides) {
      const c = slide.content || {};
      for (const m of c.metrics || []) {
        const row = ws.addRow([
          index,
          slide.headline || '',
          m.value ?? '',
          m.delta ?? '',
          m.label ?? '',
          m.description ?? '',
          c.takeaway ?? '',
        ]);
        row.eachCell((cell) => {
          cell.font = { name: FONT, size: 11, color: { argb: `FF${C.dark}` } };
          cell.alignment = { wrapText: true, vertical: 'top' };
        });
        row.getCell(3).font = { name: FONT, size: 14, bold: true, color: { argb: `FF${C.red}` } };
      }
    }
  }

  // One sheet per chart (or a single Charts sheet with blocks if many)
  chartSlides.forEach(({ slide, index }, chartIdx) => {
    const c = slide.content || {};
    const name = `Chart ${chartIdx + 1}`.slice(0, 31);
    const ws = wb.addWorksheet(name, {
      properties: { tabColor: { argb: `FF${C.gray}` } },
    });
    ws.getColumn(1).width = 28;
    ws.addRow(['Slide', index]);
    ws.addRow(['Headline', slide.headline || '']);
    ws.addRow(['Chart type', c.chartType || '']);
    ws.addRow(['Highlight', c.highlight || '']);
    ws.addRow(['Caption', c.caption || '']);
    ws.addRow(['Takeaway', c.takeaway || '']);
    ws.addRow([]);
    for (let r = 1; r <= 6; r++) {
      ws.getCell(r, 1).font = { name: FONT, bold: true, color: { argb: `FF${C.red}` }, size: 11 };
      ws.getCell(r, 2).font = { name: FONT, size: 11, color: { argb: `FF${C.dark}` } };
    }

    const series = c.series || [];
    const categories = c.categories || [];
    const header = ['Category', ...series.map((s) => s.name || 'Series')];
    const headerRow = ws.addRow(header);
    styleHeaderRow(headerRow);
    series.forEach((_, i) => { ws.getColumn(i + 2).width = 14; });

    categories.forEach((cat, i) => {
      const row = ws.addRow([cat, ...series.map((s) => s.values?.[i] ?? '')]);
      row.eachCell((cell) => {
        cell.font = { name: FONT, size: 11, color: { argb: `FF${C.dark}` } };
      });
      if (c.highlight && String(cat) === String(c.highlight)) {
        row.eachCell((cell) => {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: `FF${C.lgray}` } };
          cell.font = { name: FONT, size: 11, bold: true, color: { argb: `FF${C.red}` } };
        });
      }
    });
  });

  await wb.xlsx.writeFile(outFile);
  console.log(
    `Wrote ${outFile} (metrics slides: ${metricSlides.length}, chart slides: ${chartSlides.length})`,
  );
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
