import type { RouteObject } from 'react-router';
import { SearchPage } from './pages/search-page.tsx';
import type { ToolEntry } from '../../types/index.ts';

export function createSearchRoutes(tools: ToolEntry[]): RouteObject[] {
  return [
    {
      path: 'search',
      element: <SearchPage tools={tools} />,
    },
  ];
}
