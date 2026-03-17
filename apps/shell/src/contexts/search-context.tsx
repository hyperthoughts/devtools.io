import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { useNavigate } from 'react-router';
import { ROUTES } from '../constants/routes.ts';

interface SearchContextValue {
  query: string;
  setQuery: (q: string) => void;
  submitSearch: (q: string) => void;
}

const SearchContext = createContext<SearchContextValue | null>(null);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

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
    <SearchContext.Provider value={{ query, setQuery, submitSearch }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch(): SearchContextValue {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error('useSearch must be used within SearchProvider');
  return ctx;
}
