import * as convert from 'xml-js';
import type { ConversionDirection, ConverterOptions, WorkerAPI } from './utils.ts';

const api = {
  convert: async (
    input: string,
    direction: ConversionDirection,
    options: ConverterOptions,
  ): Promise<string> => {
    if (direction === 'json-to-xml') {
      return convert.json2xml(input, {
        compact: options.compact,
        spaces: options.spaces,
        ignoreDeclaration: options.ignoreDeclaration,
        ignoreAttributes: options.ignoreAttributes,
      });
    } else {
      return convert.xml2json(input, {
        compact: options.compact,
        spaces: options.spaces,
        ignoreDeclaration: options.ignoreDeclaration,
        ignoreAttributes: options.ignoreAttributes,
      });
    }
  },
};

export type { WorkerAPI };
export default api;
