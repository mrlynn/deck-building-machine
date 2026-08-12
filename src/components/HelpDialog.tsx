'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react';
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  InputAdornment,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import {
  HELP_TOPIC_BY_ID,
  searchHelpTopics,
  type HelpTopicId,
} from '@/content/help';
import { useHelp } from '@/components/HelpProvider';
import { HelpDiagram } from '@/components/HelpDiagram';
import { PrimitivesVideo } from '@/components/PrimitivesVideo';
import { layoutTokens } from '@/theme/tokens';

function BulletList({ items }: { items: string[] }) {
  return (
    <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
      {items.map((item) => (
        <Typography
          key={item}
          component="li"
          variant="body2"
          color="text.secondary"
          sx={{ mb: 0.75 }}
        >
          {item}
        </Typography>
      ))}
    </Box>
  );
}

function TopicBody({ topicId }: { topicId: HelpTopicId }) {
  const topic = HELP_TOPIC_BY_ID[topicId];
  if (!topic) {
    return (
      <Typography color="text.secondary" variant="body2">
        Help topic not found ({topicId}).
      </Typography>
    );
  }

  return (
    <Box id={`help-section-${topic.id}`} component="article">
      <Typography
        variant="h6"
        sx={{
          fontFamily: '"Plus Jakarta Sans", sans-serif',
          fontWeight: 600,
          mb: 1,
        }}
      >
        {topic.title}
      </Typography>
      <Stack spacing={2}>
        <Stack spacing={1.5}>
          {topic.paragraphs.map((p) => (
            <Typography key={p.slice(0, 48)} color="text.secondary" variant="body2">
              {p}
            </Typography>
          ))}
          {topic.bullets && topic.bullets.length > 0 && (
            <BulletList items={topic.bullets} />
          )}
        </Stack>

        {topic.diagram && <HelpDiagram id={topic.diagram} />}

        {topic.media === 'primitives-video' && (
          <PrimitivesVideo autoPlay={false} active />
        )}

        {topic.sections?.map((section) => (
          <Box key={section.heading}>
            <Typography
              variant="subtitle2"
              sx={{
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                fontWeight: 600,
                mb: 1,
                color: 'text.primary',
              }}
            >
              {section.heading}
            </Typography>
            <Stack spacing={1.25}>
              {section.paragraphs?.map((p) => (
                <Typography
                  key={p.slice(0, 48)}
                  color="text.secondary"
                  variant="body2"
                >
                  {p}
                </Typography>
              ))}
              {section.bullets && section.bullets.length > 0 && (
                <BulletList items={section.bullets} />
              )}
            </Stack>
          </Box>
        ))}

        {topic.tip && (
          <Box
            sx={{
              mt: 0.5,
              px: 1.5,
              py: 1.25,
              borderRadius: 2,
              bgcolor: layoutTokens.sidebarBg,
              border: `1px solid ${layoutTokens.border}`,
            }}
          >
            <Typography
              className="mono"
              sx={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'text.secondary',
                mb: 0.5,
              }}
            >
              Tip
            </Typography>
            <Typography variant="body2" color="text.primary">
              {topic.tip}
            </Typography>
          </Box>
        )}
      </Stack>
    </Box>
  );
}

