import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { DEFAULT_BRAND } from './types';
import {
  normalizeBrandPack,
  parseRecentBrands,
  stripLogos,
  upsertRecentBrand,
} from './recent-brands';

describe('normalizeBrandPack', () => {
  it('returns null without customerName', () => {
    assert.equal(normalizeBrandPack({ primaryColor: '#111' }), null);
  });

  it('fills slug from name', () => {
    const pack = normalizeBrandPack({ customerName: 'Acme Corp' });
    assert.ok(pack);
    assert.equal(pack.customerSlug, 'acme-corp');
  });
});

describe('upsertRecentBrand', () => {
  it('dedupes by slug and keeps newest first', () => {
    const a = { ...DEFAULT_BRAND, customerName: 'Acme', customerSlug: 'acme' };
    const b = {
      ...DEFAULT_BRAND,
      customerName: 'Acme Inc',
      customerSlug: 'acme',
      primaryColor: '#112233',
    };
    const once = upsertRecentBrand([], a, 1);
    const twice = upsertRecentBrand(once, b, 2);
    assert.equal(twice.length, 1);
    assert.equal(twice[0].brand.customerName, 'Acme Inc');
    assert.equal(twice[0].brand.primaryColor, '#112233');
  });

  it('preserves downloaded across later saves', () => {
    const a = { ...DEFAULT_BRAND, customerName: 'Acme', customerSlug: 'acme' };
    const once = upsertRecentBrand([], a, 1, { downloaded: true });
    const twice = upsertRecentBrand(once, {
      ...a,
      primaryColor: '#112233',
    }, 2);
    assert.equal(twice[0].downloaded, true);
  });

  it('caps at twelve entries', () => {
    let list = upsertRecentBrand([], {
      ...DEFAULT_BRAND,
      customerName: 'A',
      customerSlug: 'a',
    }, 1);
    for (let i = 2; i <= 15; i += 1) {
      list = upsertRecentBrand(
        list,
        {
          ...DEFAULT_BRAND,
          customerName: `C${i}`,
          customerSlug: `c${i}`,
        },
        i,
      );
    }
    assert.equal(list.length, 12);
    assert.equal(list[0].brand.customerSlug, 'c15');
  });
});

describe('parseRecentBrands', () => {
  it('returns empty for bad JSON', () => {
    assert.deepEqual(parseRecentBrands('{'), []);
  });

  it('parses a valid list', () => {
    const raw = JSON.stringify([
      {
        id: 'acme-1',
        savedAt: 10,
        brand: { customerName: 'Acme', customerSlug: 'acme' },
      },
    ]);
    const list = parseRecentBrands(raw);
    assert.equal(list.length, 1);
    assert.equal(list[0].brand.customerName, 'Acme');
  });
});

describe('stripLogos', () => {
  it('removes logo fields', () => {
    const stripped = stripLogos({
      ...DEFAULT_BRAND,
      customerName: 'Acme',
      customerSlug: 'acme',
      logoOnDarkBase64: 'data:image/png;base64,abc',
      logoOnLightBase64: 'data:image/png;base64,def',
    });
    assert.equal(stripped.logoOnDarkBase64, undefined);
    assert.equal(stripped.logoOnLightBase64, undefined);
  });
});
