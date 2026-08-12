import { NextRequest, NextResponse } from 'next/server';
import {
  ARTIFACT_ANNOTATIONS,
  resolveArtifactPath,
} from '@/content/teachable-moments';
import { renderDeckMachine } from '@/lib/generator';
import type { BrandPack } from '@/lib/types';
import { slugify } from '@/lib/types';
import { resolveLayoutStyle } from '@/lib/layouts';

export type ArtifactPreviewFile = {
  path: string;
  content: string;
  truncated: boolean;
  totalChars: number;
};

/** Cap very large artifacts so the UI stays responsive (exporter is the usual case). */
const MAX_PREVIEW_CHARS = 24_000;

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { brand?: BrandPack };
    const brand = body.brand;
    if (!brand?.customerName?.trim()) {
      return NextResponse.json({ error: 'customerName is required' }, { status: 400 });
    }
    if (!brand.primaryColor || !brand.darkColor) {
      return NextResponse.json(
        { error: 'primaryColor and darkColor are required' },
        { status: 400 },
      );
    }

    const pack: BrandPack = {
      ...brand,
      // Logos are not needed for text artifact preview — drop them to keep the request small.
      logoOnDarkBase64: undefined,
      logoOnLightBase64: undefined,
      customerSlug: brand.customerSlug || slugify(brand.customerName),
      layoutStyle: resolveLayoutStyle(brand.layoutStyle),
    };

    const { files } = await renderDeckMachine(pack);
    const slug = pack.customerSlug;

    const previewFiles: ArtifactPreviewFile[] = [];
    for (const ann of ARTIFACT_ANNOTATIONS) {
      const rel = resolveArtifactPath(ann.pathPattern, slug);
      const raw = files[rel];
      if (typeof raw !== 'string') continue;
      const totalChars = raw.length;
      const truncated = totalChars > MAX_PREVIEW_CHARS;
      previewFiles.push({
        path: rel,
        content: truncated
          ? `${raw.slice(0, MAX_PREVIEW_CHARS)}\n\n/* … truncated for preview */`
          : raw,
        truncated,
        totalChars,
      });
    }

    return NextResponse.json({
      files: previewFiles,
      customerSlug: slug,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Preview failed';
    console.error(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
