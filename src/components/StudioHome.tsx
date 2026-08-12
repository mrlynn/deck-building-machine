'use client';

import { useMemo, useState, type ReactNode } from 'react';
import { Button, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import RecordVoiceOverOutlinedIcon from '@mui/icons-material/RecordVoiceOverOutlined';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import { AccountLibrary } from '@/components/AccountLibrary';
import { StudioPageHeader } from '@/components/StudioPageHeader';
import type { RecentBrandEntry } from '@/lib/recent-brands';
import {
  STUDIO_HOME_GREETING,
  STUDIO_HOME_JOBS,
  STUDIO_HOME_PRIMARY,
  STUDIO_HOME_TABS,
  type StudioHomeJobId,
} from '@/content/studio-home';
import { layoutTokens } from '@/theme/tokens';

type Props = {
  recentEntries: RecentBrandEntry[];
  onJob: (id: StudioHomeJobId) => void;
  onResume: (entry: RecentBrandEntry) => void;
  onRemove: (id: string) => void;
};

type HomeTabId = (typeof STUDIO_HOME_TABS)[number]['id'];

const ICONS: Record<Exclude<StudioHomeJobId, 'package'>, ReactNode> = {
  rehearse: <SchoolOutlinedIcon sx={{ fontSize: 20 }} />,
  'talk-track': <RecordVoiceOverOutlinedIcon sx={{ fontSize: 20 }} />,
  teach: <AutoAwesomeOutlinedIcon sx={{ fontSize: 20 }} />,
};

function JobCard({
  title,
  description,
  icon,
  onClick,
}: {
  title: string;
  description: string;
  icon: ReactNode;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      onClick={onClick}
      fullWidth
      variant="text"
      color="inherit"
      startIcon={icon}
      sx={{
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        textAlign: 'left',
        textTransform: 'none',
        p: 2,
        borderRadius: 3,
        border: 'none',
        bgcolor: layoutTokens.cardBg,
        color: 'text.primary',
        font: 'inherit',
        gap: 1.25,
        '& .MuiButton-startIcon': {
          margin: 0,
          mt: 0.15,
          color: 'text.secondary',
        },
        '&:hover': {
          bgcolor: layoutTokens.active,
        },
      }}
    >
      <Stack spacing={0.35} sx={{ minWidth: 0, alignItems: 'flex-start' }}>
        <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.3 }}>
          {title}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: 'block', lineHeight: 1.45 }}
        >
          {description}
        </Typography>
      </Stack>
    </Button>
  );
}

export function StudioHome({
  recentEntries,
  onJob,
  onResume,
  onRemove,
}: Props) {
  const [tab, setTab] = useState<HomeTabId>(() =>
    recentEntries.length > 0 ? 'Package' : 'Prepare',
  );

  const activeTabMeta = useMemo(
    () => STUDIO_HOME_TABS.find((t) => t.id === tab) ?? STUDIO_HOME_TABS[0],
    [tab],
  );

  const jobs = STUDIO_HOME_JOBS.filter((j) => j.category === 'Prepare');

  return (
    <Stack
      sx={{
        width: '100%',
        maxWidth: tab === 'Package' ? 960 : 720,
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 3, md: 4 },
      }}
      spacing={3}
    >
      <StudioPageHeader
        title={STUDIO_HOME_GREETING}
        subtitle={activeTabMeta.subtitle}
        tabs={STUDIO_HOME_TABS.map((t) => ({ id: t.id, label: t.label }))}
        activeTab={tab}
        onTabChange={(id) => setTab(id as HomeTabId)}
        trailing={
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => onJob(STUDIO_HOME_PRIMARY.id)}
            sx={{
              display: { xs: 'inline-flex', md: 'none' },
              borderRadius: 2,
              py: 1.25,
              px: 2,
              fontWeight: 600,
            }}
          >
            {STUDIO_HOME_PRIMARY.title}
          </Button>
        }
      />

      {tab === 'Package' ? (
        <AccountLibrary
          entries={recentEntries}
          onSelect={onResume}
          onRemove={onRemove}
          alwaysShowSearch={recentEntries.length > 0}
        />
      ) : (
        <Stack spacing={1}>
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              title={job.title}
              description={job.description}
              icon={ICONS[job.id]}
              onClick={() => onJob(job.id)}
            />
          ))}
        </Stack>
      )}
    </Stack>
  );
}
