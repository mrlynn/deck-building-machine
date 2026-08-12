/**
 * ADM/FE rehearsal content — guided beats, flashcards, and a short readiness quiz.
 * Flashcards are derived from ARTIFACT_ANNOTATIONS so demo tips stay single-sourced.
 */

import {
  ARTIFACT_ANNOTATIONS,
  resolveArtifactPath,
  type CursorPrimitive,
} from './teachable-moments';

export type RehearsePhase = 'tour' | 'cards' | 'quiz' | 'done';

export type TourBeat = {
  id: string;
  primitive: CursorPrimitive;
  title: string;
  say: string;
  detail: string;
};

export type Flashcard = {
  id: string;
  primitive: CursorPrimitive;
  /** Path shown on the front (with {{slug}} resolved for display). */
  path: string;
  /** Prompt on the front — what should you say? */
  prompt: string;
  /** Answer on the back — the demo tip. */
  answer: string;
  teaches: string;
};

export type QuizOption = {
  id: string;
  label: string;
};

export type QuizQuestion = {
  id: string;
  prompt: string;
  options: QuizOption[];
  correctOptionId: string;
  explain: string;
};

/** High-signal guided tour — not every file, just the teaching spine. */
export const REHEARSE_TOUR: TourBeat[] = [
  {
    id: 'rules',
    primitive: 'Rules',
    title: 'Open the brand rule first',
    say: 'Rules load without asking — this is how brand constraints stay on.',
    detail:
      'Point at .cursor/rules/<slug>-brand.mdc. Contrast with deck-workflow.mdc (on-demand process).',
  },
  {
    id: 'skills',
    primitive: 'Skills',
    title: 'Show Skills under /',
    say: 'Skills are the buttons humans press — create-brief, build-deck, brand-check.',
    detail:
      'In Agent chat, open /. Customers invoke skills; they rarely type agent names.',
  },
  {
    id: 'agents',
    primitive: 'Agents',
    title: 'Peek behind /build-deck',
    say: 'Skills are the button; agents are the pipeline behind it.',
    detail:
      'deck-builder orchestrates brief-analyzer → slide-writer → visual-creator → brand-guardian.',
  },
  {
    id: 'lab4',
    primitive: 'Skills',
    title: 'Required exit — Lab 4',
    say: 'Skill wraps agent. Break a headline, run /brand-check, fix, export.',
    detail:
      'Learning exit criterion: someone can explain Rules vs Skills vs Agents after Lab 4.',
  },
];

const FLASHCARD_PATHS = [
  '.cursor/rules/{{slug}}-brand.mdc',
  '.cursor/rules/deck-workflow.mdc',
  '.agents/skills/create-brief/SKILL.md',
  '.agents/skills/build-deck/SKILL.md',
  '.agents/skills/brand-check/SKILL.md',
  '.cursor/agents/deck-builder.md',
  '.cursor/agents/brand-guardian.md',
  'docs/primitives-lab.md',
] as const;

export function buildFlashcards(slug = 'customer'): Flashcard[] {
  const byPath = new Map(
    ARTIFACT_ANNOTATIONS.map((a) => [a.pathPattern, a] as const),
  );
  const cards: Flashcard[] = [];
  for (const pattern of FLASHCARD_PATHS) {
    const annotation = byPath.get(pattern);
    if (!annotation) continue;
    cards.push({
      id: pattern,
      primitive: annotation.primitive,
      path: resolveArtifactPath(pattern, slug),
      prompt: 'What do you say when you open this file?',
      answer: annotation.demoTip,
      teaches: annotation.teaches,
    });
  }
  return cards;
}

export const REHEARSE_QUIZ: QuizQuestion[] = [
  {
    id: 'skill-vs-agent',
    prompt: 'A customer asks: “What’s the difference between a Skill and an Agent?”',
    options: [
      {
        id: 'a',
        label: 'Skills are slash commands humans run; agents are multi-step workers skills invoke',
      },
      {
        id: 'b',
        label: 'Agents appear under /; skills only run in the background',
      },
      {
        id: 'c',
        label: 'They are the same thing with two names',
      },
    ],
    correctOptionId: 'a',
    explain:
      'Skills are the button (/build-deck). Agents are the pipeline (deck-builder and specialists).',
  },
  {
    id: 'where-brand',
    prompt: 'Where does always-on brand live so it shapes every chat?',
    options: [
      { id: 'a', label: 'templates/brief.md' },
      { id: 'b', label: '.cursor/rules/<slug>-brand.mdc with alwaysApply' },
      { id: 'c', label: 'Only inside the PPTX exporter' },
    ],
    correctOptionId: 'b',
    explain:
      'The brand rule is always-on. The exporter shares the same tokens, but the teaching point is ambient rules.',
  },
  {
    id: 'lab4',
    prompt: 'What is Lab 4 (the required learning exit)?',
    options: [
      {
        id: 'a',
        label: 'Export a second PPTX with a different layout style',
      },
      {
        id: 'b',
        label: 'Break a headline or banned phrase → /brand-check → fix → /export-pptx',
      },
      {
        id: 'c',
        label: 'Hand-edit templates/brief.md before the first build',
      },
    ],
    correctOptionId: 'b',
    explain:
      'Lab 4 proves skill + agent + rule together. The happy-path PPTX alone is not the exit criterion.',
  },
];

export const REHEARSE_TITLE = 'Rehearse';
export const REHEARSE_SUBTITLE =
  'Five minutes: tour the teaching beats, flip flashcards, then a 3-question readiness check.';

export function quizScore(
  answers: Record<string, string>,
): { correct: number; total: number; ready: boolean } {
  const total = REHEARSE_QUIZ.length;
  let correct = 0;
  for (const q of REHEARSE_QUIZ) {
    if (answers[q.id] === q.correctOptionId) correct += 1;
  }
  return { correct, total, ready: correct === total };
}
