# Talk track — Optimize tokens / context

**Open:** “Context is working memory. If you fill it with rules nobody needed for this task, the model has less room for your code.”

**Beats**
1. Open `.cursor/rules` in the leave-behind. Point at the brand rule with `alwaysApply: true` — intentional, keep it lean.
2. Open `deck-workflow` (or equivalent) — *not* always on. That is the pattern: pay every turn only for what must always be true.
3. Show the four apply modes from Cursor docs: Always, Intelligently (description), Specific Files (globs), Manual (@-mention).
4. Anti-pattern: “paste the whole style guide into alwaysApply.” Fix: linter + short rule + `@` reference to an example file.
5. Session: when you switch jobs, start a new chat. Prefer Agent exploring the repo over attaching 15 files.

**Exit line:** “Budget always-on. Scope the rest. Point, don’t paste.”

**Time:** ~8–10 minutes. Pairs after Encode brand / Rules lab.

**Live check:** https://cursor.com/docs/context/rules — confirm apply-mode table still matches before the room.
