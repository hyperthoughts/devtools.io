import { useRoutes } from 'react-router';
import { createMainRoutes } from './routes.tsx';
import type { ToolEntry } from '../types/index.ts';

interface AppRoutesProps {
  tools: ToolEntry[];
}

export function AppRoutes({ tools }: AppRoutesProps) {
  const routes = createMainRoutes(tools);
  return useRoutes(routes);
}
