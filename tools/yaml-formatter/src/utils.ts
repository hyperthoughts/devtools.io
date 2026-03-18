export interface FormatOptions {
  tabWidth: number;
  singleQuote: boolean;
  bracketSpacing: boolean;
  proseWrap: 'always' | 'never' | 'preserve';
}

export type WorkerAPI = {
  format: (code: string, options: FormatOptions) => Promise<string>;
};
