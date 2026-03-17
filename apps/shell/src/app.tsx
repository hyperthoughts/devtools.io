import { useEffect } from 'react';
import { AppProviders } from './contexts/index.tsx';
import { AppRoutes } from './routes/index.ts';
import { initializeRegistry } from './registry/registry-loader.ts';

export function App() {
  useEffect(() => {
    void initializeRegistry();
  }, []);

  return (
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  );
}
