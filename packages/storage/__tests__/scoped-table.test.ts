import { describe, it, expect, beforeEach } from 'vite-plus/test';
import 'fake-indexeddb/auto';
import { LocalDatabase } from '../src/database.ts';
import { ScopedTable } from '../src/scoped-table.ts';

describe('ScopedTable', () => {
  let db: LocalDatabase;
  let table: ScopedTable;

  beforeEach(async () => {
    db = new LocalDatabase();
    table = new ScopedTable(db, 'test-tool');
    await db.toolStorage.clear();
  });

  it('stores and retrieves a value', async () => {
    await table.set('key1', 'hello');
    const result = await table.get('key1');
    expect(result).toBe('hello');
  });

  it('returns undefined for missing keys', async () => {
    const result = await table.get('nonexistent');
    expect(result).toBeUndefined();
  });

  it('updates existing values', async () => {
    await table.set('key1', 'first');
    await table.set('key1', 'second');
    const result = await table.get('key1');
    expect(result).toBe('second');
  });

  it('deletes a value', async () => {
    await table.set('key1', 'hello');
    await table.delete('key1');
    const result = await table.get('key1');
    expect(result).toBeUndefined();
  });

  it('returns all entries for the tool', async () => {
    await table.set('a', 1);
    await table.set('b', 2);
    const all = await table.getAll();
    expect(all).toHaveLength(2);
    expect(all.map((e) => e.key).sort()).toEqual(['a', 'b']);
  });

  it('clears all entries for the tool', async () => {
    await table.set('a', 1);
    await table.set('b', 2);
    await table.clear();
    const all = await table.getAll();
    expect(all).toHaveLength(0);
  });

  it('isolates data between tools', async () => {
    const otherTable = new ScopedTable(db, 'other-tool');
    await table.set('shared-key', 'tool-1-value');
    await otherTable.set('shared-key', 'tool-2-value');

    expect(await table.get('shared-key')).toBe('tool-1-value');
    expect(await otherTable.get('shared-key')).toBe('tool-2-value');
  });
});
