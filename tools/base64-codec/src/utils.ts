export type Base64Mode = 'standard' | 'url-safe';

export interface CodecResult {
  output: string;
  error: string | null;
  success: boolean;
}

export function encodeBase64(input: string, mode: Base64Mode = 'standard'): CodecResult {
  if (!input) {
    return { output: '', error: null, success: true };
  }
  try {
    const bytes = new TextEncoder().encode(input);
    let base64 = btoa(String.fromCharCode(...bytes));

    if (mode === 'url-safe') {
      base64 = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    }

    return { output: base64, error: null, success: true };
  } catch (e) {
    return {
      output: '',
      error: e instanceof Error ? e.message : 'Encoding failed',
      success: false,
    };
  }
}

export function decodeBase64(input: string, mode: Base64Mode = 'standard'): CodecResult {
  if (!input) {
    return { output: '', error: null, success: true };
  }
  try {
    let base64 = input;
    if (mode === 'url-safe') {
      base64 = base64.replace(/-/g, '+').replace(/_/g, '/');
      while (base64.length % 4) {
        base64 += '=';
      }
    }

    const binary = atob(base64);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    const decoded = new TextDecoder().decode(bytes);
    return { output: decoded, error: null, success: true };
  } catch (e) {
    return {
      output: '',
      error: e instanceof Error ? e.message : 'Decoding failed',
      success: false,
    };
  }
}
