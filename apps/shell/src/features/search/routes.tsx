import type { RouteObject } from 'react-router';
import { SearchPage } from './pages/search-page.tsx';

export const searchRoutes: RouteObject[] = [
  {
    path: 'search',
    element: <SearchPage />,
  },
];
