'use client';

import { useState, type ReactNode } from 'react';
import {
  Box,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import SlideshowOutlinedIcon from '@mui/icons-material/SlideshowOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import type { BrandPack } from '@/lib/types';
import { DeckPreview } from '@/components/DeckPreview';
import { HelpButton } from '@/components/HelpButton';
import {
  FACTORY_OUTPUTS,
  FACTORY_OUTPUTS_INTRO,
  PACKAGE_CONTENTS,
  factoryOutputById,
  type FactoryOutputId,
} from '@/content/factory-outputs';
import { layoutTokens } from '@/theme/tokens';

type FactoryOutputPreviewProps = {
  brand: BrandPack;
  /** Controlled format (lets Wizard sync the artifact list). */
  format?: FactoryOutputId;
  onFormatChange?: (format: FactoryOutputId) => void;
};

function PackageContentsCallout() {
  return (
    <Box
      sx={{
        borderRadius: 1.5,
        border: `1px solid ${layoutTokens.border}`,
        bgcolor: layoutTokens.sidebarBg,
        p: 1.5,
      }}
    >
      <Typography variant="subtitle2" sx={{ mb: 1, fontSize: 13 }}>
        {PACKAGE_CONTENTS.title}
      </Typography>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1.5}
        sx={{ alignItems: 'stretch' }}
      >
        <Box sx={{ flex: 1 }}>
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
            {PACKAGE_CONTENTS.inZipTitle}
          </Typography>
          <Box component="ul" sx={{ m: 0, pl: 2 }}>
            {PACKAGE_CONTENTS.inZip.map((line) => (
              <Typography
                key={line}
                component="li"
                variant="caption"
                color="text.primary"
                sx={{ display: 'list-item', mb: 0.35, lineHeight: 1.4 }}
              >
                {line}
              </Typography>
            ))}
          </Box>
        </Box>
        <Box sx={{ flex: 1 }}>
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
            {PACKAGE_CONTENTS.notInZipTitle}
          </Typography>
          <Box component="ul" sx={{ m: 0, pl: 2 }}>
            {PACKAGE_CONTENTS.notInZip.map((line) => (
              <Typography
                key={line}
                component="li"
                variant="caption"
                color="text.secondary"
                sx={{ display: 'list-item', mb: 0.35, lineHeight: 1.4 }}
              >
                {line}
              </Typography>
            ))}
          </Box>
        </Box>
      </Stack>
    </Box>
  );
}

function DocSilhouette({ brand }: { brand: BrandPack }) {
  const name = brand.customerName || 'Customer';
  const primary = brand.primaryColor;
  const dark = brand.darkColor;
  const gray = brand.grayColor;
  const lgray = brand.lightGrayColor || '#F2F2F2';
  const white = brand.whiteColor || '#FFFFFF';
  const font = brand.fontStack?.split(',')[0]?.trim() || 'Arial';
  const voice =
    brand.voiceSummary?.trim().slice(0, 120) ||
    'Clear, confident voice from brand rules';

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 420,
        mx: 'auto',
        aspectRatio: '8.5 / 11',
        bgcolor: white,
        borderRadius: 1.5,
        border: `1px solid ${layoutTokens.border}`,
        boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
        p: 2.5,
        display: 'flex',
        flexDirection: 'column',
        gap: 1.25,
        fontFamily: font,
      }}
    >
      <Box sx={{ borderBottom: `3px solid ${primary}`, pb: 1 }}>
        <Typography sx={{ fontSize: 16, fontWeight: 600, color: dark, lineHeight: 1.25 }}>
          {name} narrative leave-behind
        </Typography>
        <Typography sx={{ fontSize: 10, color: gray, mt: 0.5 }}>
          /build-doc · same voice rules as the deck
        </Typography>
      </Box>
      <Typography sx={{ fontSize: 11, fontWeight: 700, color: primary }}>
        Executive summary
      </Typography>
      <Typography sx={{ fontSize: 10, color: dark, lineHeight: 1.45, opacity: 0.9 }}>
        {voice}
        {brand.voiceSummary && brand.voiceSummary.length > 120 ? '…' : ''}
      </Typography>
      <Typography sx={{ fontSize: 11, fontWeight: 700, color: primary, mt: 0.5 }}>
        Key points
      </Typography>
      {[0, 1, 2].map((i) => (
        <Stack key={i} direction="row" spacing={1} sx={{ alignItems: 'flex-start' }}>
          <Box
            sx={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              bgcolor: primary,
              mt: 0.45,
              flexShrink: 0,
            }}
          />
          <Box sx={{ flex: 1 }}>
            <Box
              sx={{
                height: 7,
                bgcolor: dark,
                opacity: 0.85,
                borderRadius: 0.5,
                width: `${88 - i * 8}%`,
                mb: 0.4,
              }}
            />
            <Box
              sx={{
                height: 6,
                bgcolor: lgray,
                borderRadius: 0.5,
                width: `${70 - i * 6}%`,
              }}
            />
          </Box>
        </Stack>
      ))}
      <Box sx={{ mt: 'auto', pt: 1, borderTop: `1px solid ${lgray}` }}>
        <Typography sx={{ fontSize: 9, color: gray }}>
          Silhouette only — customer runs /build-doc in Cursor → output/&lt;title&gt;.docx
        </Typography>
      </Box>
    </Box>
  );
}

