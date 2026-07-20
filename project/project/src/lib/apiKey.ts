const STORAGE_KEY = "gch_tmdb_api_key";

export const DEFAULT_TMDB_API_KEY = "a7d87e23dda08fe2002c190e83245cf8";

export function getApiKey(): string {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && stored.trim()) return stored.trim();
  } catch {
    // ignore
  }
  return DEFAULT_TMDB_API_KEY;
}

export function setApiKey(key: string): void {
  try {
    if (key.trim()) localStorage.setItem(STORAGE_KEY, key.trim());
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
  window.dispatchEvent(new CustomEvent("gch-apikey-change"));
}

export function hasCustomKey(): boolean {
  try {
    return Boolean(localStorage.getItem(STORAGE_KEY));
  } catch {
    return false;
  }
}
