import { format } from 'sql-formatter';
import type { FormatOptions } from './utils.ts';

const api = {
  async formatSql(input: string, options: FormatOptions): Promise<string> {
    if (!input) return '';
    try {
      const tabWidth = options.indent === '\t' ? undefined : options.indent.length;
      return format(input, {
        language: options.dialect as any,
        keywordCase: options.keywordCase,
        tabWidth,
        useTabs: options.indent === '\t',
        linesBetweenQueries: 2,
      });
    } catch (err: any) {
      throw new Error(err.message || 'Error formatting SQL');
    }
  },
  async minifySql(input: string, options: FormatOptions): Promise<string> {
    // Basic minification by stripping newlines, formatting to 0 indent, dropping comments is harder without an AST.
    // The package offers minification by using empty strings for indentation but it has limitations.
    if (!input) return '';
    try {
      const result = format(input, {
        language: options.dialect as any,
        keywordCase: options.keywordCase,
        linesBetweenQueries: 1,
      });
      return result.replace(/\n\s*/g, ' ').trim();
    } catch (err: any) {
      throw new Error(err.message || 'Error minifying SQL');
    }
  },
};

export type WorkerAPI = typeof api;
