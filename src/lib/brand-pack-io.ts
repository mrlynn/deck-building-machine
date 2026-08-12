import {
  normalizeBrandPack,
  stripLogos,
} from './recent-brands';
import { resolveLayoutStyle } from './layouts';
import type { BrandPack } from './types';
import { slugify } from './types';

export const BRAND_PACK_FILE_VERSION = 1;

export type BrandPackFile = {
  version: number;
  exportedAt: string;
  brand: BrandPack;
};

export type BrandDeepLink = {
  customerName?: string;
  customerSlug?: string;
  website?: string;
  industry?: string;
  primaryColor?: string;
  darkColor?: string;
  layoutStyle?: string;
  /** When true, load the most recent saved brand pack. */
  resume?: boolean;
};

/** Build a downloadable brand-pack JSON payload. */
export function toBrandPackFile(brand: BrandPack): BrandPackFile {
  const normalized = normalizeBrandPack(brand);
  if (!normalized) {
    throw new Error('Brand pack needs a customer name before export');
  }
  return {
    version: BRAND_PACK_FILE_VERSION,
    exportedAt: new Date().toISOString(),
    brand: normalized,
  };
}

/** Parse an imported brand-pack JSON string. */
export function parseBrandPackFile(raw: string): BrandPack {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error('Invalid JSON — expected a Deck Machine brand pack file');
  }
  if (
    typeof parsed === 'object' &&
    parsed !== null &&
    'brand' in parsed &&
    typeof (parsed as BrandPackFile).brand === 'object'
  ) {
    const brand = normalizeBrandPack((parsed as BrandPackFile).brand);
    if (!brand) throw new Error('Brand pack is missing customerName');
    return brand;
  }
  const brand = normalizeBrandPack(parsed);
  if (!brand) throw new Error('Brand pack is missing customerName');
  return brand;
}

/** Parse Studio deep-link query params into a partial brand identity. */
export function parseBrandDeepLink(
  searchParams: URLSearchParams,
): BrandDeepLink {
  const resume =
    searchParams.get('resume') === '1' ||
    searchParams.get('resume') === 'true';
  const customer =
    searchParams.get('customer') || searchParams.get('name') || undefined;
  const domain =
    searchParams.get('domain') || searchParams.get('website') || undefined;
  const slug = searchParams.get('slug') || undefined;
  const industry = searchParams.get('industry') || undefined;
  const primary = searchParams.get('primary') || undefined;
  const dark = searchParams.get('dark') || undefined;
  const layout = searchParams.get('layout') || undefined;

  return {
    ...(customer ? { customerName: customer } : {}),
    ...(slug ? { customerSlug: slugify(slug) } : {}),
    ...(domain ? { website: domain } : {}),
    ...(industry ? { industry } : {}),
    ...(primary ? { primaryColor: primary.startsWith('#') ? primary : `#${primary}` } : {}),
    ...(dark ? { darkColor: dark.startsWith('#') ? dark : `#${dark}` } : {}),
    ...(layout ? { layoutStyle: layout } : {}),
    ...(resume ? { resume: true } : {}),
  };
}

/**
 * Logo slots from a prefill/source. Always returns both keys so a merge onto
 * an existing BrandPack clears marks the source did not provide (prevents
 * prior-account logo leak when Brandfetch returns only one theme).
 */
export function logoFieldsFromSource(source: {
  logoOnDarkBase64?: string;
  logoOnLightBase64?: string;
}): Pick<BrandPack, 'logoOnDarkBase64' | 'logoOnLightBase64'> {
  return {
    logoOnDarkBase64: source.logoOnDarkBase64,
    logoOnLightBase64: source.logoOnLightBase64,
  };
}

/** Empty logo slots — use when selecting a new account before prefill/upload. */
export const CLEARED_LOGO_FIELDS: Pick<
  BrandPack,
  'logoOnDarkBase64' | 'logoOnLightBase64'
> = {
  logoOnDarkBase64: undefined,
  logoOnLightBase64: undefined,
};

/** Apply deep-link fields onto a brand pack (identity + optional colors). */
export function applyDeepLink(
  brand: BrandPack,
  link: BrandDeepLink,
): BrandPack {
  const name = link.customerName?.trim();
  const websiteChanged = Boolean(link.website && link.website !== brand.website);
  const identityChanged = Boolean(name || websiteChanged);
  let next: BrandPack = { ...brand };
  if (name) {
    next.customerName = name;
    next.customerSlug = link.customerSlug || slugify(name);
    next.displayName = name;
    next.defaultAudience = `${name} leadership`;
  } else if (link.customerSlug) {
    next.customerSlug = link.customerSlug;
  }
  if (link.website) next.website = link.website;
  if (link.industry) next.industry = link.industry;
  if (link.primaryColor) next.primaryColor = link.primaryColor;
  if (link.darkColor) next.darkColor = link.darkColor;
  if (link.layoutStyle) {
    next.layoutStyle = resolveLayoutStyle(link.layoutStyle);
  }
  // Deep links never carry logos — drop prior account marks on identity change
  if (identityChanged) {
    next = stripLogos(next);
  }
  return next;
}

/**
 * Shareable Studio URL with identity + key colors (no logos — keep the URL short).
 * Relative path + query, suitable for clipboard.
 */
export function buildShareQuery(brand: BrandPack): string {
  const light = stripLogos(brand);
  const params = new URLSearchParams();
  if (light.customerName) params.set('customer', light.customerName);
  if (light.customerSlug) params.set('slug', light.customerSlug);
  if (light.website) params.set('domain', light.website);
  if (light.industry) params.set('industry', light.industry);
  if (light.primaryColor) {
    params.set('primary', light.primaryColor.replace(/^#/, ''));
  }
  if (light.darkColor) {
    params.set('dark', light.darkColor.replace(/^#/, ''));
  }
  if (light.layoutStyle) params.set('layout', light.layoutStyle);
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export function buildShareUrl(brand: BrandPack, origin?: string): string {
  const base =
    origin ||
    (typeof window !== 'undefined' ? window.location.origin : '');
  const path =
    typeof window !== 'undefined' ? window.location.pathname : '/';
  return `${base}${path}${buildShareQuery(brand)}`;
}

export function downloadBrandPackJson(brand: BrandPack): void {
  const file = toBrandPackFile(brand);
  const blob = new Blob([JSON.stringify(file, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${file.brand.customerSlug || 'brand'}-brand-pack.json`;
  a.click();
  URL.revokeObjectURL(url);
}