function WorkbookSilhouette({ brand }: { brand: BrandPack }) {
  const name = brand.customerName || 'Customer';
  const primary = brand.primaryColor;
  const dark = brand.darkColor;
  const gray = brand.grayColor;
  const lgray = brand.lightGrayColor || '#F2F2F2';
  const white = brand.whiteColor || '#FFFFFF';
  const font = brand.fontStack?.split(',')[0]?.trim() || 'Arial';

  const tabs = ['Cover', 'Metrics', 'Chart 1'];

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 520,
        mx: 'auto',
        borderRadius: 1.5,
        border: `1px solid ${layoutTokens.border}`,
        boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
        overflow: 'hidden',
        bgcolor: white,
        fontFamily: font,
      }}
    >
      <Stack
        direction="row"
        spacing={0}
        sx={{
          bgcolor: lgray,
          borderBottom: `1px solid ${layoutTokens.border}`,
          px: 1,
          pt: 0.75,
        }}
      >
        {tabs.map((tab, i) => (
          <Box
            key={tab}
            sx={{
              px: 1.5,
              py: 0.75,
              fontSize: 11,
              fontWeight: i === 0 ? 700 : 500,
              color: i === 0 ? white : gray,
              bgcolor: i === 0 ? primary : 'transparent',
              borderRadius: '6px 6px 0 0',
              mr: 0.5,
            }}
          >
            {tab}
          </Box>
        ))}
      </Stack>
      <Box sx={{ p: 2 }}>
        <Typography
          sx={{
            fontSize: 15,
            fontWeight: 600,
            color: dark,
            borderBottom: `2px solid ${primary}`,
            pb: 1,
            mb: 1.5,
          }}
        >
          {name} metrics pack
        </Typography>
        <Stack spacing={1}>
          {[
            ['Audience', brand.defaultAudience || 'Leadership review'],
            ['Source', 'deck-content.json chart / metrics slides'],
            ['Skill', '/export-metrics-xlsx'],
          ].map(([k, v]) => (
            <Stack key={k} direction="row" spacing={2}>
              <Typography sx={{ fontSize: 11, fontWeight: 700, color: primary, width: 72 }}>
                {k}
              </Typography>
              <Typography sx={{ fontSize: 11, color: dark }}>{v}</Typography>
            </Stack>
          ))}
        </Stack>
        <Box
          sx={{
            mt: 2,
            border: `1px solid ${layoutTokens.border}`,
            borderRadius: 1,
            overflow: 'hidden',
          }}
        >
          <Stack direction="row" sx={{ bgcolor: primary, color: white, px: 1, py: 0.75 }}>
            {['Slide', 'Value', 'Label'].map((h) => (
              <Typography key={h} sx={{ flex: 1, fontSize: 10, fontWeight: 700 }}>
                {h}
              </Typography>
            ))}
          </Stack>
          {[
            ['4', 'Minutes', 'Deck Machine'],
            ['4', 'Days–weeks', 'Manual path'],
          ].map((row, i) => (
            <Stack
              key={i}
              direction="row"
              sx={{
                px: 1,
                py: 0.75,
                bgcolor: i % 2 ? lgray : white,
                borderTop: `1px solid ${layoutTokens.border}`,
              }}
            >
              {row.map((cell, j) => (
                <Typography
                  key={j}
                  sx={{
                    flex: 1,
                    fontSize: 11,
                    fontWeight: j === 1 ? 700 : 400,
                    color: j === 1 ? primary : dark,
                  }}
                >
                  {cell}
                </Typography>
              ))}
            </Stack>
          ))}
        </Box>
        <Typography sx={{ fontSize: 9, color: gray, mt: 1.5 }}>
          Silhouette only — customer runs /export-metrics-xlsx after a deck with metrics/chart
          slides
        </Typography>
      </Box>
    </Box>
  );
}

