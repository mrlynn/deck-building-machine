'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { loadBrand, repoRootFromInput } = require('./load-brand');

const root = path.resolve(__dirname, '../../..');
const nestedDeck = path.join(
  root,
  'examples/assembled-use-cursor-cli/deck-content.json',
);

describe('load-brand', () => {
  it('walks up from examples/assembled-* to the repo root', () => {
    assert.equal(repoRootFromInput(nestedDeck), root);
  });

  it('loads reference dogfood pack by default', () => {
    const prev = process.env.DECK_BRAND_DIR;
    delete process.env.DECK_BRAND_DIR;
    try {
      const brand = loadBrand(root);
      assert.equal(brand.customerName, 'Acme');
      assert.equal(brand.primaryBare, 'BE202E');
    } finally {
      if (prev === undefined) delete process.env.DECK_BRAND_DIR;
      else process.env.DECK_BRAND_DIR = prev;
    }
  });

  it('honors DECK_BRAND_DIR=brand/cursor for enablement exports', () => {
    const prev = process.env.DECK_BRAND_DIR;
    process.env.DECK_BRAND_DIR = 'brand/cursor';
    try {
      const brand = loadBrand(root);
      assert.equal(brand.customerName, 'Cursor');
      assert.equal(brand.primaryBare, 'E8601B');
      assert.ok(brand.brandDir.endsWith(`${path.sep}brand${path.sep}cursor`));
    } finally {
      if (prev === undefined) delete process.env.DECK_BRAND_DIR;
      else process.env.DECK_BRAND_DIR = prev;
    }
  });
});
