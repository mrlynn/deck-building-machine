'use client';

import { useCallback, useState } from 'react';
import { Box, Button, Collapse, Stack, Typography } from '@mui/material';
import PlayCircleOutlinedIcon from '@mui/icons-material/PlayCircleOutlined';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { publicAssetUrl } from '@/components/CursorLogo';
import { PrimitivesVideo } from '@/components/PrimitivesVideo';
import {
  PRIMITIVES_STRIP_COLLAPSE_LABEL,
  PRIMITIVES_STRIP_EXPAND_LABEL,
  PRIMITIVES_STRIP_SUBTITLE,
  PRIMITIVES_STRIP_TITLE,
  PRIMITIVES_VIDEO_POSTER_PATH,
} from '@/content/primitives-video';
import { layoutTokens } from '@/theme/tokens';

/**
 * Collapsed-by-default overview for return visitors (survives welcome dismiss).
 * Expands inline under the Wizard hero primitive strip.
 */
export function PrimitivesVideoStrip() {
  const [expanded, setExpanded] = useState(false);
  const poster = publicAssetUrl(PRIMITIVES_VIDEO_POSTER_PATH);

  const toggle = useCallback(() => {
    setExpanded((v) => !v);
  }, []);

  return (
    <Box
      sx={{
        borderRadius: 2,
        border: `1px solid ${layoutTokens.border}`,
        bgcolor: '#fff',
        overflow: 'hidden',
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1.5}
        sx={{
          p: 1.5,
          alignItems: { xs: 'stretch', sm: 'center' },
        }}
      >
        <Box
          component="button"
          type="button"
          onClick={toggle}
          aria-expanded={expanded}
          aria-label={expanded ? PRIMITIVES_STRIP_COLLAPSE_LABEL : PRIMITIVES_STRIP_EXPAND_LABEL}
          sx={{
            width: { xs: '100%', sm: 120 },
            flexShrink: 0,
            borderRadius: 1.5,
            overflow: 'hidden',
            border: `1px solid ${layoutTokens.border}`,
            aspectRatio: '16 / 9',
            bgcolor: '#14120B',
            position: 'relative',
            p: 0,
            cursor: 'pointer',
            font: 'inherit',
            '&:hover': { opacity: 0.92 },
          }}
        >
          <Box
            component="img"
            src={poster}
            alt=""
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              opacity: 0.9,
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
            }}
          >
            {expanded ? (
              <ExpandLessIcon sx={{ fontSize: 28, opacity: 0.9 }} />
            ) : (
              <PlayCircleOutlinedIcon sx={{ fontSize: 32, opacity: 0.95 }} />
            )}
          </Box>
        </Box>

        <Stack spacing={0.35} sx={{ flex: 1, minWidth: 0, justifyContent: 'center' }}>
          <Typography
            sx={{
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              fontWeight: 600,
              fontSize: 14,
              letterSpacing: '-0.01em',
            }}
          >
            {PRIMITIVES_STRIP_TITLE}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.45 }}>
            {PRIMITIVES_STRIP_SUBTITLE}
          </Typography>
        </Stack>

        <Button
          size="small"
          variant={expanded ? 'outlined' : 'contained'}
          color="inherit"
          onClick={toggle}
          sx={{
            flexShrink: 0,
            alignSelf: { xs: 'flex-start', sm: 'center' },
            ...(expanded
              ? {}
              : {
                  bgcolor: layoutTokens.text,
                  color: '#fff',
                  '&:hover': { bgcolor: '#000' },
                }),
          }}
        >
          {expanded ? PRIMITIVES_STRIP_COLLAPSE_LABEL : PRIMITIVES_STRIP_EXPAND_LABEL}
        </Button>
      </Stack>

      <Collapse in={expanded} unmountOnExit={false}>
        <Box sx={{ px: 1.5, pb: 1.5, pt: 0 }}>
          <PrimitivesVideo autoPlay={false} active={expanded} showChapters />
        </Box>
      </Collapse>
    </Box>
  );
}
