import type { RouteObject } from 'react-router';
import { ExplorePage } from './pages/explore-page.tsx';
import type { ToolEntry } from '../../types/index.ts';

export function createExploreRoutes(tools: ToolEntry[]): RouteObject[] {
  return [
    {
      path: 'explore',
      element: <ExplorePage tools={tools} />,
    },
  ];
}
