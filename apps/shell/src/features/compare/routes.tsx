import type { RouteObject } from 'react-router';
import { ComparePage } from './pages/compare-page.tsx';

export const compareRoutes: RouteObject[] = [
  {
    path: 'compare',
    element: <ComparePage />,
  },
];
