/** Deck layout styles selected in Studio and baked into generated exporters/rules. */

export const LAYOUT_STYLE_IDS = ['classic', 'minimal', 'bold'] as const;

export type LayoutStyleId = (typeof LAYOUT_STYLE_IDS)[number];

export type LayoutStyleDef = {
  id: LayoutStyleId;
  label: string;
  tagline: string;
  description: string;
  /** Guidance injected into always-on brand rules for agents */
  agentGuidance: string;
  /** Brief-analyzer / slide-writer preference hints */
  slideMixHint: string;
};

export const LAYOUT_STYLES: Record<LayoutStyleId, LayoutStyleDef> = {
  classic: {
    id: 'classic',
    label: 'Executive Classic',
    tagline: 'Primary title slides, clear accent bars',
    description:
      'The default corporate look: full-bleed primary titles, thin accent bars on content slides, and light-gray metric tiles. Familiar and boardroom-safe.',
    agentGuidance:
      'Layout style is Executive Classic. Prefer primary/full-bleed title and section slides. Use content slides with a clear insight headline and short bullets. Metrics tiles on light gray. Keep visual density moderate — do not overcrowd.',
    slideMixHint:
      'Balanced mix: title, optional agenda, content, metrics, chart/diagram where the story is numeric or process, closing. Section dividers when the deck exceeds ~10 slides. Prefer diagram/chart over image.',
  },
  minimal: {
    id: 'minimal',
    label: 'Minimal Air',
    tagline: 'More whitespace, quieter chrome',
    description:
      'Light title treatments, larger type, fewer bars and dots. Best when the story should feel calm and premium rather than branded-loud.',
    agentGuidance:
      'Layout style is Minimal Air. Prefer light backgrounds, generous whitespace, and fewer slides with denser chrome. Favor insight headlines with 3 bullets max when possible. Use metrics sparingly (2–3 stats). Prefer clean diagram flows over busy image slides. Avoid stacking section dividers — keep the deck short and airy.',
    slideMixHint:
      'Shorter decks (8–10). Prefer content, quote, and simple diagram/chart over heavy sectioning. Metrics only when numbers are the point.',
  },
  bold: {
    id: 'bold',
    label: 'Bold Signal',
    tagline: 'Dark frames, stronger primary accents',
    description:
      'Dark title/section frames, thicker primary accents, and louder metric treatments. Use when the room needs high contrast and decisive visuals.',
    agentGuidance:
      'Layout style is Bold Signal. Prefer dark title and section slides with strong primary accents. Lean into metrics, charts, and two-column contrasts. Keep bullets punchy (verbs, short). Closing slides should feel decisive with numbered actions.',
    slideMixHint:
      'Lead with a strong title, use metrics or chart early, and include at least one two-column, diagram, or quote for contrast. Section dividers welcome in longer decks.',
  },
};
export const DEFAULT_LAYOUT_STYLE: LayoutStyleId = 'classic';

export function isLayoutStyleId(value: string | null | undefined): value is LayoutStyleId {
  return Boolean(value && value in LAYOUT_STYLES);
}

export function resolveLayoutStyle(value: string | null | undefined): LayoutStyleId {
  return isLayoutStyleId(value) ? value : DEFAULT_LAYOUT_STYLE;
}

export function layoutStyleList(): LayoutStyleDef[] {
  return LAYOUT_STYLE_IDS.map((id) => LAYOUT_STYLES[id]);
}
