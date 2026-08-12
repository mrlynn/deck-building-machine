import { DEFAULT_BRAND, type BrandPack, hexBare } from './types';

/** Markers from the Studio reference (dogfood) brand that must not leak into customer zips. */
const REFERENCE_MARKERS = ['acme'] as const;

export type LeakSeverity = 'pass' | 'warn' | 'fail';

export type LeakFinding = {
  id: string;
  severity: Exclude<LeakSeverity, 'pass'>;
  field: string;
  message: string;
};

export type ReferenceBrandLeakReport = {
  severity: LeakSeverity;
  isReferenceCustomer: boolean;
  findings: LeakFinding[];
  /** One-line summary for the UI. */
  summary: string;
};

function isReferenceCustomer(brand: BrandPack): boolean {
  const slug = brand.customerSlug.toLowerCase();
  const name = brand.customerName.toLowerCase();
  return slug === 'acme' || slug.startsWith('acme-') || name.includes('acme');
}

function fieldHits(value: string | undefined): boolean {
  if (!value) return false;
  const lower = value.toLowerCase();
  return REFERENCE_MARKERS.some((m) => lower.includes(m));
}

/**
 * Client-side trust check: brand pack fields should not carry reference-brand
 * leftovers when packaging a customer zip.
 */
export function checkReferenceBrandLeak(brand: BrandPack): ReferenceBrandLeakReport {
  if (isReferenceCustomer(brand)) {
    return {
      severity: 'pass',
      isReferenceCustomer: true,
      findings: [],
      summary:
        'Reference customer (Acme) — Studio defaults are expected for dogfood.',
    };
  }

  const findings: LeakFinding[] = [];

  const stringFields: Array<[string, string | undefined]> = [
    ['customerName', brand.customerName],
    ['customerSlug', brand.customerSlug],
    ['displayName', brand.displayName],
    ['defaultAudience', brand.defaultAudience],
    ['presenterHint', brand.presenterHint],
    ['voiceSummary', brand.voiceSummary],
    ['website', brand.website],
    ['industry', brand.industry],
  ];

  for (const [field, value] of stringFields) {
    if (fieldHits(value)) {
      findings.push({
        id: `field-${field}`,
        severity: 'fail',
        field,
        message: `${field} still mentions the reference brand (Acme).`,
      });
    }
  }

  for (const word of brand.wordsToAvoid ?? []) {
    if (fieldHits(word)) {
      findings.push({
        id: `avoid-${word}`,
        severity: 'warn',
        field: 'wordsToAvoid',
        message: `Words-to-avoid list includes “${word}” — unusual for a non-reference pack.`,
      });
    }
  }

  if (
    hexBare(brand.primaryColor) === hexBare(DEFAULT_BRAND.primaryColor) &&
    !brand.website
  ) {
    findings.push({
      id: 'default-primary',
      severity: 'warn',
      field: 'primaryColor',
      message:
        'Primary is still Studio reference red and no website is set — confirm this is the customer’s color.',
    });
  }

  const hasFail = findings.some((f) => f.severity === 'fail');
  const hasWarn = findings.some((f) => f.severity === 'warn');
  const severity: LeakSeverity = hasFail ? 'fail' : hasWarn ? 'warn' : 'pass';

  const summaries: Record<LeakSeverity, string> = {
    pass: 'Brand pack fields look clean for this customer.',
    warn: 'Possible reference leftovers — review highlighted fields before download.',
    fail: 'Reference brand markers found in the brand pack — fix before downloading.',
  };

  return {
    severity,
    isReferenceCustomer: false,
    findings,
    summary: summaries[severity],
  };
}
