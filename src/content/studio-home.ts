/**
 * ChatGTM-inspired home starters — job-shaped, not feature-shaped.
 * Primary CTA lives in the sidebar (+ mobile app bar); Package tab is the account library.
 */

export const STUDIO_HOME_GREETING = 'What would you like to do?';

export const STUDIO_HOME_SUBTITLE =
  'Package a branded Cursor leave-behind from the sidebar, or prep for the room. Recent accounts stay in the rail.';

export const STUDIO_HOME_TABS = [
  {
    id: 'Package' as const,
    label: 'Library',
    subtitle:
      'Search and resume brand packs from this browser — same list as the sidebar.',
  },
  {
    id: 'Prepare' as const,
    label: 'Prepare',
    subtitle: 'Warm up before the live room — rehearse, talk track, or teach.',
  },
];

export const STUDIO_HOME_PRIMARY = {
  id: 'package' as const,
  title: 'Package leave-behind',
  description: 'Find account → encode brand → download zip',
};

export type StudioHomeJobId =
  | 'package'
  | 'rehearse'
  | 'talk-track'
  | 'teach';

export type StudioHomeJob = {
  id: Exclude<StudioHomeJobId, 'package'>;
  category: 'Prepare';
  title: string;
  description: string;
};

/** Prepare-tab jobs (Library tab uses AccountLibrary cards). */
export const STUDIO_HOME_JOBS: StudioHomeJob[] = [
  {
    id: 'rehearse',
    category: 'Prepare',
    title: 'Rehearse for the room',
    description: 'Five minutes: beats, flashcards, readiness quiz',
  },
  {
    id: 'talk-track',
    category: 'Prepare',
    title: 'Open talk track',
    description: 'Live demo script with copy helpers',
  },
  {
    id: 'teach',
    category: 'Prepare',
    title: 'Skills, rules, and agents',
    description: 'Teaching spine for the leave-behind demo',
  },
];
