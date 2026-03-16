import { createContext, useContext, type ReactNode } from 'react';
import { db, ScopedTable } from '@devtools/storage';
import type { LocalDatabase } from '@devtools/storage';

interface StorageContextValue {
  db: LocalDatabase;
  createScopedTable: (toolId: string) => ScopedTable;
}

const StorageContext = createContext<StorageContextValue | null>(null);

export function StorageProvider({ children }: { children: ReactNode }) {
  const value: StorageContextValue = {
    db,
    createScopedTable: (toolId: string) => new ScopedTable(db, toolId),
  };

  return <StorageContext.Provider value={value}>{children}</StorageContext.Provider>;
}

export function useStorageContext(): StorageContextValue {
  const ctx = useContext(StorageContext);
  if (!ctx) throw new Error('useStorageContext must be used within StorageProvider');
  return ctx;
}
