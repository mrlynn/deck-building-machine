'use client';

import { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Drawer,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RecordVoiceOverOutlinedIcon from '@mui/icons-material/RecordVoiceOverOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import CheckIcon from '@mui/icons-material/Check';
import { HelpButton } from '@/components/HelpButton';
import { copyText } from '@/lib/copy-text';
import {
  DEMO_PASTE,
  DEMO_SCRIPT_BULLETS,
  LAB4_PROMPT,
  TALK_TRACK_HELP_TOPIC,
  TALK_TRACK_NUDGES,
  TALK_TRACK_TITLE,
} from '@/content/demo-kit';
import { layoutTokens } from '@/theme/tokens';

type Props = {
  open: boolean;
  onClose: () => void;
  activeStep: number;
  onOpenRehearse?: () => void;
};

function CopyRow({
  label,
  text,
}: {
  label: string;
  text: string;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      size="small"
      variant="outlined"
      startIcon={copied ? <CheckIcon /> : <ContentCopyIcon />}
      onClick={async () => {
        const ok = await copyText(text);
        if (ok) {
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1600);
        }
      }}
      sx={{ justifyContent: 'flex-start' }}
    >
      {copied ? 'Copied' : label}
    </Button>
  );
}

export function TalkTrackDrawer({
  open,
  onClose,
  activeStep,
  onOpenRehearse,
}: Props) {
  const nudge = useMemo(
    () =>
      TALK_TRACK_NUDGES.find((n) => n.step === activeStep)?.say ??
      TALK_TRACK_NUDGES[0]?.say,
    [activeStep],
  );

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: { xs: '100%', sm: 380 },
            bgcolor: layoutTokens.bg,
          },
        },
      }}
    >
      <Box sx={{ p: 2.5, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Stack
          direction="row"
          spacing={1}
          sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 2 }}
        >
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <RecordVoiceOverOutlinedIcon fontSize="small" />
            <Typography variant="h6" sx={{ fontSize: 18 }}>
              {TALK_TRACK_TITLE}
            </Typography>
            <HelpButton topic={TALK_TRACK_HELP_TOPIC} />
          </Stack>
          <IconButton aria-label="Close talk track" onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Stack>

        <Box
          sx={{
            borderRadius: 2,
            border: `1px solid ${layoutTokens.border}`,
            bgcolor: '#fff',
            p: 1.75,
            mb: 2,
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
            On this step, say
          </Typography>
          <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
            {nudge}
          </Typography>
        </Box>

        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Full demo script
        </Typography>
        <Stack
          component="ol"
          spacing={0.85}
          sx={{ m: 0, pl: 2.25, mb: 2, flex: 1, overflow: 'auto' }}
        >
          {DEMO_SCRIPT_BULLETS.map((bullet) => (
            <Typography
              key={bullet}
              component="li"
              variant="body2"
              color="text.secondary"
              sx={{ pl: 0.5 }}
            >
              {bullet}
            </Typography>
          ))}
        </Stack>

        <Stack spacing={1} sx={{ pt: 1, borderTop: `1px solid ${layoutTokens.border}` }}>
          <Typography variant="caption" color="text.secondary">
            Copy helpers for the live room
          </Typography>
          <CopyRow label="Copy demo paste notes" text={DEMO_PASTE} />
          <CopyRow label="Copy Lab 4 prompt" text={LAB4_PROMPT} />
          <CopyRow
            label="Copy full talk track"
            text={DEMO_SCRIPT_BULLETS.map((b, i) => `${i + 1}. ${b}`).join('\n')}
          />
          {onOpenRehearse && (
            <Button
              size="small"
              variant="contained"
              startIcon={<SchoolOutlinedIcon />}
              onClick={onOpenRehearse}
              sx={{ justifyContent: 'flex-start' }}
            >
              Rehearse (5 min)
            </Button>
          )}
        </Stack>
      </Box>
    </Drawer>
  );
}
