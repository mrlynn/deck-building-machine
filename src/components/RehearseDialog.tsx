'use client';

import { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import { HelpButton } from '@/components/HelpButton';
import {
  buildFlashcards,
  quizScore,
  REHEARSE_QUIZ,
  REHEARSE_SUBTITLE,
  REHEARSE_TITLE,
  REHEARSE_TOUR,
  type RehearsePhase,
} from '@/content/rehearse';
import { layoutTokens } from '@/theme/tokens';

type Props = {
  open: boolean;
  onClose: () => void;
  customerSlug?: string;
};

const PHASES: RehearsePhase[] = ['tour', 'cards', 'quiz', 'done'];

function phaseIndex(phase: RehearsePhase): number {
  return PHASES.indexOf(phase);
}

function PrimitiveChip({ label }: { label: string }) {
  return (
    <Chip
      size="small"
      label={label}
      sx={{
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
      }}
    />
  );
}

export function RehearseDialog({ open, onClose, customerSlug }: Props) {
  const slug = customerSlug?.trim() || 'customer';
  const cards = useMemo(() => buildFlashcards(slug), [slug]);

  const [phase, setPhase] = useState<RehearsePhase>('tour');
  const [tourIndex, setTourIndex] = useState(0);
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [picked, setPicked] = useState<string | null>(null);

  const reset = () => {
    setPhase('tour');
    setTourIndex(0);
    setCardIndex(0);
    setFlipped(false);
    setQuizIndex(0);
    setAnswers({});
    setPicked(null);
  };

  const handleClose = () => {
    onClose();
    // Reset after close animation so reopen feels fresh
    window.setTimeout(reset, 200);
  };

  const progress = (() => {
    if (phase === 'tour') {
      return ((tourIndex + 1) / REHEARSE_TOUR.length) * 33;
    }
    if (phase === 'cards') {
      return 33 + ((cardIndex + 1) / cards.length) * 33;
    }
    if (phase === 'quiz') {
      return 66 + ((quizIndex + 1) / REHEARSE_QUIZ.length) * 34;
    }
    return 100;
  })();

  const score = quizScore(answers);
  const beat = REHEARSE_TOUR[tourIndex];
  const card = cards[cardIndex];
  const question = REHEARSE_QUIZ[quizIndex];

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="rehearse-title"
      slotProps={{
        paper: {
          sx: {
            // Do not use `sm: null` — Emotion serializes it and collapses the paper
            // (backdrop dims, dialog looks empty / broken).
            m: { xs: 1, sm: 2 },
            width: { xs: 'calc(100% - 16px)' },
            maxWidth: { xs: 'calc(100% - 16px)', sm: 600 },
            maxHeight: { xs: 'calc(100% - 16px)', sm: 'calc(100% - 64px)' },
          },
        },
      }}
    >
      <DialogTitle id="rehearse-title" sx={{ pb: 1 }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <SchoolOutlinedIcon fontSize="small" />
          <Box sx={{ flex: 1, minWidth: 0 }}>
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
              {REHEARSE_TITLE}
              {phase !== 'done'
                ? ` · ${phaseIndex(phase) + 1}/3`
                : ' · complete'}
            </Typography>
            <Typography variant="h6" sx={{ fontSize: 20, lineHeight: 1.3 }}>
              {phase === 'tour' && 'Guided tour'}
              {phase === 'cards' && 'Flashcards'}
              {phase === 'quiz' && 'Am I ready?'}
              {phase === 'done' && (score.ready ? "You're ready" : 'Almost — review once')}
            </Typography>
          </Box>
          <HelpButton topic="skills-and-rules" />
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
          {REHEARSE_SUBTITLE}
        </Typography>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{ mt: 1.5, borderRadius: 999, height: 6 }}
        />
      </DialogTitle>

      <DialogContent dividers>
        {phase === 'tour' && beat && (
          <Stack spacing={1.5}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <PrimitiveChip label={beat.primitive} />
              <Typography variant="caption" color="text.secondary">
                Beat {tourIndex + 1} of {REHEARSE_TOUR.length}
              </Typography>
            </Stack>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              {beat.title}
            </Typography>
            <Box
              sx={{
                borderRadius: 2,
                border: `1px solid ${layoutTokens.border}`,
                bgcolor: layoutTokens.sidebarBg,
                p: 1.75,
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
                Say
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.45 }}>
                “{beat.say}”
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {beat.detail}
            </Typography>
          </Stack>
        )}

        {phase === 'cards' && card && (
          <Stack spacing={1.5}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <PrimitiveChip label={card.primitive} />
              <Typography variant="caption" color="text.secondary">
                Card {cardIndex + 1} of {cards.length}
              </Typography>
            </Stack>
            <Box
              component="button"
              type="button"
              onClick={() => setFlipped((v) => !v)}
              sx={{
                textAlign: 'left',
                cursor: 'pointer',
                borderRadius: 2,
                border: `1px solid ${layoutTokens.border}`,
                bgcolor: flipped ? layoutTokens.sidebarBg : '#fff',
                p: 2.25,
                minHeight: 168,
                font: 'inherit',
                transition: 'background-color 120ms ease',
                '&:hover': { borderColor: layoutTokens.text },
              }}
            >
              <Typography
                className="mono"
                sx={{
                  fontSize: 11,
                  color: 'text.secondary',
                  mb: 1,
                  wordBreak: 'break-all',
                }}
              >
                {card.path}
              </Typography>
              {!flipped ? (
                <>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {card.prompt}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Tap to reveal the line
                  </Typography>
                </>
              ) : (
                <>
                  <Typography variant="body1" sx={{ lineHeight: 1.5, mb: 1 }}>
                    {card.answer}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {card.teaches}
                  </Typography>
                </>
              )}
            </Box>
          </Stack>
        )}

        {phase === 'quiz' && question && (
          <Stack spacing={1.5}>
            <Typography variant="caption" color="text.secondary">
              Question {quizIndex + 1} of {REHEARSE_QUIZ.length}
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              {question.prompt}
            </Typography>
            <Stack spacing={1}>
              {question.options.map((opt) => {
                const selected = picked === opt.id;
                const revealed = picked !== null;
                const isCorrect = opt.id === question.correctOptionId;
                let border = layoutTokens.border;
                let bgcolor = '#fff';
                if (revealed && isCorrect) {
                  border = layoutTokens.accent;
                  bgcolor = 'rgba(16, 185, 129, 0.08)';
                } else if (revealed && selected && !isCorrect) {
                  border = '#BE202E';
                  bgcolor = 'rgba(190, 32, 46, 0.06)';
                } else if (selected) {
                  border = layoutTokens.text;
                }
                return (
                  <Box
                    key={opt.id}
                    component="button"
                    type="button"
                    disabled={picked !== null}
                    onClick={() => {
                      setPicked(opt.id);
                      setAnswers((prev) => ({
                        ...prev,
                        [question.id]: opt.id,
                      }));
                    }}
                    sx={{
                      textAlign: 'left',
                      cursor: picked ? 'default' : 'pointer',
                      borderRadius: 2,
                      border: `1px solid ${border}`,
                      bgcolor,
                      p: 1.5,
                      font: 'inherit',
                    }}
                  >
                    <Typography variant="body2">{opt.label}</Typography>
                  </Box>
                );
              })}
            </Stack>
            {picked && (
              <Typography variant="body2" color="text.secondary">
                {question.explain}
              </Typography>
            )}
          </Stack>
        )}

        {phase === 'done' && (
          <Stack spacing={1.5}>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {score.correct}/{score.total} correct
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {score.ready
                ? 'You can teach the spine: Rules stay on, Skills are the buttons, Agents are the pipeline — and Lab 4 is the exit.'
                : 'Skim the talk track once more, then retry the quiz. The three questions are the lines customers actually ask.'}
            </Typography>
            <Box
              sx={{
                borderRadius: 2,
                border: `1px solid ${layoutTokens.border}`,
                bgcolor: layoutTokens.sidebarBg,
                p: 1.75,
              }}
            >
              <Typography variant="body2">
                Next: package a leave-behind, then run the live script with Talk
                track open.
              </Typography>
            </Box>
          </Stack>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, justifyContent: 'space-between' }}>
        <Button onClick={handleClose}>Close</Button>
        <Stack direction="row" spacing={1}>
          {phase === 'tour' && (
            <>
              <Button
                disabled={tourIndex === 0}
                onClick={() => setTourIndex((i) => Math.max(0, i - 1))}
              >
                Back
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  if (tourIndex >= REHEARSE_TOUR.length - 1) {
                    setPhase('cards');
                    setCardIndex(0);
                    setFlipped(false);
                  } else {
                    setTourIndex((i) => i + 1);
                  }
                }}
              >
                {tourIndex >= REHEARSE_TOUR.length - 1
                  ? 'Flashcards'
                  : 'Next beat'}
              </Button>
            </>
          )}
          {phase === 'cards' && (
            <>
              <Button
                disabled={cardIndex === 0}
                onClick={() => {
                  setCardIndex((i) => Math.max(0, i - 1));
                  setFlipped(false);
                }}
              >
                Back
              </Button>
              <Button
                variant="outlined"
                onClick={() => setFlipped((v) => !v)}
              >
                {flipped ? 'Hide' : 'Reveal'}
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  if (cardIndex >= cards.length - 1) {
                    setPhase('quiz');
                    setQuizIndex(0);
                    setPicked(null);
                  } else {
                    setCardIndex((i) => i + 1);
                    setFlipped(false);
                  }
                }}
              >
                {cardIndex >= cards.length - 1 ? 'Quiz' : 'Next card'}
              </Button>
            </>
          )}
          {phase === 'quiz' && (
            <Button
              variant="contained"
              disabled={!picked}
              onClick={() => {
                if (quizIndex >= REHEARSE_QUIZ.length - 1) {
                  setPhase('done');
                } else {
                  setQuizIndex((i) => i + 1);
                  setPicked(null);
                }
              }}
            >
              {quizIndex >= REHEARSE_QUIZ.length - 1 ? 'See results' : 'Next'}
            </Button>
          )}
          {phase === 'done' && (
            <>
              {!score.ready && (
                <Button
                  onClick={() => {
                    setPhase('quiz');
                    setQuizIndex(0);
                    setAnswers({});
                    setPicked(null);
                  }}
                >
                  Retry quiz
                </Button>
              )}
              <Button variant="contained" onClick={handleClose}>
                {score.ready ? "Let's demo" : 'Done'}
              </Button>
            </>
          )}
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
