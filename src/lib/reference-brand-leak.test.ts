import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { DEFAULT_BRAND } from './types';
import { checkReferenceBrandLeak } from './reference-brand-leak';

describe('checkReferenceBrandLeak', () => {
  it('passes for Acme dogfood', () => {
    const report = checkReferenceBrandLeak({
      ...DEFAULT_BRAND,
      customerName: 'Acme Corporation',
      customerSlug: 'acme',
    });
    assert.equal(report.severity, 'pass');
    assert.equal(report.isReferenceCustomer, true);
  });

  it('fails when audience still says Acme', () => {
    const report = checkReferenceBrandLeak({
      ...DEFAULT_BRAND,
      customerName: 'Stripe',
      customerSlug: 'stripe',
      defaultAudience: 'Acme leadership',
    });
    assert.equal(report.severity, 'fail');
    assert.ok(report.findings.some((f) => f.field === 'defaultAudience'));
  });

  it('passes a clean customer pack', () => {
    const report = checkReferenceBrandLeak({
      ...DEFAULT_BRAND,
      customerName: 'Stripe',
      customerSlug: 'stripe',
      primaryColor: '#635BFF',
      website: 'stripe.com',
      defaultAudience: 'Stripe leadership',
    });
    assert.equal(report.severity, 'pass');
    assert.equal(report.findings.length, 0);
  });
});
