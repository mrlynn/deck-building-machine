# Welcome Modal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show new visitors a cookie-backed welcome dialog that answers “What is this?” and permanently dismisses only when they check “Don’t show again” and click Got it.

**Architecture:** Client-only MUI `WelcomeDialog` mounted in `Providers`. Pure cookie helpers in `welcome-cookie.ts` (parse/serialize + document.cookie wrappers). Short copy in `welcome.ts`. Defer opening while Help is open from a `#help=` deep link; open Help `overview` from Learn more.

**Tech Stack:** Next.js App Router, React 19, MUI 9 Dialog/Checkbox/Button, `document.cookie`, Node built-in test runner (`node --test`) for cookie helpers only.

**Spec:** `docs/superpowers/specs/2026-07-13-welcome-modal-design.md`  
**Branch:** `feature/welcome-modal`

---

## File map

| File | Responsibility |
|---|---|
| `src/content/welcome.ts` | Copy, pills, cookie name constants used by UI |
| `src/lib/welcome-cookie.ts` | Parse cookie header, build Set-Cookie-style write string, read/write/has helpers |
| `src/lib/welcome-cookie.test.ts` | Node tests for pure parse/serialize |
| `src/components/WelcomeDialog.tsx` | Header-band dialog + show/hide + opt-out + Learn more |
| `src/components/Providers.tsx` | Mount `<WelcomeDialog />` |
| `package.json` | Add `test:welcome-cookie` script |

---

### Task 1: Welcome copy module

**Files:**
- Create: `src/content/welcome.ts`

- [ ] **Step 1: Create copy module**

```ts
/** Short welcome pitch for first-visit modal. Deeper detail lives in Help overview. */

export const WELCOME_COOKIE_NAME = 'deck-machine-welcome-dismissed';
export const WELCOME_COOKIE_VALUE = '1';
/** ~10 years in seconds */
export const WELCOME_COOKIE_MAX_AGE_SECONDS = 315_360_000;

export const WELCOME_EYEBROW = 'Deck Machine Studio';
export const WELCOME_TITLE = 'What is this?';

export const WELCOME_PARAGRAPHS = [
  'ADMs and FEs use this to give customers a firsthand demo of how skills, rules, and agents land in Cursor — immediately.',
  'Customers leave with a working repo they can open and run, not a slide about AI.',
] as const;

export const WELCOME_PILLS = ['Skills', 'Rules', 'Agents'] as const;

export const WELCOME_DONT_SHOW_LABEL = "Don't show again";
export const WELCOME_LEARN_MORE_LABEL = 'Learn more';
export const WELCOME_GOT_IT_LABEL = 'Got it';
```

- [ ] **Step 2: Commit**

```bash
git add src/content/welcome.ts
git commit -m "feat(welcome): add welcome modal copy constants"
```

---

### Task 2: Cookie helpers (TDD)

**Files:**
- Create: `src/lib/welcome-cookie.ts`
- Create: `src/lib/welcome-cookie.test.ts`
- Modify: `package.json`

- [ ] **Step 1: Write the failing tests**

Create `src/lib/welcome-cookie.test.ts`:

```ts
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  WELCOME_COOKIE_MAX_AGE_SECONDS,
  WELCOME_COOKIE_NAME,
  WELCOME_COOKIE_VALUE,
} from '../content/welcome';
import {
  buildWelcomeDismissCookie,
  isWelcomeDismissedInCookieHeader,
} from './welcome-cookie';

describe('isWelcomeDismissedInCookieHeader', () => {
  it('returns false for empty header', () => {
    assert.equal(isWelcomeDismissedInCookieHeader(''), false);
  });

  it('returns true when dismiss cookie is present', () => {
    assert.equal(
      isWelcomeDismissedInCookieHeader(
        `foo=bar; ${WELCOME_COOKIE_NAME}=${WELCOME_COOKIE_VALUE}`,
      ),
      true,
    );
  });

  it('returns false when only other cookies exist', () => {
    assert.equal(isWelcomeDismissedInCookieHeader('session=abc'), false);
  });

  it('ignores similarly named cookies', () => {
    assert.equal(
      isWelcomeDismissedInCookieHeader(`${WELCOME_COOKIE_NAME}-x=1`),
      false,
    );
  });
});

describe('buildWelcomeDismissCookie', () => {
  it('sets name, value, path, max-age, and samesite', () => {
    const cookie = buildWelcomeDismissCookie();
    assert.match(cookie, new RegExp(`^${WELCOME_COOKIE_NAME}=${WELCOME_COOKIE_VALUE}`));
    assert.match(cookie, /Path=\//);
    assert.match(cookie, new RegExp(`Max-Age=${WELCOME_COOKIE_MAX_AGE_SECONDS}`));
    assert.match(cookie, /SameSite=Lax/);
    assert.doesNotMatch(cookie, /Secure/);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `node --import tsx --test src/lib/welcome-cookie.test.ts`  
If `tsx` is not available, use:

```bash
npx --yes tsx --test src/lib/welcome-cookie.test.ts
```

Expected: FAIL (module `./welcome-cookie` not found or exports missing)

- [ ] **Step 3: Implement cookie helpers**

Create `src/lib/welcome-cookie.ts`:

```ts
import {
  WELCOME_COOKIE_MAX_AGE_SECONDS,
  WELCOME_COOKIE_NAME,
  WELCOME_COOKIE_VALUE,
} from '../content/welcome';

