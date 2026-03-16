import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { FileSystemService } from '@devtools/filesystem';

interface FilesystemContextValue {
  filesystem: FileSystemService;
}

const FilesystemContext = createContext<FilesystemContextValue | null>(null);

export function FilesystemProvider({ children }: { children: ReactNode }) {
  const filesystem = useMemo(() => new FileSystemService(), []);

  return <FilesystemContext.Provider value={{ filesystem }}>{children}</FilesystemContext.Provider>;
}

export function useFilesystemContext(): FilesystemContextValue {
  const ctx = useContext(FilesystemContext);
  if (!ctx) throw new Error('useFilesystemContext must be used within FilesystemProvider');
  return ctx;
}
