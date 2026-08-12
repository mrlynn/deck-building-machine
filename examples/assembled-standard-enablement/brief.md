# Deck Brief

> Assembled from content-blocks via `npm run assemble:blocks`.
> Review, then run `/build-deck` or `/polish-deck` on the sibling deck-content.json.
> **SME package:** curriculum blocks are still draft — sign off before external 101.

---

## Deck information

| Field | Value |
|---|---|
| **Topic** | Standard enablement spine (leave-behind + curriculum drafts) |
| **Audience** | Customer champions and engineers in a Cursor demo |
| **Purpose** | Inform |
| **Target slide count** | 27 |
| **Presenter** | ADM / FE |
| **Delivery time** | 45–60 minutes (modular) |

---

## Background

Assembled content blocks for Deck Machine enablement.
Blocks are JTBD-named units under `content-blocks/` — not a Hub Studio hub.
This mix is the candidate **standard enablement** spine for review.

**Included blocks**

- Prove Rules stay on with Lab 4 (`prove-primitives-with-lab4@1.0.0`)
- Encode brand once so Agents and exporters share tokens (`encode-brand-as-tokens@1.0.0`)
- Catch thin decks with /deck-score before export (`govern-quality-with-cli@1.0.0`)
- Run the same Agent from the terminal with Cursor CLI (`use-cursor-cli@1.0.0`)
- Spend context on the task, not on rule bloat (`optimize-tokens@1.0.0`)
- Answer privacy questions and show how review gates work (`govern-privacy-and-review@1.0.0`)

---

## Key messages

1. Rules stay on; Skills are buttons; Agents are the pipeline.
2. Brand tokens are encoded once for Agents and exporters.
3. Quality gates (`/brand-check` + `/deck-score`) catch failures before export.
4. CLI, token budget, and privacy/review are the curriculum sidebars ADMs asked for.

---

## Content to include

### Prove Rules stay on with Lab 4

**Job:** After the happy-path PPTX, spend ~20 minutes so the room feels Rules / Skills / Agents — not another feature tour.

**Key messages**
1. Rules shape Agent output without typing `@` or `/` (`alwaysApply` brand rule).
2. Skills are what humans type under `/`; agents are the pipeline behind them.
3. Lab 4 proves quality: break a headline → `/brand-check` → fix → `/export-pptx`.

**Content to include**
- Always-on brand rule vs contextual deck-workflow rule
- Atomic skills: `/write-slide`, `/brand-check`, `/export-pptx` (not only `/build-deck`)
- Lab 4 exit: deliberate bad edit caught by brand-guardian
- Optional: `/deck-score` when a takeaway is deleted

**What to avoid**
- Topic-label headlines (“Overview”, “Q2 Results”)
- Treating the PPTX as the product — it is the proof artifact

---

### Encode brand once so Agents and exporters share tokens

**Job:** Show that Studio is encoding brand as always-on rules and shared export tokens — not decorating a single PowerPoint.

**Key messages**
1. Colors, fonts, voice, and words-to-avoid land in `.cursor/rules` and `brand/`.
2. Layout style (classic / minimal / bold) shapes both Agent slide mix and exporter frames.
3. Same tokens feed PPTX, DOCX, and XLSX skills — thin renderers, one factory.

**Content to include**
- Brand pack fields: primary/dark/grays, voice summary, logos on dark/light
- Always-on rule path: `.cursor/rules/<slug>-brand.mdc`
- Factory outputs: slides default; doc and workbook prove more renderers
- Day-2 ownership: brand/ stays with marketing + champion

**What to avoid**
- Implying Studio generates finished customer Office files in the browser
- Inventing chart numbers not in the brief

---

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

---

### Run the same Agent from the terminal with Cursor CLI

**Job:** Show that Cursor Agent is not locked to the IDE — terminal, scripts, and CI can run the same rules-aware agent.

**Key messages**
1. Install once (`curl https://cursor.com/install -fsS | bash` on macOS/Linux; PowerShell install on Windows), then run `agent`.
2. Modes match the editor: Agent (default), Plan (`--mode=plan` / `/plan`), Ask (`--mode=ask` / `/ask`).
3. Project `.cursor/rules` and `mcp.json` apply in the CLI the same way they do in the editor.
4. Use `agent -p "..."` for non-interactive scripts and CI; prepend `&` to hand off to Cloud Agent.

**Content to include**
- Install + `agent login` / `agent status`
- Interactive: `agent` or `agent "prompt"`
- Print mode: `agent -p "…" --output-format text`
- Optional: `agent resume`, worktrees (`-w`), sandbox (`/sandbox`)
- Tie-back: leave-behind Rules still shape CLI Agent output

**What to avoid**
- Implying CLI replaces the IDE for every workflow
- Documenting stale binary names — canonical entrypoint is `agent` (see cursor.com/docs/cli)
- Deep-diving every flag; teach the three modes + print + rules parity

