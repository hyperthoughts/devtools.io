import { describe, it, expect } from 'vite-plus/test';
import { hashString } from '../src/utils.ts';

describe('hashString', () => {
  it('computes SHA-256', async () => {
    const result = await hashString('hello', 'SHA-256');
    expect(result.algorithm).toBe('SHA-256');
    expect(result.hash).toBe('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824');
    expect(result.duration).toBeGreaterThanOrEqual(0);
  });

  it('computes SHA-1', async () => {
    const result = await hashString('hello', 'SHA-1');
    expect(result.algorithm).toBe('SHA-1');
    expect(result.hash).toBe('aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d');
  });

  it('computes MD5', async () => {
    const result = await hashString('hello', 'MD5');
    expect(result.algorithm).toBe('MD5');
    expect(result.hash).toBe('5d41402abc4b2a76b9719d911017c592');
  });
});
