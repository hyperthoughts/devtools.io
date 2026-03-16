import { BrowserRouter, Routes, Route } from 'react-router';
import { ThemeProvider } from './providers/theme-provider.tsx';
import { StorageProvider } from './providers/storage-provider.tsx';
import { WorkerProvider } from './providers/worker-provider.tsx';
import { FilesystemProvider } from './providers/filesystem-provider.tsx';
import { ShellLayout } from './layout/shell-layout.tsx';
import { Home } from './routes/home.tsx';
import { ToolRoute } from './routes/tool-route.tsx';
import { Settings } from './routes/settings.tsx';
import registryData from './registry/registry.json';
import type { ToolEntry } from './types.ts';

const tools = (registryData.tools ?? []) as ToolEntry[];

export function App() {
  return (
    <ThemeProvider>
      <StorageProvider>
        <WorkerProvider>
          <FilesystemProvider>
            <BrowserRouter>
              <Routes>
                <Route element={<ShellLayout tools={tools} />}>
                  <Route index element={<Home tools={tools} />} />
                  <Route path="tools/:toolId" element={<ToolRoute />} />
                  <Route path="settings" element={<Settings />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </FilesystemProvider>
        </WorkerProvider>
      </StorageProvider>
    </ThemeProvider>
  );
}
