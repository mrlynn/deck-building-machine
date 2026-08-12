import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { assessPackProgress, packLogoSrc } from './pack-progress';
import { DEFAULT_BRAND } from './types';

const base = {
  ...DEFAULT_BRAND,
  customerName: 'Acme',
  customerSlug: 'acme',
};

describe('assessPackProgress', () => {
  it('marks downloaded packs complete', () => {
    const p = assessPackProgress(base, { downloaded: true });
    assert.equal(p.stage, 'downloaded');
    assert.equal(p.step, 4);
    assert.equal(p.label, 'Downloaded');
  });

  it('marks ready when colors and logos are set', () => {
    const p = assessPackProgress({
      ...base,
      primaryColor: '#112233',
      logoOnLightBase64: 'data:image/png;base64,abc',
    });
    assert.equal(p.stage, 'ready');
    assert.equal(p.label, 'Ready');
  });

  it('treats logosOmitted as logo presence for progress', () => {
    const p = assessPackProgress(
      { ...base, primaryColor: '#112233' },
      { logosOmitted: true },
    );
    assert.equal(p.stage, 'ready');
  });

  it('flags missing logos', () => {
    const p = assessPackProgress({
      ...base,
      primaryColor: '#112233',
    });
    assert.equal(p.stage, 'brand');
    assert.equal(p.label, 'Needs logos');
  });
});

describe('packLogoSrc', () => {
  it('prefers light-surface logo', () => {
    assert.equal(
      packLogoSrc({
        ...base,
        logoOnLightBase64: 'light',
        logoOnDarkBase64: 'dark',
      }),
      'light',
    );
  });
});
