import type { RouteObject } from 'react-router';
import { MainLayout } from '../layouts/main-layout.tsx';
import { homeRoutes } from '../features/home/routes.tsx';
import { searchRoutes } from '../features/search/routes.tsx';
import { exploreRoutes } from '../features/explore/routes.tsx';
import { favoritesRoutes } from '../features/favorites/routes.tsx';
import { toolDetailRoutes } from '../features/tool-detail/routes.tsx';
import { settingsRoutes } from '../features/settings/routes.tsx';
import { notFoundRoutes } from '../features/not-found/routes.tsx';

export function createMainRoutes(): RouteObject[] {
  return [
    {
      element: <MainLayout />,
      children: [
        ...homeRoutes,
        ...searchRoutes,
        ...exploreRoutes,
        ...favoritesRoutes,
        ...toolDetailRoutes,
        ...settingsRoutes,
        ...notFoundRoutes,
      ],
    },
  ];
}
