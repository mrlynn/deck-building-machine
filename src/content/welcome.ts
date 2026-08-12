/** Short welcome pitch for first-visit modal. Deeper detail lives in Help overview. */

import {
  POST_DOWNLOAD_ARC,
  WELCOME_PRIMITIVE_PILLS,
} from './teachable-moments';

export const WELCOME_COOKIE_NAME = 'deck-machine-welcome-dismissed';
export const WELCOME_COOKIE_VALUE = '1';
/** ~10 years in seconds */
export const WELCOME_COOKIE_MAX_AGE_SECONDS = 315_360_000;

export const WELCOME_EYEBROW = 'Deck Machine Studio';
export const WELCOME_TITLE = 'What is this?';

export const WELCOME_PARAGRAPHS = [
  'ADMs and FEs use this to give customers a firsthand demo of how skills, rules, and agents land in Cursor — immediately.',
  'Customers leave with a working repo they can open and run, not a slide about AI.',
] as const;

export const WELCOME_VIDEO_CAPTION =
  'Watch the overview (~45s). Unmute if you want narration — Skills, Rules, and Agents in one sitting.';

/** @deprecated Prefer WELCOME_PRIMITIVE_PILLS — kept for any callers expecting string labels. */
export const WELCOME_PILLS = WELCOME_PRIMITIVE_PILLS.map((p) => p.label);

export { WELCOME_PRIMITIVE_PILLS, POST_DOWNLOAD_ARC };

export const WELCOME_DONT_SHOW_LABEL = "Don't show again";
export const WELCOME_LEARN_MORE_LABEL = 'Learn more';
export const WELCOME_GOT_IT_LABEL = 'Got it';
