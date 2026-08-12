'use strict';
/**
 * Deck Machine — DOCX Builder
 * Brand tokens load from brand/brand-pack.json at runtime.
 * Prefer the bundled exporter (no npm): node bundled/export-docx.cjs …
 * Usage: node build-docx.js path/to/doc-content.json
 */
const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, BorderStyle, AlignmentType,
} = require('docx');
const { loadBrand, repoRootFromInput } = require('../../_shared/load-brand');

const [,, inputPath] = process.argv;
if (!inputPath) {
  console.error('Usage: node build-docx.js doc-content.json');
  process.exit(1);
}

const docJsonAbs = path.resolve(inputPath);
const brand = loadBrand(repoRootFromInput(docJsonAbs));
const C = {
  red: brand.primaryBare,
  dark: brand.darkBare,
  gray: brand.grayBare,
  mgray: brand.midGrayBare,
};
const FONT = brand.fontStack.split(',')[0].trim() || 'Arial';

const doc = JSON.parse(fs.readFileSync(docJsonAbs, 'utf8'));
const outDir = path.resolve(path.dirname(docJsonAbs), 'output');
fs.mkdirSync(outDir, { recursive: true });

const meta = doc.metadata || {};
const slug = (meta.title || 'document')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '')
  .slice(0, 48);
const outFile = path.join(outDir, `${slug || 'document'}.docx`);

function p(text, opts = {}) {
  return new Paragraph({
    spacing: { after: opts.after ?? 200 },
    ...opts.para,
    children: [
      new TextRun({
        text: text || '',
        font: FONT,
        size: opts.size ?? 22, // half-points → 11pt
        color: opts.color || C.dark,
        bold: !!opts.bold,
        italics: !!opts.italics,
      }),
    ],
  });
}

function heading(text, level = HeadingLevel.HEADING_1) {
  return new Paragraph({
    heading: level,
    spacing: { before: 280, after: 160 },
    children: [
      new TextRun({
        text: text || '',
        font: FONT,
        bold: true,
        color: C.red,
        size: level === HeadingLevel.HEADING_1 ? 28 : 24,
      }),
    ],
  });
}

function bullet(text, detail) {
  const kids = [
    new TextRun({ text: text || '', font: FONT, size: 22, color: C.dark, bold: true }),
  ];
  if (detail) {
    kids.push(new TextRun({ text: `\n${detail}`, font: FONT, size: 20, color: C.gray }));
  }
  return new Paragraph({
    spacing: { after: 120 },
    indent: { left: 360 },
    children: kids,
  });
}

const children = [];

// Title band
children.push(new Paragraph({
  spacing: { after: 80 },
  border: {
    bottom: { style: BorderStyle.SINGLE, size: 18, color: C.red, space: 8 },
  },
  children: [
    new TextRun({
      text: meta.title || 'Document',
      font: FONT,
      size: 40,
      color: C.dark,
    }),
  ],
}));

if (meta.subtitle) children.push(p(meta.subtitle, { size: 24, color: C.gray, after: 80 }));
const metaLine = [meta.audience, meta.presenter, meta.date].filter(Boolean).join(' · ');
if (metaLine) children.push(p(metaLine, { size: 18, color: C.mgray, after: 280 }));

if (doc.executiveSummary) {
  children.push(heading('Executive summary'));
  String(doc.executiveSummary).split(/\n+/).filter(Boolean).forEach((para) => {
    children.push(p(para, { after: 160 }));
  });
}

for (const section of doc.sections || []) {
  if (section.heading) children.push(heading(section.heading));
  for (const para of section.paragraphs || []) {
    children.push(p(para));
  }
  for (const b of section.bullets || []) {
    if (typeof b === 'string') children.push(bullet(b));
    else children.push(bullet(b.text, b.detail));
  }
}

if (doc.ask) {
  children.push(heading('Recommendation'));
  children.push(p(doc.ask, { bold: true }));
}

if (Array.isArray(doc.takeaways) && doc.takeaways.length) {
  children.push(heading('Takeaways'));
  doc.takeaways.forEach((t, i) => children.push(bullet(`${i + 1}. ${t}`)));
}

const document = new Document({
  creator: meta.presenter || brand.customerName,
  title: meta.title || 'Document',
  description: meta.audience || '',
  styles: {
    default: {
      document: {
        styles: [{
          id: 'Normal',
          run: { font: FONT, size: 22, color: C.dark },
        }],
      },
    },
  },
  sections: [{
    properties: {
      page: {
        margin: { top: 720, right: 720, bottom: 720, left: 720 },
      },
    },
    children,
  }],
});

Packer.toBuffer(document).then((buffer) => {
  fs.writeFileSync(outFile, buffer);
  console.log(`Wrote ${outFile} (${(doc.sections || []).length} sections)`);
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
