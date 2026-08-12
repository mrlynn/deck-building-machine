import { NextResponse } from 'next/server';
import { getBrandfetchClientId, isBrandfetchConfigured } from '@/lib/brandfetch';

/** Probe whether Brand API (server) and Search (client id) are available. */
export async function GET() {
  const brandApi = isBrandfetchConfigured();
  const clientId = getBrandfetchClientId();
  return NextResponse.json({
    brandApi,
    search: Boolean(clientId),
    /** Safe to expose — Brandfetch Search requires browser-direct clientId. */
    clientId: clientId || null,
  });
}