const ICONS: Record<FactoryOutputId, ReactNode> = {
  slides: <SlideshowOutlinedIcon sx={{ fontSize: 16 }} />,
  doc: <DescriptionOutlinedIcon sx={{ fontSize: 16 }} />,
  workbook: <TableChartOutlinedIcon sx={{ fontSize: 16 }} />,
};

/**
 * Download-step preview: one surface, three formats.
 * Avoids crowding by switching views instead of stacking Doc/XLSX beside slides.
 */
export function FactoryOutputPreview({
  brand,
  format: controlledFormat,
  onFormatChange,
}: FactoryOutputPreviewProps) {
  const [internalFormat, setInternalFormat] = useState<FactoryOutputId>('slides');
  const format = controlledFormat ?? internalFormat;
  const setFormat = (next: FactoryOutputId) => {
    if (onFormatChange) onFormatChange(next);
    else setInternalFormat(next);
  };
  const active = factoryOutputById(format);

  return (
    <Box>
      <Stack spacing={1.25} sx={{ mb: 1.5 }}>
        <PackageContentsCallout />

        <Stack
          direction="row"
          spacing={1}
          sx={{ alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap' }}
        >
          <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
            <Typography variant="subtitle2">What the customer can produce</Typography>
            <HelpButton topic="factory-outputs" label="Help: slides, doc, and workbook" />
          </Stack>
          <Typography variant="caption" color="text.secondary" sx={{ maxWidth: 440 }}>
            {FACTORY_OUTPUTS_INTRO}
          </Typography>
        </Stack>

        <ToggleButtonGroup
          exclusive
          size="small"
          value={format}
          onChange={(_, next: FactoryOutputId | null) => {
            if (next) setFormat(next);
          }}
          aria-label="Factory output format"
          sx={{
            flexWrap: 'wrap',
            gap: 0.5,
            '& .MuiToggleButtonGroup-grouped': {
              border: `1px solid ${layoutTokens.border} !important`,
              borderRadius: '8px !important',
              px: 1.5,
              py: 0.75,
              textTransform: 'none',
              bgcolor: '#fff',
            },
            '& .Mui-selected': {
              bgcolor: `${layoutTokens.active} !important`,
              borderColor: `${layoutTokens.text} !important`,
              fontWeight: 700,
            },
          }}
        >
          {FACTORY_OUTPUTS.map((opt) => (
            <ToggleButton key={opt.id} value={opt.id} aria-label={opt.label}>
              <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
                {ICONS[opt.id]}
                <Box component="span">{opt.label}</Box>
                <Box
                  component="span"
                  className="mono"
                  sx={{ fontSize: 10, color: 'text.secondary', letterSpacing: '0.04em' }}
                >
                  {opt.proof}
                </Box>
              </Stack>
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        <Stack spacing={0.35}>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
            <Box component="span" sx={{ fontWeight: 600, color: 'text.primary' }}>
              {active.skill}
            </Box>
            {' — '}
            {active.caption}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
            Customer path:{' '}
            <Box component="span" className="mono" sx={{ color: 'text.primary', fontWeight: 600 }}>
              {active.customerRuns}
            </Box>
          </Typography>
        </Stack>
      </Stack>

      {format === 'slides' && (
        <DeckPreview brand={brand} title="Slides preview (layout style)" />
      )}
      {format === 'doc' && <DocSilhouette brand={brand} />}
      {format === 'workbook' && <WorkbookSilhouette brand={brand} />}
    </Box>
  );
}
