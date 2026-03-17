import Dexie, { type Table } from 'dexie';
import type { ToolStorageEntry, AppMetadata, ToolRegistryEntry } from './types.ts';

export class LocalDatabase extends Dexie {
  appMeta!: Table<AppMetadata>;
  toolStorage!: Table<ToolStorageEntry>;
  toolRegistry!: Table<ToolRegistryEntry>;

  constructor() {
    super('DevToolsDB');
    this.version(1).stores({
      appMeta: 'id',
      toolStorage: '++id, toolId, [toolId+key]',
    });
    this.version(2).stores({
      appMeta: 'id',
      toolStorage: '++id, toolId, [toolId+key]',
      toolRegistry: 'id, category',
    });
  }
}

export const db = new LocalDatabase();
