'use client';

import { Box, Stack, Typography } from '@mui/material';
import type { BrandPack } from '@/lib/types';
import {
  LAYOUT_STYLES,
  resolveLayoutStyle,
  type LayoutStyleId,
} from '@/lib/layouts';
import { layoutTokens } from '@/theme/tokens';

type PreviewKind = 'title' | 'content' | 'metrics' | 'chart';

type DeckPreviewProps = {
  brand: BrandPack;
  /** Which mini-slides to show (default: all four) */
  slides?: PreviewKind[];
  /** Heading above the mini-slides (default: Layout preview) */
  title?: string;
};

function SlideFrame({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <Box
      sx={{
        flex: { xs: '1 1 100%', sm: '1 1 160px' },
        minWidth: { xs: 0, sm: 140 },
        maxWidth: { xs: '100%', sm: 280 },
      }}
    >
      <Typography
        className="mono"
        sx={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: 'text.secondary',
          mb: 0.75,
        }}
      >
        {label}
      </Typography>
      <Box
        sx={{
          aspectRatio: '13.33 / 7.5',
          borderRadius: 1.5,
          overflow: 'hidden',
          border: `1px solid ${layoutTokens.border}`,
          boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
          position: 'relative',
          bgcolor: '#fff',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

function TitleSlide({
  brand,
  layout,
}: {
  brand: BrandPack;
  layout: LayoutStyleId;
}) {
  const name = brand.customerName || 'Customer';
  const primary = brand.primaryColor;
  const dark = brand.darkColor;
  const white = brand.whiteColor || '#FFFFFF';
  const gray = brand.grayColor;
  const logoSrc =
    layout === 'minimal' ? brand.logoOnLightBase64 : brand.logoOnDarkBase64;

  const logoEl = logoSrc ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={logoSrc}
      alt=""
      style={{
        position: 'absolute',
        right: '5%',
        bottom: '8%',
        width: 14,
        height: 14,
        objectFit: 'contain',
      }}
    />
  ) : null;

  if (layout === 'minimal') {
    return (
      <Box sx={{ width: '100%', height: '100%', bgcolor: white, position: 'relative', p: '6%' }}>
        <Box sx={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '2.2%', bgcolor: primary }} />
        <Typography sx={{ fontSize: '11px', fontWeight: 600, color: dark, mt: '18%', lineHeight: 1.2 }}>
          {name} Q3 Strategy
        </Typography>
        <Typography sx={{ fontSize: '6px', color: gray, mt: 0.75 }}>
          Leadership update
        </Typography>
        {logoEl}
      </Box>
    );
  }

  if (layout === 'bold') {
    return (
      <Box sx={{ width: '100%', height: '100%', bgcolor: dark, position: 'relative', p: '6%' }}>
        <Box sx={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '9%', bgcolor: primary }} />
        <Typography sx={{ fontSize: '11px', fontWeight: 600, color: white, mt: '16%', lineHeight: 1.2 }}>
          {name} Q3 Strategy
        </Typography>
        <Typography sx={{ fontSize: '6px', color: white, opacity: 0.75, mt: 0.75 }}>
          Leadership update
        </Typography>
        {logoEl}
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', height: '100%', bgcolor: primary, position: 'relative', p: '6%' }}>
      <Typography sx={{ fontSize: '5px', color: white, opacity: 0.75, mb: 0.5 }}>
        Title slide
      </Typography>
      <Typography sx={{ fontSize: '11px', fontWeight: 600, color: white, mt: '12%', lineHeight: 1.2 }}>
        {name} Q3 Strategy
      </Typography>
      <Typography sx={{ fontSize: '6px', color: white, opacity: 0.8, mt: 0.75 }}>
        Leadership update
      </Typography>
      {logoEl}
    </Box>
  );
}

function ContentSlide({
  brand,
  layout,
}: {
  brand: BrandPack;
  layout: LayoutStyleId;
}) {
  const primary = brand.primaryColor;
  const dark = brand.darkColor;
  const white = brand.whiteColor || '#FFFFFF';
  const bullets = [
    'Load brand rules automatically',
    'Run skills from the / menu',
    'Watch agents build the deck',
  ];

  return (
    <Box sx={{ width: '100%', height: '100%', bgcolor: white, position: 'relative', p: '5% 6%' }}>
      {layout === 'classic' && (
        <Box sx={{ position: 'absolute', left: '6%', right: '6%', top: '8%', height: 2, bgcolor: primary }} />
      )}
      {layout === 'bold' && (
        <>
          <Box sx={{ position: 'absolute', left: '6%', right: '6%', top: '8%', height: 3, bgcolor: primary }} />
          <Box sx={{ position: 'absolute', left: '4%', top: '14%', bottom: '12%', width: 3, bgcolor: primary }} />
        </>
      )}
      {layout === 'minimal' && (
        <Box sx={{ position: 'absolute', left: '4%', top: '14%', bottom: '14%', width: 2, bgcolor: primary }} />
      )}
      <Typography
        sx={{
          fontSize: layout === 'minimal' ? '7.5px' : '7px',
          fontWeight: 600,
          color: dark,
          mt: layout === 'minimal' ? '6%' : '12%',
          mb: 1,
          ml: layout === 'classic' ? 0 : '3%',
          lineHeight: 1.25,
        }}
      >
        Team Cursor usage grew 40% in 90 days
      </Typography>
      <Stack spacing={0.45} sx={{ ml: layout === 'classic' ? 0 : '3%' }}>
        {bullets.map((b) => (
          <Stack key={b} direction="row" spacing={0.5} sx={{ alignItems: 'flex-start' }}>
            {layout !== 'minimal' && (
              <Box
                sx={{
                  width: 4,
                  height: 4,
                  borderRadius: '50%',
                  bgcolor: primary,
                  mt: '2px',
                  flexShrink: 0,
                }}
              />
            )}
            <Typography sx={{ fontSize: '5.5px', color: dark, lineHeight: 1.3 }}>{b}</Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
}

function MetricsSlide({
  brand,
  layout,
}: {
  brand: BrandPack;
  layout: LayoutStyleId;
}) {
  const primary = brand.primaryColor;
  const dark = brand.darkColor;
  const white = brand.whiteColor || '#FFFFFF';
  const lgray = brand.lightGrayColor;
  const metrics = [
    { value: '40%', label: 'Usage growth', delta: '+YoY' },
    { value: '1.3k', label: 'Monthly users', delta: '+40%' },
    { value: '4h', label: 'Review time', delta: '−3d' },
  ];

  return (
    <Box sx={{ width: '100%', height: '100%', bgcolor: white, p: '5% 6%' }}>
      {layout !== 'minimal' && (
        <Box
          sx={{
            width: '100%',
            height: layout === 'bold' ? 3 : 2,
            bgcolor: primary,
            mb: 0.75,
          }}
        />
      )}
      <Typography sx={{ fontSize: '7px', fontWeight: 600, color: dark, mb: 0.75 }}>
        Adoption metrics outpaced the plan
      </Typography>
      <Stack direction="row" spacing={0.5} sx={{ height: '58%' }}>
        {metrics.map((m) => (
          <Box
            key={m.label}
            sx={{
              flex: 1,
              bgcolor: layout === 'minimal' ? white : lgray,
              borderTop: layout === 'minimal' ? `2px solid ${primary}` : undefined,
              borderBottom: layout === 'minimal' ? `1px solid ${layoutTokens.border}` : undefined,
              position: 'relative',
              overflow: 'hidden',
              px: 0.5,
              pt: layout === 'bold' ? 0 : 0.5,
            }}
          >
            {layout === 'bold' && (
              <Box sx={{ bgcolor: dark, mx: -0.5, mt: 0, mb: 0.4, px: 0.5, py: 0.35 }}>
                <Typography sx={{ fontSize: '8px', fontWeight: 700, color: white }}>
                  {m.value}
                </Typography>
              </Box>
            )}
            {layout !== 'bold' && (
              <>
                {layout === 'classic' && (
                  <Box sx={{ position: 'absolute', left: 0, right: 0, top: 0, height: 2, bgcolor: primary }} />
                )}
                <Typography sx={{ fontSize: '9px', fontWeight: 700, color: primary, mt: 0.35 }}>
                  {m.value}
                </Typography>
              </>
            )}
            <Typography sx={{ fontSize: '4.5px', fontWeight: 600, color: dark, mt: 0.25 }}>
              {m.label}
            </Typography>
            <Typography sx={{ fontSize: '4px', fontWeight: 700, color: primary, mt: 0.2 }}>
              {m.delta}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}

function ChartSlide({
  brand,
  layout,
}: {
  brand: BrandPack;
  layout: LayoutStyleId;
}) {
  const primary = brand.primaryColor;
  const dark = brand.darkColor;
  const white = brand.whiteColor || '#FFFFFF';
  const lgray = brand.lightGrayColor || '#F2F2F2';
  const gray = brand.grayColor;
  // Heights as % of the plot area — positioned absolutely so flex % height
  // cannot collapse to an empty silhouette.
  const bars = [
    { label: 'Q1', h: 42 },
    { label: 'Q2', h: 55 },
    { label: 'Q3', h: 68 },
    { label: 'Q4', h: 88 },
  ];
  const gutter = layout === 'classic' ? 0 : '3%';

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        bgcolor: white,
        position: 'relative',
        p: '5% 6%',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
      }}
    >
      {layout === 'classic' && (
        <Box sx={{ position: 'absolute', left: '6%', right: '6%', top: '8%', height: '2px', bgcolor: primary }} />
      )}
      {layout === 'bold' && (
        <Box sx={{ position: 'absolute', left: '6%', right: '6%', top: '8%', height: '3px', bgcolor: primary }} />
      )}
      {layout === 'minimal' && (
        <Box sx={{ position: 'absolute', left: '4%', top: '14%', bottom: '14%', width: '2px', bgcolor: primary }} />
      )}
      <Typography
        sx={{
          fontSize: '6.5px',
          fontWeight: 600,
          color: dark,
          mt: layout === 'minimal' ? '4%' : '10%',
          mb: 0.5,
          ml: gutter,
          lineHeight: 1.25,
          flexShrink: 0,
        }}
      >
        MAU climbed while rollout stayed organic
      </Typography>
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          ml: gutter,
          mt: 0.35,
          mb: 0.15,
          display: 'flex',
          alignItems: 'stretch',
          gap: 0.5,
          borderBottom: `1px solid ${lgray}`,
          px: 0.15,
        }}
      >
        {bars.map((bar, i) => {
          const highlighted = i === bars.length - 1;
          return (
            <Box
              key={bar.label}
              sx={{
                flex: 1,
                position: 'relative',
                minWidth: 0,
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  left: '18%',
                  right: '18%',
                  bottom: 0,
                  height: `${bar.h}%`,
                  minHeight: 6,
                  bgcolor: primary,
                  opacity: highlighted ? 1 : 0.4,
                  borderRadius: '1px 1px 0 0',
                }}
              />
            </Box>
          );
        })}
      </Box>
      <Stack
        direction="row"
        spacing={0.5}
        sx={{ ml: gutter, flexShrink: 0, px: 0.15 }}
      >
        {bars.map((bar, i) => (
          <Typography
            key={bar.label}
            sx={{
              flex: 1,
              fontSize: '3.5px',
              color: i === bars.length - 1 ? primary : gray,
              fontWeight: i === bars.length - 1 ? 700 : 400,
              textAlign: 'center',
              lineHeight: 1.2,
            }}
          >
            {bar.label}
          </Typography>
        ))}
      </Stack>
    </Box>
  );
}

/**
 * Live mini-slide preview driven by brand colors + selected layout style.
 * Mirrors the most visible exporter treatments (title, content, metrics, chart silhouette).
 */
export function DeckPreview({
  brand,
  slides = ['title', 'content', 'metrics', 'chart'],
  title = 'Layout preview',
}: DeckPreviewProps) {
  const layout = resolveLayoutStyle(brand.layoutStyle);
  const meta = LAYOUT_STYLES[layout];

  return (
    <Box>
      <Stack
        direction="row"
        spacing={1}
        sx={{ alignItems: 'baseline', justifyContent: 'space-between', mb: 1.5, flexWrap: 'wrap' }}
      >
        <Typography variant="subtitle2">{title}</Typography>
        <Typography variant="caption" color="text.secondary">
          {meta.label} · updates live with colors
        </Typography>
      </Stack>
      <Stack direction="row" spacing={1.5} sx={{ flexWrap: 'wrap', gap: 1.5 }}>
        {slides.includes('title') && (
          <SlideFrame label="Title">
            <TitleSlide brand={brand} layout={layout} />
          </SlideFrame>
        )}
        {slides.includes('content') && (
          <SlideFrame label="Content">
            <ContentSlide brand={brand} layout={layout} />
          </SlideFrame>
        )}
        {slides.includes('metrics') && (
          <SlideFrame label="Metrics">
            <MetricsSlide brand={brand} layout={layout} />
          </SlideFrame>
        )}
        {slides.includes('chart') && (
          <SlideFrame label="Chart">
            <ChartSlide brand={brand} layout={layout} />
          </SlideFrame>
        )}
      </Stack>
    </Box>
  );
}