**Review note:** Draft for SME pass (enablement priority #1). Verify install URLs and flags against https://cursor.com/docs/cli/overview before customer delivery.

---

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

---

### Answer privacy questions and show how review gates work

**Job:** Give ADMs a clear, doc-backed privacy story for leadership/GRC, then prove that leave-behind quality is gated in-repo — not left to hope.

**Key messages**
1. With Privacy Mode on, Cursor states code is not used for training by Cursor or model providers; ZDR agreements cover most models (see Cursor privacy docs).
2. Privacy Mode is on by default for Enterprise; Teams/Enterprise admins can enforce it org-wide so individuals cannot turn it off.
3. Be honest about edges: Cloud Agents store code temporarily by design (optional); some models need admin opt-in for provider retention; BYOK and personal accounts change the story.
4. Review habit: `/brand-check` (judgment) + `/deck-score` (structure) before export — governance of the artifact, not only of the vendor.

**Content to include**
- Two data flows: LLM requests vs Cloud Agents (enterprise privacy docs)
- Team dashboard enforcement + Allowed Team IDs / MDM for personal-account risk
- Point to official pages — do not paraphrase legal contracts in the room
- Leave-behind Lab 4 / scorecard as the customer-side review ritual

**What to avoid**
- Claiming “zero data leaves the device” — prompts and code context go to providers for inference
- Inventing certifications or DPA terms not on cursor.com/security
- Deep-diving every residency/CMEK option — mention Enterprise extras and hand to account team

**Review note:** Draft for SME + security enablement pass (priority #3). Re-check https://cursor.com/docs/enterprise/privacy-and-data-governance and https://cursor.com/data-use before customer delivery.

---

## Assembled talk tracks

# Talk track — Prove primitives with Lab 4

**Open:** “The PowerPoint proved the pipeline. These next minutes prove *why* the repo is wired this way.”

**Beats**
1. Rules — open `.cursor/rules/*-brand.mdc`, note `alwaysApply: true`. Ask for a topic-label slide without a skill; watch the insight rewrite.
2. Skills — open `/`, run `/write-slide` only, then `/export-pptx`. Atomic change, no full rebuild.
3. Agents — `/brand-check` wraps `brand-guardian`. Skills are the button; agents are the pipeline.
4. Lab 4 — break a headline or insert a banned phrase → `/brand-check` → fix → export.

**Exit line:** “You saw the rule catch a violation you introduced on purpose. That is the leave-behind working.”

**Time:** ~20 minutes total (Labs 1–4). Skip Lab 5 unless the room wants depth.

---

# Talk track — Encode brand as tokens

**Open:** “We are not picking colors for one deck. We are encoding brand so every Agent chat and every exporter agrees.”

**Beats**
1. In Studio Encode brand — point at the alert: colors and voice become always-on rules.
2. After download — open `brand/brand-pack.json` and `.cursor/rules/*-brand.mdc`.
3. Factory outputs — PPTX is the demo vehicle; Doc/XLSX are the same tokens, thin skills.
4. Ownership — marketing owns palette/voice; champion owns the Git home.

**Exit line:** “Change the brand pack once; Agents and exporters pick it up without a redesign loop.”

**Time:** ~5 minutes inside the packaging demo, or a short Encode brand teachable moment.

---

# Talk track — Govern quality with CLI

**Open:** “Brand-check is judgment. Deck-score is the structural gate — both before you trust the PPTX.”

**Beats**
1. After Lab 4 break — run `/brand-check` as usual.
2. Optional: strip a takeaway, run `/deck-score` (or `--strict`), show Depth/errors move.
3. Fix and re-export. Point at `.agents/skills/deck-score/` for champions who want CI later.
4. Reminder: Studio does not host a scorecard UI on purpose.

**Exit line:** “You have two gates: guardian for brand voice, CLI for thin structure.”

**Time:** ~3–5 minutes inside Lab 4, or a short add-on after the required brand-check pass.

---

# Talk track — Use Cursor CLI

**Open:** “If your engineers live in the terminal — or CI — they get the same Agent, not a lesser CLI toy.”

**Beats**
1. Install — show the one-liner from cursor.com/docs/cli/overview. Run `agent status` (or `agent login` if needed).
2. Parity — `cd` into the leave-behind repo. Start `agent`. Ask something that should hit the always-on brand rule. Point at `.cursor/rules`.
3. Modes — `/ask` for read-only, `/plan` before a bigger change, Agent to implement. Same mental model as the IDE.
4. Print mode — one `agent -p "summarize what Lab 4 proves" --output-format text` so they see automation.
5. Optional handoff — mention `&` for Cloud Agent and cursor.com/agents; do not derail into a full cloud tour.

**Exit line:** “Rules travel with the repo. The CLI is how terminal-first teams run the same factory.”

**Time:** ~10–12 minutes. Pair after Lab 1–2 if the room is IDE-heavy; lead with CLI if the audience is platform/CI.

**Live check before the room:** Confirm `agent --help` works on the demo machine; re-read https://cursor.com/docs/cli/overview if anything looks renamed.

---

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

---

# Talk track — Govern privacy and review

**Open:** “Security asks two different questions: what happens to our code with the vendor, and what happens before we ship a deck. Answer both.”

**Beats**
1. Privacy Mode — “With Privacy Mode enabled, Cursor’s docs state your code is not used for training by Cursor or model providers.” Link: cursor.com/help/security-and-privacy/privacy and data-use.
2. Enterprise default — Privacy Mode on by default for Enterprise; admins can enforce in the team dashboard so people cannot disable it. Mention Allowed Team IDs / MDM if corporate devices are in the room.
3. Honest edges — Cloud Agents are optional and store repo copies while they run. Some models sit outside ZDR and need admin approval. Personal accounts on corporate laptops break the story — enforce team login.
4. Do not overclaim — Inference still sends prompts and code context to providers. Point GRC to the enterprise privacy docs and account team for DPA/CMEK/residency.
5. Review gates — Flip to the leave-behind: deliberate bad edit → `/brand-check` → optional `/deck-score` → fix → export. That is governance of *their* output.

**Exit line:** “Vendor controls + in-repo review. Neither replaces the other.”

**Time:** ~10–12 minutes. Often after CLI / tokens, or as the security sidebar in a 101.

**Live check:** Re-read enterprise privacy + data-use pages the morning of the session — model-retention exceptions change.

---

## What to avoid

- Topic-label headlines
- Treating Studio as an Office SaaS
- Skipping Lab 4 exit criteria
- Shipping draft curriculum externally before SME / security sign-off
