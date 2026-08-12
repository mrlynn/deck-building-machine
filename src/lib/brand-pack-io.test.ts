import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { DEFAULT_BRAND } from './types';
import {
  applyDeepLink,
  buildShareQuery,
  CLEARED_LOGO_FIELDS,
  logoFieldsFromSource,
  parseBrandDeepLink,
  parseBrandPackFile,
  toBrandPackFile,
} from './brand-pack-io';

describe('parseBrandDeepLink', () => {
  it('reads customer, domain, colors, and resume', () => {
    const link = parseBrandDeepLink(
      new URLSearchParams(
        'customer=Acme&domain=acme.com&primary=112233&resume=1',
      ),
    );
    assert.equal(link.customerName, 'Acme');
    assert.equal(link.website, 'acme.com');
    assert.equal(link.primaryColor, '#112233');
    assert.equal(link.resume, true);
  });
});

describe('applyDeepLink', () => {
  it('sets name, slug, and audience', () => {
    const next = applyDeepLink(
      { ...DEFAULT_BRAND },
      { customerName: 'Stripe', website: 'stripe.com' },
    );
    assert.equal(next.customerName, 'Stripe');
    assert.equal(next.customerSlug, 'stripe');
    assert.equal(next.website, 'stripe.com');
    assert.equal(next.defaultAudience, 'Stripe leadership');
  });

  it('clears prior logos when identity changes', () => {
    const next = applyDeepLink(
      {
        ...DEFAULT_BRAND,
        customerName: 'Nike',
        customerSlug: 'nike',
        website: 'nike.com',
        logoOnDarkBase64: 'data:image/png;base64,nike-dark',
        logoOnLightBase64: 'data:image/png;base64,nike-light',
      },
      { customerName: 'New York Life', website: 'newyorklife.com' },
    );
    assert.equal(next.customerName, 'New York Life');
    assert.equal(next.logoOnDarkBase64, undefined);
    assert.equal(next.logoOnLightBase64, undefined);
  });

  it('keeps logos when only colors change', () => {
    const next = applyDeepLink(
      {
        ...DEFAULT_BRAND,
        customerName: 'Nike',
        logoOnDarkBase64: 'data:image/png;base64,nike-dark',
      },
      { primaryColor: '#112233' },
    );
    assert.equal(next.logoOnDarkBase64, 'data:image/png;base64,nike-dark');
    assert.equal(next.primaryColor, '#112233');
  });
});

describe('logoFieldsFromSource', () => {
  it('always emits both keys so merges can clear missing slots', () => {
    const fields = logoFieldsFromSource({
      logoOnLightBase64: 'data:image/png;base64,only-light',
    });
    assert.equal(fields.logoOnLightBase64, 'data:image/png;base64,only-light');
    assert.equal(fields.logoOnDarkBase64, undefined);
    assert.ok('logoOnDarkBase64' in fields);
    assert.ok('logoOnLightBase64' in fields);
  });

  it('clears both when merging CLEARED_LOGO_FIELDS onto a prior pack', () => {
    const prior = {
      ...DEFAULT_BRAND,
      logoOnDarkBase64: 'data:image/png;base64,old-dark',
      logoOnLightBase64: 'data:image/png;base64,old-light',
    };
    const next = { ...prior, ...CLEARED_LOGO_FIELDS };
    assert.equal(next.logoOnDarkBase64, undefined);
    assert.equal(next.logoOnLightBase64, undefined);
  });
});

describe('brand pack file', () => {
  it('round-trips through JSON', () => {
    const file = toBrandPackFile({
      ...DEFAULT_BRAND,
      customerName: 'Notion',
      customerSlug: 'notion',
    });
    const parsed = parseBrandPackFile(JSON.stringify(file));
    assert.equal(parsed.customerName, 'Notion');
    assert.equal(parsed.customerSlug, 'notion');
  });

  it('accepts a bare brand object', () => {
    const parsed = parseBrandPackFile(
      JSON.stringify({ customerName: 'Linear', customerSlug: 'linear' }),
    );
    assert.equal(parsed.customerName, 'Linear');
  });
});

describe('buildShareQuery', () => {
  it('omits logos and includes identity', () => {
    const qs = buildShareQuery({
      ...DEFAULT_BRAND,
      customerName: 'Acme',
      customerSlug: 'acme',
      website: 'acme.com',
      primaryColor: '#ABCDEF',
      logoOnDarkBase64: 'data:image/png;base64,xxx',
    });
    assert.match(qs, /customer=Acme/);
    assert.match(qs, /domain=acme.com/);
    assert.match(qs, /primary=ABCDEF/i);
    assert.doesNotMatch(qs, /logo/i);
  });
});
