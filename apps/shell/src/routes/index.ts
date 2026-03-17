import { useRoutes } from 'react-router';
import { createMainRoutes } from './routes.tsx';

export function AppRoutes() {
  const routes = createMainRoutes();
  return useRoutes(routes);
}
