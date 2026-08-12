'use client';

import type { ReactNode } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { HelpButton } from '@/components/HelpButton';
import type { HelpTopicId } from '@/content/help';
import { layoutTokens } from '@/theme/tokens';

type Tab = {
  id: string;
  label: string;
};

type Props = {
  title: string;
  subtitle: string;
  /** Optional leading icon next to the title. */
  icon?: ReactNode;
  helpTopic?: HelpTopicId;
  /** Trailing controls (chips, actions). */
  trailing?: ReactNode;
  /** ChatGTM-style underline tabs under the header. */
  tabs?: Tab[];
  activeTab?: string;
  onTabChange?: (id: string) => void;
};

/**
 * Page title + purpose line (+ optional tabs), matching ChatGTM Skills headers.
 */
export function StudioPageHeader({
  title,
  subtitle,
  icon,
  helpTopic,
  trailing,
  tabs,
  activeTab,
  onTabChange,
}: Props) {
  return (
    <Stack spacing={1.5}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1}
        sx={{
          alignItems: { xs: 'stretch', sm: 'flex-start' },
          justifyContent: 'space-between',
        }}
      >
        <Stack spacing={0.75} sx={{ minWidth: 0, flex: 1 }}>
          <Stack
            direction="row"
            spacing={1}
            sx={{ alignItems: 'center', flexWrap: 'wrap' }}
          >
            {icon}
            <Typography
              sx={{
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                fontWeight: 700,
                fontSize: { xs: 22, sm: 26 },
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
              }}
            >
              {title}
            </Typography>
            {helpTopic ? <HelpButton topic={helpTopic} /> : null}
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 560 }}>
            {subtitle}
          </Typography>
        </Stack>
        {trailing ? (
          <Box sx={{ flexShrink: 0, pt: { sm: 0.5 } }}>{trailing}</Box>
        ) : null}
      </Stack>

      {tabs && tabs.length > 0 ? (
        <Stack
          direction="row"
          spacing={2.5}
          sx={{
            borderBottom: `1px solid ${layoutTokens.border}`,
            mt: 0.5,
          }}
        >
          {tabs.map((tab) => {
            const active = tab.id === activeTab;
            return (
              <Box
                key={tab.id}
                component="button"
                type="button"
                onClick={() => onTabChange?.(tab.id)}
                sx={{
                  border: 'none',
                  bgcolor: 'transparent',
                  cursor: 'pointer',
                  font: 'inherit',
                  px: 0.25,
                  pb: 1,
                  mb: '-1px',
                  color: active ? 'text.primary' : 'text.secondary',
                  fontWeight: active ? 700 : 500,
                  fontSize: 14,
                  borderBottom: active
                    ? `2px solid ${layoutTokens.text}`
                    : '2px solid transparent',
                  '&:hover': {
                    color: 'text.primary',
                  },
                }}
              >
                {tab.label}
              </Box>
            );
          })}
        </Stack>
      ) : null}
    </Stack>
  );
}
