/** Client-safe Brandfetch types + Brand Search (browser-direct per Brandfetch guidelines). */

export interface BrandSearchHit {
  brandId: string;
  name: string | null;
  domain: string;
  icon: string | null;
  claimed: boolean;
}

export interface BrandPrefill {
  source: 'brandfetch';
  qualityScore?: number;
  customerName?: string;
  customerSlug?: string;
  displayName?: string;
  website?: string;
  industry?: string;
  primaryColor?: string;
  darkColor?: string;
  grayColor?: string;
  lightGrayColor?: string;
  midGrayColor?: string;
  whiteColor?: string;
  accentColor?: string;
  fontStack?: string;
  logoOnDarkBase64?: string;
  logoOnLightBase64?: string;
}

export async function searchBrandsClient(
  name: string,
  clientId: string,
): Promise<BrandSearchHit[]> {
  const q = name.trim();
  if (q.length < 2) return [];

  const url = `https://api.brandfetch.io/v2/search/${encodeURIComponent(q)}?c=${encodeURIComponent(clientId)}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Brand search failed (${res.status})`);
  }
  return (await res.json()) as BrandSearchHit[];
}
