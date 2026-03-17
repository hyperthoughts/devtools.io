import type { RouteObject } from 'react-router';
import { MainLayout } from '../layouts/main-layout.tsx';
import { homeRoutes } from '../features/home/routes.tsx';
import { createSearchRoutes } from '../features/search/routes.tsx';
import { createFavoritesRoutes } from '../features/favorites/routes.tsx';
import { toolDetailRoutes } from '../features/tool-detail/routes.tsx';
import { settingsRoutes } from '../features/settings/routes.tsx';
import { notFoundRoutes } from '../features/not-found/routes.tsx';
import type { ToolEntry } from '../types/index.ts';

export function createMainRoutes(tools: ToolEntry[]): RouteObject[] {
  return [
    {
      element: <MainLayout tools={tools} />,
      children: [
        ...homeRoutes,
        ...createSearchRoutes(tools),
        ...createFavoritesRoutes(tools),
        ...toolDetailRoutes,
        ...settingsRoutes,
        ...notFoundRoutes,
      ],
    },
  ];
}
