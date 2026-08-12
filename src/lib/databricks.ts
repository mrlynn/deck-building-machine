import type { SalesforceAccount } from './types';

interface DatabricksConfig {
  host: string;
  token: string;
  warehouseId: string;
  catalog: string;
  schema: string;
}

/**
 * Supports both Studio naming and common Databricks connector naming:
 * - DATABRICKS_HOST  OR  DATABRICKS_SERVER_HOSTNAME
 * - DATABRICKS_WAREHOUSE_ID  OR  extracted from DATABRICKS_HTTP_PATH
 * - DATABRICKS_TOKEN (shared)
 */
function resolveHost(): string | undefined {
  const host =
    process.env.DATABRICKS_HOST ||
    process.env.DATABRICKS_SERVER_HOSTNAME ||
    process.env.DATABRICKS_HOSTNAME;
  if (!host) return undefined;
  const trimmed = host.replace(/\/$/, '');
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  return `https://${trimmed}`;
}

function resolveWarehouseId(): string | undefined {
  if (process.env.DATABRICKS_WAREHOUSE_ID) return process.env.DATABRICKS_WAREHOUSE_ID;
  const httpPath = process.env.DATABRICKS_HTTP_PATH;
  if (!httpPath) return undefined;
  const match = httpPath.match(/\/warehouses\/([a-zA-Z0-9-]+)/);
  return match?.[1];
}

function getConfig(): DatabricksConfig | null {
  const host = resolveHost();
  const token = process.env.DATABRICKS_TOKEN;
  const warehouseId = resolveWarehouseId();
  if (!host || !token || !warehouseId) return null;
  return {
    host,
    token,
    warehouseId,
    catalog: process.env.DATABRICKS_CATALOG || 'revops',
    schema: process.env.DATABRICKS_SCHEMA || 'pt_salesforce',
  };
}

export function isDatabricksFeatureEnabled(): boolean {
  const flag = process.env.ENABLE_DATABRICKS?.trim().toLowerCase();
  if (flag === 'false' || flag === '0' || flag === 'no') return false;
  return flag === 'true';
}

export function isDatabricksConfigured(): boolean {
  return isDatabricksFeatureEnabled() && getConfig() !== null;
}

export function databricksConfigStatus(): {
  enabled: boolean;
  configured: boolean;
  missing: string[];
  resolved: { host: boolean; token: boolean; warehouseId: boolean };
} {
  const enabled = isDatabricksFeatureEnabled();
  const host = Boolean(resolveHost());
  const token = Boolean(process.env.DATABRICKS_TOKEN);
  const warehouseId = Boolean(resolveWarehouseId());
  const missing: string[] = [];
  if (!host) missing.push('DATABRICKS_HOST or DATABRICKS_SERVER_HOSTNAME');
  if (!token) missing.push('DATABRICKS_TOKEN');
  if (!warehouseId) missing.push('DATABRICKS_WAREHOUSE_ID or DATABRICKS_HTTP_PATH');
  return {
    enabled,
    configured: enabled && host && token && warehouseId,
    missing,
    resolved: { host, token, warehouseId },
  };
}

type StatementResponse = {
  status?: { state?: string; error?: { message?: string } };
  manifest?: {
    schema?: { columns?: { name: string }[] };
  };
  result?: {
    data_array?: Array<Array<string | null>>;
  };
  statement_id?: string;
};

async function executeSql(query: string): Promise<StatementResponse> {
  const cfg = getConfig();
  if (!cfg) {
    const status = databricksConfigStatus();
    throw new Error(
      `Databricks is not configured. Missing: ${status.missing.join(', ')}.`,
    );
  }

  const res = await fetch(`${cfg.host}/api/2.0/sql/statements`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${cfg.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      warehouse_id: cfg.warehouseId,
      catalog: cfg.catalog,
      schema: cfg.schema,
      statement: query,
      wait_timeout: '30s',
      disposition: 'INLINE',
      format: 'JSON_ARRAY',
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Databricks API ${res.status}: ${text}`);
  }

  let data = (await res.json()) as StatementResponse;
  let state = data.status?.state;

  let attempts = 0;
  while (
    (state === 'PENDING' || state === 'RUNNING') &&
    data.statement_id &&
    attempts < 20
  ) {
    await new Promise((r) => setTimeout(r, 1000));
    const poll = await fetch(
      `${cfg.host}/api/2.0/sql/statements/${data.statement_id}`,
      { headers: { Authorization: `Bearer ${cfg.token}` } },
    );
    data = (await poll.json()) as StatementResponse;
    state = data.status?.state;
    attempts += 1;
  }

  if (state === 'FAILED') {
    throw new Error(data.status?.error?.message || 'Databricks query failed');
  }

  return data;
}

function escapeSqlLiteral(value: string): string {
  return value.replace(/'/g, "''");
}

export async function searchAccounts(
  query: string,
  limit = 10,
): Promise<SalesforceAccount[]> {
  const cfg = getConfig();
  if (!cfg) return [];

  const q = escapeSqlLiteral(query.trim().toLowerCase());
  if (q.length < 2) return [];

  const sql = `
    SELECT Id, Name, Website, Industry, Type, BillingCountry
    FROM \`${cfg.catalog}\`.\`${cfg.schema}\`.account
    WHERE lower(Name) LIKE '%${q}%'
    ORDER BY
      CASE WHEN Type = 'Customer' THEN 0 ELSE 1 END,
      Name
    LIMIT ${Math.min(Math.max(limit, 1), 25)}
  `;

  const data = await executeSql(sql);
  const rows = data.result?.data_array || [];

  return rows.map((row) => ({
    id: row[0] || '',
    name: row[1] || '',
    website: row[2],
    industry: row[3],
    type: row[4],
    billingCountry: row[5],
  }));
}
