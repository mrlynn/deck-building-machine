/** Stage-specific starter questions for the Studio assistant. */

export type AssistantStageExamples = {
  step: number;
  stepName: string;
  blurb: string;
  questions: string[];
};

export const ASSISTANT_EXAMPLES_BY_STEP: Record<number, AssistantStageExamples> = {
  0: {
    step: 0,
    stepName: 'Find account',
    blurb: 'Finding the account and deciding how brand details get into Studio.',
    questions: [
      'Where do the brand details come from?',
      'How do I find a customer if Databricks is not configured?',
      'When should I use Brandfetch search vs typing the name myself?',
      'How do recent accounts and share links work?',
      'Where are Talk track and Rehearse?',
      'What is Deck Machine Studio actually for?',
      'Does the Salesforce account id get baked into the zip?',
    ],
  },
  1: {
    step: 1,
    stepName: 'Encode brand',
    blurb: 'Colors, voice, logos, and layout that get rendered into the demo repo.',
    questions: [
      'What does Brandfetch prefill, and what should I still review?',
      'What does the prefill confidence banner mean?',
      'Which logo goes on dark backgrounds vs light ones?',
      'What do Classic, Minimal, and Bold change in the deck?',
      'How should I write the voice summary for this customer?',
      'What is the repo slug used for?',
    ],
  },
  2: {
    step: 2,
    stepName: 'Download leave-behind',
    blurb: 'What you download, and what to do with it in Cursor next.',
    questions: [
      'What files are inside the zip I am about to download?',
      'What should I do after I download the zip?',
      'What is Mission control?',
      'How do I demo this live?',
      'How do /create-brief and /build-deck work?',
      'Will any branding leak into the customer zip?',
      'What is the difference between skills, rules, and agents?',
    ],
  },
};

export function getAssistantExamples(step: number): AssistantStageExamples {
  return ASSISTANT_EXAMPLES_BY_STEP[step] ?? ASSISTANT_EXAMPLES_BY_STEP[0];
}
