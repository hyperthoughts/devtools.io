import Dexie, { type Table } from 'dexie';
import type { ToolStorageEntry, AppMetadata } from './types.ts';

export class LocalDatabase extends Dexie {
  appMeta!: Table<AppMetadata>;
  toolStorage!: Table<ToolStorageEntry>;

  constructor() {
    super('DevToolsDB');
    this.version(1).stores({
      appMeta: 'id',
      toolStorage: '++id, toolId, [toolId+key]',
    });
  }
}

export const db = new LocalDatabase();