/** Pure: true if document.cookie-style header includes the dismiss cookie. */
export function isWelcomeDismissedInCookieHeader(cookieHeader: string): boolean {
  if (!cookieHeader) return false;
  const parts = cookieHeader.split(';');
  for (const part of parts) {
    const [rawName, ...rest] = part.trim().split('=');
    if (rawName === WELCOME_COOKIE_NAME && rest.join('=') === WELCOME_COOKIE_VALUE) {
      return true;
    }
  }
  return false;
}

/** Pure: string assigned to document.cookie to persist dismiss. */
export function buildWelcomeDismissCookie(): string {
  return [
    `${WELCOME_COOKIE_NAME}=${WELCOME_COOKIE_VALUE}`,
    'Path=/',
    `Max-Age=${WELCOME_COOKIE_MAX_AGE_SECONDS}`,
    'SameSite=Lax',
  ].join('; ');
}

export function hasWelcomeDismissedCookie(): boolean {
  if (typeof document === 'undefined') return false;
  return isWelcomeDismissedInCookieHeader(document.cookie);
}

export function setWelcomeDismissedCookie(): void {
  if (typeof document === 'undefined') return;
  document.cookie = buildWelcomeDismissCookie();
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx --yes tsx --test src/lib/welcome-cookie.test.ts
```

Expected: PASS (all tests)

- [ ] **Step 5: Add npm script**

In `package.json` scripts, add:

```json
"test:welcome-cookie": "npx --yes tsx --test src/lib/welcome-cookie.test.ts"
```

- [ ] **Step 6: Commit**

```bash
git add src/lib/welcome-cookie.ts src/lib/welcome-cookie.test.ts package.json
git commit -m "feat(welcome): add cookie helpers with node tests"
```

---

### Task 3: WelcomeDialog component

**Files:**
- Create: `src/components/WelcomeDialog.tsx`
- Reference patterns: `src/components/HelpDialog.tsx`, `src/theme/tokens.ts`, `src/components/HelpProvider.tsx`

- [ ] **Step 1: Implement WelcomeDialog**

Create `src/components/WelcomeDialog.tsx` with this behavior and structure:

```tsx
'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Stack,
  Typography,
} from '@mui/material';
import {
  WELCOME_DONT_SHOW_LABEL,
  WELCOME_EYEBROW,
  WELCOME_GOT_IT_LABEL,
  WELCOME_LEARN_MORE_LABEL,
  WELCOME_PARAGRAPHS,
  WELCOME_PILLS,
  WELCOME_TITLE,
} from '@/content/welcome';
import {
  hasWelcomeDismissedCookie,
  setWelcomeDismissedCookie,
} from '@/lib/welcome-cookie';
import { useHelp } from '@/components/HelpProvider';
import { layoutTokens } from '@/theme/tokens';

export function WelcomeDialog() {
  const { open: helpOpen, openHelp } = useHelp();
  const [open, setOpen] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [ready, setReady] = useState(false);

  // After mount: decide whether welcome is eligible (cookie absent).
  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    if (hasWelcomeDismissedCookie()) {
      setOpen(false);
      return;
    }
    // Defer while Help is open (e.g. #help= deep link on first paint).
    if (helpOpen) {
      setOpen(false);
      return;
    }
    setOpen(true);
  }, [ready, helpOpen]);

  const handleClose = useCallback(() => {
    setOpen(false);
    setDontShowAgain(false);
  }, []);

  const handleGotIt = useCallback(() => {
    if (dontShowAgain) {
      setWelcomeDismissedCookie();
    }
    handleClose();
  }, [dontShowAgain, handleClose]);

  const handleLearnMore = useCallback(() => {
    handleClose();
    openHelp('overview');
  }, [handleClose, openHelp]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="welcome-dialog-title"
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            border: `1px solid ${layoutTokens.border}`,
            overflow: 'hidden',
          },
        },
      }}
    >
      <DialogTitle
        id="welcome-dialog-title"
        sx={{
          bgcolor: layoutTokens.sidebarBg,
          borderBottom: `1px solid ${layoutTokens.border}`,
          py: 2,
          px: 2.5,
        }}
      >
        <Typography
          className="mono"
          sx={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'text.secondary',
            mb: 0.25,
          }}
        >
          {WELCOME_EYEBROW}
        </Typography>
        <Typography
          sx={{
            fontFamily: '"Plus Jakarta Sans", sans-serif',
            fontWeight: 700,
            fontSize: 18,
            letterSpacing: '-0.02em',
          }}
        >
          {WELCOME_TITLE}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ px: 2.5, pt: 2.5, pb: 1 }}>
        <Stack spacing={1.5}>
          {WELCOME_PARAGRAPHS.map((p) => (
            <Typography key={p.slice(0, 40)} variant="body2" color="text.secondary">
              {p}
            </Typography>
          ))}
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ pt: 0.5 }}>
            {WELCOME_PILLS.map((pill) => (
              <Box
                key={pill}
                component="span"
                sx={{
                  px: 1,
                  py: 0.5,
                  borderRadius: 999,
                  bgcolor: layoutTokens.pill,
                  fontSize: 11,
                  fontWeight: 600,
                  color: 'text.secondary',
                }}
              >
                {pill}
              </Box>
            ))}
          </Stack>
          <FormControlLabel
            control={
              <Checkbox
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                size="small"
              />
            }
            label={
              <Typography variant="body2">{WELCOME_DONT_SHOW_LABEL}</Typography>
            }
            sx={{ mt: 0.5, ml: 0, alignItems: 'center' }}
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 2.5, pb: 2, pt: 1, gap: 1 }}>
        <Button onClick={handleLearnMore} color="inherit">
          {WELCOME_LEARN_MORE_LABEL}
        </Button>
        <Button onClick={handleGotIt} variant="contained" color="inherit"
          sx={{ bgcolor: layoutTokens.text, color: '#fff', '&:hover': { bgcolor: '#000' } }}
        >
          {WELCOME_GOT_IT_LABEL}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
