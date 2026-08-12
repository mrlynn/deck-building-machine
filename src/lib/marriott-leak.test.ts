import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { DEFAULT_BRAND } from './types';
import { checkMarriottLeak } from './marriott-leak';

describe('checkMarriottLeak', () => {
  it('passes for Marriott dogfood', () => {
    const report = checkMarriottLeak({
      ...DEFAULT_BRAND,
      customerName: 'Marriott International',
      customerSlug: 'marriott',
    });
    assert.equal(report.severity, 'pass');
    assert.equal(report.isReferenceCustomer, true);
  });

  it('fails when audience still says Marriott', () => {
    const report = checkMarriottLeak({
      ...DEFAULT_BRAND,
      customerName: 'Acme',
      customerSlug: 'acme',
      defaultAudience: 'Marriott leadership',
    });
    assert.equal(report.severity, 'fail');
    assert.ok(report.findings.some((f) => f.field === 'defaultAudience'));
  });

  it('passes a clean customer pack', () => {
    const report = checkMarriottLeak({
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
