export type { RegexMatch } from './worker.ts';

export interface RegexOptions {
  pattern: string;
  flags: string;
  text: string;
}
