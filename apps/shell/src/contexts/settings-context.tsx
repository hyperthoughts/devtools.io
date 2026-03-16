import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface SettingsContextValue {
  relativeDates: boolean;
  setRelativeDates: (v: boolean) => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

function readBool(key: string, fallback: boolean): boolean {
  if (typeof window === 'undefined') return fallback;
  const v = localStorage.getItem(key);
  if (v === null) return fallback;
  return v === 'true';
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [relativeDates, setRelativeDatesState] = useState(() =>
    readBool('devtools-relative-dates', false),
  );

  const setRelativeDates = useCallback((v: boolean) => {
    setRelativeDatesState(v);
    localStorage.setItem('devtools-relative-dates', String(v));
  }, []);

  return (
    <SettingsContext.Provider value={{ relativeDates, setRelativeDates }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
