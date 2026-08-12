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
| **Target slide count** | 5 |
| **Presenter** | ADM / FE |
| **Delivery time** | 20–30 minutes |

---

## Background

Assembled content blocks for the Deck Machine leave-behind teaching spine.
Blocks are JTBD-named units under `content-blocks/` — not a Hub Studio hub.

**Included blocks**

- Encode brand once so Agents and exporters share tokens (`encode-brand-as-tokens@1.0.0`)

---

## Key messages

1. Rules stay on; Skills are buttons; Agents are the pipeline.
2. Brand tokens are encoded once for Agents and exporters.
3. Quality gates (`/brand-check` + `/deck-score`) catch failures before export.

---

## Content to include

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

## Assembled talk tracks

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

## What to avoid

- Topic-label headlines
- Treating Studio as an Office SaaS
- Skipping Lab 4 exit criteria
