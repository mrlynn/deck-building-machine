'use client';

import { Box, Stack, Typography } from '@mui/material';
import {
  layoutStyleList,
  type LayoutStyleId,
} from '@/lib/layouts';
import { layoutTokens } from '@/theme/tokens';

type LayoutStylePickerProps = {
  value: LayoutStyleId;
  onChange: (id: LayoutStyleId) => void;
  /** When true, omit the built-in heading (parent provides one) */
  hideTitle?: boolean;
  /** Optional override for the explanatory caption under the title */
  teachableCaption?: string;
};

const DEFAULT_LAYOUT_CAPTION =
  'Chooses how the generated PPTX exporter frames title, content, and metrics slides. The same choice is written into brand rules so agents prefer a matching slide mix.';

export function LayoutStylePicker({
  value,
  onChange,
  hideTitle = false,
  teachableCaption,
}: LayoutStylePickerProps) {
  const caption = teachableCaption ?? DEFAULT_LAYOUT_CAPTION;
  return (
    <Box>
      {!hideTitle && (
        <>
          <Typography variant="subtitle2" gutterBottom>
            Deck layout style
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, maxWidth: 560 }}>
            {caption}
          </Typography>
        </>
      )}
      {hideTitle && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, maxWidth: 560 }}>
          {caption}
        </Typography>
      )}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.25}>
        {layoutStyleList().map((style) => {
          const selected = style.id === value;
          return (
            <Box
              key={style.id}
              component="button"
              type="button"
              onClick={() => onChange(style.id)}
              sx={{
                flex: 1,
                textAlign: 'left',
                cursor: 'pointer',
                borderRadius: 2,
                border: `1.5px solid ${selected ? layoutTokens.text : layoutTokens.border}`,
                bgcolor: selected ? layoutTokens.active : '#fff',
                p: 1.5,
                transition: 'border-color 120ms ease, background-color 120ms ease',
                '&:hover': {
                  borderColor: layoutTokens.text,
                  bgcolor: layoutTokens.hover,
                },
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
                  mb: 0.5,
                }}
              >
                {style.label}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5, color: 'text.primary' }}>
                {style.tagline}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                {style.description}
              </Typography>
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
}
