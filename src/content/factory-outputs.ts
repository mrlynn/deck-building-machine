/**
 * Studio download-step copy for factory output formats.
 * PPTX remains the demo vehicle; Doc / Excel are thin skills in the same zip.
 * The zip ships a Cursor factory — not pre-built Office files.
 */

export type FactoryOutputId = 'slides' | 'doc' | 'workbook';

export type FactoryOutputOption = {
  id: FactoryOutputId;
  label: string;
  skill: string;
  caption: string;
  /** Short chip sublabel under the toggle */
  proof: string;
  /** What the customer runs in Cursor to get this format */
  customerRuns: string;
  /** Path in the zip to highlight in the artifact list */
  artifactPath: string;
};

export const FACTORY_OUTPUTS: FactoryOutputOption[] = [
  {
    id: 'slides',
    label: 'Slides',
    skill: '/build-deck → /export-pptx',
    caption:
      'Primary demo vehicle. Customer builds a branded PPTX in Cursor — proves rules, skills, and agents.',
    proof: 'PPTX',
    customerRuns: '/create-brief → /build-deck → output/*.pptx',
    artifactPath: '.agents/skills/export-pptx/scripts/bundled/export-pptx.cjs',
  },
  {
    id: 'doc',
    label: 'Document',
    skill: '/build-doc → /export-docx',
    caption:
      'Same brief and brand voice as a Word narrative. Thin second renderer — not a Word product, not in the zip as a finished .docx.',
    proof: 'DOCX',
    customerRuns: '/build-doc → output/*.docx',
    artifactPath: '.agents/skills/export-docx/scripts/bundled/export-docx.cjs',
  },
  {
    id: 'workbook',
    label: 'Workbook',
    skill: '/export-metrics-xlsx',
    caption:
      'Metrics and chart slides from the deck → branded Excel. Numbers only from the deck — not a modeler, not a pre-filled workbook in the zip.',
    proof: 'XLSX',
    customerRuns: '/export-metrics-xlsx → output/*-metrics.xlsx',
    artifactPath:
      '.agents/skills/export-metrics-xlsx/scripts/bundled/export-xlsx.cjs',
  },
];

export const FACTORY_OUTPUTS_INTRO =
  'Preview how the same brand pack lands in three formats. The zip does not include finished Office files — it ships the Cursor skills that produce them.';

/** Two-column framing for ADMs on the download step */
export const PACKAGE_CONTENTS = {
  title: 'What you are packaging',
  inZipTitle: 'In the zip (Cursor factory)',
  inZip: [
    'Always-on brand rules + workflow rule',
    'Skills: /create-brief, /build-deck, /build-doc, /export-metrics-xlsx, …',
    'Bundled exporters (PPTX · DOCX · XLSX) — no npm install',
    'brand/brand-pack.json + logos + teaching docs',
  ],
  notInZipTitle: 'Not in the zip (customer builds these)',
  notInZip: [
    'Finished .pptx / .docx / .xlsx files',
    'brief.md or deck-content.json (created in Cursor)',
    'A multi-format SaaS — Studio only packages the kit',
  ],
} as const;

export function factoryOutputById(id: FactoryOutputId): FactoryOutputOption {
  return FACTORY_OUTPUTS.find((o) => o.id === id) ?? FACTORY_OUTPUTS[0];
}
