import { DEFAULT_BRAND, type BrandPack, hexBare } from './types';

export type PrefillConfidenceLevel = 'good' | 'review' | 'manual';

export type PrefillConfidence = {
  level: PrefillConfidenceLevel;
  /** 0–100 when Brandfetch reported a score; otherwise null. */
  scorePercent: number | null;
  label: string;
  detail: string;
  checks: Array<{ id: string; ok: boolean; label: string }>;
};

function hasLogo(brand: BrandPack): boolean {
  return Boolean(brand.logoOnDarkBase64 || brand.logoOnLightBase64);
}

function primaryStillReference(brand: BrandPack): boolean {
  return (
    hexBare(brand.primaryColor) === hexBare(DEFAULT_BRAND.primaryColor) &&
    brand.customerSlug !== 'marriott' &&
    !brand.customerName.toLowerCase().includes('marriott')
  );
}

/**
 * Surface trust signals after Brandfetch (or manual entry).
 * qualityScore is Brandfetch's 0–1 score when available.
 */
export function assessPrefillConfidence(
  brand: BrandPack,
  qualityScore?: number | null,
): PrefillConfidence {
  const scorePercent =
    typeof qualityScore === 'number' && Number.isFinite(qualityScore)
      ? Math.round(Math.min(1, Math.max(0, qualityScore)) * 100)
      : null;

  const checks = [
    {
      id: 'name',
      ok: Boolean(brand.customerName.trim()),
      label: 'Customer name set',
    },
    {
      id: 'website',
      ok: Boolean(brand.website?.trim()),
      label: 'Website set (helps Brandfetch)',
    },
    {
      id: 'logos',
      ok: hasLogo(brand),
      label: hasLogo(brand)
        ? 'At least one logo present'
        : 'Add on-dark and on-light logos',
    },
    {
      id: 'both-logos',
      ok: Boolean(brand.logoOnDarkBase64 && brand.logoOnLightBase64),
      label:
        brand.logoOnDarkBase64 && brand.logoOnLightBase64
          ? 'Both logo variants present'
          : 'Review both logo variants',
    },
    {
      id: 'primary',
      ok: !primaryStillReference(brand),
      label: primaryStillReference(brand)
        ? 'Primary still reference red — confirm it matches the customer'
        : 'Primary color differs from Studio defaults',
    },
  ];

  const logoOk = hasLogo(brand);
  const bothLogos = Boolean(brand.logoOnDarkBase64 && brand.logoOnLightBase64);
  const refPrimary = primaryStillReference(brand);

  let level: PrefillConfidenceLevel = 'manual';
  if (scorePercent !== null && scorePercent >= 70 && bothLogos && !refPrimary) {
    level = 'good';
  } else if (scorePercent !== null && scorePercent >= 40 && logoOk) {
    level = 'review';
  } else if (bothLogos && !refPrimary && brand.website) {
    level = 'good';
  } else if (logoOk || (scorePercent !== null && scorePercent >= 40)) {
    level = 'review';
  } else if (refPrimary || !logoOk) {
    level = 'review';
  }

  if (!brand.customerName.trim()) {
    level = 'manual';
  }

  const labels: Record<PrefillConfidenceLevel, string> = {
    good: 'Prefill looks good',
    review: 'Review logos and primary color',
    manual: 'Enter brand details manually',
  };

  const details: Record<PrefillConfidenceLevel, string> = {
    good:
      scorePercent !== null
        ? `Brandfetch quality ${scorePercent}%. Spot-check logos on the dark and light swatches, then continue.`
        : 'Colors and logos look ready. Spot-check the swatches, then continue.',
    review:
      scorePercent !== null
        ? `Brandfetch quality ${scorePercent}%. APIs sometimes return a marketing accent or stale mark — confirm primary and both logos.`
        : 'Confirm primary color and both logo variants before download. Brandfetch can miss accents.',
    manual:
      'No strong prefill yet. Add a website and fetch from Brandfetch, or enter colors and logos by hand.',
  };

  return {
    level,
    scorePercent,
    label: labels[level],
    detail: details[level],
    checks,
  };
}
