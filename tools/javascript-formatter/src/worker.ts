import prettier from 'prettier/standalone';
import * as babelPlugin from 'prettier/plugins/babel';
import * as tsPlugin from 'prettier/plugins/typescript';
import * as estreePlugin from 'prettier/plugins/estree';
import type { FormatOptions } from './utils.ts';

const api = {
  format: async (code: string, options: FormatOptions): Promise<string> => {
    return await prettier.format(code, {
      plugins: [babelPlugin, tsPlugin, estreePlugin],
      ...options,
    });
  },
};

export type WorkerAPI = typeof api;
