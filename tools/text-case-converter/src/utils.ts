export type CaseType =
  | 'lowercase'
  | 'uppercase'
  | 'camelCase'
  | 'PascalCase'
  | 'snake_case'
  | 'CONSTANT_CASE'
  | 'kebab-case'
  | 'dot.case'
  | 'path/case'
  | 'Title Case'
  | 'Sentence case';

export function convertCase(text: string, toCase: CaseType): string {
  if (!text) return '';

  // Return raw lower/upper immediately if preserving punctuation
  if (toCase === 'lowercase') return text.toLowerCase();
  if (toCase === 'uppercase') return text.toUpperCase();

  // First, normalize the text into words
  // Match contiguous alphanumeric sequences, boundaries include punctuation, camelCase jumps, etc.
  const words = text
    .replace(/([a-z])([A-Z])/g, '$1 $2') // split camel case
    .replace(/[^a-zA-Z0-9_]+/g, ' ') // replace non-alphanumeric with space (except underscore which might be snake case)
    .replace(/_/g, ' ') // Then explicitly drop underscore for clean word boundary
    .trim()
    .split(/\s+/);

  if (words.length === 0 || (words.length === 1 && words[0] === '')) return text;

  const lowerWords = words.map((w) => w.toLowerCase());
  const cap = (w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();

  switch (toCase) {
    case 'camelCase':
      return lowerWords[0] + lowerWords.slice(1).map(cap).join('');
    case 'PascalCase':
      return lowerWords.map(cap).join('');
    case 'snake_case':
      return lowerWords.join('_');
    case 'CONSTANT_CASE':
      return lowerWords.map((w) => w.toUpperCase()).join('_');
    case 'kebab-case':
      return lowerWords.join('-');
    case 'dot.case':
      return lowerWords.join('.');
    case 'path/case':
      return lowerWords.join('/');
    case 'Title Case':
      return lowerWords.map(cap).join(' ');
    case 'Sentence case':
      return (
        cap(lowerWords[0]) + (lowerWords.length > 1 ? ' ' + lowerWords.slice(1).join(' ') : '')
      );
    default:
      return text;
  }
}
