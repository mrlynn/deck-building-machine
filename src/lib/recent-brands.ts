import {
  DEFAULT_BRAND,
  type BrandPack,
  slugify,
} from './types';
import { DEFAULT_LAYOUT_STYLE, resolveLayoutStyle } from './layouts';

export const RECENT_BRANDS_STORAGE_KEY = 'deck-machine-recent-brands';
/** Cap for browser library + sidebar (search helps once the list grows). */
export const RECENT_BRANDS_MAX = 12;
/** Skip storing logos when the JSON would exceed this (localStorage headroom). */
export const RECENT_BRANDS_MAX_BYTES = 1_200_000;

export type RecentBrandEntry = {
  id: string;
  savedAt: number;
  brand: BrandPack;
  /** True when logos were stripped to fit storage. */
  logosOmitted?: boolean;
  /** True after a successful leave-behind zip download. */
  downloaded?: boolean;
};

export type SaveRecentBrandOpts = {
  downloaded?: boolean;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function asOptionalString(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [...DEFAULT_BRAND.wordsToAvoid];
  return value.filter((v): v is string => typeof v === 'string');
}

/** Normalize unknown JSON into a BrandPack (best-effort). */
export function normalizeBrandPack(raw: unknown): BrandPack | null {
  if (!isRecord(raw)) return null;
  const customerName = asString(raw.customerName).trim();
  if (!customerName) return null;
  const customerSlug =
    asString(raw.customerSlug).trim() || slugify(customerName);

  return {
    customerName,
    customerSlug,
    displayName: asOptionalString(raw.displayName),
    website: asOptionalString(raw.website),
    industry: asOptionalString(raw.industry),
    salesforceAccountId: asOptionalString(raw.salesforceAccountId),
    primaryColor: asString(raw.primaryColor, DEFAULT_BRAND.primaryColor),
    darkColor: asString(raw.darkColor, DEFAULT_BRAND.darkColor),
    grayColor: asString(raw.grayColor, DEFAULT_BRAND.grayColor),
    lightGrayColor: asString(raw.lightGrayColor, DEFAULT_BRAND.lightGrayColor),
    midGrayColor: asString(raw.midGrayColor, DEFAULT_BRAND.midGrayColor),
    whiteColor: asString(raw.whiteColor, DEFAULT_BRAND.whiteColor),
    accentColor: asString(raw.accentColor, DEFAULT_BRAND.accentColor),
    fontStack: asString(raw.fontStack, DEFAULT_BRAND.fontStack),
    voiceSummary: asString(raw.voiceSummary, DEFAULT_BRAND.voiceSummary),
    wordsToAvoid: asStringArray(raw.wordsToAvoid),
    defaultAudience: asString(
      raw.defaultAudience,
      `${customerName} leadership`,
    ),
    presenterHint: asOptionalString(raw.presenterHint),
    layoutStyle: resolveLayoutStyle(
      asString(raw.layoutStyle, DEFAULT_LAYOUT_STYLE),
    ),
    logoOnDarkBase64: asOptionalString(raw.logoOnDarkBase64),
    logoOnLightBase64: asOptionalString(raw.logoOnLightBase64),
  };
}

export function stripLogos(brand: BrandPack): BrandPack {
  const next = { ...brand };
  delete next.logoOnDarkBase64;
  delete next.logoOnLightBase64;
  return next;
}

function entryId(brand: BrandPack, savedAt: number): string {
  return `${brand.customerSlug || slugify(brand.customerName)}-${savedAt}`;
}

/** Pure: merge a brand into the recent list (newest first, deduped by slug). */
export function upsertRecentBrand(
  existing: RecentBrandEntry[],
  brand: BrandPack,
  savedAt = Date.now(),
  opts?: SaveRecentBrandOpts,
): RecentBrandEntry[] {
  const normalized = normalizeBrandPack(brand);
  if (!normalized) return existing;

  let pack = { ...normalized };
  let logosOmitted = false;
  const probe: RecentBrandEntry = {
    id: entryId(pack, savedAt),
    savedAt,
    brand: pack,
  };
  if (JSON.stringify(probe).length > RECENT_BRANDS_MAX_BYTES) {
    pack = stripLogos(pack);
    logosOmitted = true;
  }

  const slug = pack.customerSlug;
  const prev = existing.find((e) => e.brand.customerSlug === slug);
  const without = existing.filter((e) => e.brand.customerSlug !== slug);
  const downloaded = opts?.downloaded === true || prev?.downloaded === true;
  const hasLogos = Boolean(pack.logoOnDarkBase64 || pack.logoOnLightBase64);
  const next: RecentBrandEntry = {
    id: entryId(pack, savedAt),
    savedAt,
    brand: pack,
    ...(downloaded ? { downloaded: true } : {}),
  };
  if (logosOmitted) {
    next.logosOmitted = true;
  } else if (!hasLogos && prev?.logosOmitted) {
    // Still no logos in storage — keep prior omission signal for progress UI
    next.logosOmitted = true;
  }

  return [next, ...without].slice(0, RECENT_BRANDS_MAX);
}

export function parseRecentBrands(raw: string | null): RecentBrandEntry[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const entries: RecentBrandEntry[] = [];
    for (const item of parsed) {
      if (!isRecord(item)) continue;
      const brand = normalizeBrandPack(item.brand);
      if (!brand) continue;
      const savedAt =
        typeof item.savedAt === 'number' ? item.savedAt : Date.now();
      entries.push({
        id: asString(item.id, entryId(brand, savedAt)),
        savedAt,
        brand,
        logosOmitted: item.logosOmitted === true,
        downloaded: item.downloaded === true,
      });
    }
    return entries.slice(0, RECENT_BRANDS_MAX);
  } catch {
    return [];
  }
}

export function loadRecentBrands(): RecentBrandEntry[] {
  if (typeof localStorage === 'undefined') return [];
  try {
    return parseRecentBrands(localStorage.getItem(RECENT_BRANDS_STORAGE_KEY));
  } catch {
    return [];
  }
}

export function saveRecentBrand(
  brand: BrandPack,
  opts?: SaveRecentBrandOpts,
): RecentBrandEntry[] {
  const next = upsertRecentBrand(loadRecentBrands(), brand, Date.now(), opts);
  if (typeof localStorage === 'undefined') return next;
  try {
    localStorage.setItem(RECENT_BRANDS_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Quota exceeded — retry without logos
    const stripped = upsertRecentBrand(
      loadRecentBrands(),
      stripLogos(brand),
      Date.now(),
      opts,
    ).map((e) => ({ ...e, logosOmitted: true as const }));
    try {
      localStorage.setItem(RECENT_BRANDS_STORAGE_KEY, JSON.stringify(stripped));
      return stripped;
    } catch {
      return loadRecentBrands();
    }
  }
  return next;
}

export function removeRecentBrand(id: string): RecentBrandEntry[] {
  const next = loadRecentBrands().filter((e) => e.id !== id);
  if (typeof localStorage === 'undefined') return next;
  try {
    localStorage.setItem(RECENT_BRANDS_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
  return next;
}

export function clearRecentBrands(): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.removeItem(RECENT_BRANDS_STORAGE_KEY);
  } catch {
    // ignore
  }
}
