export interface FormatOptions {
  tabWidth: number;
  singleQuote: boolean;
  semi: boolean;
  trailingComma: 'none' | 'es5' | 'all';
  parser: 'babel' | 'typescript';
}

export type WorkerAPI = {
  format: (code: string, options: FormatOptions) => Promise<string>;
};
