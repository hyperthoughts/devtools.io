import type { ToolStorage } from '../src/index.ts';

export function createMockStorage(): ToolStorage {
  const store = new Map<string, unknown>();

  return {
    async get<T = unknown>(key: string): Promise<T | undefined> {
      return store.get(key) as T | undefined;
    },
    async set(key: string, value: unknown): Promise<void> {
      store.set(key, value);
    },
    async delete(key: string): Promise<void> {
      store.delete(key);
    },
    async getAll(): Promise<Array<{ key: string; value: unknown }>> {
      return Array.from(store.entries()).map(([key, value]) => ({ key, value }));
    },
    async clear(): Promise<void> {
      store.clear();
    },
  };
}
