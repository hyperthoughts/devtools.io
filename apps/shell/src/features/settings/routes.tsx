import type { RouteObject } from 'react-router';
import { SettingsPage } from './pages/settings-page.tsx';

export const settingsRoutes: RouteObject[] = [
  {
    path: 'settings',
    element: <SettingsPage />,
  },
];
