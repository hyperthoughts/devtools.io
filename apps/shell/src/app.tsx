import { AppProviders } from './contexts/index.tsx';
import { AppRoutes } from './routes/index.ts';
import registryData from './registry/registry.json';
import type { ToolEntry } from './types/index.ts';

const tools = (registryData.tools ?? []) as ToolEntry[];

export function App() {
  return (
    <AppProviders>
      <AppRoutes tools={tools} />
    </AppProviders>
  );
}
