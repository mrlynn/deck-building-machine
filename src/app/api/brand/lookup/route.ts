import { NextRequest, NextResponse } from 'next/server';
import {
  isBrandfetchConfigured,
  lookupBrandPrefill,
  normalizeDomain,
} from '@/lib/brandfetch';

export async function GET(req: NextRequest) {
  if (!isBrandfetchConfigured()) {
    return NextResponse.json(
      {
        configured: false,
        error:
          'Brandfetch not configured. Set BRANDFETCH_API_KEY in .env.local and restart the dev server.',
      },
      { status: 503 },
    );
  }

  const domainParam = req.nextUrl.searchParams.get('domain') || '';
  const domain = normalizeDomain(domainParam);
  if (!domain) {
    return NextResponse.json(
      { configured: true, error: 'Pass a valid domain, e.g. ?domain=stripe.com' },
      { status: 400 },
    );
  }

  try {
    const prefill = await lookupBrandPrefill(domain);
    return NextResponse.json({ configured: true, prefill });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Brand lookup failed';
    const status = message.includes('No Brandfetch entry')
      ? 404
      : message.includes('quota')
        ? 429
        : message.includes('unauthorized')
          ? 401
          : 502;
    return NextResponse.json({ configured: true, error: message }, { status });
  }
}

export async function POST(req: NextRequest) {
  if (!isBrandfetchConfigured()) {
    return NextResponse.json(
      {
        configured: false,
        error:
          'Brandfetch not configured. Set BRANDFETCH_API_KEY in .env.local and restart the dev server.',
      },
      { status: 503 },
    );
  }

  let body: { domain?: string } = {};
  try {
    body = (await req.json()) as { domain?: string };
  } catch {
    return NextResponse.json({ configured: true, error: 'Invalid JSON body' }, { status: 400 });
  }

  const domain = normalizeDomain(body.domain || '');
  if (!domain) {
    return NextResponse.json(
      { configured: true, error: 'Pass a valid domain in the request body' },
      { status: 400 },
    );
  }

  try {
    const prefill = await lookupBrandPrefill(domain);
    return NextResponse.json({ configured: true, prefill });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Brand lookup failed';
    const status = message.includes('No Brandfetch entry')
      ? 404
      : message.includes('quota')
        ? 429
        : message.includes('unauthorized')
          ? 401
          : 502;
    return NextResponse.json({ configured: true, error: message }, { status });
  }
}
