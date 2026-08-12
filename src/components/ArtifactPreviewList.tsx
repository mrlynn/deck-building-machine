'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  ButtonBase,
  Chip,
  CircularProgress,
  Collapse,
  Stack,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  annotationForPath,
  previewArtifactPaths,
} from '@/content/teachable-moments';
import type { BrandPack } from '@/lib/types';
import { layoutTokens } from '@/theme/tokens';

type PreviewFile = {
  path: string;
  content: string;
  truncated: boolean;
  totalChars: number;
};

type ArtifactPreviewListProps = {
  brand: BrandPack;
  /** When false, skip fetching (e.g. wizard step not visible). */
  active: boolean;
  /**
   * When set (e.g. from Factory outputs toggle), expand and emphasize this zip path
   * so ADMs see the matching exporter / skill for the format they are previewing.
   */
  highlightPath?: string | null;
};

export function ArtifactPreviewList({
  brand,
  active,
  highlightPath = null,
}: ArtifactPreviewListProps) {
  const slug = brand.customerSlug || 'customer';
  const paths = useMemo(() => previewArtifactPaths(slug), [slug]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filesByPath, setFilesByPath] = useState<Record<string, PreviewFile>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchedKey, setFetchedKey] = useState<string | null>(null);

  const brandKey = useMemo(
    () =>
      JSON.stringify({
        customerName: brand.customerName,
        customerSlug: brand.customerSlug,
        primaryColor: brand.primaryColor,
        darkColor: brand.darkColor,
        grayColor: brand.grayColor,
        lightGrayColor: brand.lightGrayColor,
        midGrayColor: brand.midGrayColor,
        whiteColor: brand.whiteColor,
        accentColor: brand.accentColor,
        fontStack: brand.fontStack,
        voiceSummary: brand.voiceSummary,
        wordsToAvoid: brand.wordsToAvoid,
        defaultAudience: brand.defaultAudience,
        presenterHint: brand.presenterHint,
        layoutStyle: brand.layoutStyle,
        displayName: brand.displayName,
        website: brand.website,
        industry: brand.industry,
      }),
    [brand],
  );

  const loadPreview = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/generate/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand: {
            ...brand,
            logoOnDarkBase64: undefined,
            logoOnLightBase64: undefined,
          },
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Preview failed (${res.status})`);
      }
      const data = (await res.json()) as { files: PreviewFile[] };
      const map: Record<string, PreviewFile> = {};
      for (const f of data.files) {
        map[f.path] = f;
      }
      setFilesByPath(map);
      setFetchedKey(brandKey);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Preview failed');
      setFilesByPath({});
      setFetchedKey(null);
    } finally {
      setLoading(false);
    }
  }, [brand, brandKey]);

  useEffect(() => {
    if (!active) return;
    if (fetchedKey === brandKey) return;
    void loadPreview();
  }, [active, brandKey, fetchedKey, loadPreview]);

  useEffect(() => {
    if (!active || !highlightPath) return;
    if (!paths.includes(highlightPath)) return;
    setExpanded(highlightPath);
  }, [active, highlightPath, paths]);

  function toggle(path: string) {
    setExpanded((prev) => (prev === path ? null : path));
  }

  return (
    <Stack spacing={1}>
      {loading && (
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', py: 0.5 }}>
          <CircularProgress size={14} />
          <Typography variant="caption" color="text.secondary">
            Rendering branded file contents…
          </Typography>
        </Stack>
      )}
      {error && (
        <Alert
          severity="warning"
          action={
            <ButtonBase
              onClick={() => void loadPreview()}
              sx={{ fontSize: 12, px: 1, fontWeight: 600 }}
            >
              Retry
            </ButtonBase>
          }
        >
          {error}
        </Alert>
      )}
      {paths.map((path) => {
        const ann = annotationForPath(path, slug);
        const file = filesByPath[path];
        const isOpen = expanded === path;
        const isHighlight = Boolean(highlightPath && path === highlightPath);
        return (
          <Box
            key={path}
            data-highlight={isHighlight ? 'true' : undefined}
            sx={{
              borderRadius: 1.5,
              border: `1px solid ${
                isHighlight ? layoutTokens.text : layoutTokens.border
              }`,
              bgcolor: isHighlight ? layoutTokens.active : layoutTokens.bg,
              overflow: 'hidden',
              boxShadow: isHighlight ? `0 0 0 1px ${layoutTokens.text}` : 'none',
            }}
          >
            <ButtonBase
              onClick={() => toggle(path)}
              aria-expanded={isOpen}
              sx={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                px: 1.5,
                py: 1,
                '&:hover': { bgcolor: layoutTokens.hover },
              }}
            >
              <Stack
                direction="row"
                spacing={1}
                sx={{ alignItems: 'center', flexWrap: 'wrap', mb: ann ? 0.25 : 0 }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: 'monospace',
                    fontSize: 12,
                    flex: 1,
                    minWidth: 0,
                    wordBreak: 'break-all',
                  }}
                >
                  {path}
                </Typography>
                {ann && (
                  <Chip
                    size="small"
                    label={ann.primitive}
                    sx={{ height: 22, fontSize: 11, fontWeight: 600 }}
                  />
                )}
                <ExpandMoreIcon
                  fontSize="small"
                  sx={{
                    color: 'text.secondary',
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.15s ease',
                  }}
                />
              </Stack>
              {ann && (
                <Typography variant="caption" color="text.secondary" component="div">
                  {ann.teaches}
                </Typography>
              )}
            </ButtonBase>

            <Collapse in={isOpen} timeout="auto" unmountOnExit>
              <Box
                sx={{
                  borderTop: `1px solid ${layoutTokens.border}`,
                  px: 1.5,
                  py: 1.25,
                  bgcolor: layoutTokens.sidebarBg,
                }}
              >
                {ann && (
                  <Stack spacing={1} sx={{ mb: 1.25 }}>
                    <Typography variant="body2" color="text.primary" sx={{ lineHeight: 1.5 }}>
                      {ann.explanation}
                    </Typography>
                    <Box
                      sx={{
                        borderLeft: `3px solid ${layoutTokens.accent}`,
                        pl: 1.25,
                        py: 0.25,
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
                          mb: 0.35,
                        }}
                      >
                        Demo tip
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.45 }}>
                        {ann.demoTip}
                      </Typography>
                    </Box>
                  </Stack>
                )}

                {!file && !loading && (
                  <Typography variant="caption" color="text.secondary">
                    Content not available yet.
                  </Typography>
                )}

                {file && (
                  <Box>
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 0.75 }}
                    >
                      <Typography
                        className="mono"
                        sx={{
                          fontSize: 10,
                          fontWeight: 700,
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                          color: 'text.secondary',
                        }}
                      >
                        Generated contents
                      </Typography>
                      {file.truncated && (
                        <Typography variant="caption" color="text.secondary">
                          Preview truncated
                        </Typography>
                      )}
                    </Stack>
                    <Box
                      component="pre"
                      sx={{
                        m: 0,
                        p: 1.25,
                        maxHeight: 320,
                        overflow: 'auto',
                        borderRadius: 1,
                        border: `1px solid ${layoutTokens.border}`,
                        bgcolor: '#1D1D1B',
                        color: '#F2F2F2',
                        fontFamily:
                          'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                        fontSize: 11,
                        lineHeight: 1.45,
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                      }}
                    >
                      {file.content}
                    </Box>
                  </Box>
                )}
              </Box>
            </Collapse>
          </Box>
        );
      })}
    </Stack>
  );
}
