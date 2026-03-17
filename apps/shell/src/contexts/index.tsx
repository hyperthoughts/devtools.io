import type { ReactNode } from 'react';
import { BrowserRouter } from 'react-router';
import { ThemeProvider } from './theme-context.tsx';
import { StorageProvider } from './storage-context.tsx';
import { WorkerProvider } from './worker-context.tsx';
import { FilesystemProvider } from './filesystem-context.tsx';
import { SearchProvider } from './search-context.tsx';
import { FavoritesProvider } from './favorites-context.tsx';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <StorageProvider>
        <WorkerProvider>
          <FilesystemProvider>
            <BrowserRouter>
              <SearchProvider>
                <FavoritesProvider>{children}</FavoritesProvider>
              </SearchProvider>
            </BrowserRouter>
          </FilesystemProvider>
        </WorkerProvider>
      </StorageProvider>
    </ThemeProvider>
  );
}

export { useTheme } from './theme-context.tsx';
export { useSearch } from './search-context.tsx';
export { useFavorites } from './favorites-context.tsx';
export { useStorageContext } from './storage-context.tsx';
export { useWorkerContext } from './worker-context.tsx';
export { useFilesystemContext } from './filesystem-context.tsx';
