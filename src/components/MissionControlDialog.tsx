'use client';

import { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Stack,
  Typography,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { HelpButton } from '@/components/HelpButton';
import { copyText } from '@/lib/copy-text';
import {
  emailHandoffBlurb,
  missionStepsForCustomer,
} from '@/content/demo-kit';
import { layoutTokens } from '@/theme/tokens';

type Props = {
  open: boolean;
  onClose: () => void;
  customerName: string;
  customerSlug: string;
};

function CopyButton({ label, text }: { label: string; text: string }) {
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
    >
      {copied ? 'Copied' : label}
    </Button>
  );
}

export function MissionControlDialog({
  open,
  onClose,
  customerName,
  customerSlug,
}: Props) {
  const steps = useMemo(
    () => missionStepsForCustomer(customerName),
    [customerName],
  );
  const [done, setDone] = useState<Record<string, boolean>>({});
  const emailBlurb = useMemo(
    () => emailHandoffBlurb(customerName, customerSlug),
    [customerName, customerSlug],
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="mission-control-title"
      slotProps={{
        paper: {
          sx: {
            // Avoid `sm: null` — collapses dialog paper under Emotion (backdrop-only UI).
            m: { xs: 1, sm: 2 },
            width: { xs: 'calc(100% - 16px)' },
            maxWidth: { xs: 'calc(100% - 16px)', sm: 600 },
            maxHeight: { xs: 'calc(100% - 16px)', sm: 'calc(100% - 64px)' },
          },
        },
      }}
    >
      <DialogTitle id="mission-control-title" sx={{ pb: 1 }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <CheckCircleOutlineIcon color="success" />
          <Box>
            <Typography
              className="mono"
              sx={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'text.secondary',
              }}
            >
              You&apos;re demo-ready
            </Typography>
            <Typography variant="h6" sx={{ fontSize: 20, lineHeight: 1.3 }}>
              {customerName.trim() || 'Customer'} leave-behind downloaded
            </Typography>
          </Box>
          <Box sx={{ flex: 1 }} />
          <HelpButton topic="after-download" />
          <HelpButton topic="field-kit" />
        </Stack>
      </DialogTitle>
      <DialogContent dividers>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          The zip is the kit. The learning happens in Cursor — work the checklist
          live, then leave them on Lab 4 and day-2 ownership. Teaching CLI,
          tokens, or privacy? Open Help → Teaching modules (field kit) — those
          decks are regenerated with{' '}
          <Box component="span" sx={{ fontFamily: 'monospace', fontSize: '0.9em' }}>
            npm run field-kit
          </Box>
          , not packaged in this zip.
        </Typography>

        <Stack spacing={1.25} sx={{ mb: 2.5 }}>
          {steps.map((step, index) => (
            <Box
              key={step.id}
              sx={{
                borderRadius: 2,
                border: `1px solid ${layoutTokens.border}`,
                bgcolor: done[step.id] ? layoutTokens.sidebarBg : '#fff',
                p: 1.5,
              }}
            >
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1}
                sx={{ alignItems: { sm: 'flex-start' }, justifyContent: 'space-between' }}
              >
                <FormControlLabel
                  sx={{ alignItems: 'flex-start', m: 0, flex: 1 }}
                  control={
                    <Checkbox
                      checked={Boolean(done[step.id])}
                      onChange={(_, checked) =>
                        setDone((prev) => ({ ...prev, [step.id]: checked }))
                      }
                      sx={{ pt: 0.25 }}
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {index + 1}. {step.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {step.detail}
                      </Typography>
                    </Box>
                  }
                />
                {step.copyText && step.copyLabel && (
                  <CopyButton label={step.copyLabel} text={step.copyText} />
                )}
              </Stack>
            </Box>
          ))}
        </Stack>

        <Box
          sx={{
            borderRadius: 2,
            border: `1px solid ${layoutTokens.border}`,
            bgcolor: layoutTokens.sidebarBg,
            p: 1.75,
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: 0.75 }}>
            Email handoff for the customer
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 1.25, whiteSpace: 'pre-wrap' }}
          >
            {emailBlurb}
          </Typography>
          <CopyButton label="Copy email" text={emailBlurb} />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose}>Close</Button>
        <Button variant="contained" onClick={onClose}>
          Got it — open Cursor
        </Button>
      </DialogActions>
    </Dialog>
  );
}
