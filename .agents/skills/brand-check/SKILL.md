---
name: brand-check
description: Review presentation content or a deck-content.json file for Acme brand compliance. Returns a report with flagged issues and suggested fixes.
---

# /brand-check

Review your deck for Acme brand compliance before sharing.

## How to use

```
/brand-check
```

Reviews `deck-content.json` in the current directory.

Or specify a file:
```
/brand-check path/to/deck-content.json
```

## What it checks

- Insight headlines (not topic labels)
- Bullet count and length
- Jargon and passive voice
- One idea per slide
- Data with context
- Color and typography notes

## Prompt for agent

When invoked:
1. Resolve the deck path from the argument, or use `deck-content.json` in the current directory.
2. Run the Node scorer first. This step is required; do not skip it:

   ```bash
   node .agents/skills/deck-score/scripts/score-deck.js path/to/deck-content.json --json
   ```

3. Parse the command's stdout as the `DeckQualityReport`, then delegate to `brand-guardian` with both the deck JSON and the complete scorecard JSON pasted in the prompt. The guardian must preserve that scorecard unchanged and add its judgment.
4. Display the structural scorecard first, including every category and Aesthetics:

   | Category | Score |
   |---|---|
   | Structure | 100 |
   | Notes | 50 |
   | Depth | 40 |
   | Visuals | 67 |
   | Variety | 100 |
   | Aesthetics | 80 |

5. Display the guardian's Judgment next:

   | Dimension | Judgment |
   |---|---|
   | Spine | Pass |
   | Voice | Warn |
   | Evidence | Pass |
   | Aesthetics | Pass |

6. Display the per-slide brand table:

| Slide | Status | Issues |
|---|---|---|
| 1: Title | ✓ Pass | — |
| 3: Situation | ⚠ Warning | Headline is a topic label, not an insight |

7. For each error/warning, show the current content and the suggested fix.
8. Ask: "Apply all suggested fixes automatically? (yes/no)"

## Output

- Review report displayed in chat
- Optionally: corrected `deck-content.json` with fixes applied
