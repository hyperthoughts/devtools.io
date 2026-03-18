// @ts-ignore
import * as prettier from 'prettier/standalone';
// @ts-ignore
import * as prettierPluginHtml from 'prettier/plugins/html';

export type HTMLFormatterOptions = {
  printWidth: number;
  tabWidth: number;
  useTabs: boolean;
  bracketSameLine: boolean;
};

const api = {
  formatHtml: async (code: string, options: HTMLFormatterOptions): Promise<string> => {
    try {
      if (!code.trim()) return '';
      return await prettier.format(code, {
        parser: 'html',
        plugins: [prettierPluginHtml],
        ...options,
      });
    } catch (e: any) {
      throw new Error(e.message || 'Failed to format HTML');
    }
  },
};

export type WorkerAPI = typeof api;
