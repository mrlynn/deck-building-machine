import { NextRequest, NextResponse } from 'next/server';
import {
  databricksConfigStatus,
  isDatabricksConfigured,
  searchAccounts,
} from '@/lib/databricks';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q') || '';
  const status = databricksConfigStatus();
  const configured = isDatabricksConfigured();

  if (!configured) {
    return NextResponse.json({
      configured: false,
      accounts: [],
      missing: status.missing,
      resolved: status.resolved,
      message:
        'Databricks not fully configured. Studio accepts DATABRICKS_HOST or DATABRICKS_SERVER_HOSTNAME, DATABRICKS_TOKEN, and DATABRICKS_WAREHOUSE_ID or DATABRICKS_HTTP_PATH. Restart `npm run dev` after editing .env.local.',
    });
  }

  if (q.trim().length < 2) {
    return NextResponse.json({ configured: true, accounts: [], resolved: status.resolved });
  }

  try {
    const accounts = await searchAccounts(q);
    return NextResponse.json({ configured: true, accounts, resolved: status.resolved });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Databricks search failed';
    return NextResponse.json(
      { configured: true, accounts: [], error: message, resolved: status.resolved },
      { status: 502 },
    );
  }
}
