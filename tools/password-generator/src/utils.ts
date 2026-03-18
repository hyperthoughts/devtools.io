export type PasswordMode = 'random' | 'passphrase';

export interface RandomOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
}

export interface PassphraseOptions {
  words: number;
  separator: string;
}

const WORDS = [
  'apple',
  'banana',
  'orange',
  'house',
  'tree',
  'river',
  'mountain',
  'cloud',
  'ocean',
  'moon',
  'star',
  'sun',
  'forest',
  'desert',
  'snow',
  'rain',
  'wind',
  'fire',
  'ice',
  'stone',
  'metal',
  'glass',
  'wood',
  'plastic',
  'paper',
  'book',
  'pen',
  'pencil',
  'computer',
  'phone',
  'music',
  'art',
  'science',
  'math',
  'history',
  'language',
  'time',
  'space',
  'light',
  'dark',
  'life',
  'dream',
  'sleep',
  'wake',
  'walk',
  'run',
  'jump',
  'fly',
  'swim',
  'dive',
  'eat',
  'drink',
  'smile',
  'laugh',
  'cry',
  'think',
  'feel',
  'love',
  'hope',
  'fear',
  'brave',
  'calm',
  'quiet',
  'loud',
  'fast',
  'slow',
  'hard',
  'soft',
  'strong',
  'weak',
  'happy',
  'sad',
  'angry',
  'joy',
  'peace',
  'truth',
  'lie',
  'secret',
  'open',
  'close',
  'door',
  'window',
  'wall',
  'roof',
  'floor',
  'ceiling',
  'chair',
  'table',
  'bed',
  'sofa',
  'car',
  'bus',
  'train',
  'plane',
  'boat',
  'ship',
  'bike',
  'wheel',
  'engine',
  'motor',
];

export function generateRandomPassword(opts: RandomOptions): string {
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const nums = '0123456789';
  const syms = '!@#$%^&*()_+~`|}{[]:;?><,./-=';

  let chars = '';
  if (opts.uppercase) chars += upper;
  if (opts.lowercase) chars += lower;
  if (opts.numbers) chars += nums;
  if (opts.symbols) chars += syms;

  if (!chars) return '';

  let res = '';
  const arr = new Uint32Array(opts.length);
  crypto.getRandomValues(arr);
  for (let i = 0; i < opts.length; i++) {
    res += chars[arr[i] % chars.length];
  }
  return res;
}

export function generatePassphrase(opts: PassphraseOptions): string {
  if (opts.words <= 0) return '';
  const arr = new Uint32Array(opts.words);
  crypto.getRandomValues(arr);
  const selected = [];
  for (let i = 0; i < opts.words; i++) {
    selected.push(WORDS[arr[i] % WORDS.length]);
  }
  return selected.join(opts.separator);
}
