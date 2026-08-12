import { DEFAULT_BRAND, type BrandPack, hexBare } from './types';

export type PackProgressId =
  | 'account'
  | 'brand'
  | 'ready'
  | 'downloaded';

export type PackProgress = {
  /** Wizard-aligned stage (highest completed). */
  stage: PackProgressId;
  /** 1–4 for a compact meter. */
  step: number;
  total: number;
  /** Short label for the rail. */
  label: string;
  /** Longer hint for tooltips. */
  detail: string;
};

function primaryStillReference(brand: BrandPack): boolean {
  return (
    hexBare(brand.primaryColor) === hexBare(DEFAULT_BRAND.primaryColor) &&
    brand.customerSlug !== 'acme' &&
    !brand.customerName.toLowerCase().includes('acme')
  );
}

function hasStoredLogo(brand: BrandPack): boolean {
  return Boolean(brand.logoOnDarkBase64 || brand.logoOnLightBase64);
}

/**
 * Progress for a recent brand pack in the sidebar.
 * `logosOmitted` means logos existed at save time but were stripped for storage.
 * `downloaded` is set after a successful zip generate.
 */
export function assessPackProgress(
  brand: BrandPack,
  opts?: { downloaded?: boolean; logosOmitted?: boolean },
): PackProgress {
  const total = 4;
  const hasAccount = Boolean(brand.customerName.trim());
  const hasLogo = hasStoredLogo(brand) || opts?.logosOmitted === true;
  const branded = !primaryStillReference(brand) || hasLogo;
  const ready =
    hasAccount &&
    branded &&
    hasLogo &&
    !primaryStillReference(brand);

  if (opts?.downloaded) {
    return {
      stage: 'downloaded',
      step: 4,
      total,
      label: 'Downloaded',
      detail: 'Leave-behind zip was generated in this browser.',
    };
  }

  if (ready) {
    return {
      stage: 'ready',
      step: 3,
      total,
      label: 'Ready',
      detail: 'Brand pack looks complete — open Preview to download.',
    };
  }

  if (hasAccount && branded) {
    return {
      stage: 'brand',
      step: 2,
      total,
      label: hasLogo ? 'Brand' : 'Needs logos',
      detail: hasLogo
        ? 'Account and brand started — finish Encode brand, then download.'
        : 'Add logos (and confirm primary) before download.',
    };
  }

  return {
    stage: 'account',
    step: hasAccount ? 1 : 0,
    total,
    label: 'Started',
    detail: 'Find the account, then encode brand and download.',
  };
}

/** Prefer light-surface mark; fall back to on-dark. */
export function packLogoSrc(brand: BrandPack): string | undefined {
  return brand.logoOnLightBase64 || brand.logoOnDarkBase64;
}
