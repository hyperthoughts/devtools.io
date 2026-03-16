import { useMemo } from 'react';
import { db } from './database.ts';
import { ScopedTable } from './scoped-table.ts';

export function useToolStorage(toolId: string): ScopedTable {
  return useMemo(() => new ScopedTable(db, toolId), [toolId]);
}
