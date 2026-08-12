'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import {
  Box,
  Button,
  Chip,
  Drawer,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import { useAssistant } from '@/components/AssistantProvider';
import { getAssistantExamples } from '@/content/assistant-examples';
import { layoutTokens } from '@/theme/tokens';

function messageText(parts: { type: string; text?: string }[]): string {
  return parts
    .filter((part) => part.type === 'text' && part.text)
    .map((part) => part.text as string)
    .join('');
}

function ExampleQuestionList({
  questions,
  disabled,
  onSelect,
}: {
  questions: string[];
  disabled?: boolean;
  onSelect: (question: string) => void;
}) {
  return (
    <Stack spacing={1}>
      {questions.map((question) => (
        <Chip
          key={question}
          label={question}
          onClick={() => onSelect(question)}
          clickable={!disabled}
          disabled={disabled}
          sx={{
            height: 'auto',
            py: 1,
            px: 0.5,
            justifyContent: 'flex-start',
            borderRadius: 2,
            bgcolor: '#fff',
            border: `1px solid ${layoutTokens.border}`,
            opacity: disabled ? 0.6 : 1,
            '& .MuiChip-label': {
              whiteSpace: 'normal',
              textAlign: 'left',
              fontSize: 13,
              lineHeight: 1.4,
            },
          }}
        />
      ))}
    </Stack>
  );
}

