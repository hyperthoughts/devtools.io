export interface SlugOptions {
  separator: '-' | '_';
  lowercase: boolean;
  removeStopWords: boolean;
  trim: boolean;
  preserveCase: boolean;
}

const STOP_WORDS = new Set([
  'a',
  'an',
  'and',
  'are',
  'as',
  'at',
  'be',
  'but',
  'by',
  'for',
  'if',
  'in',
  'into',
  'is',
  'it',
  'no',
  'not',
  'of',
  'on',
  'or',
  'such',
  'that',
  'the',
  'their',
  'then',
  'there',
  'these',
  'they',
  'this',
  'to',
  'was',
  'will',
  'with',
]);

export function generateSlug(text: string, options: SlugOptions): string {
  let str = text;

  // Remove accents/diacritics
  str = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  if (options.removeStopWords) {
    const words = str.split(/\b/);
    str = words.filter((word) => !STOP_WORDS.has(word.toLowerCase())).join('');
  }

  // Replace spaces and special characters with separator
  str = str.replace(/[^a-zA-Z0-9]+/g, options.separator);

  if (options.trim) {
    str = str.replace(new RegExp(`^\\${options.separator}+|\\${options.separator}+$`, 'g'), '');
  }

  if (options.lowercase && !options.preserveCase) {
    str = str.toLowerCase();
  } else if (!options.preserveCase) {
    str = str.toLowerCase();
  } else if (options.preserveCase && options.lowercase) {
    str = str.toLowerCase(); // lowercase overriding preserveCase in typical usage
  }

  return str;
}
