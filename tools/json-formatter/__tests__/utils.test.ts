import { describe, it, expect } from 'vite-plus/test';
import { formatJson, minifyJson, validateJson } from '../src/utils.ts';

describe('formatJson', () => {
  it('formats valid JSON', () => {
    const result = formatJson('{"a":1,"b":2}');
    expect(result.isValid).toBe(true);
    expect(result.output).toBe('{\n  "a": 1,\n  "b": 2\n}');
    expect(result.error).toBeNull();
  });

  it('uses custom indent', () => {
    const result = formatJson('{"a":1}', 4);
    expect(result.output).toBe('{\n    "a": 1\n}');
  });

  it('handles invalid JSON', () => {
    const result = formatJson('{invalid}');
    expect(result.isValid).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it('handles empty input', () => {
    const result = formatJson('');
    expect(result.isValid).toBe(true);
    expect(result.output).toBe('');
  });
});

describe('minifyJson', () => {
  it('minifies valid JSON', () => {
    const result = minifyJson('{\n  "a": 1,\n  "b": 2\n}');
    expect(result.isValid).toBe(true);
    expect(result.output).toBe('{"a":1,"b":2}');
  });

  it('handles invalid JSON', () => {
    const result = minifyJson('{invalid}');
    expect(result.isValid).toBe(false);
  });
});

describe('validateJson', () => {
  it('validates correct JSON', () => {
    expect(validateJson('{"a":1}').isValid).toBe(true);
  });

  it('rejects invalid JSON', () => {
    const result = validateJson('{bad}');
    expect(result.isValid).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it('accepts empty input', () => {
    expect(validateJson('').isValid).toBe(true);
  });
});
