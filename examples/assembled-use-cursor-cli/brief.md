# Deck Brief

> Assembled from content-blocks via `npm run assemble:blocks`.
> Review, then run `/build-deck` or `/polish-deck` on the sibling deck-content.json.

---

## Deck information

| Field | Value |
|---|---|
| **Topic** | Leave-behind teaching blocks (assembled) |
| **Audience** | Customer champions and engineers in a Cursor demo |
| **Purpose** | Inform |
| **Target slide count** | 7 |
| **Presenter** | ADM / FE |
| **Delivery time** | 20–30 minutes |

---

## Background

Assembled content blocks for Deck Machine enablement.
Blocks are JTBD-named units under `content-blocks/` — not a Hub Studio hub.

**Included blocks**

- Run the same Agent from the terminal with Cursor CLI (`use-cursor-cli@1.0.0`)

---

## Key messages

1. Rules stay on; Skills are buttons; Agents are the pipeline.
2. Brand tokens are encoded once for Agents and exporters.
3. Quality gates (`/brand-check` + `/deck-score`) catch failures before export.

---

## Content to include

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

## Assembled talk tracks

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

## What to avoid

- Topic-label headlines
- Treating Studio as an Office SaaS
- Skipping Lab 4 exit criteria
