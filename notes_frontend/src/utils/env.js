const THEME_KEY = 'notes.theme';

// PUBLIC_INTERFACE
export function isSupabaseConfigured() {
  /** Returns true if Supabase env vars are set. */
  return Boolean(process.env.REACT_APP_SUPABASE_URL && process.env.REACT_APP_SUPABASE_KEY);
}

// PUBLIC_INTERFACE
export function getInitialTheme() {
  /** Determine initial theme from localStorage or system preference. Defaults to light. */
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {
    // ignore storage read errors
  }
  const prefersDark = typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
}

// PUBLIC_INTERFACE
export function saveThemePreference(theme) {
  /** Persist theme selection */
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // ignore
  }
}

// PUBLIC_INTERFACE
export function applyThemeToDocument(theme) {
  /** Apply [data-theme] to root element */
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', theme);
  }
}
