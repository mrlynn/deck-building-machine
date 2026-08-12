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
