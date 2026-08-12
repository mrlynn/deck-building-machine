export const HERO_QUIET_STORAGE_KEY = 'deck-machine-hero-quiet';

export function loadHeroQuietPreference(): boolean {
  if (typeof localStorage === 'undefined') return false;
  try {
    return localStorage.getItem(HERO_QUIET_STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

export function saveHeroQuietPreference(quiet: boolean): void {
  if (typeof localStorage === 'undefined') return;
  try {
    if (quiet) {
      localStorage.setItem(HERO_QUIET_STORAGE_KEY, '1');
    } else {
      localStorage.removeItem(HERO_QUIET_STORAGE_KEY);
    }
  } catch {
    // ignore quota / private mode
  }
}
