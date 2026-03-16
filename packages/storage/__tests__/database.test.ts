import { describe, it, expect } from 'vite-plus/test';
import 'fake-indexeddb/auto';
import { LocalDatabase } from '../src/database.ts';

describe('LocalDatabase', () => {
  it('creates the database with correct tables', () => {
    const db = new LocalDatabase();
    expect(db.appMeta).toBeDefined();
    expect(db.toolStorage).toBeDefined();
  });

  it('stores and retrieves app metadata', async () => {
    const db = new LocalDatabase();
    await db.appMeta.put({ id: 'theme', value: 'dark' });
    const result = await db.appMeta.get('theme');
    expect(result?.value).toBe('dark');
  });
});