```

Notes for implementer:
- Do **not** write the cookie on X / Esc / backdrop / Learn more even if the checkbox is checked.
- `onClose` from MUI Dialog covers X, Esc, and backdrop → `handleClose` only.
- Initial `open` must stay `false` until after mount + cookie/help checks.

- [ ] **Step 2: Typecheck**

```bash
npx tsc --noEmit
```

Expected: no errors related to WelcomeDialog / welcome modules.

- [ ] **Step 3: Commit**

```bash
git add src/components/WelcomeDialog.tsx
git commit -m "feat(welcome): add header-band WelcomeDialog"
```

---

### Task 4: Mount in Providers

**Files:**
- Modify: `src/components/Providers.tsx`

- [ ] **Step 1: Import and render WelcomeDialog**

Update `Providers.tsx` so the tree is:

```tsx
'use client';

import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { theme } from '@/theme/theme';
import { HelpProvider } from '@/components/HelpProvider';
import { HelpDialog } from '@/components/HelpDialog';
import { WelcomeDialog } from '@/components/WelcomeDialog';
import { AssistantProvider } from '@/components/AssistantProvider';
import { AssistantDrawer } from '@/components/AssistantDrawer';
import type { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AppRouterCacheProvider>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <HelpProvider>
          <AssistantProvider>
            {children}
            <WelcomeDialog />
            <HelpDialog />
            <AssistantDrawer />
          </AssistantProvider>
        </HelpProvider>
      </MuiThemeProvider>
    </AppRouterCacheProvider>
  );
}
```

`WelcomeDialog` must sit **inside** `HelpProvider` (uses `useHelp`). Order vs `HelpDialog` does not matter for z-index as long as only one is intended open; Learn more closes welcome before opening Help.

- [ ] **Step 2: Commit**

```bash
git add src/components/Providers.tsx
git commit -m "feat(welcome): mount WelcomeDialog in Providers"
```

---

### Task 5: Manual verification

**Files:** none (browser checks against running app)

- [ ] **Step 1: Start the app**

```bash
npm run dev
```

Open `http://localhost:3000` (or the port Next prints).

- [ ] **Step 2: Run the checklist**

| # | Action | Expected |
|---|---|---|
| 1 | Clear site cookies for localhost; hard refresh | Welcome modal appears after load |
| 2 | Leave checkbox unchecked; click Got it; refresh | Modal appears again |
| 3 | Check Don't show again; Got it; refresh | Modal does not appear; DevTools shows `deck-machine-welcome-dismissed=1` with Max-Age ≈ 315360000 |
| 4 | Clear cookie; open app; Learn more | Welcome closes; Help opens on “What is Deck Machine Studio?” |
| 5 | Clear cookie; visit `/#help=overview` | Help opens first; close Help → welcome appears |
| 6 | Check Don't show again; press Esc / click backdrop | Modal closes; refresh → modal appears again (no cookie) |

- [ ] **Step 3: Re-run cookie unit tests**

```bash
npm run test:welcome-cookie
```

Expected: PASS

- [ ] **Step 4: Final commit if any polish**

Only if verification prompted small fixes; otherwise skip.

```bash
git add -A
git status
git commit -m "fix(welcome): polish after manual verification"
```

---

## Spec coverage (self-review)

| Spec requirement | Task |
|---|---|
| Header-band layout B | Task 3 |
| Hybrid copy + pills | Task 1, 3 |
| Cookie name/value/max-age/SameSite, no Secure | Task 2 |
| Show when cookie absent; hydration-safe | Task 3 |
| Don't show again + Got it writes cookie | Task 3 |
| Close without checkbox does not write cookie | Task 3 |
| Checkbox + Esc/backdrop/Learn more does not write cookie | Task 3 |
| Learn more → Help overview | Task 3 |
| Defer while `#help=` Help open | Task 3 |
| Mount in Providers | Task 4 |
| Manual checklist | Task 5 |

No middleware, localStorage, or re-open control (non-goals).
