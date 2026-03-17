import type { RouteObject } from 'react-router';
import { FavoritesPage } from './pages/favorites-page.tsx';

export const favoritesRoutes: RouteObject[] = [
  {
    path: 'favorites',
    element: <FavoritesPage />,
  },
];
