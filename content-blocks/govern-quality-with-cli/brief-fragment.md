### Catch thin decks with /deck-score before export

**Job:** Add a structural quality gate next to brand judgment so leave-behinds do not ship with topic labels or missing depth.

**Key messages**
1. `/brand-check` runs brand-guardian — voice, banned phrases, insight headlines.
2. `/deck-score` is a Node CLI on `deck-content.json` — structure, depth, aesthetics (warn by default; `--strict` to fail).
3. Lab 4 optional path: delete a takeaway → score drops → fix → re-check.

**Content to include**
- When to run brand-check vs deck-score
- `npm run smoke:deck-quality` / skill script paths for maintainers
- Strict mode for CI-minded champions
- Not a Studio dashboard — CLI and skills only (per scorecard spec)

**What to avoid**
- Treating scorecard as a vanity dashboard in Studio
- Inventing metrics to “pass” aesthetics
