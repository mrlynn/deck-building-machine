# Welcome Modal Design

**Date:** 2026-07-13  
**Branch:** `feature/welcome-modal`  
**Status:** Approved for implementation planning

## Problem

New visitors to Deck Machine Studio land on the wizard without an immediate answer to “What is this?” ADMs and FEs need a clear, dismissible explanation that this app packages a firsthand customer demo of Cursor skills, rules, and agents — not a PowerPoint SaaS product.

## Goals

- Answer “What is this?” on first visit with a short hybrid pitch
- Persist “Don’t show again” via a long-lived cookie (~10 years)
- Link deeper explanation into the existing Help overview topic
- Match existing Studio UI (MUI Dialog, layout tokens, HelpDialog patterns)

## Non-goals

- Server-rendered / middleware cookie gating
- localStorage-based persistence
- A UI control to re-open the welcome after permanent dismiss (Help covers this)
- Rewriting Help content

## Approach

**Client welcome dialog + `document.cookie`** mounted in `Providers` alongside `HelpDialog`.

Rejected alternatives:

- Middleware / server component cookie read — overkill for a client-only studio
- localStorage — user required a cookie

## Architecture

| Piece | Role |
|---|---|
| `src/components/WelcomeDialog.tsx` | MUI Dialog UI (header-band layout) |
| `src/lib/welcome-cookie.ts` | Read / write / clear helpers for the dismiss cookie |
| `src/content/welcome.ts` | Short pitch copy + pill labels |
| `src/components/Providers.tsx` | Mount `WelcomeDialog` next to `HelpDialog` |

### Cookie

- **Name:** `deck-machine-welcome-dismissed`
- **Value:** `1`
- **Attributes:** `Path=/; Max-Age=315360000; SameSite=Lax` (10 years)
- **No `Secure` flag** — local `http` must work during development

### Show / hide logic

1. Server render and initial client state: dialog **closed** (avoid hydration mismatch).
2. After mount: if cookie is **absent**, open the dialog.
3. If Help is already open from a `#help=…` deep link on first paint: **defer** welcome until Help closes; then open welcome if cookie still absent.
4. Closing without opt-out (X, Esc, backdrop, or Got it with checkbox unchecked): close for this visit only; **no cookie**; shows again on next visit/refresh.
5. Got it with “Don’t show again” checked: write cookie, then close.
6. Learn more: close welcome, call `openHelp('overview')`.

## UI (layout B — header band)

- Eyebrow: `Deck Machine Studio`
- Title: `What is this?`
- Header band background: `layoutTokens.sidebarBg` with bottom border
- Body: two short paragraphs (hybrid pitch)
- Pills: `Skills` · `Rules` · `Agents`
- Checkbox: `Don't show again`
- Actions: secondary `Learn more`, primary `Got it`
- Visual language: Plus Jakarta Sans titles, mono eyebrow, same border radius / borders as `HelpDialog`

## Copy

**Paragraph 1:** ADMs and FEs use this to give customers a firsthand demo of how skills, rules, and agents land in Cursor — immediately.

**Paragraph 2:** Customers leave with a working repo they can open and run, not a slide about AI.

(Exact strings live in `src/content/welcome.ts` so copy can iterate without touching dialog structure.)

## Interactions

| Control | Behavior |
|---|---|
| Checkbox unchecked + Got it / X / Esc / backdrop | Close only; no cookie |
| Checkbox checked + Got it | Set cookie; close |
| Checkbox checked + X / Esc / backdrop / Learn more | Close only; **no cookie** (opt-out requires Got it) |
| Learn more | Close welcome; open Help topic `overview` |
| Help deep link on load | Welcome waits until Help closes |

## Edge cases

- Hydration-safe: never open before mount
- Help hash present: defer welcome while Help is open
- No permanent-dismiss without checkbox (matches product choice: always return until explicit opt-out)
- Cookie readable/writable only in browser; helpers no-op or return false on server

## Testing checklist

- First visit (no cookie): modal appears after mount
- Got it without checkbox: closed; refresh → modal again
- Don't show again + Got it: cookie set; refresh → no modal
- Learn more: Help opens on overview; welcome closed
- Load with `#help=overview`: Help first; after close, welcome if no cookie
- Cookie max-age ≈ 10 years when inspecting DevTools

## Out of scope for v1

- Analytics on dismiss / learn more
- “Reset welcome” developer utility
- Mobile-specific layout variants beyond MUI Dialog responsiveness
