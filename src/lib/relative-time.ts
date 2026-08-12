/** Compact relative time for account lists (e.g. "5h ago"). */
export function formatRelativeTime(savedAt: number, now = Date.now()): string {
  const delta = Math.max(0, now - savedAt);
  const mins = Math.floor(delta / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 48) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
