/** Shared media constants for the Deck Machine primitives overview video. */

import type { CursorPrimitive } from './teachable-moments';

export const PRIMITIVES_VIDEO_PATH = '/deck-machine-primitives.mp4';
export const PRIMITIVES_VIDEO_POSTER_PATH = '/deck-machine-primitives-poster.jpg';

export const PRIMITIVES_VIDEO_DURATION_SECONDS = 44;

export const PRIMITIVES_VIDEO_CAPTION =
  'About 45 seconds — how Rules, Skills, and Agents fit together in the leave-behind.';

export type PrimitivesVideoChapter = {
  id: CursorPrimitive;
  label: string;
  /** Seek target in seconds (tuned from frame samples of the MP4). */
  startSeconds: number;
  blurb: string;
};

/**
 * Chapter markers for seek-on-pill. Tuned from sampled frames:
 * ~15s Rules, ~22s Skills, ~30s Agents (closing diagram ~38s).
 */
export const PRIMITIVES_VIDEO_CHAPTERS: PrimitivesVideoChapter[] = [
  {
    id: 'Rules',
    label: 'Rules',
    startSeconds: 12,
    blurb: 'Always on — brand standards load without a command.',
  },
  {
    id: 'Skills',
    label: 'Skills',
    startSeconds: 20,
    blurb: 'The button — slash commands humans pick under /.',
  },
  {
    id: 'Agents',
    label: 'Agents',
    startSeconds: 28,
    blurb: 'The pipeline — multi-step workers skills invoke.',
  },
];

/** Wizard strip — collapsed by default for return visitors. */
export const PRIMITIVES_STRIP_TITLE =
  'See how Rules, Skills, and Agents fit together';
export const PRIMITIVES_STRIP_SUBTITLE =
  '45-second overview — still here after you dismiss the welcome modal';
export const PRIMITIVES_STRIP_EXPAND_LABEL = 'Watch overview';
export const PRIMITIVES_STRIP_COLLAPSE_LABEL = 'Hide video';
