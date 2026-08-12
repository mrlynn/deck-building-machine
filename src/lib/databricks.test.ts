import assert from 'node:assert/strict';
import { afterEach, describe, it } from 'node:test';
import {
  databricksConfigStatus,
  isDatabricksConfigured,
  isDatabricksFeatureEnabled,
} from './databricks';

describe('databricks feature flag', () => {
  const envKeys = [
    'ENABLE_DATABRICKS',
    'DATABRICKS_HOST',
    'DATABRICKS_SERVER_HOSTNAME',
    'DATABRICKS_TOKEN',
    'DATABRICKS_WAREHOUSE_ID',
    'DATABRICKS_HTTP_PATH',
  ] as const;

  const previous: Partial<Record<(typeof envKeys)[number], string | undefined>> = {};

  afterEach(() => {
    for (const key of envKeys) {
      if (previous[key] === undefined) delete process.env[key];
      else process.env[key] = previous[key];
    }
  });

  it('is disabled by default', () => {
    for (const key of envKeys) {
      previous[key] = process.env[key];
      delete process.env[key];
    }
    assert.equal(isDatabricksFeatureEnabled(), false);
    assert.equal(isDatabricksConfigured(), false);
    assert.equal(databricksConfigStatus().enabled, false);
  });

  it('requires ENABLE_DATABRICKS=true even when credentials are present', () => {
    for (const key of envKeys) {
      previous[key] = process.env[key];
    }
    process.env.DATABRICKS_SERVER_HOSTNAME = 'example.cloud.databricks.com';
    process.env.DATABRICKS_HTTP_PATH = '/sql/1.0/warehouses/abc123';
    process.env.DATABRICKS_TOKEN = 'dapi-test';
    delete process.env.ENABLE_DATABRICKS;

    assert.equal(isDatabricksConfigured(), false);

    process.env.ENABLE_DATABRICKS = 'true';
    assert.equal(isDatabricksFeatureEnabled(), true);
    assert.equal(isDatabricksConfigured(), true);
  });

  it('honors ENABLE_DATABRICKS=false even when credentials are present', () => {
    for (const key of envKeys) {
      previous[key] = process.env[key];
    }
    process.env.ENABLE_DATABRICKS = 'false';
    process.env.DATABRICKS_SERVER_HOSTNAME = 'example.cloud.databricks.com';
    process.env.DATABRICKS_HTTP_PATH = '/sql/1.0/warehouses/abc123';
    process.env.DATABRICKS_TOKEN = 'dapi-test';

    assert.equal(isDatabricksFeatureEnabled(), false);
    assert.equal(isDatabricksConfigured(), false);
  });
});