function MarkdownBody({ children }: { children: string }) {
  return (
    <Box
      sx={{
        typography: 'body2',
        lineHeight: 1.55,
        color: 'inherit',
        '& p': { m: 0, mb: 1.25 },
        '& p:last-child': { mb: 0 },
        '& h1, & h2, & h3, & h4': {
          fontFamily: '"Plus Jakarta Sans", sans-serif',
          fontWeight: 700,
          letterSpacing: '-0.02em',
          lineHeight: 1.3,
          m: 0,
          mt: 1.5,
          mb: 0.75,
        },
        '& h1:first-child, & h2:first-child, & h3:first-child, & h4:first-child': {
          mt: 0,
        },
        '& h2': { fontSize: 15 },
        '& h3': { fontSize: 14 },
        '& h4': { fontSize: 13 },
        '& ul, & ol': { m: 0, mb: 1.25, pl: 2.25 },
        '& li': { mb: 0.5 },
        '& li > p': { mb: 0.25 },
        '& strong': { fontWeight: 700 },
        '& a': { color: 'inherit', textDecoration: 'underline' },
        '& code': {
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
          fontSize: '0.85em',
          px: 0.5,
          py: 0.15,
          borderRadius: 0.75,
          bgcolor: layoutTokens.pill,
        },
        '& pre': {
          m: 0,
          mb: 1.25,
          p: 1.25,
          borderRadius: 1.5,
          overflowX: 'auto',
          bgcolor: layoutTokens.sidebarBg,
          border: `1px solid ${layoutTokens.border}`,
        },
        '& pre code': {
          p: 0,
          bgcolor: 'transparent',
          fontSize: 12,
        },
      }}
    >
      <ReactMarkdown
        components={{
          a: ({ href, children: linkChildren }) => (
            <a href={href} target="_blank" rel="noreferrer">
              {linkChildren as ReactNode}
            </a>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </Box>
  );
}

export function AssistantDrawer() {
  const { open, closeAssistant, wizardState } = useAssistant();
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const wizardStateRef = useRef(wizardState);

  useEffect(() => {
    wizardStateRef.current = wizardState;
  }, [wizardState]);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: '/api/assistant',
      }),
    [],
  );

  const { messages, sendMessage, status, error, setMessages } = useChat({
    transport,
  });

  const busy = status === 'submitted' || status === 'streaming';
  const step = wizardState?.activeStep ?? 0;
  const examples = getAssistantExamples(step);
  const stepLabel = wizardState?.stepName ?? examples.stepName;

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, status, open]);

  const submit = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    sendMessage(
      { text: trimmed },
      {
        body: {
          wizardState: wizardStateRef.current,
        },
      },
    );
    setInput('');
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={closeAssistant}
      slotProps={{
        paper: {
          sx: {
            width: { xs: '100%', sm: 420 },
            bgcolor: layoutTokens.bg,
            borderLeft: `1px solid ${layoutTokens.border}`,
          },
        },
      }}
    >
      <Stack sx={{ height: '100%' }}>
        <Box
          sx={{
            px: 2,
            py: 1.5,
            borderBottom: `1px solid ${layoutTokens.border}`,
            bgcolor: layoutTokens.sidebarBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1,
          }}
        >
          <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center' }}>
            <SmartToyOutlinedIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
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
                Assistant
              </Typography>
              <Typography
                sx={{
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  fontWeight: 700,
                  fontSize: 15,
                  letterSpacing: '-0.02em',
                }}
              >
                Ask about Studio
              </Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={0.5}>
            {messages.length > 0 && (
              <Button
                size="small"
                onClick={() => setMessages([])}
                sx={{ textTransform: 'none' }}
              >
                Clear
              </Button>
            )}
            <IconButton aria-label="Close assistant" onClick={closeAssistant} size="small">
              <CloseIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Box>

        {wizardState && (
          <Box
            sx={{
              px: 2,
              py: 1,
              borderBottom: `1px solid ${layoutTokens.borderSubtle}`,
              bgcolor: '#fff',
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Context: step {wizardState.activeStep + 1} — {wizardState.stepName}
              {wizardState.customerName ? ` · ${wizardState.customerName}` : ''}
            </Typography>
          </Box>
        )}

        <Box
          ref={scrollRef}
          sx={{
            flex: 1,
            overflowY: 'auto',
            px: 2,
            py: 2,
          }}
        >
          {messages.length === 0 ? (
            <Stack spacing={2}>
              <Box>
                <Typography
                  className="mono"
                  sx={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'text.secondary',
                    mb: 0.75,
                  }}
                >
                  Example questions · {stepLabel}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {examples.blurb}
                </Typography>
              </Box>
              <ExampleQuestionList
                questions={examples.questions}
                disabled={busy}
                onSelect={submit}
              />
            </Stack>
          ) : (
            <Stack spacing={1.5}>
              {messages.map((message) => {
                const isUser = message.role === 'user';
                const text = messageText(message.parts);
                if (!text) return null;
                return (
                  <Box
                    key={message.id}
                    sx={{
                      alignSelf: isUser ? 'flex-end' : 'flex-start',
                      maxWidth: '92%',
                      px: 1.5,
                      py: 1.15,
                      borderRadius: 2,
                      bgcolor: isUser ? layoutTokens.text : '#fff',
                      color: isUser ? '#fff' : 'text.primary',
                      border: isUser ? 'none' : `1px solid ${layoutTokens.border}`,
                    }}
                  >
                    {isUser ? (
                      <Typography
                        variant="body2"
                        sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}
                      >
                        {text}
                      </Typography>
                    ) : (
                      <MarkdownBody>{text}</MarkdownBody>
                    )}
                  </Box>
                );
              })}
              {busy && (
                <Typography variant="caption" color="text.secondary">
                  Thinking…
                </Typography>
              )}
            </Stack>
          )}

          {error && (
            <Box
              sx={{
                mt: 2,
                p: 1.5,
                borderRadius: 2,
                bgcolor: 'rgba(190, 32, 46, 0.08)',
                border: '1px solid rgba(190, 32, 46, 0.25)',
              }}
            >
              <Typography variant="body2" color="error">
                {error.message ||
                  'The assistant could not respond. Check API keys in .env.local and restart the server.'}
              </Typography>
            </Box>
          )}
        </Box>

        <Box
          sx={{
            borderTop: `1px solid ${layoutTokens.border}`,
            bgcolor: '#fff',
          }}
        >
          {messages.length > 0 && (
            <Box
              sx={{
                px: 2,
                pt: 1.5,
                pb: 0.5,
                borderBottom: `1px solid ${layoutTokens.borderSubtle}`,
                bgcolor: layoutTokens.sidebarBg,
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
                  mb: 1,
                }}
              >
                Try for {stepLabel}
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  gap: 0.75,
                  overflowX: 'auto',
                  pb: 1,
                  mx: -0.25,
                  px: 0.25,
                }}
              >
                {examples.questions.map((question) => (
                  <Chip
                    key={question}
                    size="small"
                    label={question}
                    onClick={() => submit(question)}
                    clickable={!busy}
                    disabled={busy}
                    sx={{
                      flexShrink: 0,
                      maxWidth: 260,
                      bgcolor: '#fff',
                      border: `1px solid ${layoutTokens.border}`,
                      '& .MuiChip-label': {
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        fontSize: 12,
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}

          <Box
            component="form"
            onSubmit={(event) => {
              event.preventDefault();
              submit(input);
            }}
            sx={{ p: 2 }}
          >
          <Stack direction="row" spacing={1} sx={{ alignItems: 'flex-end' }}>
            <TextField
              fullWidth
              multiline
              maxRows={4}
              size="small"
              placeholder={`Ask about the ${stepLabel} step…`}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              disabled={busy}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  submit(input);
                }
              }}
            />
            <IconButton
              type="submit"
              color="primary"
              disabled={busy || !input.trim()}
              aria-label="Send message"
              sx={{
                bgcolor: layoutTokens.text,
                color: '#fff',
                borderRadius: 2,
                '&:hover': { bgcolor: '#2a271f' },
                '&.Mui-disabled': {
                  bgcolor: layoutTokens.pill,
                  color: layoutTokens.textSecondary,
                },
              }}
            >
              <SendIcon fontSize="small" />
            </IconButton>
          </Stack>
          </Box>
        </Box>
      </Stack>
    </Drawer>
  );
}
