import type { RouteObject } from 'react-router';
import { FavoritesPage } from './pages/favorites-page.tsx';
import type { ToolEntry } from '../../types/index.ts';

export function createFavoritesRoutes(tools: ToolEntry[]): RouteObject[] {
  return [
    {
      path: 'favorites',
      element: <FavoritesPage tools={tools} />,
    },
  ];
}
