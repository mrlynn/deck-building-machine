# Marriott Cursor Deck Machine — One-Pager
**For:** Paul Dyrwal (AI Studio) · Kristin · Cliff · account team  
**Owner:** Michael Lynn (Cursor) · July 2026

---

## What we built

A **Cursor-native deck machine** for Marriott. Paul describes the meeting (or pastes notes). Cursor writes a structured brief, then a Marriott-branded PowerPoint — with brand rules, voice, and the Marriott mark baked in.

This is **not** a new IT app or a seat purchase. Marriott already uses Cursor. This turns organic usage into a repeatable builder workflow.

```
Talk or paste notes  →  /create-brief  →  brief.md
                     →  /build-deck    →  branded .pptx
```

---

## Why it matters

| Before | After |
|---|---|
| Days–weeks with designers for a Marriott deck | Minutes from brief to branded PPTX |
| Paul learns PowerPoint + brand templates | Paul talks; Cursor applies brand |
| Dec culture (slide about the idea) | Builder habit (deck → working proof) |

Paul asked for a deck-building machine as his first Cursor project. This repo *is* that leave-behind.

---

## How Paul uses it (3 steps)

1. **Open this repo in Cursor**  
   Brand standards load automatically (colors, voice, slide rules).

2. **Create the brief** — in Agent chat:
   ```
   /create-brief
   ```
   Answer a few questions, *or* paste Slack/email/meeting notes.  
   Paul never fills a markdown template by hand.

3. **Build the deck**
   ```
   /build-deck brief.md
   ```
   Pick up the file from `output/`.  
   Need a tweak? Edit `deck-content.json` → `/export-pptx`.

**Demo paste (try this once):**
```
Deck for Naveen Aug 7. Ask for sprint day resources and a longer meeting.
1,300 MAU, 40% MCP. Peers: NAB, Money Forward, Amplitude.
```

---

## What’s inside the repo

| Piece | Role |
|---|---|
| Brand rules | Marriott palette, typography, voice — always on |
| `/create-brief` | Interview or paste → writes `brief.md` |
| `/build-deck` | Brief → outline → slides → brand check → PPTX |
| Footer logos | Marriott M on every slide |
| Example | `examples/ai-studio-brief.md` (AI Studio enablement deck) |
| Teaching | `docs/primitives-decision-tree.md` · `docs/primitives-lab.md` · `docs/after-the-demo.md` |

---

## Account team — how to talk about it

**Say:**  
“Paul builds Marriott decks inside Cursor. Brief in chat, branded PPTX out. This is the model for AI Studio, then cascade.”

**Don’t say:**  
“New AI tool,” “IT procurement,” “learn the brief template,” or a feature tour of Cursor.

**Align on:**  
This repo is the leave-behind. Demo script = talk/paste → brief → PPTX → Lab 4. Use it to prep Paul for deeper enablement and the August 7 Naveen conversation. After the first PPTX, run Lab 4, then leave him on `docs/after-the-demo.md`.

---

## Deck Machine Studio (ADM packaging)

Use Studio when you need a **customer-branded** leave-behind (not the Marriott reference zip).

| Tool | When |
|---|---|
| Recent accounts | Resume last night’s brand pack in one click |
| Export / Import JSON | Hand off a pack to a teammate (includes logos) |
| Copy share link | Prefill name/domain/colors via URL (no logos) |
| Talk track | Live demo script + copy Lab 4 / demo paste |
| Rehearse | ~5 min practice before the room |
| Mission control | Checklist that opens right after Download |
| Field kit | Curriculum sidebars (CLI / tokens / privacy) — not in the zip UI |

**Fast path:** Resume or Find account → Encode brand → Download → keep Talk track open → Mission control checklist → Lab 4.

In-app Help: **How the wizard works**, **Account-team talk track**, **After you download**, **Teaching modules (field kit)**.

**Curriculum PPTX (repo, before the room):** `npm run field-kit` → see `docs/adm-field-kit.md`.

---

## Next 20 minutes with Paul

1. Open the repo together  
2. Run `/create-brief` with his real next meeting  
3. Run `/build-deck` and open the PPTX  
4. Change one headline → `/export-pptx`  
5. **Required:** Lab 4 in `docs/primitives-lab.md` (bad headline → `/brand-check` → fix)  
6. Point at `docs/after-the-demo.md`  
7. Agree: next real deck Paul needs ships this way

---

*Questions → Michael Lynn · Cursor AI Adoption*
