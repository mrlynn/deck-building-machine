/**
 * Wizard page headers — ChatGTM-style title + purpose subtitle per step.
 */

export type WizardStepMeta = {
  /** Stepper label (short). */
  label: string;
  /** Insight-style page title. */
  title: string;
  /** One-line purpose under the title. */
  subtitle: string;
  helpTopic: 'customer' | 'brand-pack' | 'generate';
};

export const WIZARD_STEPS: WizardStepMeta[] = [
  {
    label: 'Find account',
    title: 'Find the customer',
    subtitle:
      'Enter a customer name, search Brandfetch, import a pack, or resume a recent account.',
    helpTopic: 'customer',
  },
  {
    label: 'Encode brand',
    title: 'Encode brand',
    subtitle:
      'Confirm colors, logos, and voice — this is what the leave-behind zip will use.',
    helpTopic: 'brand-pack',
  },
  {
    label: 'Download leave-behind',
    title: 'Download leave-behind',
    subtitle:
      'Preview the Cursor factory output, then download the branded zip.',
    helpTopic: 'generate',
  },
];
