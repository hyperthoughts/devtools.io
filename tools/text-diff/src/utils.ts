import * as diff from 'diff';

export type DiffMethod = 'chars' | 'words' | 'lines' | 'sentences' | 'css' | 'json';

export interface DiffResult {
  value: string;
  added?: boolean;
  removed?: boolean;
}

export function computeDiff(
  oldValue: string,
  newValue: string,
  method: DiffMethod,
  ignoreWhitespace = false,
  ignoreCase = false,
): DiffResult[] {
  const options = { ignoreWhitespace, ignoreCase };

  switch (method) {
    case 'chars':
      return diff.diffChars(oldValue, newValue, options);
    case 'words':
      return diff.diffWords(oldValue, newValue, options);
    case 'lines':
      return diff.diffLines(oldValue, newValue, options);
    case 'sentences':
      return diff.diffSentences(oldValue, newValue, options);
    case 'css':
      return diff.diffCss(oldValue, newValue, options);
    case 'json':
      try {
        const o = typeof oldValue === 'string' && oldValue !== '' ? JSON.parse(oldValue) : oldValue;
        const n = typeof newValue === 'string' && newValue !== '' ? JSON.parse(newValue) : newValue;
        return diff.diffJson(o, n, options);
      } catch {
        // Fallback to lines if JSON parse fails
        return diff.diffLines(oldValue, newValue, options);
      }
    default:
      return diff.diffChars(oldValue, newValue, options);
  }
}
