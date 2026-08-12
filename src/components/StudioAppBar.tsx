'use client';

import { useState, type MouseEvent } from 'react';
import {
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import RecordVoiceOverOutlinedIcon from '@mui/icons-material/RecordVoiceOverOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import { CursorLogo } from '@/components/CursorLogo';
import { layoutTokens } from '@/theme/tokens';

type Props = {
  onPackage: () => void;
  onOpenRehearse: () => void;
  onOpenTalkTrack: () => void;
  onOpenAssistant: () => void;
  onOpenHelp: () => void;
  /** Logo / title → studio home */
  onGoHome?: () => void;
};

const actions = [
  {
    id: 'package',
    label: 'Package leave-behind',
    icon: <AddIcon fontSize="small" />,
  },
  {
    id: 'rehearse',
    label: 'Rehearse',
    icon: <SchoolOutlinedIcon fontSize="small" />,
  },
  {
    id: 'talk',
    label: 'Talk track',
    icon: <RecordVoiceOverOutlinedIcon fontSize="small" />,
  },
  {
    id: 'assistant',
    label: 'Assistant',
    icon: <SmartToyOutlinedIcon fontSize="small" />,
  },
  {
    id: 'help',
    label: 'Help',
    icon: <HelpOutlineOutlinedIcon fontSize="small" />,
  },
] as const;

/**
 * Compact top chrome for xs/sm. Desktop chrome lives in AccountsRail.
 */
export function StudioAppBar({
  onPackage,
  onOpenRehearse,
  onOpenTalkTrack,
  onOpenAssistant,
  onOpenHelp,
  onGoHome,
}: Props) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const menuOpen = Boolean(anchor);

  const run = (id: (typeof actions)[number]['id']) => {
    setAnchor(null);
    if (id === 'package') onPackage();
    else if (id === 'rehearse') onOpenRehearse();
    else if (id === 'talk') onOpenTalkTrack();
    else if (id === 'assistant') onOpenAssistant();
    else onOpenHelp();
  };

  return (
    <Box
      component="header"
      sx={{
        display: { xs: 'block', md: 'none' },
        position: 'sticky',
        top: 0,
        zIndex: 1100,
        borderBottom: `1px solid ${layoutTokens.border}`,
        bgcolor: layoutTokens.sidebarBg,
        px: { xs: 1.5, sm: 2 },
        py: 1,
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        sx={{ alignItems: 'center', justifyContent: 'space-between', minWidth: 0 }}
      >
        <Box
          onClick={onGoHome}
          role={onGoHome ? 'link' : undefined}
          tabIndex={onGoHome ? 0 : undefined}
          onKeyDown={
            onGoHome
              ? (e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onGoHome();
                  }
                }
              : undefined
          }
          aria-label={onGoHome ? 'Go to studio home' : undefined}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            minWidth: 0,
            flexShrink: 1,
            p: 0.5,
            m: 0,
            ml: -0.5,
            cursor: onGoHome ? 'pointer' : 'default',
            borderRadius: 1,
            '&:hover': onGoHome ? { bgcolor: layoutTokens.hover } : undefined,
          }}
        >
          <CursorLogo variant="on-light" mode="lockup" height={18} />
          <Typography
            sx={{
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: 'text.primary',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            Deck Machine
          </Typography>
        </Box>

        <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center', flexShrink: 0 }}>
          <IconButton
            size="small"
            aria-label="Package leave-behind"
            onClick={onPackage}
            sx={{
              bgcolor: layoutTokens.text,
              color: '#fff',
              borderRadius: 999,
              '&:hover': { bgcolor: '#2a2820' },
            }}
          >
            <AddIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            aria-label="Help"
            onClick={onOpenHelp}
            sx={{
              border: `1px solid ${layoutTokens.border}`,
              borderRadius: 999,
            }}
          >
            <HelpOutlineOutlinedIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            aria-label="Open menu"
            aria-controls={menuOpen ? 'studio-app-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={menuOpen ? 'true' : undefined}
            onClick={(e: MouseEvent<HTMLElement>) => setAnchor(e.currentTarget)}
            sx={{
              border: `1px solid ${layoutTokens.border}`,
              borderRadius: 999,
            }}
          >
            <MenuIcon fontSize="small" />
          </IconButton>
          <Menu
            id="studio-app-menu"
            anchorEl={anchor}
            open={menuOpen}
            onClose={() => setAnchor(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            slotProps={{
              paper: {
                sx: {
                  mt: 1,
                  minWidth: 220,
                  border: `1px solid ${layoutTokens.border}`,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                },
              },
            }}
          >
            {actions.map((action, index) => [
              index === 1 ? (
                <Divider key={`${action.id}-div`} sx={{ my: 0.5 }} />
              ) : null,
              index === 4 ? (
                <Divider key={`${action.id}-div-help`} sx={{ my: 0.5 }} />
              ) : null,
              <MenuItem key={action.id} onClick={() => run(action.id)}>
                <ListItemIcon>{action.icon}</ListItemIcon>
                <ListItemText>{action.label}</ListItemText>
              </MenuItem>,
            ])}
          </Menu>
        </Stack>
      </Stack>
    </Box>
  );
}
