// @ts-ignore
import * as prettier from 'prettier/standalone';
// @ts-ignore
import * as prettierPluginPostcss from 'prettier/plugins/postcss';

export type CSSFormatterOptions = {
  printWidth: number;
  tabWidth: number;
  useTabs: boolean;
  singleQuote: boolean;
};

const api = {
  formatCss: async (code: string, options: CSSFormatterOptions): Promise<string> => {
    try {
      if (!code.trim()) return '';
      return await prettier.format(code, {
        parser: 'css',
        plugins: [prettierPluginPostcss],
        ...options,
      });
    } catch (e: any) {
      throw new Error(e.message || 'Failed to format CSS');
    }
  },
};

export type WorkerAPI = typeof api;
