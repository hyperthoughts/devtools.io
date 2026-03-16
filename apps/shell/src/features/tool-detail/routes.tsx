import type { RouteObject } from 'react-router';
import { ToolDetailPage } from './pages/tool-detail-page.tsx';

export const toolDetailRoutes: RouteObject[] = [
  {
    path: 'tools/:toolId',
    element: <ToolDetailPage />,
  },
];
