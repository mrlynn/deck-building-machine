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

Assembled content blocks for the Deck Machine leave-behind teaching spine.
Blocks are JTBD-named units under `content-blocks/` — not a Hub Studio hub.

**Included blocks**

- Answer privacy questions and show how review gates work (`govern-privacy-and-review@1.0.0`)

---

## Key messages

1. Rules stay on; Skills are buttons; Agents are the pipeline.
2. Brand tokens are encoded once for Agents and exporters.
3. Quality gates (`/brand-check` + `/deck-score`) catch failures before export.

---

## Content to include

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
