import { describe, it, expect } from 'vite-plus/test';
import { encodeBase64, decodeBase64 } from '../src/utils.ts';

describe('encodeBase64', () => {
  it('encodes a string', () => {
    const result = encodeBase64('Hello, World!');
    expect(result.success).toBe(true);
    expect(result.output).toBe('SGVsbG8sIFdvcmxkIQ==');
  });

  it('encodes URL-safe', () => {
    const result = encodeBase64('subjects?_d', 'url-safe');
    expect(result.success).toBe(true);
    expect(result.output).not.toContain('+');
    expect(result.output).not.toContain('/');
    expect(result.output).not.toContain('=');
  });

  it('handles empty input', () => {
    const result = encodeBase64('');
    expect(result.success).toBe(true);
    expect(result.output).toBe('');
  });
});

describe('decodeBase64', () => {
  it('decodes a string', () => {
    const result = decodeBase64('SGVsbG8sIFdvcmxkIQ==');
    expect(result.success).toBe(true);
    expect(result.output).toBe('Hello, World!');
  });

  it('decodes URL-safe', () => {
    const encoded = encodeBase64('test+data/here', 'url-safe');
    const decoded = decodeBase64(encoded.output, 'url-safe');
    expect(decoded.success).toBe(true);
    expect(decoded.output).toBe('test+data/here');
  });

  it('handles invalid base64', () => {
    const result = decodeBase64('!!!invalid!!!');
    expect(result.success).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it('handles empty input', () => {
    const result = decodeBase64('');
    expect(result.success).toBe(true);
    expect(result.output).toBe('');
  });
});
