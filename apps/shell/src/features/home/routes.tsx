import type { RouteObject } from 'react-router';
import { HomePage } from './pages/home-page.tsx';

export const homeRoutes: RouteObject[] = [
  {
    index: true,
    element: <HomePage />,
  },
];
