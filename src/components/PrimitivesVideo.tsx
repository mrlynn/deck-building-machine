'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { publicAssetUrl } from '@/components/CursorLogo';
import {
  PRIMITIVES_VIDEO_CAPTION,
  PRIMITIVES_VIDEO_CHAPTERS,
  PRIMITIVES_VIDEO_PATH,
  PRIMITIVES_VIDEO_POSTER_PATH,
  type PrimitivesVideoChapter,
} from '@/content/primitives-video';
import { layoutTokens } from '@/theme/tokens';

type PrimitivesVideoProps = {
  /** Attempt muted autoplay (welcome dialog). User can unmute via controls. */
  autoPlay?: boolean;
  /** When false, pause playback (e.g. dialog closed). */
  active?: boolean;
  caption?: string;
  /** Show Rules / Skills / Agents seek chips under the player. */
  showChapters?: boolean;
};

/**
 * Shared player for the Deck Machine primitives overview.
 * Used by WelcomeDialog, Help (skills-and-rules), and the Wizard strip.
 */
export function PrimitivesVideo({
  autoPlay = false,
  active = true,
  caption = PRIMITIVES_VIDEO_CAPTION,
  showChapters = true,
}: PrimitivesVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [activeChapterId, setActiveChapterId] = useState<string | null>(null);
  const src = publicAssetUrl(PRIMITIVES_VIDEO_PATH);
  const poster = publicAssetUrl(PRIMITIVES_VIDEO_POSTER_PATH);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!active) {
      el.pause();
      return;
    }
    if (autoPlay) {
      el.muted = true;
      void el.play().catch(() => {
        /* Autoplay blocked — controls still work */
      });
    }
  }, [active, autoPlay]);

  const syncChapterFromTime = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const t = el.currentTime;
    let current: PrimitivesVideoChapter | null = null;
    for (const ch of PRIMITIVES_VIDEO_CHAPTERS) {
      if (t >= ch.startSeconds) current = ch;
    }
    setActiveChapterId(current?.id ?? null);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || !showChapters) return;
    el.addEventListener('timeupdate', syncChapterFromTime);
    el.addEventListener('seeked', syncChapterFromTime);
    return () => {
      el.removeEventListener('timeupdate', syncChapterFromTime);
      el.removeEventListener('seeked', syncChapterFromTime);
    };
  }, [showChapters, syncChapterFromTime]);

  const seekToChapter = useCallback((chapter: PrimitivesVideoChapter) => {
    const el = ref.current;
    if (!el) return;
    el.currentTime = chapter.startSeconds;
    setActiveChapterId(chapter.id);
    void el.play().catch(() => {});
  }, []);

  return (
    <Box>
      <Box
        sx={{
          borderRadius: 2,
          overflow: 'hidden',
          border: `1px solid ${layoutTokens.border}`,
          bgcolor: '#14120B',
          aspectRatio: '16 / 9',
          lineHeight: 0,
        }}
      >
        <Box
          component="video"
          ref={ref}
          src={src}
          poster={poster}
          controls
          playsInline
          preload="metadata"
          muted={autoPlay}
          aria-label="Deck Machine primitives overview"
          sx={{
            width: '100%',
            height: '100%',
            display: 'block',
            objectFit: 'contain',
          }}
        />
      </Box>

      {showChapters ? (
        <Stack
          direction="row"
          spacing={1}
          useFlexGap
          sx={{ pt: 1, flexWrap: 'wrap', alignItems: 'center' }}
        >
          <Typography
            className="mono"
            sx={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'text.secondary',
              mr: 0.5,
            }}
          >
            Jump to
          </Typography>
          {PRIMITIVES_VIDEO_CHAPTERS.map((ch) => {
            const selected = activeChapterId === ch.id;
            return (
              <Box
                key={ch.id}
                component="button"
                type="button"
                onClick={() => seekToChapter(ch)}
                title={ch.blurb}
                aria-label={`Jump to ${ch.label} section`}
                aria-pressed={selected}
                sx={{
                  px: 1,
                  py: 0.5,
                  borderRadius: 999,
                  border: `1px solid ${selected ? layoutTokens.text : layoutTokens.border}`,
                  bgcolor: selected ? layoutTokens.text : layoutTokens.pill,
                  fontSize: 11,
                  fontWeight: 600,
                  color: selected ? '#fff' : 'text.secondary',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  '&:hover': {
                    bgcolor: selected ? '#000' : layoutTokens.active,
                    color: selected ? '#fff' : 'text.primary',
                  },
                }}
              >
                {ch.label}
              </Box>
            );
          })}
        </Stack>
      ) : null}

      {caption ? (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: 'block', mt: 0.75, lineHeight: 1.45 }}
        >
          {caption}
        </Typography>
      ) : null}
    </Box>
  );
}
