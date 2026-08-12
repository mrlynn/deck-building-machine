import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { formatRelativeTime } from './relative-time';

describe('formatRelativeTime', () => {
  const now = Date.parse('2026-07-18T12:00:00Z');

  it('returns just now under a minute', () => {
    assert.equal(formatRelativeTime(now - 30_000, now), 'just now');
  });

  it('returns hours under two days', () => {
    assert.equal(formatRelativeTime(now - 5 * 3_600_000, now), '5h ago');
  });

  it('returns days after 48h', () => {
    assert.equal(formatRelativeTime(now - 72 * 3_600_000, now), '3d ago');
  });
});
