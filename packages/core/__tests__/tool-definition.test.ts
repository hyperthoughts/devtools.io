import { describe, it, expect } from 'vite-plus/test';
import { TOOL_CONTRACT_VERSION } from '../src/index.ts';
import { createMockToolContext, createMockStorage } from '../testing/index.ts';

describe('TOOL_CONTRACT_VERSION', () => {
  it('is version 1', () => {
    expect(TOOL_CONTRACT_VERSION).toBe(1);
  });
});

describe('createMockToolContext', () => {
  it('creates a default context', () => {
    const ctx = createMockToolContext();
    expect(ctx.theme).toBe('dark');
    expect(ctx.worker).toBeNull();
    expect(ctx.filesystem).toBeNull();
    expect(ctx.storage).toBeDefined();
  });

  it('accepts overrides', () => {
    const ctx = createMockToolContext({ theme: 'light' });
    expect(ctx.theme).toBe('light');
  });
});

describe('createMockStorage', () => {
  it('stores and retrieves values', async () => {
    const storage = createMockStorage();
    await storage.set('key', 'value');
    expect(await storage.get('key')).toBe('value');
  });

  it('deletes values', async () => {
    const storage = createMockStorage();
    await storage.set('key', 'value');
    await storage.delete('key');
    expect(await storage.get('key')).toBeUndefined();
  });

  it('returns all entries', async () => {
    const storage = createMockStorage();
    await storage.set('a', 1);
    await storage.set('b', 2);
    const all = await storage.getAll();
    expect(all).toHaveLength(2);
  });

  it('clears all values', async () => {
    const storage = createMockStorage();
    await storage.set('a', 1);
    await storage.clear();
    expect(await storage.getAll()).toHaveLength(0);
  });
});
