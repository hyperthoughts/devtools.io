import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { useNavigate } from 'react-router';
import { ROUTES } from '../constants/routes.ts';

interface SearchContextValue {
  query: string;
  instantSearchEnabled: boolean;
  setQuery: (q: string) => void;
  toggleInstantSearch: () => void;
  submitSearch: (q: string) => void;
}

const SearchContext = createContext<SearchContextValue | null>(null);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState('');
  const [instantSearchEnabled, setInstantSearchEnabled] = useState(() => {
    if (typeof window === 'undefined') return true;
    const stored = localStorage.getItem('devtools-instant-search');
    return stored !== 'false';
  });
  const navigate = useNavigate();

  const toggleInstantSearch = useCallback(() => {
    setInstantSearchEnabled((prev) => {
      const next = !prev;
      localStorage.setItem('devtools-instant-search', String(next));
      return next;
    });
  }, []);

  const submitSearch = useCallback(
    (q: string) => {
      setQuery(q);
      if (q.trim()) {
        void navigate(`${ROUTES.SEARCH}?q=${encodeURIComponent(q.trim())}`);
      }
    },
    [navigate],
  );

  return (
    <SearchContext.Provider
      value={{ query, instantSearchEnabled, setQuery, toggleInstantSearch, submitSearch }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch(): SearchContextValue {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error('useSearch must be used within SearchProvider');
  return ctx;
}
