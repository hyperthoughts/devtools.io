import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useAppMeta, setAppMeta } from '@devtools/storage';

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

function getSystemTheme(): 'dark' | 'light' {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useAppMeta<Theme>('theme', 'system');
  const accentColor = useAppMeta<AccentColor>('accentColor', 'blue');
  const backgroundShade = useAppMeta<BackgroundShade>('backgroundShade', 'default');
  const [systemTheme, setSystemTheme] = useState(getSystemTheme);

  const resolvedTheme = theme === 'system' ? systemTheme : theme;

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

  return (
    <ThemeContext.Provider
      value={{
        theme,
        resolvedTheme,
        accentColor,
        backgroundShade,
        setTheme: (t) => void setAppMeta('theme', t),
        setAccentColor: (c) => void setAppMeta('accentColor', c),
        setBackgroundShade: (s) => void setAppMeta('backgroundShade', s),
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
