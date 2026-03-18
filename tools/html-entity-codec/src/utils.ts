import * as he from 'he';

export type EncodeMode = 'named' | 'decimal' | 'hexadecimal';

export function encodeEntities(
  input: string,
  mode: EncodeMode,
  encodeEverything: boolean,
  useNamedReferences: boolean,
  allowUnsafeSymbols: boolean,
): string {
  if (!input) return '';
  return he.encode(input, {
    useNamedReferences: mode === 'named' || useNamedReferences,
    decimal: mode === 'decimal',
    encodeEverything,
    allowUnsafeSymbols,
  });
}

export function decodeEntities(input: string, strict: boolean): string {
  if (!input) return '';
  try {
    return he.decode(input, { strict, isAttributeValue: false });
  } catch (e: any) {
    throw new Error(e.message || 'Failed to decode HTML entities');
  }
}
