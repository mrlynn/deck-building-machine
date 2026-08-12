import { BrandPack, DEFAULT_BRAND } from './types';

const BRAND_API_BASE = 'https://api.brandfetch.io/v2/brands';
const FALLBACK_FONT_STACK = 'Arial, Calibri, Helvetica Neue, sans-serif';

export interface BrandfetchColor {
  hex: string;
  type: 'accent' | 'dark' | 'light' | 'brand';
  brightness: number;
}

export interface BrandfetchFormat {
  src: string;
  format: 'svg' | 'webp' | 'png' | 'jpeg';
  height?: number | null;
  width?: number | null;
  size?: number;
  background?: 'transparent' | null;
}

export interface BrandfetchLogo {
  theme: 'dark' | 'light' | null;
  type: 'icon' | 'logo' | 'symbol' | 'other';
  formats: BrandfetchFormat[];
  tags: unknown[];
}

export interface BrandfetchFont {
  name: string | null;
  type: 'title' | 'body';
  origin?: 'google' | 'custom' | 'system';
  originId?: string | null;
}

export interface BrandfetchIndustry {
  id: string;
  name: string;
  slug: string;
  score: number;
  emoji?: string;
}

export interface BrandfetchBrand {
  id: string;
  name: string | null;
  domain: string;
  description?: string | null;
  logos: BrandfetchLogo[];
  colors: BrandfetchColor[];
  fonts: BrandfetchFont[];
  company?: {
    industries?: BrandfetchIndustry[];
  };
  qualityScore?: number;
}

/** Partial BrandPack returned for wizard prefill (grays stay as defaults). */
export type BrandPrefill = Partial<BrandPack> & {
  source: 'brandfetch';
  qualityScore?: number;
};

export function isBrandfetchConfigured(): boolean {
  return Boolean(process.env.BRANDFETCH_API_KEY?.trim());
}

export function getBrandfetchClientId(): string | undefined {
  const id = process.env.NEXT_PUBLIC_BRANDFETCH_CLIENT_ID?.trim();
  return id || undefined;
}

/** Strip protocol, path, and leading www. → bare domain for Brand API. */
export function normalizeDomain(input: string): string | null {
  const raw = input.trim();
  if (!raw) return null;

  let host = raw;
  try {
    if (raw.includes('://')) {
      host = new URL(raw).hostname;
    } else {
      host = raw.split('/')[0]?.split('?')[0] ?? raw;
    }
  } catch {
    host = raw.split('/')[0] ?? raw;
  }

  host = host.replace(/^www\./i, '').toLowerCase().replace(/\.+$/, '');
  if (!host || !host.includes('.')) return null;
  return host;
}

