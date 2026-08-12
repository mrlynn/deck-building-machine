'use client';

import { useMemo, useState } from 'react';
import {
  Box,
  Chip,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined';
import SearchIcon from '@mui/icons-material/Search';
import {
  assessPackProgress,
  packLogoSrc,
  type PackProgressId,
} from '@/lib/pack-progress';
import type { RecentBrandEntry } from '@/lib/recent-brands';
import { formatRelativeTime } from '@/lib/relative-time';
import { layoutTokens } from '@/theme/tokens';

type Props = {
  entries: RecentBrandEntry[];
  onSelect: (entry: RecentBrandEntry) => void;
  onRemove: (id: string) => void;
  /** Show search even with few entries (default: when 3+). */
  alwaysShowSearch?: boolean;
  emptyHint?: string;
};

function progressChipTone(
  stage: PackProgressId,
): 'success' | 'default' | 'warning' {
  if (stage === 'downloaded' || stage === 'ready') return 'success';
  if (stage === 'brand') return 'warning';
  return 'default';
}

function matchesQuery(entry: RecentBrandEntry, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const { brand } = entry;
  const hay = [
    brand.customerName,
    brand.customerSlug,
    brand.website,
    brand.displayName,
    brand.industry,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  return hay.includes(q);
}

/**
 * ChatGTM Skills-style account library: search + card grid with status chips.
 */
export function AccountLibrary({
  entries,
  onSelect,
  onRemove,
  alwaysShowSearch = false,
  emptyHint = 'Brand packs show up here as you encode and download. Package a leave-behind from the sidebar to start.',
}: Props) {
  const [query, setQuery] = useState('');
  const showSearch = alwaysShowSearch || entries.length >= 3;

  const filtered = useMemo(
    () => entries.filter((e) => matchesQuery(e, query)),
    [entries, query],
  );

  if (entries.length === 0) {
    return (
      <Box
        sx={{
          borderRadius: 3,
          bgcolor: layoutTokens.cardBg,
          px: 2.5,
          py: 3,
        }}
      >
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
          {emptyHint}
        </Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={2}>
      {showSearch ? (
        <TextField
          size="small"
          fullWidth
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search accounts..."
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 999,
              bgcolor: layoutTokens.cardBg,
              '& fieldset': { borderColor: 'transparent' },
              '&:hover fieldset': { borderColor: layoutTokens.border },
              '&.Mui-focused fieldset': {
                borderColor: layoutTokens.border,
              },
            },
          }}
        />
      ) : null}

      {filtered.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ px: 0.5 }}>
          No accounts match “{query.trim()}”.
        </Typography>
      ) : (
        <Grid container spacing={1.5}>
          {filtered.map((entry) => {
            const progress = assessPackProgress(entry.brand, {
              downloaded: entry.downloaded,
              logosOmitted: entry.logosOmitted,
            });
            const logoSrc = packLogoSrc(entry.brand);
            const blurb =
              entry.brand.website?.trim() ||
              entry.brand.industry?.trim() ||
              entry.brand.customerSlug;

            return (
              <Grid key={entry.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <Box
                  sx={{
                    height: '100%',
                    borderRadius: 3,
                    bgcolor: layoutTokens.cardBg,
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    position: 'relative',
                    transition: 'background-color 120ms ease',
                    '&:hover': { bgcolor: layoutTokens.active },
                  }}
                >
                  <Box
                    component="button"
                    type="button"
                    onClick={() => onSelect(entry)}
                    sx={{
                      all: 'unset',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1,
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={1.25}
                      sx={{ alignItems: 'flex-start' }}
                    >
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: 1.5,
                          flexShrink: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: '#fff',
                          border: `1px solid ${layoutTokens.border}`,
                          overflow: 'hidden',
                        }}
                      >
                        {logoSrc ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={logoSrc}
                            alt=""
                            width={28}
                            height={28}
                            style={{ objectFit: 'contain', display: 'block' }}
                          />
                        ) : (
                          <Box
                            sx={{
                              width: 14,
                              height: 14,
                              borderRadius: '50%',
                              bgcolor:
                                entry.brand.primaryColor || layoutTokens.border,
                            }}
                          />
                        )}
                      </Box>
                      <Box sx={{ minWidth: 0, flex: 1, pr: 3 }}>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 700, lineHeight: 1.3 }}
                          noWrap
                        >
                          {entry.brand.customerName}
                        </Typography>
                        <Chip
                          size="small"
                          label={progress.label}
                          color={progressChipTone(progress.stage)}
                          variant="outlined"
                          sx={{
                            mt: 0.75,
                            height: 22,
                            fontSize: 11,
                            fontWeight: 600,
                            bgcolor: '#fff',
                          }}
                        />
                      </Box>
                    </Stack>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: 1.45,
                        minHeight: '2.9em',
                      }}
                    >
                      {blurb}
                    </Typography>

                    <Tooltip title={progress.detail}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mt: 'auto', pt: 0.5 }}
                      >
                        {formatRelativeTime(entry.savedAt)}
                        {entry.logosOmitted ? ' · logos not stored' : ''}
                      </Typography>
                    </Tooltip>
                  </Box>

                  <IconButton
                    size="small"
                    aria-label={`Remove ${entry.brand.customerName}`}
                    onClick={() => onRemove(entry.id)}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      color: 'text.secondary',
                    }}
                  >
                    <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Stack>
  );
}
