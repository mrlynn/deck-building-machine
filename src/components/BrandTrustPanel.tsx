'use client';

import {
  Alert,
  Box,
  Chip,
  Collapse,
  Stack,
  Typography,
} from '@mui/material';
import { assessPrefillConfidence } from '@/lib/prefill-confidence';
import { checkReferenceBrandLeak } from '@/lib/reference-brand-leak';
import type { BrandPack } from '@/lib/types';

type Props = {
  brand: BrandPack;
  qualityScore?: number | null;
  /** Show the prefill confidence block (brand pack step). */
  showPrefill?: boolean;
  /**
   * Surface leftover issues only when something needs attention.
   * Pass state is never shown — ADMs should not see “reference brand check” chrome.
   */
  showLeakCheck?: boolean;
};

export function BrandTrustPanel({
  brand,
  qualityScore,
  showPrefill = true,
  showLeakCheck = true,
}: Props) {
  const confidence = assessPrefillConfidence(brand, qualityScore);
  const leak = checkReferenceBrandLeak(brand);
  const showLeakIssue =
    showLeakCheck && (leak.severity === 'warn' || leak.severity === 'fail');

  const prefillSeverity =
    confidence.level === 'good'
      ? 'success'
      : confidence.level === 'review'
        ? 'warning'
        : 'info';

  if (!showPrefill && !showLeakIssue) {
    return null;
  }

  return (
    <Stack spacing={1.25}>
      {showPrefill && (
        <Alert severity={prefillSeverity}>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.25 }}>
            {confidence.label}
            {confidence.scorePercent !== null
              ? ` · ${confidence.scorePercent}%`
              : ''}
          </Typography>
          <Typography variant="body2">{confidence.detail}</Typography>
          <Stack
            direction="row"
            spacing={0.75}
            sx={{ flexWrap: 'wrap', gap: 0.75, mt: 1 }}
          >
            {confidence.checks.map((check) => (
              <Chip
                key={check.id}
                size="small"
                label={check.label}
                color={check.ok ? 'success' : 'default'}
                variant={check.ok ? 'filled' : 'outlined'}
              />
            ))}
          </Stack>
        </Alert>
      )}

      {showLeakIssue && (
        <Alert severity={leak.severity === 'fail' ? 'error' : 'warning'}>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.25 }}>
            {leak.severity === 'fail'
              ? 'Fix brand pack fields before download'
              : 'Review brand pack fields before download'}
          </Typography>
          <Typography variant="body2">{leak.summary}</Typography>
          <Collapse in={leak.findings.length > 0}>
            <Box
              component="ul"
              sx={{
                m: 0,
                mt: 1,
                pl: 2.25,
                borderRadius: 1,
              }}
            >
              {leak.findings.map((f) => (
                <Typography
                  key={f.id}
                  component="li"
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'list-item' }}
                >
                  {f.message}
                </Typography>
              ))}
            </Box>
          </Collapse>
        </Alert>
      )}
    </Stack>
  );
}