function withHash(hex: string): string {
  const cleaned = hex.trim().replace(/^#/, '');
  return `#${cleaned}`;
}

function pickColor(
  colors: BrandfetchColor[],
  type: BrandfetchColor['type'],
): string | undefined {
  const match = colors.find((c) => c.type === type && c.hex);
  return match ? withHash(match.hex) : undefined;
}

/**
 * Brandfetch theme semantics (from their docs):
 * - dark  → dark-colored mark, use on light backgrounds → logoOnLight
 * - light → light-colored mark, use on dark backgrounds → logoOnDark
 */
function pickLogoFormat(
  logos: BrandfetchLogo[],
  theme: 'dark' | 'light',
): BrandfetchFormat | undefined {
  const preferredTypes: BrandfetchLogo['type'][] = ['logo', 'symbol', 'icon', 'other'];
  const formatPriority = ['png', 'webp', 'jpeg', 'svg'] as const;

  for (const type of preferredTypes) {
    const logo = logos.find((l) => l.type === type && l.theme === theme);
    if (!logo?.formats?.length) continue;
    for (const fmt of formatPriority) {
      const match = logo.formats.find((f) => f.format === fmt && f.src);
      if (match) return match;
    }
  }

  const themed = logos.find((l) => l.theme === theme && l.formats?.length);
  if (themed) {
    for (const fmt of formatPriority) {
      const match = themed.formats.find((f) => f.format === fmt && f.src);
      if (match) return match;
    }
  }

  return undefined;
}

async function fetchImageAsDataUrl(src: string, apiKey: string): Promise<string | undefined> {
  try {
    const res = await fetch(src, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (!res.ok) return undefined;
    const contentType = res.headers.get('content-type') || 'image/png';
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.byteLength > 1.5 * 1024 * 1024) return undefined;
    return `data:${contentType};base64,${buf.toString('base64')}`;
  } catch {
    return undefined;
  }
}

export function mapBrandToPrefill(
  brand: BrandfetchBrand,
  logos?: { onDark?: string; onLight?: string },
): BrandPrefill {
  const accent = pickColor(brand.colors, 'accent');
  const dark = pickColor(brand.colors, 'dark');
  const brandColors = brand.colors.filter((c) => c.type === 'brand');
  const secondaryBrand = brandColors.find(
    (c) => withHash(c.hex).toLowerCase() !== accent?.toLowerCase(),
  );

  const bodyFont = brand.fonts.find((f) => f.type === 'body' && f.name);
  const titleFont = brand.fonts.find((f) => f.type === 'title' && f.name);
  const fontName = bodyFont?.name || titleFont?.name || brand.fonts[0]?.name;
  const fontStack = fontName
    ? `${fontName}, ${FALLBACK_FONT_STACK}`
    : DEFAULT_BRAND.fontStack;

  const industry = brand.company?.industries?.[0]?.name;

  const prefill: BrandPrefill = {
    source: 'brandfetch',
    qualityScore: brand.qualityScore,
    website: brand.domain,
    primaryColor: accent || (brandColors[0] ? withHash(brandColors[0].hex) : undefined),
    darkColor: dark || DEFAULT_BRAND.darkColor,
    accentColor: secondaryBrand
      ? withHash(secondaryBrand.hex)
      : DEFAULT_BRAND.accentColor,
    fontStack,
    grayColor: DEFAULT_BRAND.grayColor,
    lightGrayColor: DEFAULT_BRAND.lightGrayColor,
    midGrayColor: DEFAULT_BRAND.midGrayColor,
    whiteColor: DEFAULT_BRAND.whiteColor,
  };

  if (brand.name) {
    prefill.customerName = brand.name;
    prefill.displayName = brand.name;
  }
  if (industry) prefill.industry = industry;
  if (logos?.onDark) prefill.logoOnDarkBase64 = logos.onDark;
  if (logos?.onLight) prefill.logoOnLightBase64 = logos.onLight;

  return prefill;
}

export async function fetchBrandByDomain(domain: string): Promise<BrandfetchBrand> {
  const apiKey = process.env.BRANDFETCH_API_KEY?.trim();
  if (!apiKey) {
    throw new Error('BRANDFETCH_API_KEY is not configured');
  }

  const normalized = normalizeDomain(domain);
  if (!normalized) {
    throw new Error('Invalid domain');
  }

  const res = await fetch(`${BRAND_API_BASE}/domain/${encodeURIComponent(normalized)}`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: 'application/json',
    },
  });

  if (res.status === 404) {
    throw new Error(`No Brandfetch entry for ${normalized}`);
  }
  if (res.status === 401) {
    throw new Error('Brandfetch API key unauthorized');
  }
  if (res.status === 429) {
    throw new Error('Brandfetch API quota exceeded');
  }
  if (!res.ok) {
    throw new Error(`Brandfetch Brand API failed (${res.status})`);
  }

  return (await res.json()) as BrandfetchBrand;
}

export async function lookupBrandPrefill(domain: string): Promise<BrandPrefill> {
  const apiKey = process.env.BRANDFETCH_API_KEY!.trim();
  const brand = await fetchBrandByDomain(domain);

  const onDarkFormat = pickLogoFormat(brand.logos, 'light');
  const onLightFormat = pickLogoFormat(brand.logos, 'dark');

  const [onDark, onLight] = await Promise.all([
    onDarkFormat ? fetchImageAsDataUrl(onDarkFormat.src, apiKey) : Promise.resolve(undefined),
    onLightFormat ? fetchImageAsDataUrl(onLightFormat.src, apiKey) : Promise.resolve(undefined),
  ]);

  return mapBrandToPrefill(brand, { onDark, onLight });
}
