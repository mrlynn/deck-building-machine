/**
 * Copy strings for talk track, mission control, and shareable demo helpers.
 * Long-form curriculum stays in help.ts / teachable-moments.ts.
 */

import type { HelpTopicId } from './help';
import { DEMO_SCRIPT_BULLETS, DEMO_SCRIPT_HELP_TOPIC } from './teachable-moments';

export const DEMO_PASTE = `Deck for Naveen Aug 7. Ask for sprint day resources and a longer meeting.
1,300 MAU, 40% MCP. Peers: NAB, Money Forward, Amplitude.`;

export const LAB4_PROMPT =
  'Open docs/primitives-lab.md and complete Lab 4: deliberately break a headline or use a banned phrase, run /brand-check, fix it, then /export-pptx.';

export const CREATE_BRIEF_COMMAND = '/create-brief';
export const BUILD_DECK_COMMAND = '/build-deck brief.md';
export const BUILD_DOC_COMMAND = '/build-doc brief.md';
export const EXPORT_METRICS_COMMAND = '/export-metrics-xlsx';
export const BRAND_CHECK_COMMAND = '/brand-check';

export type MissionStep = {
  id: string;
  title: string;
  detail: string;
  copyText?: string;
  copyLabel?: string;
};

export function missionStepsForCustomer(customerName: string): MissionStep[] {
  const name = customerName.trim() || 'your customer';
  return [
    {
      id: 'open',
      title: 'Open the unzipped folder in Cursor',
      detail:
        'Brand rules load automatically — no @ or / needed. Say: “Rules stay on without asking.”',
    },
    {
      id: 'skills',
      title: 'Show Skills under / in Agent chat',
      detail:
        'Point at create-brief, build-deck, and brand-check. Skills are the buttons humans press.',
      copyText: CREATE_BRIEF_COMMAND,
      copyLabel: 'Copy /create-brief',
    },
    {
      id: 'brief',
      title: 'Run /create-brief with real notes',
      detail: 'Talk or paste — never hand-fill the brief template.',
      copyText: DEMO_PASTE,
      copyLabel: 'Copy demo paste',
    },
    {
      id: 'build',
      title: 'Run /build-deck brief.md',
      detail: 'Narrate agents working behind the skill while the PPTX builds.',
      copyText: BUILD_DECK_COMMAND,
      copyLabel: 'Copy /build-deck',
    },
    {
      id: 'proof',
      title: 'Open the PPTX from output/',
      detail: `Proof the pipeline worked for ${name} — the deck is evidence, not the product. The zip did not contain this file; Cursor built it.`,
    },
    {
      id: 'thin-renderers',
      title: 'Optional: show Document or Workbook',
      detail:
        'Same factory, more renderers — /build-doc (Word) or /export-metrics-xlsx (Excel from deck metrics/charts). Not a second product.',
      copyText: `${BUILD_DOC_COMMAND}\n${EXPORT_METRICS_COMMAND}`,
      copyLabel: 'Copy doc + workbook commands',
    },
    {
      id: 'lab4',
      title: 'Required exit: Lab 4 (break → fix)',
      detail:
        'Bad headline or banned phrase → /brand-check → fix → /export-pptx.',
      copyText: LAB4_PROMPT,
      copyLabel: 'Copy Lab 4 prompt',
    },
    {
      id: 'day2',
      title: 'Leave them on docs/after-the-demo.md',
      detail: 'Ownership, preflight, and when to regenerate vs edit.',
    },
  ];
}

/** Paste-ready email for the customer after the call (not Slack — many accounts aren’t on it). */
export function emailHandoffBlurb(customerName: string, slug: string): string {
  const name = customerName.trim() || 'your team';
  const folder = `${slug || 'customer'}-deck-machine`;
  return [
    `Subject: Cursor leave-behind for ${name}`,
    '',
    'Hi —',
    '',
    `Here’s the Cursor leave-behind we packaged for ${name}. Unzip ${folder}.zip and open the folder in Cursor.`,
    '',
    'Brand rules load automatically. In Agent chat, run /create-brief (talk or paste notes), then /build-deck brief.md — that creates the PPTX in output/ (it is not inside the zip).',
    '',
    'Optional after the first deck: /build-doc for a Word narrative, or /export-metrics-xlsx for a metrics workbook from the same brand pack.',
    '',
    'After the first PPTX, do Lab 4 in docs/primitives-lab.md (break a headline → /brand-check → fix). Day-2 ownership is in docs/after-the-demo.md.',
    '',
    'Happy to jump on a follow-up if useful.',
  ].join('\n');
}

export type TalkTrackStepNudge = {
  step: number;
  say: string;
};

export const TALK_TRACK_NUDGES: TalkTrackStepNudge[] = [
  {
    step: 0,
    say: 'We’re packaging a demo kit — not generating their deck in the browser.',
  },
  {
    step: 1,
    say: 'You’re encoding brand as always-on rules. Colors and voice land in .cursor/rules.',
  },
  {
    step: 2,
    say: 'Flip Document → Workbook → Slides once (kit, not finished files). After download: /create-brief → /build-deck → Lab 4.',
  },
];

export const TALK_TRACK_TITLE = 'Talk track';
export const TALK_TRACK_HELP_TOPIC: HelpTopicId = DEMO_SCRIPT_HELP_TOPIC;

export { DEMO_SCRIPT_BULLETS, DEMO_SCRIPT_HELP_TOPIC };
