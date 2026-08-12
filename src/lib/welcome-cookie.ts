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
