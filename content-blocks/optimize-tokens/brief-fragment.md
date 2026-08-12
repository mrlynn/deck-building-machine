### Spend context on the task, not on rule bloat

**Job:** Teach that every always-on rule and every pasted file competes with the actual task for context — so champions design Rules like a budget, not a dump.

**Key messages**
1. Applied rules are injected into model context (see Cursor Rules docs) — `alwaysApply: true` pays on every chat.
2. Prefer scoped rules: globs for file types, `description` for Apply Intelligently, manual `@rule` for rare checklists.
3. Keep rules focused (docs: under 500 lines; split large ones). Reference files with `@` instead of copying contents.
4. Session hygiene: new chat when the job changes; let Agent explore instead of attaching a dozen files.

**Content to include**
- Four apply modes: Always / Intelligently / Specific Files / Manual
- Leave-behind pattern: one lean always-on brand rule; workflow rules stay contextual
- Anti-patterns: monolithic always-on style guides, duplicating what Agent already knows
- Tie to Lab / decision tree: “if it should always apply, make it a Rule — but make it short”

**What to avoid**
- Inventing exact token prices or undocumented UI gauges
- Telling teams to delete the brand `alwaysApply` rule — that tax is intentional
- Turning this into a full model-picker tutorial

**Review note:** Draft for SME pass (enablement priority #2). Re-check https://cursor.com/docs/context/rules before customer delivery.
