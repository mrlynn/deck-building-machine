import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { DEFAULT_BRAND } from './types';
import { assessPrefillConfidence } from './prefill-confidence';

describe('assessPrefillConfidence', () => {
  it('rates a strong Brandfetch pack as good', () => {
    const result = assessPrefillConfidence(
      {
        ...DEFAULT_BRAND,
        customerName: 'Stripe',
        customerSlug: 'stripe',
        website: 'stripe.com',
        primaryColor: '#635BFF',
        logoOnDarkBase64: 'data:image/png;base64,a',
        logoOnLightBase64: 'data:image/png;base64,b',
      },
      0.92,
    );
    assert.equal(result.level, 'good');
    assert.equal(result.scorePercent, 92);
  });

  it('asks for review when primary is still reference red', () => {
    const result = assessPrefillConfidence(
      {
        ...DEFAULT_BRAND,
        customerName: 'Stripe',
        customerSlug: 'stripe',
        website: 'stripe.com',
        logoOnDarkBase64: 'data:image/png;base64,a',
      },
      0.5,
    );
    assert.equal(result.level, 'review');
    assert.ok(result.checks.some((c) => c.id === 'primary' && !c.ok));
  });
});
