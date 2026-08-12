---
name: build-doc
description: Build a branded Word document from a brief (or from an existing deck). Same brand voice and narrative spine as the deck factory — different renderer. Writes doc-content.json and exports .docx.
---

# /build-doc

Turn a brief into a branded one-pager / narrative document (DOCX). PPTX stays the demo vehicle; this is a thin second renderer on the same factory.

## How to use

```
/build-doc brief.md
```

Or derive from an existing deck:

```
/build-doc --from-deck deck-content.json
```

Default brief path: `brief.md`.

## No npm install

DOCX export uses the bundled `export-docx` skill (`bundled/export-docx.cjs`). Do not run `npm install`.

## What happens

1. Reads the brief (or maps content-bearing slides from `deck-content.json`)
2. Writes `doc-content.json` under brand voice rules
3. Runs the DOCX exporter → `output/<title>.docx`
4. Reports path and offers `/brand-check` on the doc content (voice/avoid-list) if sharing externally

## Prompt for agent

### 1. Resolve source

- If `--from-deck` or user points at `deck-content.json`: map slides → sections
  - Skip pure `title` / `agenda` / `section` chrome (fold title into metadata)
  - `content` / `two-column` / `closing` → sections with assertion+detail bullets
  - `metrics` / `chart` → a short “Numbers” section (values + caption; no invented data)
  - `diagram` → numbered process steps from node labels
- Else read `brief.md` (or given path). If missing, run `/create-brief` first.

### 2. Write `doc-content.json`

Schema:

```json
{
  "metadata": {
    "title": "Insight-style document title",
    "subtitle": "Optional",
    "audience": "",
    "presenter": "",
    "date": "Month YYYY",
    "purpose": "inform|persuade|update|request"
  },
  "executiveSummary": "2–4 sentences. Lead with the conclusion.",
  "sections": [
    {
      "heading": "Insight or section title",
      "paragraphs": ["Optional prose"],
      "bullets": [{ "text": "Assertion", "detail": "Evidence" }]
    }
  ],
  "ask": "What they should decide or do",
  "takeaways": ["Message 1", "Message 2", "Message 3"]
}
```

Rules:
- Same voice as deck brand rules (clear, confident, warm; no banned phrases)
- Exactly three takeaways when the brief has three key messages
- Do not invent metrics
- Keep it short — this is a leave-behind narrative, not a novel

### 3. Export

```bash
cd .agents/skills/export-docx/scripts
node bundled/export-docx.cjs ../../../../doc-content.json
```

### 4. Next step

```
Document saved: doc-content.json → output/<title>.docx

Next: edit in chat and re-run /export-docx, or /build-deck if you also need slides.
```

## Teaching note

Same pattern as `/build-deck`: skill is the button; brand rules stay on; export script is the proof artifact. Do not position this as a Word SaaS.
