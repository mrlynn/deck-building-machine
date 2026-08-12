/** Brand pack — customer-specific inputs that parameterize a deck machine. */

import {
  DEFAULT_LAYOUT_STYLE,
  type LayoutStyleId,
} from './layouts';

export interface BrandPack {
  customerName: string;
  customerSlug: string;
  displayName?: string;
  website?: string;
  industry?: string;
  salesforceAccountId?: string;
  primaryColor: string; // hex with or without #
  darkColor: string;
  grayColor: string;
  lightGrayColor: string;
  midGrayColor: string;
  whiteColor: string;
  accentColor: string;
  fontStack: string;
  voiceSummary: string;
  wordsToAvoid: string[];
  defaultAudience: string;
  presenterHint?: string;
  /** Visual layout preset baked into the PPTX exporter + brand rules */
  layoutStyle: LayoutStyleId;
  /** Base64 PNG for logo on dark/primary backgrounds (e.g. white mark) */
  logoOnDarkBase64?: string;
  /** Base64 PNG for logo on light backgrounds (e.g. primary-colored mark) */
  logoOnLightBase64?: string;
}

export interface SalesforceAccount {
  id: string;
  name: string;
  website: string | null;
  industry: string | null;
  type: string | null;
  billingCountry: string | null;
}

export interface GenerateRequest {
  brand: BrandPack;
}

export const DEFAULT_BRAND: BrandPack = {
  customerName: '',
  customerSlug: '',
  primaryColor: '#BE202E',
  darkColor: '#1D1D1B',
  grayColor: '#4A4A4A',
  lightGrayColor: '#F2F2F2',
  midGrayColor: '#9B9B9B',
  whiteColor: '#FFFFFF',
  accentColor: '#B8973A',
  fontStack: 'Arial, Calibri, Helvetica Neue, sans-serif',
  voiceSummary:
    'Clear, confident, warm, and action-oriented. Lead with the conclusion. Insight headlines, not topic labels.',
  wordsToAvoid: ['leverage', 'synergies', 'best-in-class', 'going forward', 'in this space'],
  defaultAudience: 'customer leadership',
  layoutStyle: DEFAULT_LAYOUT_STYLE,
};

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48);
}

export function hexBare(hex: string): string {
  return hex.replace(/^#/, '').toUpperCase();
}
