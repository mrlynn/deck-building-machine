'use client';

import {
  Box,
  Button,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlineOutlined';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import RecordVoiceOverOutlinedIcon from '@mui/icons-material/RecordVoiceOverOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import { CursorLogo } from '@/components/CursorLogo';
import {
  assessPackProgress,
  packLogoSrc,
} from '@/lib/pack-progress';
import type { RecentBrandEntry } from '@/lib/recent-brands';
import { formatRelativeTime } from '@/lib/relative-time';
import { layoutTokens } from '@/theme/tokens';

type Props = {
  entries: RecentBrandEntry[];
  activeSlug?: string;
  /** Highlight Home when on studio home */
  homeActive?: boolean;
  onSelect: (entry: RecentBrandEntry) => void;
  onRemove: (id: string) => void;
  onGoHome: () => void;
  onPackage: () => void;
  onOpenRehearse: () => void;
  onOpenTalkTrack: () => void;
  onOpenAssistant: () => void;
  onOpenHelp: () => void;
};

const footerActions = [
  {
    id: 'rehearse',
    label: 'Rehearse',
    icon: <SchoolOutlinedIcon sx={{ fontSize: 18 }} />,
  },
  {
    id: 'talk',
    label: 'Talk track',
    icon: <RecordVoiceOverOutlinedIcon sx={{ fontSize: 18 }} />,
  },
  {
    id: 'assistant',
    label: 'Assistant',
    icon: <SmartToyOutlinedIcon sx={{ fontSize: 18 }} />,
  },
  {
    id: 'help',
    label: 'Help',
    icon: <HelpOutlineOutlinedIcon sx={{ fontSize: 18 }} />,
  },
] as const;

/**
 * ChatGTM-style sidebar chrome: logo, primary CTA, home nav, accounts, footer tools.
 * Hidden on xs; StudioAppBar covers compact viewports.
 */
export function AccountsRail({
  entries,
  activeSlug,
  homeActive,
  onSelect,
  onRemove,
  onGoHome,
  onPackage,
  onOpenRehearse,
  onOpenTalkTrack,
  onOpenAssistant,
  onOpenHelp,
}: Props) {
  const runFooter = (id: (typeof footerActions)[number]['id']) => {
    if (id === 'rehearse') onOpenRehearse();
    else if (id === 'talk') onOpenTalkTrack();
    else if (id === 'assistant') onOpenAssistant();
    else onOpenHelp();
  };

  return (
    <Box
      component="aside"
      sx={{
        display: { xs: 'none', md: 'flex' },
        flexDirection: 'column',
        width: layoutTokens.sidebarWidth,
        flexShrink: 0,
        borderRight: `1px solid ${layoutTokens.border}`,
        bgcolor: layoutTokens.sidebarBg,
        position: 'sticky',
        top: 0,
        alignSelf: 'flex-start',
        height: '100vh',
        zIndex: 1,
      }}
    >
      <Stack
        spacing={2}
        sx={{ px: 1.5, pt: 2, pb: 1.5, flexShrink: 0 }}
      >
        <Box
          onClick={onGoHome}
          role="link"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onGoHome();
            }
          }}
          aria-label="Deck Machine Studio home"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 0.75,
            px: 0.75,
            py: 0.5,
            borderRadius: 1.5,
            cursor: 'pointer',
            '&:hover': { bgcolor: layoutTokens.hover },
          }}
        >
          <CursorLogo variant="on-light" mode="lockup" height={18} />
          <Typography
            sx={{
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              fontSize: 15,
              fontWeight: 700,
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
              color: 'text.primary',
            }}
          >
            Deck Machine
          </Typography>
        </Box>

        <Button
          fullWidth
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={onPackage}
          sx={{
            justifyContent: 'flex-start',
            borderRadius: 2,
            py: 1,
            px: 1.5,
            fontWeight: 600,
          }}
        >
          Package leave-behind
        </Button>

        <Box
          component="button"
          type="button"
          onClick={onGoHome}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.25,
            width: '100%',
            border: 'none',
            borderRadius: 1.5,
            px: 1.25,
            py: 1,
            cursor: 'pointer',
            font: 'inherit',
            textAlign: 'left',
            bgcolor: homeActive ? layoutTokens.active : 'transparent',
            color: 'text.primary',
            '&:hover': { bgcolor: layoutTokens.hover },
          }}
        >
          <HomeOutlinedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
          <Typography variant="body2" sx={{ fontWeight: homeActive ? 700 : 500 }}>
            Home
          </Typography>
        </Box>
      </Stack>

      <Stack
        direction="row"
        spacing={1}
        sx={{ alignItems: 'center', px: 2, pt: 1, pb: 0.75, flexShrink: 0 }}
      >
        <FolderOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
        <Typography
          sx={{
            fontSize: 11,
            fontWeight: 600,
            color: 'text.secondary',
            flex: 1,
          }}
        >
          Accounts
        </Typography>
        {entries.length > 0 ? (
          <Typography
            sx={{ fontSize: 11, color: 'text.secondary', fontWeight: 600 }}
          >
            {entries.length}
          </Typography>
        ) : null}
      </Stack>

      <Box sx={{ flex: 1, minHeight: 0, overflow: 'auto', px: 1, pb: 1 }}>
        {entries.length === 0 ? (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block', px: 1, pb: 2, lineHeight: 1.45 }}
          >
            Recent brand packs show up as you encode and download. Resume jumps
            to Encode brand.
          </Typography>
        ) : (
          <Stack spacing={0.25}>
            {entries.map((entry) => {
              const active =
                activeSlug && entry.brand.customerSlug === activeSlug;
              const progress = assessPackProgress(entry.brand, {
                downloaded: entry.downloaded,
                logosOmitted: entry.logosOmitted,
              });
              const logoSrc = packLogoSrc(entry.brand);
              const progressTone =
                progress.stage === 'downloaded' || progress.stage === 'ready'
                  ? layoutTokens.accent
                  : layoutTokens.textSecondary;

              return (
                <Stack
                  key={entry.id}
                  direction="row"
                  spacing={0.5}
                  sx={{
                    alignItems: 'center',
                    borderRadius: 1.5,
                    bgcolor: active ? layoutTokens.active : 'transparent',
                    '&:hover': { bgcolor: layoutTokens.hover },
                  }}
                >
                  <Tooltip title={progress.detail} placement="right">
                    <Box
                      component="button"
                      type="button"
                      onClick={() => onSelect(entry)}
                      sx={{
                        flex: 1,
                        minWidth: 0,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        border: 'none',
                        bgcolor: 'transparent',
                        cursor: 'pointer',
                        font: 'inherit',
                        textAlign: 'left',
                        px: 1.25,
                        py: 1,
                        borderRadius: 1.5,
                      }}
                    >
                      <Box
                        sx={{
                          width: 28,
                          height: 28,
                          borderRadius: 1.25,
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
                            width={22}
                            height={22}
                            style={{
                              objectFit: 'contain',
                              display: 'block',
                            }}
                          />
                        ) : (
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              borderRadius: '50%',
                              bgcolor:
                                entry.brand.primaryColor || layoutTokens.border,
                            }}
                          />
                        )}
                      </Box>
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600 }}
                          noWrap
                        >
                          {entry.brand.customerName}
                        </Typography>
                        <Stack
                          direction="row"
                          spacing={0.75}
                          sx={{ alignItems: 'center', minWidth: 0 }}
                        >
                          <Box
                            sx={{
                              width: 28,
                              height: 3,
                              borderRadius: 999,
                              bgcolor: layoutTokens.pill,
                              overflow: 'hidden',
                              flexShrink: 0,
                            }}
                            aria-hidden
                          >
                            <Box
                              sx={{
                                width: `${(progress.step / progress.total) * 100}%`,
                                height: '100%',
                                bgcolor: progressTone,
                              }}
                            />
                          </Box>
                          <Typography
                            variant="caption"
                            sx={{
                              color: progressTone,
                              fontWeight: 600,
                              flexShrink: 0,
                            }}
                            noWrap
                          >
                            {progress.label}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            noWrap
                            sx={{ minWidth: 0 }}
                          >
                            {formatRelativeTime(entry.savedAt)}
                          </Typography>
                        </Stack>
                      </Box>
                    </Box>
                  </Tooltip>
                  <IconButton
                    size="small"
                    aria-label={`Remove ${entry.brand.customerName}`}
                    onClick={() => onRemove(entry.id)}
                    sx={{ mr: 0.5 }}
                  >
                    <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Stack>
              );
            })}
          </Stack>
        )}
      </Box>

      <Stack
        direction="row"
        spacing={0.5}
        sx={{
          flexShrink: 0,
          px: 1.25,
          py: 1.25,
          borderTop: `1px solid ${layoutTokens.border}`,
          justifyContent: 'space-between',
        }}
      >
        {footerActions.map((action) => (
          <Tooltip key={action.id} title={action.label} placement="top">
            <IconButton
              size="small"
              aria-label={action.label}
              onClick={() => runFooter(action.id)}
              sx={{
                borderRadius: 1.5,
                color: 'text.secondary',
                '&:hover': {
                  bgcolor: layoutTokens.hover,
                  color: 'text.primary',
                },
              }}
            >
              {action.icon}
            </IconButton>
          </Tooltip>
        ))}
      </Stack>
    </Box>
  );
}
