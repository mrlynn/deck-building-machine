import { DEFAULT_BRAND, type BrandPack, hexBare } from './types';

const MARRIOTT_MARKERS = [
  'marriott',
  'bonvoy',
  'ritz-carlton',
  'ritz carlton',
] as const;

export type LeakSeverity = 'pass' | 'warn' | 'fail';

export type LeakFinding = {
  id: string;
  severity: Exclude<LeakSeverity, 'pass'>;
  field: string;
  message: string;
};

export type MarriottLeakReport = {
  severity: LeakSeverity;
  isReferenceCustomer: boolean;
  findings: LeakFinding[];
  /** One-line summary for the UI. */
  summary: string;
};

function isMarriottCustomer(brand: BrandPack): boolean {
  const slug = brand.customerSlug.toLowerCase();
  const name = brand.customerName.toLowerCase();
  return (
    slug === 'marriott' ||
    slug.startsWith('marriott-') ||
    name.includes('marriott')
  );
}

function fieldHits(value: string | undefined): boolean {
  if (!value) return false;
  const lower = value.toLowerCase();
  return MARRIOTT_MARKERS.some((m) => lower.includes(m));
}

/**
 * Client-side trust check: brand pack fields should not carry Marriott
 * leftovers when packaging a non-Marriott customer zip.
 */
export function checkMarriottLeak(brand: BrandPack): MarriottLeakReport {
  if (isMarriottCustomer(brand)) {
    return {
      severity: 'pass',
      isReferenceCustomer: true,
      findings: [],
      summary:
        'Reference customer (Marriott) — Studio defaults are expected for dogfood.',
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
        message: `${field} still mentions Marriott (or a Marriott brand).`,
      });
    }
  }

  for (const word of brand.wordsToAvoid ?? []) {
    if (fieldHits(word)) {
      findings.push({
        id: `avoid-${word}`,
        severity: 'warn',
        field: 'wordsToAvoid',
        message: `Words-to-avoid list includes “${word}” — unusual for a non-Marriott pack.`,
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
