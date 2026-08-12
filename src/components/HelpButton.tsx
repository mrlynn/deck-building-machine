'use client';

import { IconButton, Tooltip, type IconButtonProps } from '@mui/material';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import { HELP_TOPIC_BY_ID, type HelpTopicId } from '@/content/help';
import { useHelp } from '@/components/HelpProvider';
import { layoutTokens } from '@/theme/tokens';

export type HelpButtonProps = {
  /** Help topic to open and scroll to inside the modal */
  topic: HelpTopicId;
  /** Tooltip / accessible label override */
  label?: string;
  size?: IconButtonProps['size'];
  edge?: IconButtonProps['edge'];
  sx?: IconButtonProps['sx'];
};

/**
 * Inline "?" control that opens the shared help modal deep-linked to a topic.
 * Place next to section headers, chips, or fields that need explanation.
 */
export function HelpButton({
  topic,
  label,
  size = 'small',
  edge,
  sx,
}: HelpButtonProps) {
  const { openHelp } = useHelp();
  const topicMeta = HELP_TOPIC_BY_ID[topic];
  const ariaLabel = label ?? `Help: ${topicMeta.title}`;

  return (
    <Tooltip title={ariaLabel} enterDelay={400}>
      <IconButton
        aria-label={ariaLabel}
        size={size}
        edge={edge}
        onClick={(e) => {
          e.stopPropagation();
          openHelp(topic);
        }}
        sx={[
          {
            color: layoutTokens.textSecondary,
            '&:hover': {
              color: layoutTokens.text,
              bgcolor: layoutTokens.hover,
            },
          },
          ...(sx ? (Array.isArray(sx) ? sx : [sx]) : []),
        ]}
      >
        <HelpOutlineOutlinedIcon fontSize="inherit" />
      </IconButton>
    </Tooltip>
  );
}
