---
name: create-brief
description: Create a deck brief by interviewing the user or extracting from pasted notes. Writes brief.md so Paul never has to learn the template format. Use when starting a new deck, when the user has no brief yet, or when they paste Slack/email/meeting notes and want a structured brief.
---

# /create-brief

Turn a conversation or pasted notes into a structured `brief.md`. The human never fills `templates/brief.md` by hand — the Agent does.

## How to use

```
/create-brief
```

Or with raw notes pasted after the command:

```
/create-brief

Need a deck for Naveen Aug 7. Ask for sprint day resources and longer meeting.
1,300 MAU, 40% MCP. Peers: NAB, Money Forward, Amplitude.
```

Optional output path:

```
/create-brief path/to/my-brief.md
```

Default output: `brief.md` in the workspace root.

## What happens

1. **MCP context pass** (when tools are connected) — pull meeting / account context before asking
2. Collects deck inputs (interview **or** extract from paste / MCP)
3. Confirms a short summary with the user
4. Writes a complete brief matching `templates/brief.md`
5. Offers `/build-deck brief.md` (and mentions `/build-doc` if they need a narrative doc instead)

## Prompt for agent

When invoked, do the following:

### 0. MCP context pass (before interview)

If MCP / connected tools are available in this session, use them **once** to pre-fill the brief — then only ask for gaps. Do not invent tool results.

| Signal in the user message | Prefer |
|---|---|
| Named meeting, “last sync”, “what we discussed”, a person’s recent call | Meeting notes tools (e.g. Granola `query_granola_meetings` / `list_meetings`) |
| Account / company / Salesforce context | Company or CRM search tools if connected |
| Pasted Slack / email / notes | Skip MCP for that content — paste wins |

Rules for the MCP pass:

- Query with the user’s words (meeting name, account, date range). Prefer the last 30 days unless they specify.
- Extract only: situation, audience hints, ask/decision, metrics, proof points, avoid-list candidates.
- Cite what you used in the confirmation (“From Granola: …”).
- If tools are missing, fail auth, or return nothing useful: **continue silently** to paste/interview — do not block on MCP setup.
- Never tell the user they must configure MCP to use `/create-brief`.

### 1. Choose intake mode

- **Paste mode** — If the user pasted notes, Slack, email, or meeting text with the command (or in the same message), extract fields from that text. Do **not** re-ask for information already present.
- **MCP-assisted mode** — If step 0 filled most fields, treat MCP output like a paste; ask only what’s missing.
- **Interview mode** — If there is no usable paste and MCP did not help, ask the questions below. Ask only what is missing. Prefer one short batch of questions over a long back-and-forth.

### 2. Required fields to collect

Get enough to fill the template. Defaults in brackets if the user skips:

| Field | Ask as | Default if skipped |
|---|---|---|
| Topic | What is this deck about? | (required — do not invent) |
| Audience | Who is in the room? | Marriott leadership |
| Purpose | Inform / Persuade / Update / Request? | persuade |
| Ask | What should they decide or do? | (required if purpose is persuade/request) |
| Key messages | What 3 things should stick? | Derive from topic + ask if user gives 1–2 |
| Metrics / proof | Any numbers or examples to include? | Optional — leave placeholder bullets |
| Avoid | Anything off-limits? | Optional |
| Presenter | Who presents? | User's name if known, else blank |
| Date | When? | Current month YYYY |
| Slide count | How many slides? | 8–10 |
| Delivery time | How long? | 20 minutes |

Interview script (use conversational wording, not a form):

1. Who is this for, and what do you want them to do?
2. What's the situation in 2–3 sentences?
3. What three points must land?
4. Any numbers, proof points, or peer examples to include?
5. Anything we should avoid saying or positioning?

If the paste already answers these, skip straight to confirmation.

### 3. Confirm before writing

Show a compact confirmation (not the full markdown yet):

```
Brief ready to write:
- Topic: …
- Audience: …
- Purpose: …
- Ask: …
- 3 messages: …
- Metrics/proof: … (or "none yet")
- Context source: paste | interview | MCP (name the tool) | mix
- Output: brief.md

Look right? Say "yes" to write the file, or tell me what to change.
```

Only write the file after the user confirms (or if they said "just write it" / "skip confirmation" up front).

### 4. Write the brief file

Write markdown that follows `templates/brief.md` structure exactly:
- Deck information table filled in
- Background (2–3 sentences)
- Exactly three key messages
- Content to include (metrics, proof, recommendation/ask)
- What to avoid (use sensible Marriott defaults if none given — no "AI tool" framing, not an IT procurement pitch — only when the topic is Cursor/AI Studio enablement; otherwise omit canned avoids)
- Sections optional — include only if the user specified structure

Do not leave `[placeholder]` brackets in the output. Use real content or omit optional empty sections.

### 5. Next step

After writing, report the file path and say:

```
Brief saved to brief.md

Next: /build-deck brief.md
  (or /build-doc brief.md for a branded Word narrative)

Or edit the brief in chat ("make the ask sharper") and I'll update the file.
```

If the user says to continue, run `/build-deck` on the file you just wrote (follow the build-deck skill) unless they asked for a document.

## Rules for extraction quality

- Prefer the user's words for the ask and key messages — do not invent executive claims
- Round metrics to meaningful digits when parsing messy numbers
- If purpose is persuade/request and there is no ask, ask one follow-up before writing
- If topic is missing, ask one follow-up before writing
- Keep "What to avoid" short (2–4 bullets max)
- Never tell the user to open or fill `templates/brief.md` themselves

## Demo lines (for account team / Paul)

> You don't learn a brief format. Tell Cursor who it's for, what you want them to do, and the numbers that matter. It writes the brief. Then `/build-deck` turns that into PowerPoint.

> If your meeting notes tool is connected, `/create-brief` can start from the last call — you only fill the gaps. Paste still works when MCP is offline.
