import type { RouteObject } from 'react-router';
import { ExplorePage } from './pages/explore-page.tsx';

export const exploreRoutes: RouteObject[] = [
  {
    path: 'explore',
    element: <ExplorePage />,
  },
];
