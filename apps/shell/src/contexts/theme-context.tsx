import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { db } from '@devtools/storage';

export type Theme = 'dark' | 'light' | 'system';
export type AccentColor =
  | 'blue'
  | 'pink'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'indigo'
  | 'purple'
  | 'none';
export type BackgroundShade = 'default' | 'zinc' | 'slate' | 'stone' | 'gray' | 'neutral';

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: 'dark' | 'light';
  accentColor: AccentColor;
  backgroundShade: BackgroundShade;
  setTheme: (theme: Theme) => void;
  setAccentColor: (color: AccentColor) => void;
  setBackgroundShade: (shade: BackgroundShade) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const LS_KEYS = {
  theme: 'devtools-theme',
  accent: 'devtools-accent',
  shade: 'devtools-shade',
} as const;

const DB_KEYS = {
  theme: 'theme',
  accent: 'accentColor',
  shade: 'backgroundShade',
} as const;

function getSystemTheme(): 'dark' | 'light' {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function readStorage<T extends string>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  return (localStorage.getItem(key) as T) ?? fallback;
}

function persist<T extends string>(lsKey: string, dbKey: string, value: T) {
  localStorage.setItem(lsKey, value);
  void db.appMeta.put({ id: dbKey, value });
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => readStorage(LS_KEYS.theme, 'system'));
  const [accentColor, setAccentState] = useState<AccentColor>(() =>
    readStorage(LS_KEYS.accent, 'blue'),
  );
  const [backgroundShade, setShadeState] = useState<BackgroundShade>(() =>
    readStorage(LS_KEYS.shade, 'default'),
  );
  const [systemTheme, setSystemTheme] = useState(getSystemTheme);

  const resolvedTheme = theme === 'system' ? systemTheme : theme;

  // Hydrate from IndexedDB on mount (canonical source) and reconcile with state
  useEffect(() => {
    async function hydrate() {
      const [dbTheme, dbAccent, dbShade] = await Promise.all([
        db.appMeta.get(DB_KEYS.theme),
        db.appMeta.get(DB_KEYS.accent),
        db.appMeta.get(DB_KEYS.shade),
      ]);

      if (dbTheme?.value) {
        const val = dbTheme.value as Theme;
        setThemeState(val);
        localStorage.setItem(LS_KEYS.theme, val);
      }
      if (dbAccent?.value) {
        const val = dbAccent.value as AccentColor;
        setAccentState(val);
        localStorage.setItem(LS_KEYS.accent, val);
      }
      if (dbShade?.value) {
        const val = dbShade.value as BackgroundShade;
        setShadeState(val);
        localStorage.setItem(LS_KEYS.shade, val);
      }
    }

    void hydrate();
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(resolvedTheme);
  }, [resolvedTheme]);

  useEffect(() => {
    const root = document.documentElement;
    if (accentColor === 'none') {
      root.removeAttribute('data-accent');
    } else {
      root.setAttribute('data-accent', accentColor);
    }
  }, [accentColor]);

  useEffect(() => {
    const root = document.documentElement;
    if (backgroundShade === 'default') {
      root.removeAttribute('data-shade');
    } else {
      root.setAttribute('data-shade', backgroundShade);
    }
  }, [backgroundShade]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => setSystemTheme(getSystemTheme());
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    persist(LS_KEYS.theme, DB_KEYS.theme, t);
  };

  const setAccentColor = (c: AccentColor) => {
    setAccentState(c);
    persist(LS_KEYS.accent, DB_KEYS.accent, c);
  };

  const setBackgroundShade = (s: BackgroundShade) => {
    setShadeState(s);
    persist(LS_KEYS.shade, DB_KEYS.shade, s);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        resolvedTheme,
        accentColor,
        backgroundShade,
        setTheme,
        setAccentColor,
        setBackgroundShade,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
