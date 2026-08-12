'use strict';
/**
 * Load brand tokens for Office exporters (pptx / docx / xlsx).
 *
 * Resolution order for brand directory:
 * 1. DECK_BRAND_DIR env (absolute, or relative to repo root)
 * 2. <repoRoot>/brand/brand-pack.json
 *
 * Repo root is found by walking up from the deck JSON until brand/brand-pack.json
 * exists (or package.json at the kit root).
 *
 * Falls back to reference defaults if no pack file is present.
 */
const fs = require('fs');
const path = require('path');

const DEFAULTS = {
  customerName: 'Customer',
  primaryBare: 'BE202E',
  darkBare: '1D1D1B',
  grayBare: '4A4A4A',
  lightGrayBare: 'F2F2F2',
  midGrayBare: '9B9B9B',
  whiteBare: 'FFFFFF',
  accentBare: 'B8973A',
  fontStack: 'Arial, Calibri, Helvetica Neue, sans-serif',
  layoutStyle: 'classic',
};

function bare(hex, fallback) {
  if (!hex || typeof hex !== 'string') return fallback;
  return hex.replace(/^#/, '').toUpperCase();
}

/**
 * Walk up from the deck JSON directory to the kit / repo root.
 * @param {string} inputAbs Absolute path to deck-content.json
 */
function repoRootFromInput(inputAbs) {
  let dir = path.dirname(path.resolve(inputAbs));
  for (;;) {
    if (fs.existsSync(path.join(dir, 'brand', 'brand-pack.json'))) {
      return dir;
    }
    if (
      fs.existsSync(path.join(dir, 'package.json')) &&
      fs.existsSync(path.join(dir, '.agents'))
    ) {
      return dir;
    }
    const parent = path.dirname(dir);
    if (parent === dir) {
      return path.dirname(path.resolve(inputAbs));
    }
    dir = parent;
  }
}

function resolveBrandDir(repoRoot) {
  const override = process.env.DECK_BRAND_DIR;
  if (override && override.trim()) {
    return path.isAbsolute(override)
      ? override
      : path.resolve(repoRoot, override);
  }
  return path.join(repoRoot, 'brand');
}

/**
 * @param {string} repoRoot Absolute path to the kit root
 */
function loadBrand(repoRoot) {
  const brandDir = resolveBrandDir(repoRoot);
  const packPath = path.join(brandDir, 'brand-pack.json');
  let pack = {};
  if (fs.existsSync(packPath)) {
    try {
      pack = JSON.parse(fs.readFileSync(packPath, 'utf8'));
    } catch {
      pack = {};
    }
  }

  const layoutStyle =
    process.env.DECK_LAYOUT || pack.layoutStyle || DEFAULTS.layoutStyle;

  return {
    customerName: pack.customerName || pack.displayName || DEFAULTS.customerName,
    primaryBare: bare(pack.primaryColor, DEFAULTS.primaryBare),
    darkBare: bare(pack.darkColor, DEFAULTS.darkBare),
    grayBare: bare(pack.grayColor, DEFAULTS.grayBare),
    lightGrayBare: bare(pack.lightGrayColor, DEFAULTS.lightGrayBare),
    midGrayBare: bare(pack.midGrayColor, DEFAULTS.midGrayBare),
    whiteBare: bare(pack.whiteColor, DEFAULTS.whiteBare),
    accentBare: bare(pack.accentColor, DEFAULTS.accentBare),
    fontStack: pack.fontStack || DEFAULTS.fontStack,
    layoutStyle,
    brandDir,
  };
}

module.exports = { loadBrand, repoRootFromInput, resolveBrandDir, DEFAULTS };
