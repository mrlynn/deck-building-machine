import { NextRequest, NextResponse } from 'next/server';
import { zipDeckMachine } from '@/lib/generator';
import type { BrandPack } from '@/lib/types';
import { slugify } from '@/lib/types';
import { resolveLayoutStyle } from '@/lib/layouts';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { brand?: BrandPack };
    const brand = body.brand;
    if (!brand?.customerName?.trim()) {
      return NextResponse.json({ error: 'customerName is required' }, { status: 400 });
    }
    if (!brand.primaryColor || !brand.darkColor) {
      return NextResponse.json({ error: 'primaryColor and darkColor are required' }, { status: 400 });
    }

    const pack: BrandPack = {
      ...brand,
      customerSlug: brand.customerSlug || slugify(brand.customerName),
      layoutStyle: resolveLayoutStyle(brand.layoutStyle),
    };

    const buffer = await zipDeckMachine(pack);
    const filename = `${pack.customerSlug}-deck-machine.zip`;

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Generate failed';
    console.error(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
