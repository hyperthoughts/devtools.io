import JsonToTS from 'json-to-ts';

export function convertJsonToTs(jsonStr: string, rootName: string = 'RootObject'): string {
  if (!jsonStr.trim()) return '';
  try {
    const obj = JSON.parse(jsonStr);
    const types = JsonToTS(obj, { rootName });
    return types.join('\n\n');
  } catch (err: any) {
    throw new Error(`Failed to convert JSON to TS: ${err.message}`);
  }
}
