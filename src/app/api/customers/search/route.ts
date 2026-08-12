import { NextRequest, NextResponse } from 'next/server';
import {
  databricksConfigStatus,
  isDatabricksConfigured,
  isDatabricksFeatureEnabled,
  searchAccounts,
} from '@/lib/databricks';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q') || '';
  const status = databricksConfigStatus();
  const enabled = isDatabricksFeatureEnabled();
  const configured = isDatabricksConfigured();

  if (!enabled) {
    return NextResponse.json({
      enabled: false,
      configured: false,
      accounts: [],
      resolved: status.resolved,
    });
  }

  if (!configured) {
    return NextResponse.json({
      enabled: true,
      configured: false,
      accounts: [],
      missing: status.missing,
      resolved: status.resolved,
      message:
        'Databricks is enabled but not fully configured. Set DATABRICKS_HOST or DATABRICKS_SERVER_HOSTNAME, DATABRICKS_TOKEN, and DATABRICKS_WAREHOUSE_ID or DATABRICKS_HTTP_PATH in .env.local, then restart `npm run dev`.',
    });
  }

  if (q.trim().length < 2) {
    return NextResponse.json({
      enabled: true,
      configured: true,
      accounts: [],
      resolved: status.resolved,
    });
  }

  try {
    const accounts = await searchAccounts(q);
    return NextResponse.json({
      enabled: true,
      configured: true,
      accounts,
      resolved: status.resolved,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Databricks search failed';
    return NextResponse.json(
      {
        enabled: true,
        configured: true,
        accounts: [],
        error: message,
        resolved: status.resolved,
      },
      { status: 502 },
    );
  }
}
