import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

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

const STORAGE_KEYS = {
  theme: 'devtools-theme',
  accent: 'devtools-accent',
  shade: 'devtools-shade',
} as const;

function getSystemTheme(): 'dark' | 'light' {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function readStorage<T extends string>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  return (localStorage.getItem(key) as T) ?? fallback;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => readStorage(STORAGE_KEYS.theme, 'system'));
  const [accentColor, setAccentState] = useState<AccentColor>(() =>
    readStorage(STORAGE_KEYS.accent, 'blue'),
  );
  const [backgroundShade, setShadeState] = useState<BackgroundShade>(() =>
    readStorage(STORAGE_KEYS.shade, 'default'),
  );
  const [systemTheme, setSystemTheme] = useState(getSystemTheme);

  const resolvedTheme = theme === 'system' ? systemTheme : theme;

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(resolvedTheme);
    localStorage.setItem(STORAGE_KEYS.theme, theme);
  }, [theme, resolvedTheme]);

  useEffect(() => {
    const root = document.documentElement;
    if (accentColor === 'none') {
      root.removeAttribute('data-accent');
    } else {
      root.setAttribute('data-accent', accentColor);
    }
    localStorage.setItem(STORAGE_KEYS.accent, accentColor);
  }, [accentColor]);

  useEffect(() => {
    const root = document.documentElement;
    if (backgroundShade === 'default') {
      root.removeAttribute('data-shade');
    } else {
      root.setAttribute('data-shade', backgroundShade);
    }
    localStorage.setItem(STORAGE_KEYS.shade, backgroundShade);
  }, [backgroundShade]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => setSystemTheme(getSystemTheme());
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const setTheme = (t: Theme) => setThemeState(t);
  const setAccentColor = (c: AccentColor) => setAccentState(c);
  const setBackgroundShade = (s: BackgroundShade) => setShadeState(s);

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
