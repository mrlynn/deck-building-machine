# Talk track — Prove primitives with Lab 4

**Open:** “The PowerPoint proved the pipeline. These next minutes prove *why* the repo is wired this way.”

**Beats**
1. Rules — open `.cursor/rules/*-brand.mdc`, note `alwaysApply: true`. Ask for a topic-label slide without a skill; watch the insight rewrite.
2. Skills — open `/`, run `/write-slide` only, then `/export-pptx`. Atomic change, no full rebuild.
3. Agents — `/brand-check` wraps `brand-guardian`. Skills are the button; agents are the pipeline.
4. Lab 4 — break a headline or insert a banned phrase → `/brand-check` → fix → export.

**Exit line:** “You saw the rule catch a violation you introduced on purpose. That is the leave-behind working.”

**Time:** ~20 minutes total (Labs 1–4). Skip Lab 5 unless the room wants depth.
