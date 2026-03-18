import TurndownService from 'turndown';
import { marked } from 'marked';
import type { ConversionDirection, ConverterOptions, WorkerAPI } from './utils.ts';

const api = {
  convert: async (
    input: string,
    direction: ConversionDirection,
    options: ConverterOptions,
  ): Promise<string> => {
    if (direction === 'html-to-md') {
      const turndownService = new TurndownService({
        headingStyle: options.headingStyle,
        hr: options.hr,
        bulletListMarker: options.bulletListMarker,
        codeBlockStyle: options.codeBlockStyle,
        emDelimiter: options.emDelimiter,
        strongDelimiter: options.strongDelimiter,
      });
      return turndownService.turndown(input);
    } else {
      marked.setOptions({
        gfm: options.gfm,
        breaks: options.breaks,
      });
      return await marked.parse(input);
    }
  },
};

export type { WorkerAPI };
export default api;
