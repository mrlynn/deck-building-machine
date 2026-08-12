# Marriott Deck Slide Type Catalog

**Applies to every type:** each slide carries structured speaker `notes` (opening, 2–4 points beyond the slide text, transition, timeMinutes). Content-bearing slides (`content`, `two-column`, `metrics`, `chart`, `diagram`) also carry a `takeaway` — the one line the audience must remember, rendered as a bottom accent strip.

## Slide types and when to use each

---

### 1. title
**Use for:** Deck opener (always the first slide)

**Elements:** Deck title, subtitle (optional), presenter name, date

**Style:** Red (#BE202E) background, white text

**Rules:**
- One title slide per deck, always first
- Deck title should be the main message of the entire deck (max 2 lines)
- Subtitle is optional — use for additional context only

---

### 2. agenda
**Use for:** Table of contents, "what we'll cover today"

**Elements:** Section list (3–5 items), numbered

**Style:** Light gray (#F2F2F2) background, dark text, red numbering

**Rules:**
- Only use if the deck is 10+ slides or has distinct sections
- Items should be section names, not just slide titles

---

### 3. section
**Use for:** Between major sections in longer decks (12+ slides)

**Elements:** Section number, section title

**Style:** Red (#BE202E) background, white text, large muted section number

**Rules:**
- Only use for decks with distinct sections
- Section number is for navigation, keep it large and light-weight

---

### 4. content
**Use for:** Analysis, findings, narrative, bullet-driven content

**Elements:** Insight headline, 2–5 bullets or narrative text

**Style:** White background, dark text, red accent bar at top

**Rules:**
- Max 5 bullets
- Max ~12 words per bullet
- One idea per slide — if you have more, split into two slides
- Bullets render as native PPTX lists — prefer the assertion + detail form (`{text, detail}`): bold claim line, indented evidence line beneath it

---

### 5. two-column
**Use for:** Comparisons, before/after, side-by-side analysis

**Elements:** Insight headline, two labeled columns with bullets

**Style:** White background, light gray column cards, red accent

**Rules:**
- Both columns must have the same number of bullets
- Column headings should be parallel in structure
- Use sparingly — only for genuine comparisons, not to fit more content

---

### 6. metrics
**Use for:** Key statistics, KPIs, performance numbers

**Elements:** 2–4 large stat blocks (value + label + description)

**Style:** White background, light gray tiles, stat values in red

**Rules:**
- Stat value is large and bold — it's the hero of the slide
- Label is short: 2–5 words
- Description gives the context that makes the number meaningful
- Max 4 metrics per slide

---

### 7. quote
**Use for:** Customer quotes, executive statements, key insights

**Elements:** Large pull quote, attribution (name + title + context)

**Style:** Light gray (#F2F2F2) background, red vertical accent bar, dark text

**Rules:**
- Quote must be verbatim if attributed to a real person
- Max ~40 words in the quote — trim if longer, use "..." for omissions
- Always include name, title, and where/when the quote is from

---

### 8. closing
**Use for:** Next steps, action items, wrap-up (always the last slide)

**Elements:** Numbered action list (action + owner + date)

**Style:** White background, red accent, numbered items with divider lines

**Rules:**
- Max 4 action items
- Every item must have: action (what), owner (who), date (by when)
- If you have more than 4 items, group related actions or use a follow-up document

---

### 9. chart
**Use for:** Trends, comparisons, and numeric evidence that belongs on a chart — not just metric tiles

**Elements:** Insight headline, chartType, categories, series values, `highlight`, optional `valueFormat` / axis titles / `insights` / `target`, caption (required — data source)

**Types:**
| Story | chartType |
|---|---|
| Change over time | `line` (or `area` for cumulative volume) |
| Compare categories | `bar`; `hbar` for long labels or >6 categories |
| Composition of a total | `stacked-bar` |
| Volume + rate together | `combo` (rate series marked `"type": "line"`, optional `secondaryAxis`) |
| Parts of a whole | `pie` / `doughnut` — ≤5 slices only |

**Style:** White background; the `highlight` category/series renders in Marriott Red while the rest recedes to gray; caption in mid gray

**Rules:**
- Prefer `chart` over `metrics` when the story is change over time or category comparison
- Set `highlight` on the data point that carries the headline — a chart without a highlight is a chart without a point
- Add `insights` (≤3 assertion bullets beside the chart) when the data needs interpretation
- Max 4 series; keep category labels short; sort bars by value unless order is inherent
- Values must come from the brief (never invent precise numbers); `caption` must name the source
- Agents author the data in JSON — humans do not paste chart images

---

### 10. diagram
**Use for:** Processes, architecture, SDLC flows, ownership swimlanes

**Elements:** Insight headline, layout (`flow` | `grid` | `swimlane`), nodes, optional edges/lanes/caption

**Style:** Light gray nodes, primary accent bars/arrows — drawn by the exporter from JSON

**Rules:**
- Max 6 nodes on `flow` / `grid`
- Labels ≤ ~5 words; sublabels optional and short
- Prefer `diagram` over `image` for structural ideas (editable, on-brand, no generative art drift)
- Agents author nodes/edges — never ask users to supply a Visio/PNG diagram

---

### 11. image
**Use for:** Illustration when a chart or shape diagram cannot carry the idea

**Elements:** Insight headline, `path` under `assets/`, generation `prompt`, layout (`right` | `left` | `full`), optional bullets/caption

**Style:** Agent-generated PNG embedded by the exporter

**Rules:**
- Only after considering `diagram` and `chart`
- `visual-creator` must generate the file during `/build-deck` — do not ask humans to drop files into `assets/`
- Prompt must specify flat corporate style, brand accent color, white/light background, no stock photo collage, no decorative-only art
- One idea per slide; caption for source or context

---

### 12. questions
**Use for:** A slide that specifically prompts the audience for questions

**Elements:** Just a title "Questions?"

**Style:** Red (#BE202E) background, white text

**Rules:**
- Can be cut for length and rolled into closing