export function HelpDialog() {
  const { open, topicId, closeHelp, openHelp } = useHelp();
  const [query, setQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);

  const filteredTopics = useMemo(() => searchHelpTopics(query), [query]);
  const hasQuery = query.trim().length > 0;

  const clearQuery = useCallback(() => {
    setQuery('');
    searchRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) {
      setQuery('');
      return;
    }
    const timer = window.setTimeout(() => {
      searchRef.current?.focus();
    }, 50);
    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!open || filteredTopics.length === 0) return;
    if (!filteredTopics.some((t) => t.id === topicId)) {
      openHelp(filteredTopics[0].id);
    }
  }, [open, filteredTopics, topicId, openHelp]);

  const onSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape' && hasQuery) {
      event.stopPropagation();
      clearQuery();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={closeHelp}
      fullWidth
      maxWidth="md"
      scroll="paper"
      aria-labelledby="help-dialog-title"
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            border: `1px solid ${layoutTokens.border}`,
            maxHeight: 'min(90vh, 900px)',
          },
        },
      }}
    >
      <DialogTitle
        id="help-dialog-title"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          pr: 1,
          borderBottom: `1px solid ${layoutTokens.border}`,
          bgcolor: layoutTokens.sidebarBg,
        }}
      >
        <Box>
          <Typography
            className="mono"
            sx={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'text.secondary',
              mb: 0.25,
            }}
          >
            Help
          </Typography>
          <Typography
            sx={{
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              fontWeight: 700,
              fontSize: 18,
              letterSpacing: '-0.02em',
            }}
          >
            Deck Machine Studio
          </Typography>
        </Box>
        <IconButton aria-label="Close help" onClick={closeHelp} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          p: 0,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          bgcolor: 'background.paper',
        }}
      >
        <Box
          component="nav"
          aria-label="Help topics"
          sx={{
            width: { xs: '100%', sm: 260 },
            flexShrink: 0,
            borderRight: { sm: `1px solid ${layoutTokens.border}` },
            borderBottom: { xs: `1px solid ${layoutTokens.border}`, sm: 'none' },
            bgcolor: layoutTokens.bg,
            display: 'flex',
            flexDirection: 'column',
            maxHeight: { xs: 260, sm: 'none' },
          }}
        >
          <Box
            sx={{
              px: 1.5,
              pt: 1.5,
              pb: 1,
              borderBottom: `1px solid ${layoutTokens.borderSubtle}`,
            }}
          >
            <TextField
              inputRef={searchRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onSearchKeyDown}
              placeholder="Search help…"
              size="small"
              fullWidth
              autoComplete="off"
              slotProps={{
                htmlInput: {
                  'aria-label': 'Search help topics',
                  'aria-controls': 'help-topic-list',
                },
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon
                        fontSize="small"
                        sx={{ color: 'text.secondary' }}
                      />
                    </InputAdornment>
                  ),
                  endAdornment: hasQuery ? (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="Clear search"
                        onClick={clearQuery}
                        edge="end"
                        size="small"
                      >
                        <CloseIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </InputAdornment>
                  ) : undefined,
                  sx: {
                    bgcolor: '#FFFFFF',
                    borderRadius: 2,
                    fontSize: 13,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: layoutTokens.border,
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(0, 0, 0, 0.18)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: layoutTokens.text,
                      borderWidth: 1,
                    },
                  },
                },
              }}
            />
            {hasQuery && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: 'block', mt: 0.75, px: 0.25 }}
              >
                {filteredTopics.length === 0
                  ? 'No matching topics'
                  : `${filteredTopics.length} topic${filteredTopics.length === 1 ? '' : 's'}`}
              </Typography>
            )}
          </Box>

          <List
            id="help-topic-list"
            dense
            disablePadding
            role="listbox"
            aria-label="Help topic results"
            sx={{ py: 1, overflow: 'auto', flex: 1 }}
          >
            {filteredTopics.length === 0 ? (
              <Box sx={{ px: 2.5, py: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  No topics match “{query.trim()}”. Try a different word, or clear
                  the search.
                </Typography>
              </Box>
            ) : (
              filteredTopics.map((topic) => {
                const selected = topic.id === topicId;
                return (
                  <ListItemButton
                    key={topic.id}
                    selected={selected}
                    role="option"
                    aria-selected={selected}
                    onClick={() => openHelp(topic.id)}
                    sx={{
                      mx: 1,
                      borderRadius: 1.5,
                      '&.Mui-selected': {
                        bgcolor: layoutTokens.active,
                      },
                    }}
                  >
                    <ListItemText
                      primary={topic.title}
                      secondary={topic.summary}
                      slotProps={{
                        primary: {
                          variant: 'body2',
                          sx: {
                            fontWeight: selected ? 600 : 500,
                            lineHeight: 1.3,
                          },
                        },
                        secondary: {
                          variant: 'caption',
                          sx: {
                            display: { xs: 'none', md: 'block' },
                            mt: 0.25,
                            lineHeight: 1.3,
                          },
                        },
                      }}
                    />
                  </ListItemButton>
                );
              })
            )}
          </List>
        </Box>

        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            p: { xs: 2.5, md: 3 },
            overflow: 'auto',
            maxHeight: { xs: '52vh', sm: 'min(74vh, 720px)' },
          }}
        >
          {filteredTopics.length === 0 ? (
            <Stack spacing={1.5} sx={{ py: 4, alignItems: 'flex-start' }}>
              <Typography
                sx={{
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  fontWeight: 600,
                  fontSize: 16,
                }}
              >
                No results
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Nothing in help matched your search. Clear the field to browse all
                topics again.
              </Typography>
            </Stack>
          ) : (
            <>
              <TopicBody topicId={topicId} />
              <Divider sx={{ my: 3 }} />
              <Typography variant="caption" color="text.secondary">
                The{' '}
                <Box component="span" className="mono" sx={{ fontSize: 'inherit' }}>
                  ?
                </Box>{' '}
                buttons in the wizard open this panel on the matching topic. Share a
                deep link with{' '}
                <Box component="span" className="mono" sx={{ fontSize: 'inherit' }}>
                  #help={topicId}
                </Box>
                .
              </Typography>
            </>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
