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
