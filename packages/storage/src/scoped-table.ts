import type { ToolStorage } from '@devtools/core';
import type { LocalDatabase } from './database.ts';

export class ScopedTable implements ToolStorage {
  constructor(
    private db: LocalDatabase,
    private toolId: string,
  ) {}

  async get<T = unknown>(key: string): Promise<T | undefined> {
    const entry = await this.db.toolStorage
      .where('[toolId+key]')
      .equals([this.toolId, key])
      .first();
    return entry?.value as T | undefined;
  }

  async set(key: string, value: unknown): Promise<void> {
    const existing = await this.db.toolStorage
      .where('[toolId+key]')
      .equals([this.toolId, key])
      .first();

    if (existing?.id != null) {
      await this.db.toolStorage.update(existing.id, {
        value,
        updatedAt: Date.now(),
      });
    } else {
      await this.db.toolStorage.add({
        toolId: this.toolId,
        key,
        value,
        updatedAt: Date.now(),
      });
    }
  }

  async delete(key: string): Promise<void> {
    await this.db.toolStorage.where('[toolId+key]').equals([this.toolId, key]).delete();
  }

  async getAll(): Promise<Array<{ key: string; value: unknown }>> {
    const entries = await this.db.toolStorage.where('toolId').equals(this.toolId).toArray();
    return entries.map((e) => ({ key: e.key, value: e.value }));
  }

  async clear(): Promise<void> {
    await this.db.toolStorage.where('toolId').equals(this.toolId).delete();
  }
}
