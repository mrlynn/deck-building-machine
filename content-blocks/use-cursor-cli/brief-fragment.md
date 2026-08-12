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
