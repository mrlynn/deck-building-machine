---
name: create-outline
description: Analyze a brief and create a structured deck outline. Use before writing slides when you want to review the story arc first.
---

# /create-outline

Creates a slide-by-slide outline from a brief. Use this when you want to review and adjust the story structure before writing full slide content.

## How to use

```
/create-outline path/to/brief.md
```

## What happens

1. Reads your brief
2. Identifies audience, purpose, and key messages
3. Selects the right story arc
4. Assigns slide types and insight headlines
5. Outputs the outline for your review

## Prompt for agent

When invoked:
1. Read the brief file
2. Delegate to `brief-analyzer` subagent
3. Display the returned outline in a readable format (table or numbered list)
4. Ask the user: "Does this outline tell the story you want? Type 'yes' to proceed to slide writing, or describe changes."

## Output format display

Show the outline as a table:
| # | Type | Headline | Notes |
|---|---|---|---|
| 1 | title | Deck title | ... |

## After approval

When the user approves the outline, offer to continue:
```
Ready to write slides. Run /build-deck to generate the full deck, or /write-slide to work on one slide at a time.
```
