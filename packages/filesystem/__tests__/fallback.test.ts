import { describe, it, expect } from 'vite-plus/test';
import { saveFileFallback } from '../src/fallback.ts';

describe('saveFileFallback', () => {
  it('is a function', () => {
    expect(typeof saveFileFallback).toBe('function');
  });
});
