import { BrowserRouter } from 'react-router';
import { ThemeProvider } from './contexts/theme-context.tsx';
import { SearchProvider } from './contexts/search-context.tsx';
import { FavoritesProvider } from './contexts/favorites-context.tsx';
import { StorageProvider } from './contexts/storage-context.tsx';
import { WorkerProvider } from './contexts/worker-context.tsx';
import { FilesystemProvider } from './contexts/filesystem-context.tsx';
import { AppRoutes } from './routes/index.ts';
import registryData from './registry/registry.json';
import type { ToolEntry } from './types/index.ts';

const tools = (registryData.tools ?? []) as ToolEntry[];

export function App() {
  return (
    <ThemeProvider>
      <StorageProvider>
        <WorkerProvider>
          <FilesystemProvider>
            <BrowserRouter>
              <SearchProvider>
                <FavoritesProvider>
                  <AppRoutes tools={tools} />
                </FavoritesProvider>
              </SearchProvider>
            </BrowserRouter>
          </FilesystemProvider>
        </WorkerProvider>
      </StorageProvider>
    </ThemeProvider>
  );
}
