import { describe, it, expect } from 'vite-plus/test';
import { FileSystemService } from '../src/fs-service.ts';

describe('FileSystemService', () => {
  it('creates an instance', () => {
    const service = new FileSystemService();
    expect(service).toBeDefined();
  });

  it('detects native support', () => {
    const service = new FileSystemService();
    expect(typeof service.isNativeSupported).toBe('boolean');
  });
});
