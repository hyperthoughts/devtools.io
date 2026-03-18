import prettier from 'prettier/standalone';
import * as yamlPlugin from 'prettier/plugins/yaml';
import type { FormatOptions } from './utils.ts';

const api = {
  format: async (code: string, options: FormatOptions): Promise<string> => {
    return await prettier.format(code, {
      parser: 'yaml',
      plugins: [yamlPlugin],
      ...options,
    });
  },
};

export type WorkerAPI = typeof api;
