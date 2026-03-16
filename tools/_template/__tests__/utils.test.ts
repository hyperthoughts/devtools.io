import { describe, it, expect } from 'vite-plus/test';
import { processInput } from '../src/utils.ts';

describe('tool-name utils', () => {
  it('processes valid input', () => {
    expect(processInput('test')).toBe('test');
  });

  it('trims whitespace', () => {
    expect(processInput('  hello  ')).toBe('hello');
  });

  it('handles empty input', () => {
    expect(processInput('')).toBe('');
  });
});
