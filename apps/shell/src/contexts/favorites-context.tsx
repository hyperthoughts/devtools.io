import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { db } from '@devtools/storage';
import type { FavoriteEntry, ToolEntry } from '../types/index.ts';

const DB_KEY = 'favorites';

interface FavoritesContextValue {
  favorites: FavoriteEntry[];
  toggleFavorite: (tool: ToolEntry) => void;
  isFavorite: (toolId: string) => boolean;
  clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

function persist(entries: FavoriteEntry[]) {
  void db.appMeta.put({ id: DB_KEY, value: entries });
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteEntry[]>([]);

  useEffect(() => {
    async function hydrate() {
      const record = await db.appMeta.get(DB_KEY);
      if (Array.isArray(record?.value)) {
        setFavorites(record.value as FavoriteEntry[]);
      }
    }
    void hydrate();
  }, []);

  const favoriteIds = useMemo(() => new Set(favorites.map((f) => f.id)), [favorites]);

  const isFavorite = useCallback((toolId: string) => favoriteIds.has(toolId), [favoriteIds]);

  const toggleFavorite = useCallback((tool: ToolEntry) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.id === tool.id);
      const next = exists
        ? prev.filter((f) => f.id !== tool.id)
        : [...prev, { id: tool.id, name: tool.name, category: tool.category, addedAt: Date.now() }];
      persist(next);
      return next;
    });
  }, []);

  const clearFavorites = useCallback(() => {
    setFavorites([]);
    persist([]);
  }, []);

  const value = useMemo(
    () => ({ favorites, toggleFavorite, isFavorite, clearFavorites }),
    [favorites, toggleFavorite, isFavorite, clearFavorites],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites(): FavoritesContextValue {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider');
  return ctx;
}
