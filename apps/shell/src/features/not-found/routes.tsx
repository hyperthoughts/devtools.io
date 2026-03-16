import type { RouteObject } from 'react-router';
import { NotFoundPage } from './pages/not-found-page.tsx';

export const notFoundRoutes: RouteObject[] = [
  {
    path: '*',
    element: <NotFoundPage />,
  },
];
