import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react';
import { useAppMeta, setAppMeta } from '@devtools/storage';
import type { FavoriteEntry, ToolEntry } from '../types/index.ts';

const DB_KEY = 'favorites';

interface FavoritesContextValue {
  favorites: FavoriteEntry[];
  toggleFavorite: (tool: ToolEntry) => void;
  isFavorite: (toolId: string) => boolean;
  clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const favorites = useAppMeta<FavoriteEntry[]>(DB_KEY, []);

  const favoriteIds = useMemo(() => new Set(favorites.map((f) => f.id)), [favorites]);

  const isFavorite = useCallback((toolId: string) => favoriteIds.has(toolId), [favoriteIds]);

  const toggleFavorite = useCallback(
    (tool: ToolEntry) => {
      const exists = favorites.some((f) => f.id === tool.id);
      const next = exists
        ? favorites.filter((f) => f.id !== tool.id)
        : [
            ...favorites,
            { id: tool.id, name: tool.name, category: tool.category, addedAt: Date.now() },
          ];
      void setAppMeta(DB_KEY, next);
    },
    [favorites],
  );

  const clearFavorites = useCallback(() => void setAppMeta(DB_KEY, []), []);

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
